import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, UserProgress, DailyContentData, Difficulty, MascotState } from '../types';
import { difficulties, topics, questionCounts, timeLimits } from '../types';
import Mascot from './Mascot';
import WordOfTheDay from './WordOfTheDay';
import ProgressBar from './ProgressBar';
import { getXPForNextLevel, getPlayerTitle } from '../utils/progress';
import QuoteOfTheDay from './QuoteOfTheDay';
import Flashcards from './Flashcards';
import { getDailyContent } from '../services/gameDataService';
import { getFlashcardProgress } from '../utils/flashcardProgress';
import MascotCommentary from './MascotCommentary';
import { getRandomComment } from '../database/mascotComments';
import { playSound } from '../utils/audio';

interface GameMenuProps {
  onStartGame: (settings: GameSettings) => void;
  userProgress: UserProgress;
  onNavigateToMoreGames: () => void;
}

const MIN_LEVEL_FOR_EXAM = 5;
const SETTINGS_KEY = 'englishPlaygroundLastSettings';

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, userProgress, onNavigateToMoreGames }) => {
  const [initialSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        // Validate that the saved settings are still valid options
        if (
          topics.includes(settings.topic) &&
          difficulties.includes(settings.difficulty) &&
          questionCounts.includes(settings.numQuestions) &&
          timeLimits.includes(settings.timePerQuestion)
        ) {
          return settings;
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    return {
      topic: topics[0],
      difficulty: difficulties[0] as Difficulty,
      numQuestions: questionCounts[0],
      timePerQuestion: timeLimits[1] // Default to 10s
    };
  });

  const [topic, setTopic] = useState(initialSettings.topic);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialSettings.difficulty);
  const [numQuestions, setNumQuestions] = useState(initialSettings.numQuestions);
  const [timePerQuestion, setTimePerQuestion] = useState(initialSettings.timePerQuestion);

  const [dailyContent, setDailyContent] = useState<DailyContentData | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  
  const isExamLocked = userProgress.level < MIN_LEVEL_FOR_EXAM;
  const playerTitle = getPlayerTitle(userProgress.level);

  // Mascot interaction states
  const [mascotAnimation, setMascotAnimation] = useState<MascotState>('default');
  const [mascotMessage, setMascotMessage] = useState<string>('');
  const [isCommentaryVisible, setIsCommentaryVisible] = useState(false);
  const commentaryTimeoutRef = useRef<number | null>(null);

  // Reset difficulty if 'Exam' is selected but becomes locked (unlikely edge case, but safe)
  useEffect(() => {
    if (isExamLocked && difficulty === 'Exam') {
      setDifficulty('Hard');
    }
  }, [isExamLocked, difficulty]);

  // Content is now fetched synchronously from the local DB.
  useEffect(() => {
    // --- Daily Content Logic ---
    const today = new Date().toISOString().split('T')[0];
    const cachedDate = localStorage.getItem('dailyContentDate');
    const cachedContent = localStorage.getItem('dailyContent');

    if (cachedDate === today && cachedContent) {
      setDailyContent(JSON.parse(cachedContent));
    } else {
      // Generate new content for the day and cache it.
      const contentData = getDailyContent();
      localStorage.setItem('dailyContent', JSON.stringify(contentData));
      localStorage.setItem('dailyContentDate', today);
      setDailyContent(contentData);
    }
    
    // --- Flashcard Review Count Logic ---
    const progress = getFlashcardProgress();
    const count = Object.values(progress).filter(status => status === 'needs_review').length;
    setReviewCount(count);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('start');
    const currentSettings = { topic, difficulty, numQuestions, timePerQuestion: Number(timePerQuestion) };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
    onStartGame(currentSettings);
  };
  
  const handleMascotClick = () => {
    playSound('click');
    setMascotAnimation('wowed');
    setTimeout(() => setMascotAnimation('default'), 700); // Duration of 'wowed' animation

    // Show random message
    setMascotMessage(getRandomComment('MASCOT_CLICK'));
    setIsCommentaryVisible(true);
    
    // Clear any existing timeout to avoid premature hiding
    if (commentaryTimeoutRef.current) {
        clearTimeout(commentaryTimeoutRef.current);
    }
    
    // Set a new timeout to hide the message
    commentaryTimeoutRef.current = window.setTimeout(() => {
        setIsCommentaryVisible(false);
    }, 2500);
  };
  
  const handleNavigateToMoreGames = () => {
    playSound('click');
    onNavigateToMoreGames();
  };

  const CustomSelect = <T extends string | number,>({ label, value, options, onChange, optionTransformer }: { label: string, value: T, options: readonly T[], onChange: (value: T) => void, optionTransformer?: (opt: T) => string }) => (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            playSound('click');
            onChange(e.target.value as T);
          }}
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

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in">
       <div className="flex justify-center mb-6 h-36 items-end">
        <div className="relative">
          <div
            className="cursor-pointer"
            onClick={handleMascotClick}
            role="button"
            aria-label="Interact with mascot"
          >
            <Mascot state={mascotAnimation} />
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 pb-2">
            <MascotCommentary message={mascotMessage} isVisible={isCommentaryVisible} />
          </div>
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">English Playground</h1>
      <p className="text-dark-brown/80 dark:text-cream/80 mb-6">Ready to test your skills?</p>

      <div className="text-center mb-1">
        <p className="text-lg font-semibold text-dark-brown/80 dark:text-cream/80 tracking-wide">{playerTitle}</p>
      </div>
      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      {/* No more loading/error states needed for daily content */}
      <Flashcards 
        initialData={dailyContent?.flashcards ?? null}
        reviewCount={reviewCount}
      />

      <WordOfTheDay 
        data={dailyContent?.wordOfTheDay ?? null}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <CustomSelect label="Topic" value={topic} options={topics} onChange={(v) => setTopic(v as string)} />
        
        <div className="w-full">
          <label className="block text-sm font-semibold mb-2">Difficulty</label>
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => {
                playSound('click');
                setDifficulty(e.target.value as Difficulty);
              }}
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
          {isExamLocked && (
            <p className="text-xs text-dark-brown/60 dark:text-cream/60 text-center mt-1">
              Reach Level {MIN_LEVEL_FOR_EXAM} to unlock 'Exam' difficulty!
            </p>
          )}
        </div>

        <CustomSelect label="# of Questions" value={numQuestions} options={questionCounts} onChange={(val) => setNumQuestions(Number(val))} />
        <CustomSelect 
          label="Time per Question" 
          value={timePerQuestion} 
          options={timeLimits} 
          onChange={(val) => setTimePerQuestion(Number(val))}
          optionTransformer={(opt) => `${opt} seconds`}
        />

        <button 
          type="submit" 
          className="w-full bg-teal text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50"
        >
          Start Game
        </button>
      </form>
      <div className="mt-4">
        <button 
          onClick={handleNavigateToMoreGames}
          className="w-full bg-dark-brown/10 text-dark-brown dark:bg-cream/10 dark:text-cream dark:hover:bg-cream/20 font-bold py-4 px-6 rounded-2xl text-lg shadow-md hover:bg-dark-brown/20 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-dark-brown/20 dark:focus:ring-cream/20"
        >
          More Games
        </button>
      </div>
      <QuoteOfTheDay 
        data={dailyContent?.quoteOfTheDay ?? null}
      />
    </div>
  );
};

export default GameMenu;
