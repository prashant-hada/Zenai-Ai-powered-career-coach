'use server'
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../lib/prisma";

export const checkUser = async () => {
    try {   
  const user = await currentUser();

  if (!user) {
    console.error("No user found from Clerk. Authentication issue?");
    return null;
  }

  if (!user?.id) {
    console.error("User ID is missing in Clerk user object:", user);
    return null;
  }

  console.log("User: ", user);
  

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    // console.log("name: ", name);
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    // console.dir("newUser: ", newUser);

    return newUser;
  } catch (error) {
    console.log("error: ", error);
  }
};
