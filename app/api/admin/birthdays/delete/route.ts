import { NextResponse } from "next/server";
import {
  createAdminClient,
  requireAdmin,
} from "@/lib/supabase/server";

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

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing birthday ID" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    const { error } = await supabase
      .from("birthday_configs")
      .delete()
      .eq("id", body.id);

    if (error) {
      console.error(
        "POST /api/admin/birthdays/delete:",
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
      "POST /api/admin/birthdays/delete:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid request",
      },
      { status: 400 }
    );
  }
}