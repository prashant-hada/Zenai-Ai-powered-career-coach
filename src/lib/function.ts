// import { auth } from "@clerk/nextjs/server";
// import { db } from "./prisma";
import { cookies } from "next/headers";

// export async function getUserOnboardingStatus() {
//     try {
//         const {userId} = await auth()
//         if(!userId) throw new Error('Unauthorized');

//         const user = await db.user.findUnique({
//             where:{
//                 clerkUserId:userId
//             },
//             select:{
//                 industry: true
//             }
//         })
//         if(!user) throw new Error("User not found"); 

//         return {
//             isOnboarded: !!user?.industry
//         }
//     } catch (error) {
//         console.error("Error checking onboarding status: ", (error as Error).message);
//         throw new Error('Failed to check onboarding status');
//     }
    
// }

// export async function getUserOnboardingStatus() {
//     console.log("Checking onboarding status...");
//     try {
//         // Add more logging to trace the exact flow
//         const isOnboardedCookie = (await cookies()).get("isOnboarded")?.value;
//         console.log("isOnboardedCookie:", isOnboardedCookie);

//         // Simulate the actual check or add logs before every step
//         const isOnboarded = true;  // Or your actual logic
//         console.log("isOnboarded:", isOnboarded);
        
//         return isOnboarded;
//     } catch (error) {
//         console.error("Error in getUserOnboardingStatus:", error);
//         throw new Error('Failed to check onboarding status');
//     }
// }


export async function getUserOnboardingStatus(){
    const user = (await cookies()).get('userId');
    console.log("userId: ", user);
    const userId = user?.value;
    console.log("userId: ", userId);
    
    if(!userId) throw new Error('Unauthorized');

    console.log("userId: ", userId);
    return {isOnboarded : true}
}