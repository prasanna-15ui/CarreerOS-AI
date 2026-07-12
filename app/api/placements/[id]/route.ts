import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

const placementSchema = z.object({
  company_name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  status: z.string().optional(),
  applied_date: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = context.params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Placement ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = placementSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Validation failed", issues: result.error.issues }, { status: 400 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const isAdmin = roleCookie || profile?.role === "admin";

    const { data: oldData } = await supabase.from("companies").select("status, company_name, role").eq("id", id).single();

    let query = supabase.from("companies").update(result.data).eq("id", id);
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }
    
    const { data, error } = await query.select().single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (result.data.status && oldData && oldData.status !== result.data.status) {
      try {
        await sendEmail({
          to: user.email as string,
          subject: "Placement Status Updated",
          html: templates.placementStatusChanged(
            data.company_name || oldData.company_name || "Company",
            data.role || oldData.role || "Role",
            oldData.status || "Unknown",
            result.data.status
          )
        });
      } catch (emailErr) {
        console.error("Failed to send placement status email:", emailErr);
      }
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
      return NextResponse.json({ success: false, error: "Placement ID is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const isAdmin = roleCookie || profile?.role === "admin";

    let query = supabase.from("companies").delete().eq("id", id);
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Placement deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
