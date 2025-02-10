export interface Question {
        question: string;
        options: string[],
        correctAnswer: string,
        explanation: string
}

export interface AnsweredQuestion {
    question?: string;
    answer?:string;
    explanation?: string
    userAnswer?: string
    isCorrect?: boolean
}