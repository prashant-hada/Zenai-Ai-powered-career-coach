"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
// import { CoverLetter } from "@prisma/client";
import { CoverLetter, CoverLetterData } from "@/types/CoverLetter";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

interface GenerateCoverLetterArgs {
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
}

export async function generateCoverLetter(data: GenerateCoverLetterArgs) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
      data.companyName
    }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data?.jobDescription}
    
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

    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    return content;
  } catch (error) {
    console.error("Error generating cover letter:", (error as Error).message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function updateCoverLetter(id: string, data: CoverLetterData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User not found");

    const coverLetterData = await db.coverLetter.upsert({
      where: {
        id: id,
      },
      update: {
        content: data.content ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        content: data.content,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
      },
    });

    if (coverLetterData) throw new Error("Error while updating database");

    return { success: true, data: coverLetterData };
  } catch (error) {
    console.error("Error updating cover letter:", (error as Error).message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getAllCoverLetters(): Promise<CoverLetter[]> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userData = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!userData) throw new Error("User not found");

    const coverLetterList = await db.coverLetter.findMany({
      where: {
        userId: userData.id,
      },
    });

    if (!coverLetterList || coverLetterList.length === 0)
      throw new Error("No cover letters found");

    return coverLetterList;
  } catch (error) {
    console.error("Error while fetching cover letter", error);
    throw error;
  }
}

export async function getCoverLetterById(
  coverLetterId: string
): Promise<CoverLetter | null> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userData = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!userData) throw new Error("User not found");

    const coverLetterData = await db.coverLetter.findUnique({
      where: {
        id: coverLetterId,
        userId: userData.id,
      },
    });

    if (!coverLetterData) throw new Error("Cover Letter not found");

    return coverLetterData;
  } catch (error) {
    console.error("Error whilw fetching cover letter by id: ", error);
    throw error;
  }
}

interface DeleteCLResponse {
  success: boolean;
  message: string;
}

export async function deleteCoverLetter(
  coverLetterId: string
): Promise<DeleteCLResponse> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const userData = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!userData) throw new Error("User not found");

    await db.coverLetter.delete({
      where: {
        id: coverLetterId,
        userId: userData.id,
      },
    });

    return {
      success: true,
      message: "Cover Letter Deleted Successfully",
    };
  } catch (error) {
    console.error("Error whilw fetching cover letter by id: ", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
}
