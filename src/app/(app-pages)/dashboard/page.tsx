import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';
import { generateDashBoardInsights } from '@/actions/insights';

const DashboardPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus();
    if(!isOnboarded) {redirect('/onboarding')}

    const insights = await generateDashBoardInsights();
  return (
    <div>
      <DashboardView insights={insights} />
    </div>
  )
}

export default DashboardPage