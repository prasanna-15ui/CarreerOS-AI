import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

const placementSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  status: z.string().optional(),
  applied_date: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const isAdmin = roleCookie || profile?.role === "admin";

    let query = supabase.from("companies").select("*").order("created_at", { ascending: false });
    
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data: placements, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: placements }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const { data, error } = await supabase
      .from("companies")
      .insert([{ ...result.data, user_id: user.id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await sendEmail({
        to: user.email as string,
        subject: "Application Submitted Successfully",
        html: templates.placementApplied(
          result.data.company_name, 
          result.data.role, 
          result.data.applied_date || new Date().toLocaleDateString()
        )
      });
    } catch (emailErr) {
      console.error("Failed to send placement email:", emailErr);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
