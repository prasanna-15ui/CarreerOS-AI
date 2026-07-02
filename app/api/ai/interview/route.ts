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

    const { type, history, userAnswer, isStart } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API Key missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    if (isStart) {
      // Generate the first question
      const prompt = `You are an expert interviewer conducting a ${type} interview. 
Generate ONE single realistic interview question for this category to start the interview. Do not include any pleasantries or greetings. Just the question.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return NextResponse.json({ success: true, aiMessage: response.text });
    }

    // Otherwise, evaluate the answer and ask next question
    const historyText = history.map((m: any) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join("\n");
    
    const prompt = `You are an expert interviewer conducting a ${type} interview.
Here is the chat history:
${historyText}

Candidate's latest answer: "${userAnswer}"

Evaluate the candidate's latest answer. Provide your response in STRICT JSON format:
{
  "feedback": "Your evaluation of their answer (strengths, weaknesses, what they missed)",
  "score": <number between 1 and 10 evaluating the answer>,
  "nextQuestion": "The next interview question to ask them (or an end-of-interview message if you think the interview is over)"
}
Do not use markdown blocks like \`\`\`json. Return ONLY raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanedText = (response.text || "").replace(/```json/gi, "").replace(/```/gi, "").trim();
    const resultJson = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, evaluation: resultJson });

  } catch (err: any) {
    console.error("Interview API Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
