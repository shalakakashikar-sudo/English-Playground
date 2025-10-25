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

export enum GameState {
  MENU,
  LOADING, // Kept for future use, but not currently entered in the main flow
  PLAYING,
  FINISHED,
  ERROR,
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

// --- THEME DEFINITIONS ---

export type ThemeName = 'Classic' | 'Ocean' | 'Dusk' | 'Mint';

export interface ThemeColors {
  cream: string;
  darkBrown: string;
  mustard: string;
  teal: string;
}

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
}

export const themes: Record<ThemeName, Theme> = {
  Classic: {
    name: 'Classic',
    colors: {
      cream: '#FFF8EE',
      darkBrown: '#1E1A18',
      mustard: '#FFB000',
      teal: '#00C2B2',
    },
  },
  Ocean: {
    name: 'Ocean',
    colors: {
      cream: '#E0F7FA', // Light cyan
      darkBrown: '#004D40', // Dark teal
      mustard: '#4DD0E1', // Cyan
      teal: '#00796B', // Teal
    },
  },
  Dusk: {
    name: 'Dusk',
    colors: {
      cream: '#F3E5F5', // Lavender
      darkBrown: '#4A148C', // Dark purple
      mustard: '#F06292', // Pink
      teal: '#AB47BC', // Purple
    },
  },
  Mint: {
    name: 'Mint',
    colors: {
        cream: '#F1F8E9',      // Light Green
        darkBrown: '#33691E',   // Dark Green
        mustard: '#AED581',    // Light Green
        teal: '#689F38',       // Green
    }
  }
};