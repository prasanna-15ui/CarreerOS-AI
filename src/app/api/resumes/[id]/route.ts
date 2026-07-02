import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Resume ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (fileUrl) {
      const pathParts = fileUrl.split('/resumes/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from("resumes").remove([filePath]);
      }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const isAdmin = roleCookie || profile?.role === "admin";

    let query = supabase.from("resumes").delete().eq("id", id);
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }
    
    const { error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Resume deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
