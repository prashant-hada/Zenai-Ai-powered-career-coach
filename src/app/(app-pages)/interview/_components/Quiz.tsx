'use client'
import { generateQuiz, saveQuizResult } from '@/actions/interview'
import CustomLoader from '@/components/CustomLoader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import useFetch from '@/hooks/useFetch'
import { Loader2 } from 'lucide-react'
import React, {useState, useEffect} from 'react'
import { toast } from 'sonner'
import QuizResult from './QuizResult'
import { AnsweredQuestion, Assessment, Question } from '@/types/interview'

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(false);

    const {
        loading:generateQuizLoading,
        funct: generateQuizFn,
        data:quizData
    } = useFetch(generateQuiz);

    const {
        loading: savingResult,
        funct: saveQuizResultFn,
        data: resultData,
        setData: setResultData,
      } = useFetch<Assessment ,[Question[] , string[] , number]>(saveQuizResult);

    useEffect(()=>{
        if(quizData && quizData.length > 0){
            setAnswers(new Array(quizData.length).fill(null));
        }
    },[quizData])

    const handleAnswer = (answer:string) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);
      };

      const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setShowExplanation(false);
        } else {
          finishQuiz();
        }
      };

      const calculateScore = () => {
        let correct = 0;
        answers.forEach((answer, index) => {
          if (answer === quizData[index].correctAnswer) {
            correct++;
          }
        });
        return (correct / quizData.length) * 100;
      };

      const finishQuiz = async () => {
        const score = calculateScore();
        try {
          await saveQuizResultFn(quizData, answers, score);
          toast.success("Quiz completed!");
        } catch (error) {
          toast.error((error as Error).message || "Failed to save quiz results");
        }
      };

      const startNewQuiz = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setShowExplanation(false);
        generateQuizFn();
        setResultData(null);
      };

    if(generateQuizLoading){
        return <CustomLoader
         message='Wait for a moment, while we are getting questions for you.'
         />
    }

     // Show results if quiz is completed
  if (resultData) {
    const formattedResultData = {
      ...resultData,
      questions: resultData.questions as unknown as AnsweredQuestion[]
    }
    return (
      <div className="mx-2">
        <QuizResult result={formattedResultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if(!quizData){return (
    <div>
         <Card className='mx-2'>
            <CardHeader className="">
              <CardTitle className="">
                Ready to test your Knowledge?
              </CardTitle>
            </CardHeader>
            <CardContent>
             <p className='text-muted-foreground'>
                This quiz contains 10 question specific to your industry and skills. Take your time and choose the best answer for each question.
             </p>
            </CardContent>
            <CardFooter>
                <Button onClick={generateQuizFn} className='w-full' >Start Quiz</Button>
            </CardFooter>
          </Card>
    </div>
  )}

  const question = quizData[currentQuestion];

  return(
    <Card className='mx-2'>
            <CardHeader className="">
              <CardTitle className="">
                Question {currentQuestion + 1} of {quizData.length}
              </CardTitle>
              <CardDescription>
              <p className="text-lg font-medium">{question.question}</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
            {/* <p className="text-lg font-medium">{question.question}</p> */}
            <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option:string, index:number) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg cursor-pointer"
          onClick={() => setShowExplanation(prev=>!prev)}>
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
            </CardContent>
            <CardFooter className="flex justify-between">

          <Button
            onClick={() => setShowExplanation(prev=>!prev)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            {!showExplanation
            ? "Show Explaination"
            : "Hide Explaination"}
          </Button>
        
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
            {savingResult && (
            <Loader2 className="h-4 w-4 animate-spin"/>
          )}
          {currentQuestion < quizData.length - 1
            ? "Next Question"
            : "Finish Quiz"}
        </Button>
      </CardFooter>
          </Card>
  )
}

export default Quiz