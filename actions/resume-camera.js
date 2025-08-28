import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const { resumeText } = await req.json();
  if (!resumeText) return new Response(JSON.stringify({ error: "Resume text is required" }), { status: 400 });

  const prompt = `
    Analyze this resume text and provide detailed feedback on what the user should improve. Focus on:
    - Structure and format (e.g., sections, bullet points, length).
    - Content quality (e.g., quantifiable achievements, keywords for ATS).
    - Grammar, spelling, and clarity.
    - Tailoring to job markets (e.g., add skills, experience gaps).
    - Suggestions for XYZ method in descriptions (Accomplished [X] as measured by [Y], by doing [Z]).

    Resume Text:
    ${resumeText}
    
    Format your feedback in markdown with headings for each category and bullet points for suggestions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const feedback = result.response.text().trim();
    return new Response(JSON.stringify({ feedback }), { status: 200 });
  } catch (error) {
    console.error("resume-camera: Error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to generate feedback: " + error.message }), { status: 500 });
  }
}