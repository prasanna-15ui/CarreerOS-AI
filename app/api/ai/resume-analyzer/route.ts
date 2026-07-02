import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenAI } from "@google/genai";
// Increase max duration for Vercel/Next.js edge cases if necessary
export const maxDuration = 60; 

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "Resume file is required" }, { status: 400 });
    }

    // 1. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamically require pdf-parse to avoid Next.js Turbopack build errors
    const pdfParse = require("pdf-parse");
    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    // 2. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API Key is missing. Please configure GEMINI_API_KEY in your environment." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // 3. Construct Prompt
    let prompt = `
You are an expert ATS (Applicant Tracking System) Analyzer and Senior Technical Recruiter.
Please analyze the following resume text.
`;
    
    if (jobDescription) {
      prompt += `\nI will also provide a Job Description. Evaluate how well the resume matches this specific job description.\n\nJob Description:\n${jobDescription}\n`;
    }

    prompt += `
\nResume Text:\n${resumeText}\n

Provide your analysis in the following STRICT JSON format only, without any markdown formatting or backticks:
{
  "score": <number between 0 and 100 representing overall ATS match/quality>,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missingKeywords": ["string", "string"],
  "actionableFeedback": ["string", "string"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    const aiText = response.text || "";
    
    // Clean JSON response (sometimes Gemini wraps in ```json ... ```)
    const cleanedText = aiText.replace(/```json/gi, "").replace(/```/gi, "").trim();
    let resultJson;
    try {
      resultJson = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", cleanedText);
      return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: resultJson }, { status: 200 });

  } catch (err: any) {
    console.error("Resume Analyzer Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
