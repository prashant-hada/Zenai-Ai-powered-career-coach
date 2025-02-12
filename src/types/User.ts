export default interface User {
    id: string;
    clerkUserId?: string;
    email?: string;
    name?: string | null;  // 👈 Allow `null`
    imageUrl?: string | null; 
    industry?: string | null;
    bio?: string | null;
    experience?: number | null;
    skills?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface FormData{
    industry:string;
    skills: string[];
    bio:string;
    experience:number;
  }