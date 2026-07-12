import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Invalid or missing token.", { status: 400 });
  }

  try {
    // Use the Service Role Key to bypass RLS, since the user is not authenticated yet.
    // If you haven't set it in .env.local, this will fallback to anon key (which requires RLS to allow anon updates)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Find the pending request
    const { data: requestRecord, error: fetchError } = await supabaseAdmin
      .from("login_requests")
      .select("*")
      .eq("token", token)
      .eq("approval_status", "pending")
      .single();

    if (fetchError || !requestRecord) {
      return new NextResponse(
        `
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2>Approval Link Invalid or Expired</h2>
            <p>Please try logging in again to request a new link.</p>
          </body>
        </html>
        `,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    // 2. Mark as approved
    const { error: updateError } = await supabaseAdmin
      .from("login_requests")
      .update({
        approval_status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", requestRecord.id);

    if (updateError) {
      console.error("Update Error:", updateError);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 3. Send confirmation email
    try {
      await sendEmail({
        to: requestRecord.email,
        subject: "Login Approved ✅",
        html: templates.loginApprovedConfirmation(requestRecord.email.split("@")[0]),
      });
    } catch (emailErr) {
      console.error("Failed to send login approved confirmation:", emailErr);
    }

    // 4. Return success page
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Approved</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        h1 {
          color: #111827;
          margin-top: 0;
        }
        p {
          color: #4b5563;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✅</div>
        <h1>Login Approved</h1>
        <p>Your login request has been approved successfully.</p>
        <p><strong>You can now close this tab and return to your original screen to log in.</strong></p>
      </div>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("Approval route error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
