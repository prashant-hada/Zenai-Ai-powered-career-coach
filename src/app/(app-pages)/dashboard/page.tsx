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
    // const isRange = (item: any): item is Range => {
    //   return (
    //     item !== null &&  // Check for null
    //     typeof item === "object" &&
    //     "role" in item && typeof item.role === "string" &&
    //     "min" in item && typeof item.min === "number" &&
    //     "max" in item && typeof item.max === "number" &&
    //     "median" in item && typeof item.median === "number" &&
    //     "location" in item && typeof item.location === "string"
    //   );
    // }
    
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