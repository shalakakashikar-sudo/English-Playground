import React, { useState, useEffect } from 'react';
import { Difficulty, UserProgress, CrosswordSettings, crosswordTimeLimits } from '../../types';
import { difficulties } from '../../types';
import Mascot from '../Mascot';
import ProgressBar from '../ProgressBar';
import { getXPForNextLevel, getPlayerTitle } from '../../utils/progress';

interface CrosswordMenuProps {
  onStartCrossword: (settings: CrosswordSettings) => void;
  userProgress: UserProgress;
  onBackToMenu: () => void;
}

const MIN_LEVEL_FOR_EXAM = 5;

const CrosswordMenu: React.FC<CrosswordMenuProps> = ({ onStartCrossword, userProgress, onBackToMenu }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [timerDuration, setTimerDuration] = useState(crosswordTimeLimits[2]); // Default to 2 minutes
  const isExamLocked = userProgress.level < MIN_LEVEL_FOR_EXAM;
  const playerTitle = getPlayerTitle(userProgress.level);

  useEffect(() => {
    if (isExamLocked && difficulty === 'Exam') {
      setDifficulty('Hard');
    }
  }, [isExamLocked, difficulty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartCrossword({ difficulty, timerDuration: Number(timerDuration) });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Word Weaver</h1>
      <p className="text-dark-brown/80 mb-6">Ready to solve a new puzzle?</p>
      
      <div className="text-center mb-1">
        <p className="text-lg font-semibold text-dark-brown/80 tracking-wide">{playerTitle}</p>
      </div>
      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <div className="w-full">
          <label className="block text-sm font-semibold mb-2">Difficulty</label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-teal transition-all"
            >
              {difficulties.map((d) => {
                const isExam = d === 'Exam';
                const isDisabled = isExam && isExamLocked;
                return (
                  <option key={d} value={d} disabled={isDisabled} className={isDisabled ? 'text-dark-brown/50' : ''}>
                    {d}{isDisabled ? ` (Lvl ${MIN_LEVEL_FOR_EXAM}+ Locked)` : ''}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {isExamLocked && (
            <p className="text-xs text-dark-brown/60 text-center mt-1">
              Reach Level {MIN_LEVEL_FOR_EXAM} to unlock 'Exam' difficulty!
            </p>
          )}
        </div>

        <div className="w-full">
            <label className="block text-sm font-semibold mb-2">Timer</label>
            <div className="relative">
                <select
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-teal transition-all"
                >
                    {crosswordTimeLimits.map((t) => (
                        <option key={t} value={t}>
                            {t === 0 ? 'No Timer' : `${t} minute${t > 1 ? 's' : ''}`}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-teal text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50"
        >
          Start Weaving
        </button>
      </form>

       <div className="mt-4">
        <button 
          onClick={onBackToMenu}
          className="w-full bg-dark-brown/10 text-dark-brown font-bold py-4 px-6 rounded-2xl text-lg shadow-md hover:bg-dark-brown/20 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-dark-brown/20"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};

export default CrosswordMenu;