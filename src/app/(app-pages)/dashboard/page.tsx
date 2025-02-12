export const dynamic = 'force-dynamic';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';
import { generateDashBoardInsights } from '@/actions/insights';
import { Range } from '@/types/Industry';

const DashboardPage = async() => {
    const {isOnboarded} = await getUserOnboardingStatus();
    if(!isOnboarded) {redirect('/onboarding')}

    const insights = await generateDashBoardInsights();
    
    const transformedInsights = {
      ...insights,
      salaryRange: (insights.salaryRange as unknown as Range[]).map(item => ({
        role: item.role,
        min: item.min,
        max: item.max,
        median: item.median,
        location: item.location,
      })),
    };
    
  return (
    <div>
      <DashboardView insights={transformedInsights} />
    </div>
  )
}

export default DashboardPage