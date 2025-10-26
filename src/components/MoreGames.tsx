import React from 'react';
import { UserProgress } from '../types';
import Mascot from './Mascot';
import ProgressBar from './ProgressBar';
import { getXPForNextLevel, getPlayerTitle } from '../utils/progress';

interface MoreGamesProps {
  userProgress: UserProgress;
  onBackToMenu: () => void;
  onNavigateToCrosswordMenu: () => void;
  onNavigateToWordDetectiveMenu: () => void;
}

const MoreGames: React.FC<MoreGamesProps> = ({ userProgress, onBackToMenu, onNavigateToCrosswordMenu, onNavigateToWordDetectiveMenu }) => {
  const playerTitle = getPlayerTitle(userProgress.level);

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">More Games</h1>
      <p className="text-dark-brown/80 dark:text-cream/80 mb-6">Expand your playground!</p>

      <div className="text-center mb-1">
        <p className="text-lg font-semibold text-dark-brown/80 dark:text-cream/80 tracking-wide">{playerTitle}</p>
      </div>
      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      <div className="my-8 space-y-4">
        <div 
            className="bg-dark-brown/5 dark:bg-slate-900/50 p-6 rounded-2xl text-left cursor-pointer transition-all transform hover:scale-105 hover:bg-dark-brown/10 dark:hover:bg-slate-900/70"
            onClick={onNavigateToCrosswordMenu}
            role="button"
            tabIndex={0}
            aria-label="Play Word Weaver Crossword"
        >
            <h2 className="text-2xl font-bold text-teal mb-1">Word Weaver</h2>
            <p className="text-dark-brown/80 dark:text-cream/80">Challenge your vocabulary with classic crossword puzzles. A perfect way to learn new words and test your knowledge!</p>
        </div>
        
        <div 
            className="bg-dark-brown/5 dark:bg-slate-900/50 p-6 rounded-2xl text-left cursor-pointer transition-all transform hover:scale-105 hover:bg-dark-brown/10 dark:hover:bg-slate-900/70"
            onClick={onNavigateToWordDetectiveMenu}
            role="button"
            tabIndex={0}
            aria-label="Play Word Detective"
        >
            <h2 className="text-2xl font-bold text-mustard mb-1">Word Detective</h2>
            <p className="text-dark-brown/80 dark:text-cream/80">Guess the hidden word or phrase from its definition, one letter at a time. How many tries will you need?</p>
        </div>

        <div className="bg-dark-brown/5 dark:bg-slate-900/50 p-6 rounded-2xl text-left opacity-60">
            <h2 className="text-2xl font-bold text-dark-brown/50 dark:text-cream/50 mb-1">More Challenges Coming Soon!</h2>
            <p className="text-dark-brown/60 dark:text-cream/60">New games are being crafted. Keep an eye on this space for more fun ways to learn.</p>
        </div>
      </div>


      <button 
        onClick={onBackToMenu}
        className="w-full bg-dark-brown text-white dark:bg-cream dark:text-dark-brown dark:hover:bg-cream/90 font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-dark-brown/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-dark-brown/50 dark:focus:ring-cream/50"
      >
        Back to Main Menu
      </button>
    </div>
  );
};

export default MoreGames;