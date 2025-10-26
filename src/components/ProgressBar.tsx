import React from 'react';

interface ProgressBarProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ level, currentXp, xpToNextLevel }) => {
  const progressPercentage = (currentXp / xpToNextLevel) * 100;

  return (
    <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg text-teal">Level {level}</span>
            <span className="text-sm font-semibold text-dark-brown/70 dark:text-cream/70">{currentXp} / {xpToNextLevel} XP</span>
        </div>
        <div className="w-full bg-dark-brown/10 dark:bg-cream/10 rounded-full h-4 overflow-hidden">
            <div 
                className="bg-mustard h-4 rounded-l-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%`, ...(progressPercentage >= 99.5 ? {borderRadius: '9999px'} : {}) }}>
            </div>
        </div>
    </div>
  );
};

export default ProgressBar;