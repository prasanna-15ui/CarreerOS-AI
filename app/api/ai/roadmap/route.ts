import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentRole, targetRole, timeline, commitment } = await request.json();

    if (!currentRole || !targetRole) {
      return NextResponse.json({ success: false, error: "Current role and Target role are required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API Key missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert Career Coach.
Generate a personalized career roadmap for a user transitioning from their current role to a target role.

Current Role: ${currentRole}
Target Role: ${targetRole}
Timeline: ${timeline || "6 months"}
Weekly Commitment: ${commitment || "10 hours"}

Provide a logical, step-by-step roadmap breaking down the timeline into 4-6 distinct phases. 
Respond in STRICT JSON format matching this exact structure:
{
  "summary": "A brief 2-3 sentence overview of this transition.",
  "phases": [
    {
      "title": "Phase name (e.g., Month 1: Fundamentals)",
      "focus": "Main objective of this phase",
      "actionItems": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "finalAdvice": "One piece of concluding advice."
}
Do not use markdown blocks like \`\`\`json. Return ONLY raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.3 }
    });

    const cleanedText = (response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim();
    const resultJson = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, data: resultJson });

  } catch (err: any) {
    console.error("Roadmap API Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
