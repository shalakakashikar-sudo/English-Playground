// @/database/grammar/reportedSpeech.ts
import { GrammarQuestion } from '../../types';

export const reportedSpeech: GrammarQuestion[] = [
    { question: 'She said, "I am tired." -> She said that she ___ tired.', options: ['was', 'is', 'am', 'be'], correctAnswer: 'was', explanation: 'When reporting speech, the present tense "am" changes to the past tense "was".', difficulty: 'Medium' },
    { question: 'He said, "I will call you tomorrow." -> He said he would call me the ___ day.', options: ['next', 'previous', 'same', 'last'], correctAnswer: 'next', explanation: 'In reported speech, "tomorrow" changes to "the next day" or "the following day".', difficulty: 'Medium' },
    { question: 'She asked, "Where are you going?" -> She asked me where I ___ going.', options: ['was', 'am', 'is', 'were'], correctAnswer: 'was', explanation: 'In reported questions, the tense is backshifted (are -> was) and the word order is like a statement (subject before verb).', difficulty: 'Hard' },
    { question: 'He told me, "Don\'t be late." -> He told me ___ late.', options: ['not to be', 'to not be', 'don\'t be', 'should not be'], correctAnswer: 'not to be', explanation: 'Reported commands are formed with "to" + infinitive, and negative commands with "not to" + infinitive.', difficulty: 'Hard' },
];
