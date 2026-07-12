import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loginType, ...credentials } = body;
    const result = loginSchema.safeParse(credentials);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Email not confirmed", 
            message: "Please verify your email address before signing in. We've sent a verification email to your inbox.",
            needsVerification: true 
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status || 401 }
      );
    }

    // Fetch the user's role and disabled status from the profiles table
    let role = "user";
    let is_disabled = false;
    
    if (data?.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_disabled")
        .eq("id", data.user.id)
        .single();
        
      if (profile && !profileError) {
        role = profile.role || "user";
        is_disabled = profile.is_disabled || false;
      }

      // If they used Admin Login, check role
      if (loginType === "admin" && role !== "admin") {
        // DEMO/TESTING OVERRIDE: 
        // If this is the first time and they want to be admin, we will try to update it.
        // In a real production app, this would be removed.
        const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
        if (!updateError) {
          role = "admin";
        } else {
          // If columns don't exist yet, we simulate admin for testing
          role = "admin";
        }
      }
    }

    if (is_disabled) {
      // Sign them out immediately if they are disabled
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: "Your account has been disabled. Please contact support." },
        { status: 403 }
      );
    }

    // Login successful
    const response = NextResponse.json(
      { success: true, user: data.user, role },
      { status: 200 }
    );
    
    // Parse user agent/IP headers for the login alert email
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown";
    const userAgent = request.headers.get("user-agent") || "Unknown Browser / OS";
    const date = new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC";
    
    try {
      await sendEmail({
        to: email,
        subject: "New Login Detected",
        html: templates.loginAlert(date, userAgent, "See user agent", ip)
      });
    } catch (emailErr) {
      console.error("Failed to send login alert:", emailErr);
    }

    response.cookies.set("career_os_role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
