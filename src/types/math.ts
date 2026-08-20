export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultyInfo {
  level: DifficultyLevel;
  label: string;
  name: string;
  description: string;
  badgeColor: string;
}

export interface MathTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  formulas: string[];
  keyConcepts: string[];
}

export interface MathStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathFormula?: string;
  result?: string;
}

export interface QuestionOption {
  label: string; // 'a', 'b', 'c', 'd'
  text: string;
  isCorrect?: boolean;
}

export interface PracticeProblem {
  id: string;
  topicId: string;
  topicName: string;
  difficulty: DifficultyLevel;
  questionText: string;
  diagramSvg?: string; // Optional visual diagram for geometry/trig
  options: QuestionOption[];
  correctAnswer: string; // e.g. 'b', '(2, 2)', '19.40 cm', '[3, 8]'
  correctOptionLabel?: string; // 'a', 'b', 'c', 'd'
  shortExplanation: string;
  methodology: string;
  formulaUsed: string;
  stepByStep: MathStep[];
  acceptableAnswers?: string[]; // Tolerant parsing
}

export interface DocumentAnalysisResult {
  fileName: string;
  fileSize?: string;
  detectedTopics: MathTopic[];
  extractedTextPreview: string;
  rawText: string;
  formulaCount: number;
  conceptCount: number;
  isValidMathDocument: boolean;
  warningMessage?: string;
}

export interface AnswerSubmission {
  userAnswer: string;
  isCorrect: boolean;
  feedbackText: string;
  timestamp: number;
}
