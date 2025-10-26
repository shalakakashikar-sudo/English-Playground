// @/database/grammar/tenses.ts
import { GrammarQuestion } from '../../types';

export const tenses: GrammarQuestion[] = [
    { question: 'I ___ to the store yesterday.', options: ['went', 'go', 'have gone', 'am going'], correctAnswer: 'went', explanation: 'The word "yesterday" indicates that the action happened in the past, so the simple past tense "went" is correct.', difficulty: 'Easy' },
    { question: 'She ___ her homework right now.', options: ['is doing', 'does', 'did', 'has done'], correctAnswer: 'is doing', explanation: '"Right now" indicates an action in progress, requiring the present continuous tense.', difficulty: 'Easy' },
    { question: 'I ___ my keys. I can\'t find them anywhere.', options: ['lost', 'have lost', 'had lost', 'am losing'], correctAnswer: 'have lost', explanation: 'Present perfect is used for a past action with a present result.', difficulty: 'Medium' },
    { question: 'By the time I arrived, he ___', options: ['already left', 'had already left', 'has already left', 'left'], correctAnswer: 'had already left', explanation: 'Past perfect is used for an action that happened before another past action.', difficulty: 'Medium' },
    { question: 'What ___ you do last weekend?', options: ['did', 'do', 'have', 'were'], correctAnswer: 'did', explanation: '"Did" is the auxiliary verb for questions in the past simple.', difficulty: 'Easy' },
    { question: 'He ___ in this city since 2010.', options: ['lives', 'is living', 'has lived', 'lived'], correctAnswer: 'has lived', explanation: 'Present perfect is used for an action that started in the past and continues to the present.', difficulty: 'Medium' },
    { question: 'I ___ for you for two hours!', options: ['waited', 'am waiting', 'have been waiting', 'wait'], correctAnswer: 'have been waiting', explanation: 'Present perfect continuous emphasizes the duration of an action that started in the past and continues to the present.', difficulty: 'Medium' },
    { question: 'When I was a child, I ___ to play outside every day.', options: ['used', 'use', 'was using', 'have used'], correctAnswer: 'used', explanation: '"Used to" is for past habits.', difficulty: 'Medium' },
    { question: 'She ___ English for five years.', options: ['studies', 'is studying', 'has been studying', 'studied'], correctAnswer: 'has been studying', explanation: 'Present perfect continuous for an action over a period of time up to the present.', difficulty: 'Medium' },
    { question: 'The train ___ at 10 AM tomorrow.', options: ['arrives', 'will arrive', 'is arriving', 'arrived'], correctAnswer: 'arrives', explanation: 'Simple present can be used for scheduled future events.', difficulty: 'Hard' },
    { question: 'By next year, I ___ my studies.', options: ['will finish', 'will be finishing', 'will have finished', 'finish'], correctAnswer: 'will have finished', explanation: 'Future perfect is used for an action that will be completed before a certain time in the future.', difficulty: 'Hard' },
    { question: 'He ___ for the company for ten years when he retired.', options: ['worked', 'was working', 'had been working', 'has worked'], correctAnswer: 'had been working', explanation: 'Past perfect continuous is used to describe an ongoing action that was in progress before another past event.', difficulty: 'Exam' },
];
