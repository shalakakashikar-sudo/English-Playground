// @/database/grammar/miscellaneous.ts
import { GrammarQuestion } from '../../types';

export const miscellaneous: GrammarQuestion[] = [
    { question: 'The meeting will be held ___ Tuesday.', options: ['in', 'at', 'on', 'by'], correctAnswer: 'on', explanation: '"On" is used for specific days and dates.', difficulty: 'Easy' },
    { question: 'She speaks English very ___', options: ['good', 'well', 'best', 'better'], correctAnswer: 'well', explanation: '"Well" is an adverb that modifies the verb "speaks". "Good" is an adjective and cannot be used here.', difficulty: 'Easy' },
    { question: 'He drove the car too ___', options: ['fast', 'fastly', 'faster', 'fastest'], correctAnswer: 'fast', explanation: '"Fast" is an adverb, and it does not change its form. "Fastly" is not a word.', difficulty: 'Easy' },
    { question: 'Please give the book to ___', options: ['I', 'me', 'my', 'mine'], correctAnswer: 'me', explanation: '"Me" is an object pronoun and is used after a preposition like "to".', difficulty: 'Easy' },
    { question: 'My sister and ___ went to the movies.', options: ['I', 'me', 'my', 'myself'], correctAnswer: 'I', explanation: '"I" is a subject pronoun. To check, you can remove "My sister and" and the sentence should still make sense ("I went to the movies").', difficulty: 'Medium' },
    { question: 'She is much taller than ___', options: ['I', 'me', 'my', 'myself'], correctAnswer: 'I', explanation: 'When "than" is used as a conjunction in comparisons, the pronoun that follows is in the subject case. You can think of it as an ellipsis of "than I am". While "than me" is common in informal speech, "than I" is grammatically correct.', difficulty: 'Hard' },
    { question: 'The company is looking for someone ___ has experience in marketing.', options: ['who', 'whom', 'which', 'whose'], correctAnswer: 'who', explanation: '"Who" is a subject pronoun used for people.', difficulty: 'Medium' },
    { question: 'I have no idea ___ he is.', options: ['who', 'whom', 'which', 'whose'], correctAnswer: 'who', explanation: '"Who" is used as a subject pronoun here.', difficulty: 'Medium' },
    { question: 'I need to ___ the new software on my computer.', options: ['set up', 'set in', 'set off', 'set on'], correctAnswer: 'set up', explanation: '"Set up" is a phrasal verb meaning to install or configure something.', difficulty: 'Medium' },
];
