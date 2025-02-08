"use server";
import { db } from "@/lib/prisma";
// import { IndustryInsight } from "@/types/Industry";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const generateInsightByAI = async (industry: string) => {
  try {
  //   const prompt = `
  //   Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  //   {
  //     "salaryRanges": [
  //       { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  //     ],
  //     "growthRate": number,
  //     "demandLevel": "HIGH" | "MEDIUM" | "LOW",
  //     "topSkills": ["skill1", "skill2"],
  //     "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  //     "keyTrends": ["trend1", "trend2"],
  //     "recommendedSkills": ["skill1", "skill2"]
  //   }
    
  //   IMPORTANT: Return ONLY the JSON with values corresponding to all keys mentioned. No additional text, notes, or markdown formatting.
  //   IMPORTANT: Include at least 5 common roles for salary ranges.
  //   Growth rate should be a percentage.
  //   Include at least 5 skills and trends.
  // `;

  const prompt = `Provide a JSON structure containing information about the current state of the ${industry} industry.  The JSON should *only* contain the following keys and adhere to these specific data types and constraints.  Do not include any explanatory text outside of the JSON.  Ensure *all* fields have valid, realistic values.

json
{
  "salaryRange": [
    { "role": "string", "min": "number (integer, minimum 0)", "max": "number (integer, minimum min)", "median": "number (integer, min <= median <= max)", "location": "string" },
    { "role": "string", "min": "number (integer, minimum 0)", "max": "number (integer, minimum min)", "median": "number (integer, min <= median <= max)", "location": "string" },
    { "role": "string", "min": "number (integer, minimum 0)", "max": "number (integer, minimum min)", "median": "number (integer, min <= median <= max)", "location": "string" },
    { "role": "string", "min": "number (integer, minimum 0)", "max": "number (integer, minimum min)", "median": "number (integer, min <= median <= max)", "location": "string" },
    { "role": "string", "min": "number (integer, minimum 0)", "max": "number (integer, minimum min)", "median": "number (integer, min <= median <= max)", "location": "string" }
  ],
  "growthRate": "number (percentage, 0-100)",
  "demandLevel": "string (one of: 'HIGH', 'MEDIUM', 'LOW')",
  "topSkills": ["string", "string", "string", "string", "string"],
  "marketOutlook": "string (one of: 'POSITIVE', 'NEUTRAL', 'NEGATIVE')",
  "keyTrends": ["string", "string", "string", "string", "string"],
  "recommendedSkills": ["string", "string", "string", "string", "string"]
}

  IMPORTANT: Return ONLY the JSON with values corresponding to all keys mentioned. No additional text, notes, or markdown formatting.
  IMPORTANT: Include at least 5 common roles for salary ranges.
  Growth rate should be a percentage.
  Include at least 5 skills and trends.

` ;
    const result = await model.generateContent(prompt);
    const response = result?.response;
    const text = response?.text();
    // console.log("AI TExt: ", text)

    //Text response by gemini would not just contain h=the json data, but could have some unneccessary string part above it and below it as well, thus we need to clean it first.
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    if (typeof parsedData !== "object" || parsedData === null) {
      throw new Error("Parsed data is not an object");
    }

    return {
      salaryRange: parsedData.salaryRange || [],
      growthRate: parsedData.growthRate || 0,
      demandLevel: parsedData.demandLevel || "MEDIUM",
      topSkills: parsedData.topSkills || [],
      marketOutlook: parsedData.marketOutlook || "POSITIVE",
      keyTrends: parsedData.keyTrends || [],
      recommendedSkills: parsedData.recommendedSkills || [],
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error generating industry insights:", error);
    return {}; // Return an empty object to prevent `undefined` spread error
  }
};

export const generateDashBoardInsights = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userData = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      include: {
        industryInsight: true,
      },
    });
    if (!userData) throw new Error("User not found");

    if (!userData.industryInsight) {
      const insights = await generateInsightByAI(String(userData.industry));
      const industryInsight = db.industryInsight.create({
        data: {
          industry: String(userData.industry),
          salaryRange: insights.salaryRange, 
          growthRate: insights?.growthRate,
          demandLevel: insights.demandLevel,
          topSkills: insights.topSkills,
          marketOutlook: insights.marketOutlook,
          keyTrends: insights.keyTrends,
          recommendedSkills: insights.recommendedSkills,
          lastUpdated: insights.lastUpdated,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
        },
      });
      return industryInsight;
    }

    return userData.industryInsight;
  } catch (error) {
    console.error(
      "Error generating industry insights: ",
      (error as Error).message
    );
    throw new Error(
      "Failed to generate industry insights " + (error as Error).message
    );
  }
};
