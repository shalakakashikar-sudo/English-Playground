import React, { useState, useEffect } from 'react';
// FIX: Imported Difficulty type to be used for state and casting.
import { GameSettings, UserProgress, DailyContentData, Difficulty, ThemeName, themes } from '../types';
import { difficulties, topics, questionCounts, timeLimits } from '../types';
import Mascot from './Mascot';
import WordOfTheDay from './WordOfTheDay';
import ProgressBar from './ProgressBar';
import { getXPForNextLevel } from '../utils/progress';
import QuoteOfTheDay from './QuoteOfTheDay';
import Flashcards from './Flashcards';
import { getDailyContent } from '../services/gameDataService';

interface GameMenuProps {
  onStartGame: (settings: GameSettings) => void;
  userProgress: UserProgress;
  currentTheme: ThemeName;
  onThemeChange: (themeName: ThemeName) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, userProgress, currentTheme, onThemeChange }) => {
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [numQuestions, setNumQuestions] = useState(questionCounts[0]);
  const [timePerQuestion, setTimePerQuestion] = useState(timeLimits[1]); // Default to 10s

  const [dailyContent, setDailyContent] = useState<DailyContentData | null>(null);

  // Content is now fetched synchronously from the local DB.
  useEffect(() => {
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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ topic, difficulty, numQuestions, timePerQuestion: Number(timePerQuestion) });
  };
  
  const CustomSelect = <T extends string | number,>({ label, value, options, onChange, optionTransformer }: { label: string, value: T, options: readonly T[], onChange: (value: T) => void, optionTransformer?: (opt: T) => string }) => (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-teal transition-all"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {optionTransformer ? optionTransformer(opt) : opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );

  const ThemeSelector = () => (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold mb-3 text-left">Theme</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(themes) as ThemeName[]).map(themeName => {
          const theme = themes[themeName];
          const isActive = currentTheme === themeName;
          return (
            <button
              key={themeName}
              type="button"
              onClick={() => onThemeChange(themeName)}
              className={`w-full p-3 border-2 rounded-2xl transition-all ${
                isActive ? 'border-teal ring-2 ring-teal' : 'border-dark-brown/20 hover:border-dark-brown'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full border border-dark-brown/20" style={{ backgroundColor: theme.colors.cream }}></div>
                  <div className="w-4 h-4 rounded-full border border-dark-brown/20" style={{ backgroundColor: theme.colors.darkBrown }}></div>
                  <div className="w-4 h-4 rounded-full border border-dark-brown/20" style={{ backgroundColor: theme.colors.mustard }}></div>
                  <div className="w-4 h-4 rounded-full border border-dark-brown/20" style={{ backgroundColor: theme.colors.teal }}></div>
                </div>
                <span className="font-semibold">{themeName}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">English Playground</h1>
      <p className="text-dark-brown/80 mb-8">Ready to test your skills?</p>

      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      {/* No more loading/error states needed for daily content */}
      <Flashcards 
        initialData={dailyContent?.flashcards ?? null}
      />

      <WordOfTheDay 
        data={dailyContent?.wordOfTheDay ?? null}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <CustomSelect label="Topic" value={topic} options={topics} onChange={(v) => setTopic(v as string)} />
          {/* FIX: Correctly cast the value from the select to the Difficulty type for the state setter. */}
          <CustomSelect label="Difficulty" value={difficulty} options={difficulties} onChange={(v) => setDifficulty(v as Difficulty)} />
          <CustomSelect label="# of Questions" value={numQuestions} options={questionCounts} onChange={(val) => setNumQuestions(Number(val))} />
          <CustomSelect 
            label="Time per Question" 
            value={timePerQuestion} 
            options={timeLimits} 
            onChange={(val) => setTimePerQuestion(Number(val))}
            optionTransformer={(opt) => `${opt} seconds`}
          />
        </div>

        <ThemeSelector />

        <button 
          type="submit" 
          className="w-full bg-teal text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50"
        >
          Start Game
        </button>
      </form>
      <QuoteOfTheDay 
        data={dailyContent?.quoteOfTheDay ?? null}
      />
    </div>
  );
};

export default GameMenu;