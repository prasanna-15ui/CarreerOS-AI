import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const goalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  deadline: z.string().optional().nullable(),
});

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = context.params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Goal ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = goalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Validation failed", issues: result.error.issues }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("goals")
      .update(result.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Goal ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Goal deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
