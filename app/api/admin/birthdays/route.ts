import { NextResponse } from "next/server";
import {
  createAdminClient,
  requireAdmin,
} from "@/lib/supabase/server";

export async function GET() {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from("birthday_configs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "GET /api/admin/birthdays:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error(
      "GET /api/admin/birthdays:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "A apărut o eroare.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = body.name?.trim();
    const slug = body.slug?.trim();

    if (!name || !slug || !body.birthday_date) {
      return NextResponse.json(
        {
          error:
            "Name, slug și data nașterii sunt obligatorii.",
        },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    if (body.is_primary === true) {
      const { error: primaryError } = await supabase
        .from("birthday_configs")
        .update({ is_primary: false })
        .eq("is_primary", true);

      if (primaryError) {
        console.error(
          "Primary reset error:",
          primaryError
        );

        return NextResponse.json(
          { error: primaryError.message },
          { status: 500 }
        );
      }
    }

    const { data, error } = await supabase
      .from("birthday_configs")
      .insert({
        name,
        slug,
        title:
          body.title?.trim() ||
          `La mulți ani, ${name}!`,
        message: body.message ?? "",
        birthday_date: body.birthday_date,
        birthday_time:
          body.birthday_time || "00:00",
        timezone:
          body.timezone || "Europe/Bucharest",
        language: body.language || "ro",
        theme: body.theme || "default",
        enable_confetti:
          body.enable_confetti !== false,
        is_primary: body.is_primary === true,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "POST /api/admin/birthdays:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/admin/birthdays:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "A apărut o eroare.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdmin();

    if (!auth.authorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = body.id;

    if (!id) {
      return NextResponse.json(
        {
          error:
            "ID-ul zilei de naștere este obligatoriu.",
        },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { error } = await supabase
      .from("birthday_configs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "DELETE /api/admin/birthdays:",
        error
      );

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/birthdays:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "A apărut o eroare.",
      },
      { status: 500 }
    );
  }
}