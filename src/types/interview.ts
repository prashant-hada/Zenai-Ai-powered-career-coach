export interface Question {
        question: string;
        options: string[],
        correctAnswer: string,
        explanation: string
}

export interface AnsweredQuestion {
    question: string;
    answer:string;
    explanation: string
    userAnswer: string
    isCorrect: boolean
}

export interface Assessment {
    id:string;
    userId: string;
    quizScore: number;
    questions: AnsweredQuestion[];
    category:string;
    improvementsTip:string;
    createdAt: Date;
    updatedAt: Date;
}