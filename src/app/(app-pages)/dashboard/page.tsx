import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardPage = async() => {
  //Check if user is onboarded or not
    const {isOnboarded} = await getUserOnboardingStatus();
    if(!isOnboarded) {redirect('/onboarding')}
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage