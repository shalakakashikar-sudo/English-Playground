// @/database/grammar/relativeClauses.ts
import { GrammarQuestion } from '../../types';

export const relativeClauses: GrammarQuestion[] = [
    { question: 'The woman ___ lives next door is a doctor.', options: ['who', 'which', 'whom', 'whose'], correctAnswer: 'who', explanation: '"Who" is used as a subject pronoun for people.', difficulty: 'Easy' },
    { question: 'This is the book ___ I was telling you about.', options: ['that', 'who', 'whom', 'whose'], correctAnswer: 'that', explanation: '"That" or "which" is used for things. In this context, the relative pronoun can also be omitted.', difficulty: 'Easy' },
    { question: 'The man ___ car was stolen went to the police.', options: ['whose', 'who', 'whom', 'which'], correctAnswer: 'whose', explanation: '"Whose" is a possessive pronoun used for people and things.', difficulty: 'Medium' },
    { question: 'The city ___ I was born is very small.', options: ['where', 'which', 'that', 'when'], correctAnswer: 'where', explanation: '"Where" is a relative adverb used to refer to a place.', difficulty: 'Medium' },
    { question: 'I remember the day ___ we first met.', options: ['when', 'which', 'where', 'that'], correctAnswer: 'when', explanation: '"When" is a relative adverb used to refer to a time.', difficulty: 'Medium' },
    { question: 'The reason ___ he was late is not clear.', options: ['why', 'which', 'that', 'what'], correctAnswer: 'why', explanation: '"Why" is a relative adverb used to give a reason.', difficulty: 'Hard' },
    { question: 'The manager, ___ I spoke to yesterday, was very helpful.', options: ['who', 'whom', 'which', 'whose'], correctAnswer: 'whom', explanation: '"Whom" is an object pronoun used for people, especially in formal English. You can test this by rearranging the clause: "I spoke to him/whom".', difficulty: 'Hard' },
    { question: 'This is the place ___ the accident happened.', options: ['where', 'which', 'that', 'when'], correctAnswer: 'where', explanation: '"Where" refers to a location.', difficulty: 'Easy' },
];
