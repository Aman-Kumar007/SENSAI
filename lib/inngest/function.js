import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai";

// Initialize the NEW Gen AI SDK
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ step }) => {
    // 1. Fetch all industries from the database
    const industries = await step.run("Fetch industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    // 2. Loop through each industry
    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: 
          - Return ONLY the JSON. 
          - Include at least 5 common roles for salary ranges.
          - Growth rate should be a percentage number.
          - Include at least 5 skills and trends.
        `;

      // 3. Call Gemini with Inngest wrapping
      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await genAI.models.generateContent({
            model: "gemini-2.5-flash", // Using the fast, stable Flash model
            contents: p,
            config: {
              responseMimeType: "application/json", // Enforces strict JSON output
            },
          });
        },
        prompt
      );

      // 4. Parse the response
      // The new SDK returns the text more directly. 
      // We still do a safety replace just in case, but responseMimeType usually fixes it.
      const text = res.text || "";
      const cleanedText = text.replace(/```(?:json)?|```/g, "").trim();

      // 5. Update Database with Error Handling
      try {
        const insights = JSON.parse(cleanedText);

        await step.run(`Update ${industry} insights`, async () => {
          await db.industryInsight.update({
            where: { industry },
            data: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        });
      } catch (error) {
        console.error(`Failed to parse/update insights for ${industry}:`, error);
        // We continue to the next industry instead of crashing the whole job
        continue;
      }
    }
  }
);