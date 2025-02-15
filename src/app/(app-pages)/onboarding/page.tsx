export const dynamic = 'force-dynamic';
// import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboradingForm from './_components/OnboradingForm';
import { industries } from '@/data/industries';
// import { cookies } from 'next/headers';
import { getUserOnboardingStatus } from '@/actions/user';

const OnbardingPage = async() => {
  const {isOnboarded} = await getUserOnboardingStatus();
  if(isOnboarded) {redirect('/dashboard')}
  return (
    <div>
      <OnboradingForm industries={industries} />
    </div>
  )
}

export default OnbardingPage