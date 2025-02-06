'use client'
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import { checkUser } from "@/actions/auth";
import User from "@/types/User";
export function UserContextProvider({ children }: { children: React.ReactNode }) {
    const { isSignedIn } = useUser();
    const [user, setUser] = useState<User|null>(null);
  
    useEffect(() => {
        if (isSignedIn) {
            checkUser().then((user) => {
              if (user) setUser(user); // Ensure only valid user objects are set
              console.log("user: ",user)
            });
          }
    }, [isSignedIn]);
  
    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
  }
  