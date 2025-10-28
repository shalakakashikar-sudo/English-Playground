

import { GoogleGenAI, Type } from "@google/genai";
import { Word, Difficulty, Idiom } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wordSchema = {
    type: Type.OBJECT,
    properties: {
        term: { type: Type.STRING, description: 'The vocabulary word.' },
        definition: { type: Type.STRING, description: 'A clear and simple definition of the word.' },
        synonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of synonyms.' },
        antonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of antonyms.' },
        example: { type: Type.STRING, description: 'An example sentence using the word.' },
        difficulty: { type: Type.STRING, description: 'The difficulty level of the word (e.g., Easy, Medium, Hard, Exam).' },
        etymology: { type: Type.STRING, description: 'A brief, interesting etymology or origin story for the word.' },
    },
    required: ['term', 'definition', 'synonyms', 'antonyms', 'example', 'difficulty', 'etymology'],
};

export const generateVocabulary = async (difficulty: Difficulty, count: number, existingTerms: string[]): Promise<Word[]> => {
    const prompt = `Generate ${count} new vocabulary words for an English learning app. The difficulty level for all words must be exactly '${difficulty}'.
    
    IMPORTANT: Do not generate any of the following words which are already in the database: ${existingTerms.join(', ')}.

    For each word, provide the following information:
    - term: The word itself.
    - definition: A simple, clear definition suitable for an English learner.
    - synonyms: An array of 2-3 relevant synonyms.
    - antonyms: An array of 2-3 relevant antonyms.
    - example: A sentence that clearly demonstrates the word's usage.
    - difficulty: The difficulty level, which must be '${difficulty}'.
    - etymology: A brief and interesting explanation of the word's origin.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: wordSchema,
                },
                temperature: 0.8,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        
        const jsonText = response.text.trim();
        const newWords: Word[] = JSON.parse(jsonText);
        
        if (!Array.isArray(newWords) || newWords.some(w => !w.term || !w.definition)) {
            throw new Error("Invalid data format received from API.");
        }
        
        return newWords;

    } catch (error) {
        console.error("Gemini API call for vocabulary failed:", error);
        throw new Error("Failed to generate dynamic content from the AI.");
    }
};


const idiomSchema = {
    type: Type.OBJECT,
    properties: {
        term: { type: Type.STRING, description: 'The idiom.' },
        definition: { type: Type.STRING, description: 'A clear and simple definition of the idiom.' },
        example: { type: Type.STRING, description: 'An example sentence using the idiom.' },
        difficulty: { type: Type.STRING, description: 'The difficulty level of the idiom (e.g., Easy, Medium, Hard, Exam).' },
    },
    required: ['term', 'definition', 'example', 'difficulty'],
};

export const generateIdioms = async (difficulty: Difficulty, count: number, existingTerms: string[]): Promise<Idiom[]> => {
    const prompt = `Generate ${count} new English idioms for an English learning app. The difficulty level for all idioms must be exactly '${difficulty}'.

    IMPORTANT: Do not generate any of the following idioms which are already in the database: ${existingTerms.join(', ')}.
    
    For each idiom, provide the following information:
    - term: The idiom itself (e.g., "Bite the bullet").
    - definition: A simple, clear definition suitable for an English learner.
    - example: A sentence that clearly demonstrates the idiom's usage.
    - difficulty: The difficulty level, which must be '${difficulty}'.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: idiomSchema,
                },
                temperature: 0.8,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        
        const jsonText = response.text.trim();
        const newIdioms: Idiom[] = JSON.parse(jsonText);
        
        if (!Array.isArray(newIdioms) || newIdioms.some(i => !i.term || !i.definition)) {
            throw new Error("Invalid data format received from API.");
        }
        
        return newIdioms;

    } catch (error) {
        console.error("Gemini API call for idioms failed:", error);
        throw new Error("Failed to generate dynamic content from the AI.");
    }
};

// FIX: Added missing function to generate story prompts for the Story Weaver game.
export const generateStoryPrompt = async (genre: string): Promise<string> => {
    const prompt = `Write a single, compelling, and mysterious first sentence for a ${genre} story. The sentence should immediately draw the reader in and set a clear tone for the genre. Do not add any preamble or explanation, just provide the sentence.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                temperature: 0.9,
            },
        });
        
        const firstLine = response.text.trim();
        if (!firstLine) {
            throw new Error("Generated an empty first line.");
        }
        
        return firstLine;
    } catch (error) {
        console.error("Gemini API call for story prompt failed:", error);
        // Fallback prompt
        switch(genre.toLowerCase()) {
            case 'fantasy':
                return 'The ancient map, discovered in a forgotten library, showed a single island that didn’t exist on any other chart.';
            case 'sci-fi':
                return 'The first message from the alien probe wasn\'t a greeting; it was a warning.';
            case 'mystery':
                return 'By the time Detective Miles arrived, the only thing missing from the crime scene was the victim.';
            case 'adventure':
                return 'The inheritance wasn\'t money or jewels, but a single, cryptic key and a note that simply said: "Find the other half."';
            case 'horror':
                return 'The last thing I remember before the cellar door slammed shut was the doll’s eyes, slowly turning to watch me.';
            case 'comedy':
                return 'Kevin, a squirrel of questionable intelligence and unwavering optimism, decided today was the day he would steal the world\'s largest acorn from the town square statue.';
            default:
                return `The old house at the end of the lane stood silent, holding its breath as the first visitor in fifty years approached the door.`;
        }
    }
};
