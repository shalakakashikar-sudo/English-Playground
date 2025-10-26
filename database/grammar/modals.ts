// @/database/grammar/modals.ts
import { GrammarQuestion } from '../../types';

export const modals: GrammarQuestion[] = [
    { question: 'You ___ finish your homework before you go out to play.', options: ['must', 'can', 'may', 'might'], correctAnswer: 'must', explanation: '"Must" indicates a strong obligation or necessity.', difficulty: 'Easy' },
    { question: '___ I borrow your pen, please?', options: ['May', 'Must', 'Should', 'Would'], correctAnswer: 'May', explanation: '"May" is a polite way to ask for permission.', difficulty: 'Easy' },
    { question: 'You ___ be tired after such a long journey.', options: ['must', 'can', 'should', 'may'], correctAnswer: 'must', explanation: '"Must" is used here to express a logical conclusion or a strong assumption.', difficulty: 'Medium' },
    { question: 'It ___ rain later, so you should take an umbrella.', options: ['might', 'must', 'can', 'should'], correctAnswer: 'might', explanation: '"Might" expresses a possibility.', difficulty: 'Medium' },
    { question: 'You ___ have told me you were coming!', options: ['should', 'must', 'can', 'may'], correctAnswer: 'should', explanation: '"Should have" + past participle is used to express regret or criticism about a past action.', difficulty: 'Hard' },
];
