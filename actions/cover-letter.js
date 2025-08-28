"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

async function ensureUserExists(userId) {
  console.log("ensureUserExists: Checking for user with ClerkUserId:", userId);
  try {
    let user = await db.user.findUnique({
      where: { ClerkUserId: userId },
    });

    if (!user) {
      console.log("ensureUserExists: Creating new user for ClerkUserId:", userId);
      user = await db.user.create({
        data: {
          id: crypto.randomUUID(),
          ClerkUserId: userId,
          industry: "General",
          experience: "0",
          skills: [],
          bio: "Experienced professional",
        },
      });
      console.log("ensureUserExists: Created user with ID:", user.id);
    }

    return user;
  } catch (error) {
    console.error("ensureUserExists: Error:", error.message, error.stack);
    throw new Error("Failed to ensure user exists: " + error.message);
  }
}

export async function generateCoverLetter(data) {
  console.log("generateCoverLetter: Starting with data:", data);

  if (!data.companyName || !data.jobTitle || !data.jobDescription) {
    console.error("generateCoverLetter: Missing required fields");
    throw new Error("Company name, job title, and job description are required");
  }

  const { userId } = await auth();
  if (!userId) {
    console.error("generateCoverLetter: No userId from auth");
    throw new Error("Unauthorized");
  }

  if (!genAI || !model) {
    console.error("generateCoverLetter: Missing GEMINI_API_KEY");
    throw new Error("Gemini API key is not configured");
  }

  let user;
  try {
    user = await ensureUserExists(userId);
  } catch (error) {
    console.error("generateCoverLetter: User check failed:", error.message);
    throw error;
  }

  const jobDescription = data.jobDescription.length < 10
    ? `${data.jobDescription} (Please provide a detailed job description for a ${data.jobTitle} role at ${data.companyName} to generate a tailored cover letter.)`
    : data.jobDescription;

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle || "unspecified position"} position at ${data.companyName || "unspecified company"}.
    
    About the candidate:
    - Industry: ${user.industry || "General"}
    - Years of Experience: ${user.experience || "0"}
    - Skills: ${user.skills?.join(", ") || "General skills"}
    - Professional Background: ${user.bio || "Experienced professional"}
    
    Job Description:
    ${jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    console.log("generateCoverLetter: Sending prompt to Gemini API");
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();
    console.log("generateCoverLetter: Received content from Gemini API, length:", content.length);

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription || "",
        companyName: data.companyName || "",
        jobTitle: data.jobTitle || "",
        status: "completed",
        userId: user.id,
      },
    });

    console.log("generateCoverLetter: Saved cover letter, ID:", coverLetter.id);
    return coverLetter;
  } catch (error) {
    console.error("generateCoverLetter: Error:", error.message, error.stack);
    if (error.message.includes("API key")) {
      throw new Error("Gemini API key is invalid or rate limited");
    } else if (error.message.includes("prisma")) {
      throw new Error("Database error: " + error.message);
    } else {
      throw new Error("Failed to generate cover letter: " + error.message);
    }
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) {
    console.error("getCoverLetters: No userId from auth");
    throw new Error("Unauthorized");
  }

  const user = await ensureUserExists(userId);

  return await db.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) {
    console.error("getCoverLetter: No userId from auth");
    throw new Error("Unauthorized");
  }

  const user = await ensureUserExists(userId);

  return await db.coverLetter.findUnique({
    where: { id, userId: user.id },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) {
    console.error("deleteCoverLetter: No userId from auth");
    throw new Error("Unauthorized");
  }

  const user = await ensureUserExists(userId);

  return await db.coverLetter.delete({
    where: { id, userId: user.id },
  });
}


