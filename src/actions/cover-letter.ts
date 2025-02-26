'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { CoverLetter } from "@prisma/client";

export async function generateCoverLetter() {
    
}

export async function updateCoverLetter() {
    
}

export async function getAllCoverLetters(): Promise<CoverLetter[]> {
    try {
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized")

        const userData = await db.user.findUnique({
            where:{
                clerkUserId:userId
            }
        })
        if(!userData) throw new Error("User not found");

        const coverLetterList = await db.coverLetter.findMany({
            where:{
                userId:userData.id
            }
        })

        if(!coverLetterList || coverLetterList.length === 0) throw new Error('No cover letters found');

        return coverLetterList;

    } catch (error) {
        console.error("Error while fetching cover letter", error);
        return [];
    }
}

export async function getCoverLetterById(coverLetterId:string) :Promise<CoverLetter | null>{
    try {
        const {userId} = await auth();
        if(!userId) throw new Error('Unauthorized');

        const coverLetterData = await db.coverLetter.findUnique({
            where:{
              id:coverLetterId,
              userId:userId  
            }
        })

        if(!coverLetterData) throw new Error('Cover Letter not found');

        return coverLetterData;
    } catch (error) {
        console.error("Error whilw fetching cover letter by id: ", error)
        return null
    }
    
}

interface DeleteCLResponse{
    success:boolean,
    message: string
}

export async function deleteCoverLetter(coverLetterId:string): Promise<DeleteCLResponse> {

    try {
        const {userId} = await auth();
        if(!userId) throw new Error('Unauthorized');

        const deleteCL = await db.coverLetter.delete({
            where:{
              id:coverLetterId,
              userId:userId  
            }
        })


    if(deleteCL) throw new Error("Something went wrong while deleting");

    return {
        success:true,
        message: "Cover Letter Deleted Successfully"
    }

    }catch(error){
        console.error("Error whilw fetching cover letter by id: ", error)
        return {
            success:false,
            message: (error as Error).message
        }
    }
    
}