export type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  choices: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string[];
};

export type NumericQuestion = {
  id: string;
  type: "numeric";
  prompt: string;
  correctAnswer: number;
  tolerance?: number;
  unit?: string;
  explanation: string[];
};

export type Question = ChoiceQuestion | NumericQuestion;

export type QuizResult = {
  score: number;
  total: number;
  percentage: number;
};