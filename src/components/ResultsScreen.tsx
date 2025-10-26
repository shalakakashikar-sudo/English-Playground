
import React, { useEffect, useState } from 'react';
import Mascot from './Mascot';
import confetti from 'canvas-confetti';
// FIX: Import MascotState from the central types file.
import { UserProgress, DailyContentData, MascotState } from '../types';
import { getXPForNextLevel, getPlayerTitle } from '../utils/progress';
import QuoteOfTheDay from './QuoteOfTheDay';
import { getDailyContent } from '../services/gameDataService';
import { getRandomComment } from '../database/mascotComments';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToMenu: () => void;
  xpGained: number;
  levelledUp: boolean;
  oldProgress: UserProgress;
  newProgress: UserProgress;
}

const HIGH_SCORE_THRESHOLD = 80; // A score of 80% or higher is a high score

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, onRestart, onBackToMenu, xpGained, levelledUp, oldProgress, newProgress }) => {
  const [displayProgress, setDisplayProgress] = useState<UserProgress>(oldProgress);
  const [dailyContent, setDailyContent] = useState<DailyContentData | null>(null);
  const percentage = Math.round((score / totalQuestions) * 100);

  const oldTitle = getPlayerTitle(oldProgress.level);
  const newTitle = getPlayerTitle(newProgress.level);
  const hasNewTitle = levelledUp && oldTitle !== newTitle;

  // Confetti effect for high scores or level ups
  useEffect(() => {
    const isHighScore = percentage >= HIGH_SCORE_THRESHOLD;

    if (isHighScore || levelledUp) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [percentage, levelledUp]);
  
  // XP Bar Animation Effect
  useEffect(() => {
    const xpToLevelUp = getXPForNextLevel(oldProgress.level);
    const animationTimeout = setTimeout(() => {
      if (levelledUp) {
        // 1. Fill up old level bar
        setDisplayProgress({ ...oldProgress, xp: xpToLevelUp });
        
        // 2. After a delay, switch to new level and reset bar
        const levelUpTimeout = setTimeout(() => {
          setDisplayProgress({ level: newProgress.level, xp: 0 });

          // 3. After another delay, fill new bar with remaining XP
          const finalFillTimeout = setTimeout(() => {
            setDisplayProgress(newProgress);
          }, 200);

          return () => clearTimeout(finalFillTimeout);
        }, 800); // Duration for first bar fill + pause

        return () => clearTimeout(levelUpTimeout);
      } else {
        // Just animate to the new XP value
        setDisplayProgress(newProgress);
      }
    }, 500); // Initial delay to let user see score

    return () => clearTimeout(animationTimeout);
  }, [oldProgress, newProgress, levelledUp]);

  // Fetch daily content for the quote
  useEffect(() => {
    // This now fetches from cache or generates from the local DB, so it's synchronous
    // and doesn't need loading/error states.
    const today = new Date().toISOString().split('T')[0];
    const cachedDate = localStorage.getItem('dailyContentDate');
    const cachedContent = localStorage.getItem('dailyContent');

    if (cachedDate === today && cachedContent) {
      setDailyContent(JSON.parse(cachedContent));
    } else {
      const contentData = getDailyContent();
      localStorage.setItem('dailyContent', JSON.stringify(contentData));
      localStorage.setItem('dailyContentDate', today);
      setDailyContent(contentData);
    }
  }, []);

  const handlePlayAgainClick = () => {
    onRestart();
  };

  const handleBackToMenuClick = () => {
    onBackToMenu();
  };

  const getMascotStateForScore = (percentage: number): MascotState => {
    if (percentage >= 95) return 'wowed';
    if (percentage >= 70) return 'happy';
    if (percentage > 40) return 'default';
    return 'sad';
  };

  const getFeedback = () => {
    if (percentage >= 95) return getRandomComment('WOWED_SCORE');
    if (percentage >= 70) return getRandomComment('HIGH_SCORE');
    if (percentage > 40) return getRandomComment('MEDIUM_SCORE');
    return getRandomComment('SAD_SCORE');
  };

  const xpForDisplayLevel = getXPForNextLevel(displayProgress.level);
  const progressPercentage = (displayProgress.xp / xpForDisplayLevel) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot state={getMascotStateForScore(percentage)} />
      </div>
      <h1 className="text-4xl font-bold mb-2">Game Over!</h1>
      <p className="text-lg text-dark-brown/80 dark:text-cream/80 mb-6">{getFeedback()}</p>
      
      <div className="bg-dark-brown/5 dark:bg-slate-900/50 rounded-2xl p-6 mb-8 animate-bounce-in" style={{animationDelay: '200ms'}}>
        <p className="text-xl">Your Score</p>
        <p className="text-6xl font-bold text-teal my-2">{score} <span className="text-3xl font-medium text-dark-brown/60 dark:text-cream/60">/ {totalQuestions}</span></p>
        <p className="text-2xl font-semibold text-mustard">{percentage}%</p>
      </div>

      <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Progress</h2>
          
          {levelledUp && (
            <div className="bg-mustard/20 dark:bg-mustard/30 border-2 border-mustard rounded-2xl p-4 my-4 animate-tada">
              <p className="text-3xl font-bold text-dark-brown dark:text-cream">LEVEL UP!</p>
              {hasNewTitle && (
                <p className="text-xl font-semibold text-teal mt-1">
                  New Title Unlocked: <span className="font-bold">{newTitle}!</span>
                </p>
              )}
            </div>
          )}

          <p className="text-lg font-semibold mb-4 text-teal">+{xpGained} XP</p>
          
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-teal">Level {displayProgress.level}</span>
                <span className="text-sm font-semibold text-dark-brown/70 dark:text-cream/70">{displayProgress.xp} / {xpForDisplayLevel} XP</span>
            </div>
            <div className="w-full bg-dark-brown/10 dark:bg-cream/10 rounded-full h-4 overflow-hidden">
                <div 
                    className="bg-mustard h-4 rounded-l-full transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercentage}%`, ...(progressPercentage >= 99.5 ? {borderRadius: '9999px'} : {}) }}>
                </div>
            </div>
        </div>
      </div>

      <QuoteOfTheDay 
        data={dailyContent?.quoteOfTheDay ?? null}
      />

      <div className="mt-8 space-y-4">
        <button 
          onClick={handlePlayAgainClick}
          className="w-full bg-mustard text-dark-brown font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-mustard/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-mustard/50"
        >
          Play Again
        </button>
        <button 
          onClick={handleBackToMenuClick}
          className="w-full bg-teal text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;