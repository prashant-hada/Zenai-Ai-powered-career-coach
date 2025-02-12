'use client'
import {useState} from 'react'
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns/format';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import QuizResult from './QuizResult';
import { EyeIcon } from 'lucide-react';
import { Assessment } from '@/types/interview';
  

const QuizList = ({ assessments }:{assessments:Assessment[]}) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment|null>(null);
  return (
    <div>
      <Card>
        <CardHeader className="">
          <div className="flex flex-col space-y-3 sm:flex-row items-center justify-between ">
            <div className="">
              <CardTitle className="gradient-title text-3xl md:text-4xl text-center sm:text-start">
                Recent Assessments
              </CardTitle>
              <CardDescription  className='text-center sm:text-start'>
                Review your past assessment&apos; performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Assessment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className=" space-y-4">
            {assessments?.map((assessment, index) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Assessment {index + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                    <div>
                      {format(
                        new Date(assessment.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementsTip && (
                    <CardContent>
                        {assessment?.improvementsTip && 
                        (<>
                        <p className='text-sm text-primary flex items-center justify-start gap-1 mb-2 md:mb-1'>
                            <EyeIcon className='h-4 w-4 text-purple-600' />
                            Feedback
                        </p>
                        <p className='text-sm text-muted-foreground'> {assessment.improvementsTip}</p>
                        </>
                        )
                        }
                    </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={()=> setSelectedQuiz(null)}>
  <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
    <DialogHeader>
      <DialogTitle> </DialogTitle>
      <QuizResult 
      result={selectedQuiz as Assessment}
        hideStartNew
        onStartNew={() => router.push("/interview/mock")}
            />
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default QuizList