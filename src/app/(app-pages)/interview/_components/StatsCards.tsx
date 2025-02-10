'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Trophy } from 'lucide-react';
import React from 'react'

const StatsCards = ({assessments}) => {

    const getAverageScore = ()=>{
        if(!assessments?.length) return 0;

        const total = assessments.reduce(
            (sum:number, assessment)=> sum + assessment.quizScore,
             0
            );
            return (total / assessments.length).toFixed(1);
    }

    const getLatestAssessment = ()=>{
        if(!assessments?.length) return null;

        const length = assessments?.length;
        return assessments[length-1];
    }

    const getTotalQuestions = ()=> {
        if(!assessments?.length) return 0;
        return assessments.reduce(
            (sum:number, assessment)=> sum + assessment.questions.length,
             0
            );
    }
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
        {/* Average Score card */}
        <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Average Score</CardTitle>
                <Trophy className='h-4 w-4 text-yellow-600' />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getAverageScore()}%</div>
                <p  className='text-xs text-muted-foreground'>Across all assessments</p>
            </CardContent>
        </Card>

        {/* Questions Praticed Card  */}
        <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Questions Practiced</CardTitle>
                <Brain className='h-4 w-4 text-purple-600' />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getTotalQuestions()}</div>
                <p  className='text-xs text-muted-foreground'>Total questions</p>
            </CardContent>
        </Card>

        {/* Latest Score Card  */}
        <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>Latest Score</CardTitle>
                <Target className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
                <p  className='text-xs text-muted-foreground'>On most recent assessment</p>
            </CardContent>
        </Card>
    </div>
  )
}

export default StatsCards