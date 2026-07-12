import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile GET Error:", error);

      return NextResponse.json(
        {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: "",
            phone: "",
            avatar_url: "",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data:
          profile || {
            id: user.id,
            email: user.email,
            name: "",
            phone: "",
            avatar_url: "",
          },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/profile Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      ...result.data,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Profile PUT Error:", error);

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PUT /api/profile Error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}