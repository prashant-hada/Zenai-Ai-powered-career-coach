import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboradingForm from './_components/OnboradingForm';
import { industries } from '@/data/industries';

const OnbardingPage = async() => {
  //Check if user is already onboarded
  const {isOnboarded} = await getUserOnboardingStatus();
  if(isOnboarded) {redirect('/dashboard')}
  return (
    <div>
      <OnboradingForm industries={industries} />
    </div>
  )
}

export default OnbardingPage