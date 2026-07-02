import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = context.params;
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const roleAuth = (roleCookie ? "admin" : null) || profile?.role || "user";

    if (roleAuth !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { is_disabled, role, name } = body;

    const updates: any = {};
    if (is_disabled !== undefined) updates.is_disabled = is_disabled;
    if (role !== undefined) updates.role = role;
    if (name !== undefined) updates.name = name;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
    if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const roleAuth = (roleCookie ? "admin" : null) || profile?.role || "user";

    if (roleAuth !== "admin") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    // Note: This only deletes the profile, not the auth.users record, which requires Service Role key.
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "User profile deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
