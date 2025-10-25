export interface GameSettings {
  topic: string;
  // FIX: Changed difficulty from string to Difficulty type for type safety.
  difficulty: Difficulty;
  numQuestions: number;
  timePerQuestion: number;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface WordOfTheDayData {
  word: string;
  definition: string;
  exampleSentence: string;
}

export interface QuoteOfTheDayData {
  quote: string;
  author: string;
}

// FIX: Added Quote interface for database entries.
export interface Quote {
  quote: string;
  author: string;
}

export interface FlashcardData {
  term: string;
  definition:string;
  type: 'word' | 'idiom';
}

export interface DailyContentData {
  wordOfTheDay: WordOfTheDayData;
  quoteOfTheDay: QuoteOfTheDayData;
  flashcards: FlashcardData[];
}

export interface UserProgress {
  level: number;
  xp: number;
}

export type FlashcardStatus = 'known' | 'needs_review';

export interface FlashcardProgress {
  [term: string]: FlashcardStatus;
}

// FIX: Add MascotState type here for centralization.
export type MascotState = 'default' | 'thinking' | 'correct' | 'incorrect' | 'happy' | 'wowed' | 'sad';

export enum GameState {
  MENU,
  LOADING, // Kept for future use, but not currently entered in the main flow
  PLAYING,
  FINISHED,
  ERROR,
  MORE_GAMES,
  CROSSWORD_MENU,
  CROSSWORD_PLAYING,
  WORD_DETECTIVE_MENU,
  WORD_DETECTIVE_PLAYING,
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Exam';

export const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Exam'];
export const topics = ['Vocabulary', 'Idioms', 'Synonyms/Antonyms', 'Grammar'];
export const questionCounts = [5, 10, 15, 20];
export const timeLimits = [5, 10, 15, 20];

// Add difficulty to the database types
export interface Word {
  term: string;
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example: string;
  difficulty: Difficulty;
  etymology?: string; // Add etymology for deeper explanations
}

export interface Idiom {
  term: string;
  definition: string;
  example: string;
  difficulty: Difficulty;
}

export interface GrammarQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

// Types for Crossword Game
export interface CrosswordSettings {
  difficulty: Difficulty;
  timerDuration: number; // in minutes. 0 means no timer.
}

export const crosswordTimeLimits = [0, 1, 2, 5, 10];

export interface CrosswordClue {
    num: number;
    row: number;
    col: number;
    clue: string;
    length: number;
}
export interface CrosswordPuzzle {
  id: string;
  difficulty: Difficulty;
  size: number;
  gridSolution: (string | null)[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

// Types for Word Detective Game
export interface WordDetectiveSettings {
  topic: 'Words' | 'Idioms';
  difficulty: Difficulty;
  numQuestions: number;
}

export const wordDetectiveQuestionCounts = [5, 10, 15];

export interface WordDetectivePuzzle {
  term: string;
  definition: string;
  topic: 'Words' | 'Idioms';
}
