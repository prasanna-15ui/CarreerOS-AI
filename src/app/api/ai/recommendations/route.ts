import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user context for personalized tips
    const { data: tasks } = await supabase.from("tasks").select("title, status, priority").eq("user_id", user.id);
    const { data: placements } = await supabase.from("companies").select("company_name, role, status").eq("user_id", user.id);
    const { data: resumes } = await supabase.from("resumes").select("file_name").eq("user_id", user.id);
    const { data: goals } = await supabase.from("goals").select("title, target_date").eq("user_id", user.id);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to static heuristics if no API key
      const recommendations = [];
      if (!resumes || resumes.length === 0) {
        recommendations.push({ message: "You haven't uploaded a resume yet. Consider using a clear, ATS-friendly format before applying.", action: "/resumes" });
      }
      const pendingTasks = tasks?.filter(t => t.status === "Pending") || [];
      if (pendingTasks.length > 3) {
        recommendations.push({ message: `You have ${pendingTasks.length} pending tasks. Try breaking them down using the Pomodoro technique to improve focus.`, action: "/tasks" });
      }
      return NextResponse.json({ success: true, data: recommendations });
    }

    const ai = new GoogleGenAI({ apiKey });

    const context = `
Tasks: ${JSON.stringify(tasks || [])}
Placements/Applications: ${JSON.stringify(placements || [])}
Resumes: ${JSON.stringify(resumes || [])}
Goals: ${JSON.stringify(goals || [])}
`;

    const prompt = `You are an AI Career Assistant. Look at the user's current platform data:
${context}

Generate 2-3 personalized, highly actionable recommendations for this user to advance their career. 
If they have pending tasks, tell them to do them. If they have interviews, give them a quick tip. If they lack resumes, tell them to upload one.

Respond in STRICT JSON format matching this structure:
[
  {
    "message": "The personalized recommendation text.",
    "action": "/tasks" // Or /placements, /resumes, /goals, /ai-tools depending on what they should do next
  }
]
Do not use markdown blocks like \`\`\`json. Return ONLY the raw JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.3 }
    });

    const cleanedText = (response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim();
    let resultJson = [];
    try {
      resultJson = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse recommendations:", cleanedText);
      resultJson = [{ message: "Keep up the great work! Check your tasks to stay on track.", action: "/tasks" }];
    }

    return NextResponse.json({ success: true, data: resultJson }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
