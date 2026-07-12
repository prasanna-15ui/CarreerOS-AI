import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendEmail } from "@/utils/email";
import { templates } from "@/utils/emailTemplates";

// Initialize Gemini (using same env var as other AI tools)
const geminiApiKey = process.env.GEMINI_API_KEY;

export async function GET(request: Request) {
  try {
    // 1. Verify cron secret to prevent unauthorized execution
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // 2. Fetch all users from profiles table
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, name, email")
      .not("is_disabled", "eq", true)
      .not("email", "is", null);

    if (usersError || !users) {
      return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
    }

    let emailsSent = 0;

    // 3. Loop through users and generate personalized report
    for (const user of users) {
      if (!user.email) continue;

      try {
        // Fetch User Data
        const [
          { data: tasks },
          { data: placements },
          { data: resumes }
        ] = await Promise.all([
          supabase.from("tasks").select("status, title").eq("user_id", user.id),
          supabase.from("companies").select("status, company_name").eq("user_id", user.id),
          supabase.from("resumes").select("id").eq("user_id", user.id)
        ]);

        const completedTasks = (tasks || []).filter(t => t.status === "Completed");
        const pendingTasks = (tasks || []).filter(t => t.status !== "Completed");
        const activePlacements = (placements || []).filter(p => !["Rejected", "Offer Declined"].includes(p.status || ""));

        // Generate basic recommendations if we don't have Gemini
        let recommendationsHtml = `<ul style="margin:0; padding-left:20px;">
          <li>Focus on completing your <strong>${pendingTasks.length} pending tasks</strong> this week.</li>
          <li>You have <strong>${activePlacements.length} active applications</strong>. Make sure to follow up!</li>
        </ul>`;

        // If Gemini is available, try generating a quick AI recommendation
        if (geminiApiKey) {
          try {
            const prompt = `As an AI Career Coach, write a very short (2 sentences), encouraging recommendation for a user who completed ${completedTasks.length} tasks, has ${pendingTasks.length} tasks remaining, and is actively tracking ${activePlacements.length} job applications. Output only the text.`;
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const geminiData = await response.json();
            if (geminiData.candidates && geminiData.candidates[0].content.parts[0].text) {
              recommendationsHtml = `<p style="margin:0;">${geminiData.candidates[0].content.parts[0].text}</p>`;
            }
          } catch (aiErr) {
            console.error("Gemini Weekly Report Gen Error:", aiErr);
            // Fallback to basic recommendations
          }
        }

        // Send the email
        const emailSent = await sendEmail({
          to: user.email,
          subject: "Your Weekly CareerOS AI Progress Report",
          html: templates.weeklyReport(
            completedTasks.length,
            pendingTasks.length,
            activePlacements.length,
            (resumes || []).length,
            recommendationsHtml
          )
        });

        if (emailSent) emailsSent++;
      } catch (userErr) {
        console.error(`Failed to process weekly report for user ${user.id}:`, userErr);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Weekly reports dispatched to ${emailsSent} users`
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
