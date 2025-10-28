import React, { useState } from 'react';
import { UserProgress, StoryWeaverSettings, storyWeaverGenres, storyWeaverLengths, StoryWeaverGenre, StoryWeaverLength } from '../../types';
import Mascot from '../Mascot';
import ProgressBar from '../ProgressBar';
import { getXPForNextLevel, getPlayerTitle } from '../../utils/progress';
import { playSound } from '../../utils/audio';

interface StoryWeaverMenuProps {
  onStartGame: (settings: StoryWeaverSettings) => void;
  userProgress: UserProgress;
  onBackToMenu: () => void;
}

const CustomSelect = <T extends string | number,>({ label, value, options, onChange }: { label: string, value: T, options: readonly T[], onChange: (value: T) => void }) => (
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
                {`${opt}`}
            </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-dark-brown dark:text-cream">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
        </div>
    </div>
);

const StoryWeaverMenu: React.FC<StoryWeaverMenuProps> = ({ onStartGame, userProgress, onBackToMenu }) => {
  const [genre, setGenre] = useState<StoryWeaverGenre>('Fantasy');
  const [length, setLength] = useState<StoryWeaverLength>(6);
  const playerTitle = getPlayerTitle(userProgress.level);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('start');
    onStartGame({ genre, length });
  };
  
  const handleBack = () => {
    playSound('click');
    onBackToMenu();
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 text-center border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in">
      <div className="flex justify-center mb-6">
        <Mascot />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-2">Story Weaver</h1>
      <p className="text-dark-brown/80 dark:text-cream/80 mb-6">Let's write a story together with AI!</p>
      
      <div className="text-center mb-1">
        <p className="text-lg font-semibold text-dark-brown/80 dark:text-cream/80 tracking-wide">{playerTitle}</p>
      </div>
      <ProgressBar 
        level={userProgress.level}
        currentXp={userProgress.xp}
        xpToNextLevel={getXPForNextLevel(userProgress.level)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        <CustomSelect label="Choose a Genre" value={genre} options={storyWeaverGenres} onChange={(v) => setGenre(v as StoryWeaverGenre)} />
        <CustomSelect label="Story Length (Total Turns)" value={length} options={storyWeaverLengths} onChange={(v) => setLength(Number(v) as StoryWeaverLength)} />
        
        <button 
          type="submit" 
          className="w-full bg-rose-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-rose-500/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-500/50"
        >
          Start Weaving
        </button>
      </form>

       <div className="mt-4">
        <button 
          onClick={handleBack}
          className="w-full bg-dark-brown/10 text-dark-brown dark:bg-cream/10 dark:text-cream dark:hover:bg-cream/20 font-bold py-4 px-6 rounded-2xl text-lg shadow-md hover:bg-dark-brown/20 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-dark-brown/20 dark:focus:ring-cream/20"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};

export default StoryWeaverMenu;
