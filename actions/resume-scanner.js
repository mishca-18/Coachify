"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function scanResume(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { ClerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const file = formData.get("resume");
  if (!file || file.type !== "application/pdf") throw new Error("Invalid file. Please upload a PDF resume.");

  const buffer = await file.arrayBuffer();
  const pdfData = await pdf(Buffer.from(buffer));
  const resumeText = pdfData.text;

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
    return { feedback };
  } catch (error) {
    console.error("scanResume: Error:", error.message);
    throw new Error("Failed to generate feedback: " + error.message);
  }
}