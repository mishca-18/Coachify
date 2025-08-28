import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    const industries = await step.run("Fetch industries", async () => {
      try {
        return await db.industryInsight.findMany({
          select: { industry: true },
        });
      } catch (error) {
        console.error("Error fetching industries:", error);
        throw new Error("Failed to fetch industries");
      }
    });

    for (const { industry } of industries) {
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

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      let insights;
      try {
        insights = JSON.parse(cleanedText);
      } catch (error) {
        console.error(`Error parsing insights for ${industry}:`, error);
        insights = {
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

      await step.run(`Update ${industry} insights`, async () => {
        try {
          await db.industryInsight.update({
            where: { industry },
            data: {
              salaryRanges: insights.salaryRanges || [],
              growthRate: insights.growthRate || 0.0,
              demandLevel: insights.demandLevel || "MEDIUM",
              topSkills: insights.topSkills || [],
              marketOutlook: insights.marketOutlook || "NEUTRAL",
              keyTrends: insights.keyTrends || [],
              recommendedSkills: insights.recommendedSkills || [],
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        } catch (error) {
          console.error(`Error updating ${industry} insights:`, error);
          throw new Error(`Failed to update ${industry} insights`);
        }
      });
    }
  }
);

