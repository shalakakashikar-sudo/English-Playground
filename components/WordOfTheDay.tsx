import React from 'react';
import { WordOfTheDayData } from '../types';
import { playSound } from '../utils/audio';

interface WordOfTheDayProps {
  data: WordOfTheDayData | null;
}

const WordOfTheDay: React.FC<WordOfTheDayProps> = ({ data }) => {
  
  const handleSpeak = (textToSpeak: string) => {
    playSound('click');
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-GB';
      window.speechSynthesis.cancel(); // Stop any previous speech
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  const renderContent = () => {
    if (data) {
      return (
        <>
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-3xl font-bold capitalize text-teal">{data.word}</h3>
            <button
                onClick={() => handleSpeak(data.word)}
                className="p-2 rounded-full text-dark-brown/50 hover:bg-dark-brown/10 hover:text-dark-brown focus:outline-none focus:ring-2 focus:ring-dark-brown/50 dark:text-cream/50 dark:hover:bg-cream/10 dark:hover:text-cream dark:focus:ring-cream/50 transition-colors"
                aria-label="Pronounce word"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
            </button>
          </div>
          <p className="text-dark-brown/80 dark:text-cream/80 mt-2 italic">{data.definition}</p>
          <p className="mt-4 text-dark-brown/90 dark:text-cream/90 before:content-['“'] before:mr-1 after:content-['”'] after:ml-1">
            {data.exampleSentence}
          </p>
        </>
      );
    }

    return (
        <div className="h-44 flex items-center justify-center">
          <p>Word of the day is not available.</p>
        </div>
    );
  };

  return (
    <div className="bg-dark-brown/5 dark:bg-slate-900/50 p-6 rounded-2xl mb-8 w-full">
      <h2 className="text-lg font-semibold text-dark-brown/60 dark:text-cream/60 mb-3 tracking-wider uppercase">Word of the Day</h2>
      {renderContent()}
    </div>
  );
};

export default WordOfTheDay;
