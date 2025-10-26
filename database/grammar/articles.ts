// @/database/grammar/articles.ts
import { GrammarQuestion } from '../../types';

export const articles: GrammarQuestion[] = [
    { question: 'I saw ___ amazing movie last night.', options: ['a', 'an', 'the', 'some'], correctAnswer: 'an', explanation: '"An" is used before words that start with a vowel sound, like "amazing".', difficulty: 'Easy' },
    { question: 'Could you please pass me ___ salt?', options: ['a', 'an', 'the', 'any'], correctAnswer: 'the', explanation: '"The" is a definite article used here because it refers to a specific salt shaker that is understood by both speakers.', difficulty: 'Easy' },
    { question: 'I bought ___ orange from the market.', options: ['a', 'an', 'the', 'some'], correctAnswer: 'an', explanation: '"An" is used before words starting with a vowel sound.', difficulty: 'Easy' },
    { question: 'Please pass me ___ pen on the table.', options: ['a', 'an', 'the', 'some'], correctAnswer: 'the', explanation: '"The" refers to a specific pen that both speaker and listener know.', difficulty: 'Easy' },
];
