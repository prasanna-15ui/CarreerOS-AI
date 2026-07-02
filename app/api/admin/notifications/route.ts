import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const roleCookie = request.headers.get("cookie")?.includes("career_os_role=admin");
    const roleAuth = (roleCookie ? "admin" : null) || profile?.role || "user";

    if (roleAuth !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type = "announcement", targetUserId } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: "Title and message are required" }, { status: 400 });
    }

    let userIdsToNotify: string[] = [];

    if (targetUserId === "ALL") {
      // Fetch all active users
      const { data: allUsers, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .eq("is_disabled", false);

      if (usersError) throw usersError;
      userIdsToNotify = allUsers.map(u => u.id);
    } else {
      userIdsToNotify = [targetUserId];
    }

    const notificationsToInsert = userIdsToNotify.map(uid => ({
      user_id: uid,
      title,
      message,
      type,
      read: false
    }));

    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notificationsToInsert);

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Notification sent to ${userIdsToNotify.length} user(s)` }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
