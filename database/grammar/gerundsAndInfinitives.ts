// @/database/grammar/gerundsAndInfinitives.ts
import { GrammarQuestion } from '../../types';

export const gerundsAndInfinitives: GrammarQuestion[] = [
    { question: 'I enjoy ___ books in my free time.', options: ['reading', 'to read', 'read', 'reads'], correctAnswer: 'reading', explanation: 'The verb "enjoy" is followed by a gerund (-ing form).', difficulty: 'Medium' },
    { question: 'He is good at ___ the piano.', options: ['play', 'playing', 'to play', 'played'], correctAnswer: 'playing', explanation: 'Prepositions like "at" are followed by a gerund.', difficulty: 'Medium' },
    { question: 'She decided ___ a new car.', options: ['to buy', 'buying', 'buy', 'buys'], correctAnswer: 'to buy', explanation: 'The verb "decide" is followed by an infinitive ("to" + verb).', difficulty: 'Medium' },
    { question: 'He wants ___ a doctor when he grows up.', options: ['to be', 'being', 'be', 'is'], correctAnswer: 'to be', explanation: '"Want" is followed by an infinitive.', difficulty: 'Medium' },
    { question: '___ is good for your health.', options: ['Swim', 'To swim', 'Swimming', 'Swam'], correctAnswer: 'Swimming', explanation: 'A gerund can be the subject of a sentence.', difficulty: 'Medium' },
    { question: 'I look forward to ___ you soon.', options: ['see', 'seeing', 'to see', 'saw'], correctAnswer: 'seeing', explanation: 'The phrasal verb "look forward to" is followed by a gerund.', difficulty: 'Hard' },
    { question: 'He made me ___ the whole story.', options: ['tell', 'to tell', 'telling', 'told'], correctAnswer: 'tell', explanation: 'After "make someone do something," we use the bare infinitive (the verb without "to").', difficulty: 'Hard' },
    { question: 'I would rather ___ at home than go out tonight.', options: ['stay', 'to stay', 'staying', 'stayed'], correctAnswer: 'stay', explanation: 'The expression "would rather" is followed by a bare infinitive (the verb without "to").', difficulty: 'Hard' },
];
