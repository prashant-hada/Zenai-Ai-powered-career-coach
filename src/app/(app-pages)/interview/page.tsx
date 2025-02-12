export const dynamic = 'force-dynamic';
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/StatsCards";
import QuizList from "./_components/QuizList";
import PerformanceChart from "./_components/PerformanceChart";
import { Assessment } from "@/types/interview";

const InterviewPage = async()=> {
    const assessments = await getAssessments();
    const transformedAssessments = assessments as unknown as Assessment[];

    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-6xl font-bold gradient-title">
            Interview Preparation
          </h1>
        </div>
        <div className="space-y-6">
          <StatsCards assessments={transformedAssessments} />
          <PerformanceChart assessments={transformedAssessments} />
          <QuizList assessments={transformedAssessments} />
        </div>
      </div>
    );
  }

export default InterviewPage;