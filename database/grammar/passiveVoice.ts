// @/database/grammar/passiveVoice.ts
import { GrammarQuestion } from '../../types';

export const passiveVoice: GrammarQuestion[] = [
    { question: 'The book ___ by a famous author.', options: ['was written', 'wrote', 'is writing', 'writes'], correctAnswer: 'was written', explanation: 'This is the passive voice, where the subject (the book) receives the action. The structure is "to be" + past participle.', difficulty: 'Medium' },
    { question: 'The Mona Lisa ___ by Leonardo da Vinci.', options: ['was painted', 'painted', 'is painting', 'paints'], correctAnswer: 'was painted', explanation: 'Passive voice is used here because the subject (The Mona Lisa) is the receiver of the action.', difficulty: 'Medium' },
    { question: 'English ___ all over the world.', options: ['is spoken', 'speaks', 'spoke', 'is speaking'], correctAnswer: 'is spoken', explanation: 'Present simple passive: is/are + past participle.', difficulty: 'Medium' },
    { question: 'The new bridge ___ next year.', options: ['will be built', 'will build', 'builds', 'is building'], correctAnswer: 'will be built', explanation: 'Future simple passive: will be + past participle.', difficulty: 'Medium' },
    { question: 'The thief ___ by the police yesterday.', options: ['was caught', 'caught', 'is caught', 'catches'], correctAnswer: 'was caught', explanation: 'Past simple passive: was/were + past participle.', difficulty: 'Medium' },
    { question: 'This cake ___ by my mother.', options: ['was made', 'made', 'is making', 'makes'], correctAnswer: 'was made', explanation: 'Passive voice: was/were + past participle.', difficulty: 'Medium' },
    { question: 'Mistakes ___ in the report.', options: ['were made', 'made', 'are making', 'make'], correctAnswer: 'were made', explanation: 'Passive voice: was/were + past participle.', difficulty: 'Medium' },
    { question: 'The project ___ by next Friday.', options: ['will have been completed', 'will complete', 'will be completing', 'completes'], correctAnswer: 'will have been completed', explanation: 'This is the future perfect passive voice, used to describe an action that will be finished before a specific time in the future.', difficulty: 'Hard' },
];
