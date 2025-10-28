import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import MascotState from the central types file.
import { Question, GameSettings, MascotState } from '../types';
import confetti from 'canvas-confetti';
import Mascot from './Mascot';
import MascotCommentary from './MascotCommentary';
import { getRandomComment } from '../database/mascotComments';
import { playSound } from '../utils/audio';

interface GameBoardProps {
  questions: Question[];
  settings: GameSettings;
  onGameEnd: (finalScore: number) => void;
  onReturnToHome: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ questions, settings, onGameEnd, onReturnToHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false); // True after user submits their answer
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const [mascotState, setMascotState] = useState<MascotState>('thinking');
  const [mascotMessage, setMascotMessage] = useState(getRandomComment('WELCOME'));
  const [isCommentaryVisible, setIsCommentaryVisible] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const showCommentary = (message: string, duration: number = 2000) => {
    setMascotMessage(message);
    setIsCommentaryVisible(true);
    setTimeout(() => setIsCommentaryVisible(false), duration);
  };

  const triggerConfetti = useCallback((originElement: HTMLElement | null) => {
    const defaults = {
        particleCount: 100,
        spread: 70,
        zIndex: 1000
    };

    if (originElement) {
        const rect = originElement.getBoundingClientRect();
        const origin = {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
        };
        confetti({ ...defaults, origin });
    } else {
        // Fallback for time-up or other scenarios
        confetti({ ...defaults, origin: { y: 0.6 } });
    }
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      playSound('swoosh');
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setTimeLeft(settings.timePerQuestion);
      setMascotState('thinking');
      showCommentary(getRandomComment('THINKING'), 1500);
    } else {
      playSound('gameOver');
      onGameEnd(score);
    }
  }, [isLastQuestion, onGameEnd, score, settings.timePerQuestion]);

  const handleSubmit = useCallback(() => {
    if (isAnswered || selectedAnswer === null) return;

    setIsAnswered(true);
    
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      playSound('correct');
      setScore(prevScore => prevScore + 1);
      const correctButton = document.querySelector(`[data-option="${CSS.escape(currentQuestion.correctAnswer)}"]`) as HTMLElement;
      triggerConfetti(correctButton);
      setMascotState('correct');
      showCommentary(getRandomComment('CORRECT_ANSWER'));
    } else {
      playSound('incorrect');
      setMascotState('incorrect');
      showCommentary(getRandomComment('INCORRECT_ANSWER'));
    }
  }, [isAnswered, selectedAnswer, currentQuestion.correctAnswer, triggerConfetti]);

  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    playSound('incorrect');
    setIsAnswered(true);
    setSelectedAnswer(null); // Time's up is treated as a null answer
    setMascotState('incorrect');
    showCommentary(getRandomComment('TIME_UP'));
  }, [isAnswered]);
  
  useEffect(() => {
    if (isAnswered || settings.timePerQuestion <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [currentQuestionIndex, isAnswered, settings.timePerQuestion]);

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered && settings.timePerQuestion > 0) {
      handleTimeUp();
    }
    if (timeLeft === 5 && !isAnswered && settings.timePerQuestion > 0) {
        showCommentary(getRandomComment('TIME_RUNNING_OUT'), 3000);
    }
  }, [timeLeft, isAnswered, settings.timePerQuestion, handleTimeUp]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    playSound('click');
    setSelectedAnswer(option);
  };

  const getButtonClass = (option: string) => {
    if (isAnswered) {
      if (option === currentQuestion.correctAnswer) {
        return 'bg-green-500 text-white animate-tada';
      }
      if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
        return 'bg-red-500 text-white animate-shake';
      }
      return 'bg-white/20 dark:bg-cream/10 opacity-60';
    }
    
    if (option === selectedAnswer) {
      return 'bg-teal/50 ring-2 ring-teal';
    }

    return 'bg-white/20 hover:bg-white/40 dark:bg-cream/10 dark:hover:bg-cream/20';
  };

  const timerWidth = settings.timePerQuestion > 0 ? (timeLeft / settings.timePerQuestion) * 100 : 100;

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 relative">
      <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-40 h-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full z-10">
          <MascotCommentary message={mascotMessage} isVisible={isCommentaryVisible} />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <Mascot state={mascotState} />
        </div>
      </div>

      <div className="pt-20">
        <div className="flex justify-between items-center mb-4">
            <button 
            onClick={() => {
              playSound('click');
              onReturnToHome();
            }}
            className="text-dark-brown/50 hover:text-dark-brown dark:text-cream/50 dark:hover:text-cream transition-all p-2 -ml-2 rounded-full hover:bg-dark-brown/10 dark:hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-dark-brown/50 dark:focus:ring-cream/50 transform hover:scale-110"
            aria-label="Return to Home"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            </button>
            <div className="text-lg font-semibold">Question {currentQuestionIndex + 1} / {questions.length}</div>
            <div className="text-lg font-bold bg-mustard text-dark-brown px-4 py-1 rounded-full">Score: {score}</div>
        </div>
        
        {settings.timePerQuestion > 0 && (
            <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                    <span>Time Remaining</span>
                    <span>{timeLeft}s</span>
                </div>
                <div className="w-full bg-dark-brown/10 dark:bg-cream/10 rounded-full h-2.5">
                    <div 
                        className="bg-mustard h-2.5 rounded-full transition-all duration-1000 linear" 
                        style={{ width: `${timerWidth}%` }}>
                    </div>
                </div>
            </div>
        )}
        
        <div key={currentQuestionIndex} className="animate-fade-in-down">
            <div className="bg-dark-brown/5 dark:bg-slate-900/50 p-6 rounded-2xl mb-8 min-h-[100px] flex items-center justify-center">
                <h2 className="text-2xl font-semibold text-center">{currentQuestion.question}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    data-option={option}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl text-lg font-semibold text-left transition-all duration-300 ${isAnswered ? 'cursor-default' : 'transform hover:scale-105'} ${getButtonClass(option)}`}
                >
                    {option}
                </button>
                ))}
            </div>
            
            <div className="mt-8 min-h-[150px]">
                {isAnswered && (
                <div className="p-4 bg-teal/10 dark:bg-teal/20 rounded-2xl animate-fade-in mb-6">
                    <h3 className="font-bold text-teal text-lg">
                        {selectedAnswer === null ? "Time's Up!" : "Explanation:"}
                    </h3>
                    <p className="whitespace-pre-wrap">{currentQuestion.explanation}</p>
                </div>
                )}
                <div className="flex justify-end pt-2">
                {!isAnswered ? (
                    <button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="bg-mustard text-dark-brown font-bold py-3 px-8 rounded-2xl text-lg shadow-lg hover:bg-mustard/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-mustard/50 disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    Submit
                    </button>
                ) : (
                    <button
                    onClick={handleNextQuestion}
                    className="bg-teal text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50 animate-fade-in"
                    >
                    {isLastQuestion ? 'Finish' : 'Next Question'}
                    </button>
                )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
