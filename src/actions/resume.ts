'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function getResume() {
    try {
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if (!user) throw new Error("User Not Found");

        const resume= await db.resume.findUnique({
            where:{
                userId: user.id
            }
        })

        if (!resume) throw new Error("Resume Not Found");

        return resume;
    } catch (error) {
        console.error("Error Fetching resume:", error);
        return {
            userId: "",
    id: "string",
    createdAt: Date.now(),
    updatedAt: Date,
    content: "",
    atsScore: 0,
    feedback: ""
        }
    }
}

export async function saveResume(content: string | undefined) {
    try {
        if(!content){
            throw new Error('Content is invalid');
        }
        const {userId} = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        });
        if (!user) throw new Error("User Not Found");

        const resume = await db.resume.upsert({
            where:{
                userId:user.id
            },
            update:{
                content:content
            },
            create:{
                userId:user.id,
                content:content
            }
        })

        revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }

}

export async function improveWithAi(current:string, type:string) {
    try {
        const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });
  
    if (!user) throw new Error("User not found");
    
    const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const improvedContent = response.text().trim();
  return improvedContent;
} catch (error) {
  console.error("Error improving content:", error);
  throw new Error("Failed to improve content");
}
}