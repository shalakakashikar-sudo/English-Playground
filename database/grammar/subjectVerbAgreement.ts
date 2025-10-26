// @/database/grammar/subjectVerbAgreement.ts
import { GrammarQuestion } from '../../types';

export const subjectVerbAgreement: GrammarQuestion[] = [
    { question: 'The dog ___ chasing the cat.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: 'A singular subject ("The dog") takes a singular verb ("is").', difficulty: 'Easy' },
    { question: 'The cats ___ playing in the garden.', options: ['are', 'is', 'am', 'be'], correctAnswer: 'are', explanation: 'A plural subject ("The cats") takes a plural verb ("are").', difficulty: 'Easy' },
    { question: 'My friends and I ___ going to the movies.', options: ['are', 'is', 'am', 'be'], correctAnswer: 'are', explanation: 'A compound subject ("My friends and I") is plural and takes a plural verb.', difficulty: 'Easy' },
    { question: 'Either my mother or my father ___ coming to the meeting.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: 'With "either...or", the verb agrees with the subject closer to it ("my father").', difficulty: 'Medium' },
    { question: 'The team ___ celebrating their victory.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: 'A collective noun ("team") is treated as a singular unit here.', difficulty: 'Medium' },
    { question: 'Neither of the students ___ the answer.', options: ['knows', 'know', 'are knowing', 'is knowing'], correctAnswer: 'knows', explanation: '"Neither" is a singular pronoun and takes a singular verb.', difficulty: 'Hard' },
    { question: 'The news ___ on at 6 PM.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: '"News" is an uncountable noun and is treated as singular.', difficulty: 'Hard' },
    { question: 'The number of students in the class ___ limited to twenty.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: '"The number" is singular.', difficulty: 'Hard' },
    { question: 'A number of students ___ late for the class.', options: ['were', 'was', 'is', 'be'], correctAnswer: 'were', explanation: '"A number of" is a plural expression.', difficulty: 'Hard' },
    { question: 'Everyone ___ to be respected.', options: ['wants', 'want', 'are wanting', 'is wanting'], correctAnswer: 'wants', explanation: 'Indefinite pronouns like "everyone" are singular.', difficulty: 'Medium' },
    { question: 'One of the books ___ missing.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: 'The subject is "One," which is singular.', difficulty: 'Medium' },
    { question: 'The police ___ investigating the case.', options: ['are', 'is', 'am', 'be'], correctAnswer: 'are', explanation: '"Police" is a plural noun.', difficulty: 'Hard' },
    { question: 'Fifty dollars ___ a lot of money.', options: ['is', 'are', 'am', 'be'], correctAnswer: 'is', explanation: 'Expressions of money, time, and distance are treated as singular.', difficulty: 'Hard' },
    { question: 'The man with all the birds ___ on my street.', options: ['lives', 'live', 'are living', 'is living'], correctAnswer: 'lives', explanation: 'The subject is "The man" (singular), not "birds".', difficulty: 'Hard' },
];
