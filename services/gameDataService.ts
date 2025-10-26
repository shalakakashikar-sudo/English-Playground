// @/services/gameDataService.ts

import { DB } from '../database/db';
import { GameSettings, Question, DailyContentData, FlashcardData, Difficulty, CrosswordPuzzle, WordDetectiveSettings, WordDetectivePuzzle, Word, Idiom, CrosswordClue } from '../types';
import { getFlashcardProgress } from '../utils/flashcardProgress';
import { getPlayedCrosswordIds } from '../utils/crosswordProgress';
import * as geminiService from './geminiService';

/**
 * Shuffles an array in place and returns it.
 * @param array The array to shuffle.
 */
const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Creates a multiple-choice question from a database entry (word or idiom).
 * @param correctEntry The correct Word or Idiom from the database.
 * @param allEntries The pool of all possible entries of the same type to generate wrong answers from.
 * @param type The type of question to generate.
 */
const createMultipleChoiceQuestion = (
    correctEntry: { term: string; definition: string },
    allEntries: { term: string; definition: string }[],
    type: 'definition' | 'term'
): Omit<Question, 'explanation'> => {
    
    // Filter out the correct answer to create a pool of distractors
    const distractors = allEntries.filter(entry => entry.term !== correctEntry.term);
    const shuffledDistractors = shuffle([...distractors]);

    let questionText = '';
    let correctAnswer = '';
    const options: string[] = [];

    if (type === 'definition') {
        // "What is the definition of 'term'?"
        questionText = `What is the definition of "${correctEntry.term}"?`;
        correctAnswer = correctEntry.definition;
        options.push(correctAnswer);
        for (let i = 0; i < 3; i++) {
            options.push(shuffledDistractors[i].definition);
        }
    } else { // type === 'term'
        // "Which word or phrase means: "${correctEntry.definition}"?"
        questionText = `Which word or phrase means: "${correctEntry.definition}"?`;
        correctAnswer = correctEntry.term;
        options.push(correctAnswer);
        for (let i = 0; i < 3; i++) {
            options.push(shuffledDistractors[i].term);
        }
    }

    return {
        question: questionText,
        options: shuffle(options),
        correctAnswer: correctAnswer,
    };
};

export const generateQuestions = async (settings: GameSettings): Promise<Question[]> => {
  const { topic, numQuestions, difficulty } = settings;
  const questions: Question[] = [];
  
  // Ensure we don't request more questions than available
  const count = Math.min(numQuestions, 50); // Hard cap to prevent performance issues

  switch (topic) {
    case 'Vocabulary': {
      const cacheKey = `dynamic-vocab-${difficulty}`;
      let cachedWords: Word[] = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      const staticWords = DB.words.filter(w => w.difficulty === difficulty);
      const allAvailableWords = [...staticWords, ...cachedWords];
      let uniqueWords = Array.from(new Map(allAvailableWords.map(w => [w.term.toLowerCase(), w])).values());

      if (uniqueWords.length < count) {
        const wordsToFetch = 20;
        const existingTerms = uniqueWords.map(w => w.term);
        try {
          console.log(`Fetching ${wordsToFetch} new '${difficulty}' vocabulary words...`);
          const newWords = await geminiService.generateVocabulary(difficulty, wordsToFetch, existingTerms);
          const updatedCache = [...cachedWords, ...newWords];
          localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
          uniqueWords.push(...newWords);
          uniqueWords = Array.from(new Map(uniqueWords.map(w => [w.term.toLowerCase(), w])).values());
        } catch (e) {
          console.error("Failed to fetch dynamic vocabulary content:", e);
          if (uniqueWords.length === 0) {
            throw new Error("Could not generate new questions. Please check your connection or try again later.");
          }
        }
      }

      const shuffledWords = shuffle([...uniqueWords]);
      for (let i = 0; i < Math.min(count, shuffledWords.length); i++) {
        const word = shuffledWords[i];
        const questionType = Math.random() > 0.5 ? 'definition' : 'term';
        const mcq = createMultipleChoiceQuestion(word, DB.words, questionType);
        
        const fullExplanation = `"${word.term}" means: ${word.definition}\n\n${word.etymology || ''}\nExample: "${word.example}"`;

        questions.push({ ...mcq, explanation: fullExplanation.trim() });
      }
      break;
    }
    case 'Idioms': {
      const cacheKey = `dynamic-idioms-${difficulty}`;
      let cachedIdioms: Idiom[] = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      const staticIdioms = DB.idioms.filter(i => i.difficulty === difficulty);
      const allAvailableIdioms = [...staticIdioms, ...cachedIdioms];
      let uniqueIdioms = Array.from(new Map(allAvailableIdioms.map(i => [i.term.toLowerCase(), i])).values());

      if (uniqueIdioms.length < count) {
          const idiomsToFetch = 15;
          const existingTerms = uniqueIdioms.map(i => i.term);
          try {
              console.log(`Fetching ${idiomsToFetch} new '${difficulty}' idioms...`);
              const newIdioms = await geminiService.generateIdioms(difficulty, idiomsToFetch, existingTerms);
              const updatedCache = [...cachedIdioms, ...newIdioms];
              localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
              uniqueIdioms.push(...newIdioms);
              uniqueIdioms = Array.from(new Map(uniqueIdioms.map(i => [i.term.toLowerCase(), i])).values());
          } catch (e) {
              console.error("Failed to fetch dynamic idiom content:", e);
              if (uniqueIdioms.length === 0) {
                  throw new Error("Could not generate new idioms. Please check your connection or try again later.");
              }
          }
      }

      const shuffledIdioms = shuffle([...uniqueIdioms]);
      for (let i = 0; i < Math.min(count, shuffledIdioms.length); i++) {
        const idiom = shuffledIdioms[i];
        // For idioms, asking for the definition is most common
        const mcq = createMultipleChoiceQuestion(idiom, DB.idioms, 'definition');
        questions.push({ ...mcq, explanation: `The idiom "${idiom.term}" means: ${idiom.definition}.\n\nExample: ${idiom.example}` });
      }
      break;
    }
    case 'Synonyms/Antonyms': {
      const filteredWords = DB.words.filter(w => w.difficulty === difficulty);
      const shuffledWords = shuffle([...filteredWords]).filter(w => w.synonyms.length > 0 || w.antonyms.length > 0);
      for (let i = 0; i < Math.min(count, shuffledWords.length); i++) {
        const word = shuffledWords[i];
        const isSynonym = Math.random() > 0.5 && word.synonyms.length > 0;
        
        if (isSynonym) {
            const correctAnswer = shuffle([...word.synonyms])[0];
            const distractors = DB.words
                .filter(w => w.term !== word.term && !word.synonyms.includes(w.term))
                .map(w => w.term);
            const options = shuffle([correctAnswer, ...shuffle(distractors).slice(0, 3)]);
            const explanation = `A synonym for "${word.term}" is "${correctAnswer}".\n\nBoth words relate to its meaning: "${word.definition}". ${word.etymology ? `\n\n${word.etymology}` : ''}`;
            questions.push({
                question: `Which of the following is a synonym for "${word.term}"?`,
                options,
                correctAnswer,
                explanation: explanation.trim()
            });
        } else if (word.antonyms.length > 0) { // Antonym question
             const correctAnswer = shuffle([...word.antonyms])[0];
             const distractors = DB.words
                .filter(w => w.term !== word.term && !word.antonyms.includes(w.term))
                .map(w => w.term);
             const options = shuffle([correctAnswer, ...shuffle(distractors).slice(0, 3)]);
             const explanation = `An antonym for "${word.term}" is "${correctAnswer}". They have opposite meanings.\n\n"${word.term}" means: "${word.definition}".`;
             questions.push({
                question: `Which of the following is an antonym for "${word.term}"?`,
                options,
                correctAnswer,
                explanation: explanation.trim()
            });
        }
      }
      break;
    }
    case 'Grammar': {
      const filteredGrammar = DB.grammar.filter(g => g.difficulty === difficulty);
      const shuffledGrammar = shuffle([...filteredGrammar]);
      for (let i = 0; i < Math.min(count, shuffledGrammar.length); i++) {
        const q = shuffledGrammar[i];
        questions.push({
          question: q.question,
          options: shuffle([...q.options]), // Shuffle options for variety
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        });
      }
      break;
    }
    default:
      throw new Error(`Unsupported game topic: ${topic}`);
  }
  
  return questions;
};

export const getDailyContent = (): DailyContentData => {
  const randomWord = shuffle([...DB.words])[0];
  const randomQuote = shuffle([...DB.quotes])[0];
  
  const progress = getFlashcardProgress();
  const allTerms: { term: string; definition: string; type: 'word' | 'idiom' }[] = shuffle([
    ...DB.words.map(w => ({ term: w.term, definition: w.definition, type: 'word' as const })),
    ...DB.idioms.map(i => ({ term: i.term, definition: i.definition, type: 'idiom' as const })),
  ]);

  const needsReviewCards: FlashcardData[] = allTerms
    .filter(c => progress[c.term] === 'needs_review')
    .map(c => ({ ...c, status: 'needs_review' }));

  const knownCards: FlashcardData[] = allTerms
    .filter(c => progress[c.term] === 'known')
    .map(c => ({ ...c, status: 'known' }));

  const newCards: FlashcardData[] = allTerms.filter(c => !progress[c.term]);

  const DAILY_FLASHCARD_COUNT = 8;
  const NEEDS_REVIEW_TARGET = 5;

  let selectedCards: FlashcardData[] = [];

  // 1. Prioritize 'needs review' cards
  selectedCards.push(...shuffle(needsReviewCards).slice(0, NEEDS_REVIEW_TARGET));

  // 2. Fill the rest with 'new' cards
  let remainingSlots = DAILY_FLASHCARD_COUNT - selectedCards.length;
  if (remainingSlots > 0) {
    selectedCards.push(...shuffle(newCards).slice(0, remainingSlots));
  }

  // 3. If still not enough, fill with 'known' cards
  remainingSlots = DAILY_FLASHCARD_COUNT - selectedCards.length;
  if (remainingSlots > 0) {
     selectedCards.push(...shuffle(knownCards).slice(0, remainingSlots));
  }

  return {
    wordOfTheDay: {
      word: randomWord.term,
      definition: randomWord.definition,
      exampleSentence: randomWord.example || `(No example sentence available for this word.)`,
    },
    quoteOfTheDay: {
      quote: randomQuote.quote,
      author: randomQuote.author,
    },
    flashcards: selectedCards,
  };
};

export const getWordDetectivePuzzles = (settings: WordDetectiveSettings): WordDetectivePuzzle[] => {
  const { topic, difficulty, numQuestions } = settings;
  
  let source: { term: string; definition: string }[];
  if (topic === 'Words') {
    source = DB.words.filter(w => w.difficulty === difficulty);
  } else { // Idioms
    source = DB.idioms.filter(i => i.difficulty === difficulty);
  }

  if (source.length === 0) {
    throw new Error(`No '${topic}' found for '${difficulty}' difficulty.`);
  }

  return shuffle(source)
    .slice(0, numQuestions)
    .map(item => ({
      term: item.term,
      definition: item.definition,
      topic: topic,
    }));
};

// --- START: Local Crossword Generation Logic ---

type PlacedWord = {
    word: Word;
    row: number;
    col: number;
    direction: 'across' | 'down';
};

// Helper to check if a word can be placed at a specific position
const canPlaceWord = (grid: (string | null)[][], word: string, row: number, col: number, direction: 'across' | 'down'): boolean => {
    const GRID_SIZE = grid.length;
    word = word.toUpperCase();

    // 1. Boundary check
    if (direction === 'across') {
        if (col < 0 || col + word.length > GRID_SIZE) return false;
        if ((col > 0 && grid[row][col - 1] !== null) || (col + word.length < GRID_SIZE && grid[row][col + word.length] !== null)) return false;
    } else { // down
        if (row < 0 || row + word.length > GRID_SIZE) return false;
        if ((row > 0 && grid[row - 1][col] !== null) || (row + word.length < GRID_SIZE && grid[row + word.length][col] !== null)) return false;
    }

    // 2. Collision and adjacency check
    for (let i = 0; i < word.length; i++) {
        const r = direction === 'down' ? row + i : row;
        const c = direction === 'across' ? col + i : col;
        
        const gridChar = grid[r][c];
        const wordChar = word[i];

        if (gridChar !== null && gridChar !== wordChar) return false; // Collision with a different letter

        if (gridChar === null) { // Adjacency check only for empty cells
            if (direction === 'across') {
                if (r > 0 && grid[r - 1][c] !== null) return false;
                if (r < GRID_SIZE - 1 && grid[r + 1][c] !== null) return false;
            } else { // down
                if (c > 0 && grid[r][c - 1] !== null) return false;
                if (c < GRID_SIZE - 1 && grid[r][c + 1] !== null) return false;
            }
        }
    }
    return true;
};

// Main generation function
const generateCrosswordFromDb = (difficulty: Difficulty): CrosswordPuzzle | null => {
    const sizeMap = { 'Easy': 7, 'Medium': 10, 'Hard': 12, 'Exam': 14 };
    const wordCountMap = { 'Easy': 6, 'Medium': 10, 'Hard': 14, 'Exam': 18 };
    const GRID_SIZE = sizeMap[difficulty];
    const MAX_WORDS = wordCountMap[difficulty];
    const MAX_ATTEMPTS = 3;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const sourceWords = DB.words.filter(w =>
            (w.difficulty === difficulty) &&
            w.term.length <= GRID_SIZE &&
            /^[A-Z]+$/i.test(w.term)
        ).sort((a, b) => b.term.length - a.term.length);
        
        if (sourceWords.length < MAX_WORDS) continue;

        let unplacedWords: Word[] = shuffle(sourceWords).slice(0, MAX_WORDS);
        let grid: (string | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        let placedWords: PlacedWord[] = [];

        // Place the first word
        const firstWord = unplacedWords.shift()!;
        const startRow = Math.floor(GRID_SIZE / 2);
        const startCol = Math.floor((GRID_SIZE - firstWord.term.length) / 2);
        for (let i = 0; i < firstWord.term.length; i++) {
            grid[startRow][startCol + i] = firstWord.term[i].toUpperCase();
        }
        placedWords.push({ word: firstWord, row: startRow, col: startCol, direction: 'across' });

        // Smarter placement: at each step, find the best word to place next.
        while (unplacedWords.length > 0) {
            let bestCandidate: {
                word: Word;
                fit: { row: number; col: number; direction: 'across' | 'down' };
                intersections: number;
            } | null = null;

            // Iterate through all remaining words to find the one with the best possible placement
            for (const wordToPlace of unplacedWords) {
                let bestFitForThisWord: { row: number; col: number; direction: 'across' | 'down' } | null = null;
                let maxIntersectionsForThisWord = 0;

                // Check against every already placed word for intersections
                for (const pWord of placedWords) {
                    for (let j = 0; j < pWord.word.term.length; j++) { // index in placed word
                        for (let k = 0; k < wordToPlace.term.length; k++) { // index in new word
                            if (pWord.word.term[j].toUpperCase() === wordToPlace.term[k].toUpperCase()) {
                                const newDirection: 'across' | 'down' = pWord.direction === 'across' ? 'down' : 'across';
                                
                                let row: number, col: number;
                                if (newDirection === 'down') { // new word is vertical
                                    row = pWord.row - k;
                                    col = pWord.col + j;
                                } else { // new word is horizontal
                                    row = pWord.row + j;
                                    col = pWord.col - k;
                                }

                                if (canPlaceWord(grid, wordToPlace.term, row, col, newDirection)) {
                                    let currentIntersections = 0;
                                    for (let l = 0; l < wordToPlace.term.length; l++) {
                                        const r = newDirection === 'down' ? row + l : row;
                                        const c = newDirection === 'across' ? col + l : col;
                                        if (grid[r][c] !== null) {
                                            currentIntersections++;
                                        }
                                    }
                                    
                                    // We are looking for the placement with the most intersections for THIS word
                                    if (currentIntersections > maxIntersectionsForThisWord) {
                                        maxIntersectionsForThisWord = currentIntersections;
                                        bestFitForThisWord = { row, col, direction: newDirection };
                                    }
                                }
                            }
                        }
                    }
                }

                // After checking all placements for wordToPlace, see if it's the best candidate overall so far
                if (bestFitForThisWord && (bestCandidate === null || maxIntersectionsForThisWord > bestCandidate.intersections)) {
                    bestCandidate = {
                        word: wordToPlace,
                        fit: bestFitForThisWord,
                        intersections: maxIntersectionsForThisWord,
                    };
                }
            }

            // After checking all unplaced words, place the single best one we found
            if (bestCandidate) {
                const { word, fit } = bestCandidate;
                for (let l = 0; l < word.term.length; l++) {
                    const r = fit.direction === 'down' ? fit.row + l : fit.row;
                    const c = fit.direction === 'across' ? fit.col + l : fit.col;
                    grid[r][c] = word.term[l].toUpperCase();
                }
                placedWords.push({ word, ...fit });
                unplacedWords = unplacedWords.filter(w => w.term !== word.term);
            } else {
                // No more words can be placed on the grid
                break;
            }
        }
        
        if (placedWords.length >= MAX_WORDS * 0.7) {
            // Success, now generate clues
            const clues: { across: CrosswordClue[], down: CrosswordClue[] } = { across: [], down: [] };
            let clueCounter = 1;
            const numberedCells = new Map<string, number>();

            placedWords.sort((a, b) => a.row - b.row || a.col - b.col);

            for (const pWord of placedWords) {
                const key = `${pWord.row},${pWord.col}`;
                let clueNum;
                if (!numberedCells.has(key)) {
                    clueNum = clueCounter++;
                    numberedCells.set(key, clueNum);
                } else {
                    clueNum = numberedCells.get(key)!;
                }
                
                const clueData: CrosswordClue = {
                    num: clueNum,
                    row: pWord.row,
                    col: pWord.col,
                    clue: pWord.word.definition,
                    length: pWord.word.term.length,
                };
                clues[pWord.direction].push(clueData);
            }
            clues.across.sort((a,b) => a.num - b.num);
            clues.down.sort((a,b) => a.num - b.num);

            return {
                id: `db-gen-${new Date().getTime()}`,
                difficulty,
                size: GRID_SIZE,
                gridSolution: grid,
                clues,
            };
        }
    }
    return null; // Generation failed
};

export const getCrosswordPuzzle = (difficulty: Difficulty): CrosswordPuzzle => {
    // 1. Get available static puzzles for the difficulty
    const staticPuzzlesForDifficulty = DB.crosswords.filter(p => p.difficulty === difficulty);

    // 2. Get IDs of puzzles already played
    const playedIds = getPlayedCrosswordIds();

    // 3. Find unplayed static puzzles
    const unplayedStaticPuzzles = staticPuzzlesForDifficulty.filter(p => !playedIds.includes(p.id));

    // 4. If there are unplayed puzzles, return one
    if (unplayedStaticPuzzles.length > 0) {
        return shuffle(unplayedStaticPuzzles)[0];
    }
    
    // 5. If all static puzzles are played, generate a new one
    console.log(`All static '${difficulty}' puzzles played. Generating a new one.`);
    try {
        const generatedPuzzle = generateCrosswordFromDb(difficulty);
        if (generatedPuzzle) {
            return generatedPuzzle;
        }
    } catch (error) {
        console.error("Dynamic crossword generation failed:", error);
    }

    // 6. Fallback: if dynamic generation fails, let the user replay a static one.
    // Also handles the case where there are no static puzzles for the difficulty to begin with.
    if (staticPuzzlesForDifficulty.length > 0) {
        console.warn("Dynamic generation failed. Serving a random static puzzle as fallback.");
        return shuffle(staticPuzzlesForDifficulty)[0];
    }
    
    // 7. Ultimate fallback if no puzzles exist at all for the difficulty
    throw new Error(`No crossword puzzles available for '${difficulty}' difficulty.`);
};

// --- END: Local Crossword Generation Logic ---