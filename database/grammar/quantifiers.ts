// @/database/grammar/quantifiers.ts
import { GrammarQuestion } from '../../types';

export const quantifiers: GrammarQuestion[] = [
    { question: 'I don\'t have ___ money with me.', options: ['some', 'any', 'many', 'much'], correctAnswer: 'any', explanation: '"Any" is typically used in negative sentences and questions.', difficulty: 'Easy' },
    { question: 'How ___ apples did you buy?', options: ['much', 'many', 'some', 'any'], correctAnswer: 'many', explanation: '"Many" is used with countable nouns like "apples".', difficulty: 'Easy' },
    { question: 'There is ___ milk in the fridge.', options: ['some', 'any', 'many', 'a few'], correctAnswer: 'some', explanation: '"Some" is used in affirmative sentences for uncountable nouns.', difficulty: 'Easy' },
    { question: 'How ___ sugar do you want in your coffee?', options: ['much', 'many', 'a few', 'a little'], correctAnswer: 'much', explanation: '"Much" is used with uncountable nouns.', difficulty: 'Easy' },
    { question: 'There are ___ students in the classroom.', options: ['many', 'much', 'a little', 'some of'], correctAnswer: 'many', explanation: '"Many" is for countable nouns.', difficulty: 'Easy' },
    { question: 'There isn\'t ___ time left.', options: ['many', 'much', 'some', 'a few'], correctAnswer: 'much', explanation: '"Much" is used for uncountable nouns in negative sentences.', difficulty: 'Easy' },
    { question: 'We have ___ friends in this city.', options: ['a lot of', 'much', 'a little', 'any'], correctAnswer: 'a lot of', explanation: '"A lot of" can be used with countable nouns.', difficulty: 'Easy' },
    { question: 'He has very ___ friends.', options: ['few', 'little', 'much', 'any'], correctAnswer: 'few', explanation: '"Few" is used with countable nouns and has a negative connotation, meaning "not many".', difficulty: 'Medium' },
    { question: 'There is ___ hope left.', options: ['little', 'few', 'many', 'some'], correctAnswer: 'little', explanation: '"Little" is used with uncountable nouns and has a negative connotation, meaning "not much".', difficulty: 'Medium' },
    { question: 'Could I have ___ more water, please?', options: ['some', 'any', 'many', 'much'], correctAnswer: 'some', explanation: '"Some" is used in requests and offers, even though they are questions.', difficulty: 'Medium' },
    { question: 'Very ___ people can speak more than five languages.', options: ['few', 'little', 'a few', 'a little'], correctAnswer: 'few', explanation: '"Few" is used with countable nouns to mean "not many", emphasizing the small number.', difficulty: 'Hard' },
];
