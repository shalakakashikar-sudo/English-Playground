import { FlashcardProgress, FlashcardStatus } from '../types';

const FLASHCARD_PROGRESS_KEY = 'englishPlaygroundFlashcardProgress';

export const getFlashcardProgress = (): FlashcardProgress => {
  try {
    const savedProgress = localStorage.getItem(FLASHCARD_PROGRESS_KEY);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      // Basic validation could be added here if needed
      return progress;
    }
  } catch (error) {
    console.error('Failed to load flashcard progress:', error);
  }
  
  // Default progress for new users
  return {};
};

export const saveFlashcardProgress = (progress: FlashcardProgress): void => {
  try {
    localStorage.setItem(FLASHCARD_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error)
 {
    console.error('Failed to save flashcard progress:', error);
  }
};

export const updateFlashcardStatus = (term: string, status: FlashcardStatus): void => {
    const progress = getFlashcardProgress();
    progress[term] = status;
    saveFlashcardProgress(progress);
}