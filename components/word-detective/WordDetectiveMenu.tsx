
import React, { useState, useEffect } from 'react';
import { Difficulty, UserProgress, WordDetectiveSettings, wordDetectiveQuestionCounts } from '../../types';
import { difficulties } from '../../types';
import Mascot from '../Mascot';
import ProgressBar from '../ProgressBar';
import { getXPForNextLevel, getPlayerTitle } from '../../utils/progress';

interface WordDetectiveMenuProps {
  onStartGame: (settings: WordDetectiveSettings) => void;
  userProgress: UserProgress;
  onBackToMenu: () => void;
}

const MIN_LEVEL_FOR_EXAM = 5;
const gameTopics: ('Words' | 'Idioms')[] = ['Words', 'Idioms'];

// Descriptions for difficulty levels
const difficultyDescriptions: Record<Difficulty, string> = {
  Easy: 'Common words and simple phrases.',
  Medium: 'Longer words and more complex vocabulary.',
  Hard: 'Challenging vocabulary and multi-word idioms.',
  Exam: 'Advanced, obscure, or technical terminology.'
};

const CustomSelect = <T extends string | number,>({ label, value, options, onChange, optionTransformer }: { label: string, value: T, options: readonly T[], onChange: (value: T) => void, optionTransformer?: (opt: T) => string }) => (
    <div className="w-full">
        <label className="block text-sm font-semibold mb-2">{label}</label>
        <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-teal transition-all dark:bg-slate-700 dark:border-slate-500 dark:text-cream"
        >
            {options.map((opt) => (
            <option key={opt} value={opt}>
                {optionTransformer ? optionTransformer(opt) : opt}
            </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown dark:text-cream">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
        </div>
    </div>
);

const WordDetectiveMenu: React.FC<WordDetectiveMenuProps> = ({ onStartGame, userProgress, onBackToMenu }) => {
  const [topic, setTopic] = useState<'Words' | 'Idioms'>('Words');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [numQuestions, setNumQuestions] = useState(wordDetectiveQuestionCounts[0]);
  const isExamLocked = userProgress.level < MIN_LEVEL_FOR_EXAM;
  const playerTitle = getPlayerTitle(userProgress.level);

  useEffect(() => {
    if (isExamLocked && difficulty === 'Exam') {
      setDifficulty('Hard');
    }
  }, [isExamLocked, difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ topic, difficulty, numQuestions });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Word Detective</h1>
      <p className="text-dark-brown/80 dark:text-cream/80 mb-6">Guess the hidden word from its definition!</p>
      
      <div className="text-center mb-1">
        <p className="text-lg font-semibold text-dark-brown/80 dark:text-cream/80 tracking-wide">{playerTitle}</p>
      </div>
      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <CustomSelect label="Topic" value={topic} options={gameTopics} onChange={(v) => setTopic(v as 'Words' | 'Idioms')} />

        <div className="w-full">
          <label className="block text-sm font-semibold mb-2">Difficulty</label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-teal transition-all dark:bg-slate-700 dark:border-slate-500 dark:text-cream"
            >
              {difficulties.map((d) => {
                const isExam = d === 'Exam';
                const isDisabled = isExam && isExamLocked;
                return (
                  <option key={d} value={d} disabled={isDisabled} className={isDisabled ? 'text-dark-brown/50 dark:text-cream/50' : ''}>
                    {d}{isDisabled ? ` (Lvl ${MIN_LEVEL_FOR_EXAM}+ Locked)` : ''}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown dark:text-cream">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="mt-1 min-h-[2rem] flex items-center justify-center overflow-hidden">
            <p key={difficulty} className="text-xs text-dark-brown/60 dark:text-cream/60 text-center animate-fade-in">
              {difficultyDescriptions[difficulty]}
            </p>
          </div>
          {isExamLocked && (
            <p className="text-xs text-dark-brown/60 dark:text-cream/60 text-center mt-1">
              Reach Level {MIN_LEVEL_FOR_EXAM} to unlock 'Exam' difficulty!
            </p>
          )}
        </div>

        <CustomSelect label="# of Questions" value={numQuestions} options={wordDetectiveQuestionCounts} onChange={(val) => setNumQuestions(Number(val))} />

        <button 
          type="submit" 
          className="w-full bg-mustard text-dark-brown font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-mustard/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-mustard/50"
        >
          Start Investigating
        </button>
      </form>

       <div className="mt-4">
        <button 
          onClick={onBackToMenu}
          className="w-full bg-dark-brown/10 text-dark-brown dark:bg-cream/10 dark:text-cream dark:hover:bg-cream/20 font-bold py-4 px-6 rounded-2xl text-lg shadow-md hover:bg-dark-brown/20 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-dark-brown/20 dark:focus:ring-cream/20"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};

export default WordDetectiveMenu;