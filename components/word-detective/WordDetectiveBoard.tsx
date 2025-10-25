
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WordDetectivePuzzle, WordDetectiveSettings } from '../../types';
import confetti from 'canvas-confetti';

interface WordDetectiveBoardProps {
  puzzles: WordDetectivePuzzle[];
  settings: WordDetectiveSettings;
  onReturnToMenu: () => void;
  onGameEnd: (finalScore: number) => void;
}

const MAX_MISTAKES = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const WordDetectiveBoard: React.FC<WordDetectiveBoardProps> = ({ puzzles, settings, onReturnToMenu, onGameEnd }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [shakeWord, setShakeWord] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const termToGuess = useMemo(() => currentPuzzle.term.toUpperCase(), [currentPuzzle]);
  const isLastPuzzle = currentPuzzleIndex === puzzles.length - 1;

  const uniqueLettersInTerm = useMemo(() => {
    return new Set(termToGuess.split('').filter(char => ALPHABET.includes(char)));
  }, [termToGuess]);

  const correctGuesses = useMemo(() => {
    return new Set([...guessedLetters].filter(letter => uniqueLettersInTerm.has(letter)));
  }, [guessedLetters, uniqueLettersInTerm]);

  const wrongGuesses = useMemo(() => {
    return new Set([...guessedLetters].filter(letter => !uniqueLettersInTerm.has(letter)));
  }, [guessedLetters, uniqueLettersInTerm]);

  const mistakesLeft = MAX_MISTAKES - wrongGuesses.size;

  const isWon = useMemo(() => {
    return uniqueLettersInTerm.size > 0 && correctGuesses.size === uniqueLettersInTerm.size;
  }, [correctGuesses, uniqueLettersInTerm]);

  const isLost = useMemo(() => mistakesLeft <= 0, [mistakesLeft]);

  useEffect(() => {
    if (isWon) {
      setScore(prev => prev + 1);
      setIsRevealed(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
    if (isLost) {
      setIsRevealed(true);
    }
  }, [isWon, isLost]);

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.has(letter) || isRevealed) return;
    
    if (!uniqueLettersInTerm.has(letter)) {
        setShakeWord(true);
        setTimeout(() => setShakeWord(false), 500);
    }

    setGuessedLetters(prev => new Set(prev).add(letter));
  }, [guessedLetters, isRevealed, uniqueLettersInTerm]);
  
  const handleHint = useCallback(() => {
    if (hintsLeft <= 0 || isRevealed || isWon) return;

    const unguessedCorrectLetters = [...uniqueLettersInTerm].filter(
      (letter) => !guessedLetters.has(letter)
    );
    
    if (unguessedCorrectLetters.length > 0) {
      const letterToReveal = unguessedCorrectLetters[0];
      setGuessedLetters(prev => new Set(prev).add(letterToReveal));
      setHintsLeft(prev => prev - 1);
    }
  }, [hintsLeft, isRevealed, isWon, uniqueLettersInTerm, guessedLetters]);

  const handleNext = () => {
    if (isLastPuzzle) {
      onGameEnd(score);
    } else {
      setCurrentPuzzleIndex(prev => prev + 1);
      setGuessedLetters(new Set());
      setIsRevealed(false);
    }
  };
  
  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (isRevealed) return;
    if (e.key.match(/^[a-zA-Z]$/)) {
        handleGuess(e.key.toUpperCase());
    }
  }, [handleGuess, isRevealed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
        window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const renderTerm = () => {
    return termToGuess.split('').map((char, index) => {
      const isSpecialChar = !ALPHABET.includes(char) && char !== ' ';
      const isGuessed = guessedLetters.has(char);
      const shouldReveal = isGuessed || isRevealed || isSpecialChar;

      if (char === ' ') {
        return <div key={index} className="w-4 sm:w-6"></div>;
      }

      return (
        <div 
          key={index} 
          className={`
            letter-container
            ${shakeWord ? 'animate-shake-horizontal' : ''}
          `}
        >
          <div className={`letter-box ${isSpecialChar ? 'special-char' : 'letter-placeholder'}`}>
            <span className={`transition-opacity duration-300 ${shouldReveal ? 'opacity-100' : 'opacity-0'}`}>
              {char}
            </span>
          </div>
        </div>
      );
    });
  };

  const getKeyboardKeyClass = (key: string) => {
    if (!guessedLetters.has(key)) return 'bg-white/20 hover:bg-white/40';
    if (uniqueLettersInTerm.has(key)) return 'bg-green-500 text-white';
    return 'bg-red-500 text-white opacity-70';
  };
  
  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 border-2 border-dark-brown/20 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-4">
         <button 
          onClick={onReturnToMenu}
          className="text-dark-brown/50 hover:text-dark-brown transition-all p-2 -ml-2 rounded-full hover:bg-dark-brown/10 focus:outline-none focus:ring-2 focus:ring-dark-brown/50 transform hover:scale-110"
          aria-label="Return to Menu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <div className="text-lg font-semibold">Puzzle {currentPuzzleIndex + 1} / {puzzles.length}</div>
        <div className="text-lg font-bold bg-mustard text-dark-brown px-4 py-1 rounded-full">Score: {score}</div>
      </div>
      
      <div className="text-center my-6">
        <p className="text-sm uppercase tracking-wider text-dark-brown/60 font-semibold mb-2">Definition</p>
        <p className="text-lg md:text-xl italic bg-dark-brown/5 p-4 rounded-xl min-h-[5rem] flex items-center justify-center">
            "{currentPuzzle.definition}"
        </p>
      </div>

      <div className="word-display mb-6 min-h-[3rem] sm:min-h-[3.5rem]">
        {renderTerm()}
      </div>
      
       <div className="flex justify-between items-center text-center mb-6 px-4">
        <p className="font-semibold">Mistakes left: <span className="text-red-500 font-bold text-lg">{mistakesLeft}</span></p>
        <button
            onClick={handleHint}
            disabled={hintsLeft <= 0 || isRevealed || isWon}
            className="flex items-center gap-2 bg-mustard text-dark-brown font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-mustard/90 transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-mustard/50 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Hint ({hintsLeft})</span>
        </button>
      </div>

      <div className="my-4 min-h-[170px] flex items-center justify-center">
        {isRevealed ? (
            <div className="text-center animate-fade-in">
                <p className={`text-2xl font-bold mb-4 ${isWon ? 'text-teal' : 'text-red-500'}`}>
                    {isWon ? "You got it!" : "Not quite!"}
                </p>
                <p className="font-semibold mb-4">Correct Answer: <span className="text-dark-brown">{currentPuzzle.term}</span></p>
                <button
                    onClick={handleNext}
                    className="bg-teal text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all"
                >
                    {isLastPuzzle ? 'Finish Game' : 'Next Puzzle'}
                </button>
            </div>
        ) : (
            <div className="keyboard w-full">
                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map(row => (
                    <div key={row} className="keyboard-row">
                        {row.split('').map(key => (
                            <button
                                key={key}
                                onClick={() => handleGuess(key)}
                                disabled={guessedLetters.has(key)}
                                className={`key transition-all ${getKeyboardKeyClass(key)} disabled:cursor-not-allowed`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default WordDetectiveBoard;
