import { UserProgress } from '../types';

const PROGRESS_KEY = 'englishPlaygroundProgress';

export const getXPForNextLevel = (level: number): number => {
  // A simple formula: 100 XP for level 1, then increases
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const getPlayerTitle = (level: number): string => {
  if (level >= 20) return "English Master";
  if (level >= 15) return "Grammar Guardian";
  if (level >= 10) return "Idiom Explorer";
  if (level >= 5) return "Word Wanderer";
  return "Language Learner";
};

export const getUserProgress = (): UserProgress => {
  try {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      // Basic validation
      if (typeof progress.level === 'number' && typeof progress.xp === 'number') {
        return progress;
      }
    }
  } catch (error) {
    console.error('Failed to load user progress:', error);
    // If parsing fails, fall back to default
  }
  
  // Default progress for new users
  return {
    level: 1,
    xp: 0,
  };
};

export const saveUserProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
};