import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

const resumeSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  file_url: z.string().url("Valid URL is required"),
  tags: z.array(z.string()).optional(),
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

    let query = supabase.from("resumes").select("*").order("created_at", { ascending: false });
    
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data: resumes, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: resumes }, { status: 200 });
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
    const result = resumeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: "Validation failed", issues: result.error.issues }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("resumes")
      .insert([{ ...result.data, user_id: user.id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    try {
      await sendEmail({
        to: user.email as string,
        subject: "Resume Uploaded Successfully",
        html: templates.resumeUploaded(result.data.file_name, new Date().toLocaleString(), result.data.tags?.join(", "))
      });
    } catch (emailErr) {
      console.error("Failed to send resume upload email:", emailErr);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
