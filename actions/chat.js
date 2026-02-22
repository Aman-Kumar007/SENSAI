"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithAI(messages) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
      experience: true,
    },
  });

  if (!user) throw new Error("User not found");

  const systemContext = `
    You are an expert AI Career Coach named "SensAi". 
    The user is a professional in the ${user.industry} industry.
    Current Skills: ${user.skills?.join(", ") || "Not specified"}.
    Experience Level: ${user.experience || "Not specified"}.

    Your goal is to provide actionable, professional, and encouraging career advice.
    - If they ask about resumes, focus on metrics and impact.
    - If they ask about interviews, provide STAR method tips.
    - Keep responses concise (under 3 paragraphs) and use Markdown for formatting.
  `;

  try {
    const lastMessage = messages[messages.length - 1].content;

    const fullPrompt = `${systemContext}\n\nConversation History:\n${messages
      .map((m) => `${m.role === "user" ? "User" : "Coach"}: ${m.content}`)
      .join("\n")}\n\nCoach Gemini:`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return result.text.trim();
  } catch (error) {
    console.error("Chat Action Error:", error);
    throw new Error("Failed to generate AI response: " + error.message);
  }
}
