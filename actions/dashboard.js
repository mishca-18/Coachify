"use server";


import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "HIGH" | "MEDIUM" | "LOW",
      "topSkills": ["string"],
      "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "keyTrends": ["string"],
      "recommendedSkills": ["string"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error(`Error generating AI insights for ${industry}:`, error);
    // Fallback data to prevent failure
    return {
      salaryRanges: [
        { role: "Developer", min: 50000, max: 100000, median: 75000, location: "Global" },
        { role: "Senior Developer", min: 80000, max: 150000, median: 115000, location: "Global" },
        { role: "Manager", min: 100000, max: 180000, median: 140000, location: "Global" },
        { role: "Analyst", min: 60000, max: 120000, median: 90000, location: "Global" },
        { role: "Engineer", min: 70000, max: 130000, median: 100000, location: "Global" },
      ],
      growthRate: 5.0,
      demandLevel: "MEDIUM",
      topSkills: ["JavaScript", "Python", "SQL", "Docker", "AWS"],
      marketOutlook: "NEUTRAL",
      keyTrends: ["AI Integration", "Cloud Adoption", "Cybersecurity", "Automation", "Sustainability"],
      recommendedSkills: ["TypeScript", "Kubernetes", "Data Analysis", "Cloud Security", "DevOps"],
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { ClerkUserId: userId },
    include: { industryInsight: true },
  });

  if (!user) throw new Error("User not found");

  if (!user.industryInsight && user.industry) {
    const insights = await generateAIInsights(user.industry);
    const industryInsight = await db.industryInsight.create({
      data: {
        id: `industry-${Date.now()}`,
        industry: user.industry,
        salaryRanges: insights.salaryRanges,
        growthRate: insights.growthRate,
        demandLevel: insights.demandLevel,
        topSkills: insights.topSkills,
        marketOutlook: insights.marketOutlook,
        keyTrends: insights.keyTrends,
        recommendedSkills: insights.recommendedSkills,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return industryInsight;
  }

  return user.industryInsight;
}