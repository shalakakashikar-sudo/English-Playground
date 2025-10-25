// @/services/gameDataService.ts

import { DB } from '../database/db';
import { GameSettings, Question, DailyContentData, FlashcardData, Difficulty, CrosswordPuzzle, WordDetectiveSettings, WordDetectivePuzzle, Word, Idiom } from '../types';
import { getFlashcardProgress } from '../utils/flashcardProgress';
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
  const allCards: FlashcardData[] = shuffle([
    ...DB.words.map(w => ({ term: w.term, definition: w.definition, type: 'word' as const })),
    ...DB.idioms.map(i => ({ term: i.term, definition: i.definition, type: 'idiom' as const })),
  ]);

  const needsReviewCards = allCards.filter(c => progress[c.term] === 'needs_review');
  const knownCards = allCards.filter(c => progress[c.term] === 'known');
  const newCards = allCards.filter(c => !progress[c.term]);

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

export const getCrosswordPuzzle = (difficulty: Difficulty): CrosswordPuzzle => {
  const availablePuzzles = DB.crosswords.filter(p => p.difficulty === difficulty);
  
  if (availablePuzzles.length === 0) {
    // Fallback to Easy if no puzzles for the selected difficulty exist
    const easyPuzzles = DB.crosswords.filter(p => p.difficulty === 'Easy');
    if(easyPuzzles.length === 0) throw new Error(`No crossword puzzles found for difficulty: ${difficulty} or as a fallback.`);
    return shuffle(easyPuzzles)[0];
  }
  
  return shuffle(availablePuzzles)[0];
};

export const getWordDetectivePuzzles = (settings: WordDetectiveSettings): WordDetectivePuzzle[] => {
  const { topic, difficulty, numQuestions } = settings;
  let sourceData: { term: string; definition: string }[] = [];

  if (topic === 'Words') {
    sourceData = DB.words.filter(w => w.difficulty === difficulty);
  } else { // Idioms
    sourceData = DB.idioms.filter(i => i.difficulty === difficulty);
  }

  if (sourceData.length < numQuestions) {
    // Fallback if not enough items for that difficulty, use any from the topic
    const allTopicData = topic === 'Words' ? DB.words : DB.idioms;
    sourceData = shuffle(allTopicData);
  } else {
    sourceData = shuffle(sourceData);
  }

  if (sourceData.length === 0) {
    throw new Error(`No puzzles available for the topic: ${topic}.`);
  }

  return sourceData.slice(0, numQuestions).map(p => ({
    term: p.term,
    definition: p.definition,
    topic,
  }));
};