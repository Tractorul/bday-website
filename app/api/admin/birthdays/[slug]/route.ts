import { NextResponse } from "next/server";
import {
  createAdminClient,
  createClient,
  requireAdmin,
} from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  /*
   * GET is intentionally public.
   *
   * This endpoint is used by public birthday pages.
   */
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("birthday_configs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Birthday not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = {};

  const allowedFields = [
    "name",
    "title",
    "message",
    "birthday_date",
    "birthday_time",
    "timezone",
    "language",
    "theme",
    "enable_confetti",
    "enable_music",
    "is_primary",
    "show_message_on_birthday_only",
  ];

  for (const field of allowedFields) {
    if (field in body) {
      update[field] = body[field];
    }
  }

  if (
    "name" in update &&
    (typeof update.name !== "string" ||
      !update.name.trim())
  ) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  if (
    "show_message_on_birthday_only" in update &&
    typeof update.show_message_on_birthday_only !==
      "boolean"
  ) {
    return NextResponse.json(
      {
        error:
          "show_message_on_birthday_only must be a boolean.",
      },
      { status: 400 }
    );
  }

  const supabase = await createAdminClient();

  /*
   * If this birthday is being made primary,
   * remove primary status from all others first.
   */
  if (update.is_primary === true) {
    const { error: primaryError } = await supabase
      .from("birthday_configs")
      .update({ is_primary: false })
      .eq("is_primary", true)
      .neq("slug", slug);

    if (primaryError) {
      return NextResponse.json(
        { error: primaryError.message },
        { status: 500 }
      );
    }
  }

  const { data, error } = await supabase
    .from("birthday_configs")
    .update(update)
    .eq("slug", slug)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Birthday not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("birthday_configs")
    .delete()
    .eq("slug", slug);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}