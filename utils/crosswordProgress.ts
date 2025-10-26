// @/utils/crosswordProgress.ts

const CROSSWORD_PROGRESS_KEY = 'englishPlaygroundCrosswordProgress';

/**
 * Retrieves the list of played crossword IDs from localStorage.
 * @returns An array of crossword puzzle IDs that have been played.
 */
export const getPlayedCrosswordIds = (): string[] => {
  try {
    const savedProgress = localStorage.getItem(CROSSWORD_PROGRESS_KEY);
    if (savedProgress) {
      const ids = JSON.parse(savedProgress);
      if (Array.isArray(ids)) {
        return ids;
      }
    }
  } catch (error) {
    console.error('Failed to load crossword progress:', error);
  }
  return [];
};

/**
 * Adds a new crossword ID to the list of played puzzles in localStorage.
 * @param id The ID of the crossword puzzle to mark as played.
 */
export const addPlayedCrosswordId = (id: string): void => {
  try {
    const playedIds = getPlayedCrosswordIds();
    if (!playedIds.includes(id)) {
      const newPlayedIds = [...playedIds, id];
      localStorage.setItem(CROSSWORD_PROGRESS_KEY, JSON.stringify(newPlayedIds));
    }
  } catch (error) {
    console.error('Failed to save crossword progress:', error);
  }
};
