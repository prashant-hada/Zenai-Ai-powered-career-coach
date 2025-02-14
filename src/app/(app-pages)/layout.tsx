// import { checkOnboardingStatus } from "@/actions/user";
import { getUserOnboardingStatus } from "@/actions/user";
// import axios from "axios"
import { redirect } from "next/navigation";
import React from 'react'

// const AppLayout = async({ children }: { children: React.ReactNode }) => {
//   try {
//     // const res = await axios.get('http://localhost:3000/api/check-onboarding');
//     // const { isOnboarded } = res.data;

//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/check-onboarding`, {
//       method: 'GET',
//       headers: {
//           'Content-Type': 'application/json',
//       },
//   });
//   if (!res.ok) throw new Error('Failed to fetch onboarding status');
//   const { isOnboarded } = await res.json();
//     if (!isOnboarded) redirect('/onboarding');

//     return <div className='container mx-auto mt-20 mb-12'>{children}</div>;
//   } catch (error) {
//     console.error('Onboarding Check Error: ', error);
//     redirect('/landing');
//   }
// }

// export default AppLayout


const AppLayout = async ({children}:{children:React.ReactNode}) => {
  try {
    const {isOnboarded} = await getUserOnboardingStatus();
    if(!isOnboarded) redirect('/onboarding');
  } catch (error) {
    console.error ("Error: ", error);
    redirect('/landing');
  }
  return (
    <div className='container mx-auto mt-20 mb-12'>{children}</div>
  )
}

export default AppLayout