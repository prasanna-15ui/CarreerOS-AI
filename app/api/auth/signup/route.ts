import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status || 500 }
      );
    }

    // Supabase will automatically send the verification email if 'Confirm email' is enabled in the dashboard.

    return NextResponse.json(
      { success: true, user: data.user },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Signup error details:", err);
    
    // Check if the error is a fetch timeout/connection issue
    let errorMessage = err.message || "Internal server error";
    if (errorMessage.includes("fetch failed") || errorMessage.includes("timeout") || errorMessage.includes("ECONNREFUSED")) {
      errorMessage = "Authentication server is unreachable or timed out. (This can happen if Supabase SMTP is misconfigured or blocked).";
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
