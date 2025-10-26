// @/database/grammar/tagQuestions.ts
import { GrammarQuestion } from '../../types';

export const tagQuestions: GrammarQuestion[] = [
    { question: 'You are coming to the party, ___?', options: ['aren\'t you', 'are you', 'don\'t you', 'do you'], correctAnswer: 'aren\'t you', explanation: 'A positive statement ("You are...") is followed by a negative tag question ("...aren\'t you?").', difficulty: 'Medium' },
    { question: 'He didn\'t go to the party, ___?', options: ['did he', 'didn\'t he', 'does he', 'doesn\'t he'], correctAnswer: 'did he', explanation: 'A negative statement needs a positive tag.', difficulty: 'Medium' },
    { question: 'She can speak French, ___?', options: ['can\'t she', 'can she', 'doesn\'t she', 'does she'], correctAnswer: 'can\'t she', explanation: 'Positive statement with modal verb "can" gets a negative tag "can\'t".', difficulty: 'Medium' },
    { question: 'Let\'s go to the beach, ___?', options: ['shall we', 'should we', 'will we', 'do we'], correctAnswer: 'shall we', explanation: 'The tag for "Let\'s..." is always "shall we?".', difficulty: 'Hard' },
    { question: 'I am right, ___?', options: ['aren\'t I', 'am I not', 'don\'t I', 'do I'], correctAnswer: 'aren\'t I', explanation: 'The tag question for "I am" is "aren\'t I?". "Am I not?" is grammatically correct but very formal and less common.', difficulty: 'Hard' },
];
