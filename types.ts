export enum Subject {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  MATHEMATICS = 'Mathematics'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  subject: Subject;
  topic?: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserProgress {
  physicsScore: number;
  chemistryScore: number;
  mathematicsScore: number; // Reverted back
  totalQuestionsSolved: number;
  dailyQuote?: string;
  lastQuoteDate?: string;
  seenQuestions: string[];
  tasks: Task[];
  notificationsEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}