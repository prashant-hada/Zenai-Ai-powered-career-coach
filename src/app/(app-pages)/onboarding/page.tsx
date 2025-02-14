export const dynamic = 'force-dynamic';
// import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboradingForm from './_components/OnboradingForm';
import { industries } from '@/data/industries';
// import { cookies } from 'next/headers';
import { getUserOnboardingStatus } from '@/actions/user';

const OnbardingPage = async() => {
  // //Check if user is already onboarded
  // const cookieStore = await cookies();
  // const onboardedCookie = cookieStore.get('isOnboarded')?.value;
  
  //   // If cookie is present and true, no need to check DB
  //   if (onboardedCookie === 'true') {redirect('/dashboard')}
  const {isOnboarded} = await getUserOnboardingStatus();
  if(isOnboarded) {redirect('/dashboard')}
  return (
    <div>
      <OnboradingForm industries={industries} />
    </div>
  )
}

export default OnbardingPage