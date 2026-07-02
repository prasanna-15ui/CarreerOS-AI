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

    const { skills, targetRole } = await request.json();

    if (!skills || !targetRole) {
      return NextResponse.json({ success: false, error: "Skills and Target Role are required." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API Key missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert technical recruiter and career coach.
Analyze the gap between the candidate's current skills and their target role.

Candidate's Current Skills: ${skills}
Target Role / Job Description: ${targetRole}

Provide your response in STRICT JSON format matching this exact structure:
{
  "matchScore": <number between 0 and 100 representing how close they are to the role>,
  "matchedSkills": ["Skill 1", "Skill 2"],
  "missingSkills": ["Skill 1", "Skill 2"],
  "recommendedProjects": [
    {
      "name": "Project Name",
      "description": "Brief description of a project they could build to learn the missing skills"
    }
  ]
}
Do not use markdown blocks like \`\`\`json. Return ONLY raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.2 }
    });

    const cleanedText = (response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim();
    const resultJson = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, data: resultJson });

  } catch (err: any) {
    console.error("Job Matcher API Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
