// @/database/grammar.ts
import { GrammarQuestion } from '../types';
import { articles } from './grammar/articles';
import { comparativesAndSuperlatives } from './grammar/comparativesAndSuperlatives';
import { conditionals } from './grammar/conditionals';
import { conjunctions } from './grammar/conjunctions';
import { gerundsAndInfinitives } from './grammar/gerundsAndInfinitives';
import { miscellaneous } from './grammar/miscellaneous';
import { modals } from './grammar/modals';
import { passiveVoice } from './grammar/passiveVoice';
import { prepositions } from './grammar/prepositions';
import { quantifiers } from './grammar/quantifiers';
import { relativeClauses } from './grammar/relativeClauses';
import { reportedSpeech } from './grammar/reportedSpeech';
import { subjectVerbAgreement } from './grammar/subjectVerbAgreement';
import { tagQuestions } from './grammar/tagQuestions';
import { tenses } from './grammar/tenses';

export const grammar: GrammarQuestion[] = [
    ...articles,
    ...comparativesAndSuperlatives,
    ...conditionals,
    ...conjunctions,
    ...gerundsAndInfinitives,
    ...miscellaneous,
    ...modals,
    ...passiveVoice,
    ...prepositions,
    ...quantifiers,
    ...relativeClauses,
    ...reportedSpeech,
    ...subjectVerbAgreement,
    ...tagQuestions,
    ...tenses,
];
