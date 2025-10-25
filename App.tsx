import React, { useState, useCallback, useEffect } from 'react';
import GameMenu from './components/GameMenu';
import GameBoard from './components/GameBoard';
import ResultsScreen from './components/ResultsScreen';
import ErrorDisplay from './components/ErrorDisplay';
import MoreGames from './components/MoreGames';
import CrosswordMenu from './components/crossword/CrosswordMenu';
import CrosswordBoard from './components/crossword/CrosswordBoard';
import WordDetectiveMenu from './components/word-detective/WordDetectiveMenu';
import WordDetectiveBoard from './components/word-detective/WordDetectiveBoard';
import { GameState, Question, GameSettings, UserProgress, difficulties, CrosswordPuzzle, CrosswordSettings, WordDetectivePuzzle, WordDetectiveSettings } from './types';
import { generateQuestions, getCrosswordPuzzle, getWordDetectivePuzzles } from './services/gameDataService';
import { getUserProgress, saveUserProgress, getXPForNextLevel } from './utils/progress';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [crosswordPuzzle, setCrosswordPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [crosswordSettings, setCrosswordSettings] = useState<CrosswordSettings | null>(null);
  const [wordDetectivePuzzles, setWordDetectivePuzzles] = useState<WordDetectivePuzzle[]>([]);
  const [wordDetectiveSettings, setWordDetectiveSettings] = useState<WordDetectiveSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => getUserProgress());
  const [lastGameResult, setLastGameResult] = useState<{ score: number; xpGained: number; levelledUp: boolean, oldProgress: UserProgress } | null>(null);

  const startGame = useCallback((settings: GameSettings) => {
    setGameSettings(settings);
    setWordDetectiveSettings(null);
    setError(null);

    try {
      const fetchedQuestions = generateQuestions(settings);
      if (fetchedQuestions.length === 0) {
        throw new Error("Could not find any questions for the selected topic. The database might be empty for this category.");
      }
      setQuestions(fetchedQuestions);
      setGameState(GameState.PLAYING);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while preparing the game.');
      setGameState(GameState.ERROR);
    }
  }, []);
  
  const startCrossword = useCallback((settings: CrosswordSettings) => {
    setError(null);
    try {
      const puzzle = getCrosswordPuzzle(settings.difficulty);
      setCrosswordPuzzle(puzzle);
      setCrosswordSettings(settings);
      setGameState(GameState.CROSSWORD_PLAYING);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while preparing the crossword.');
      setGameState(GameState.ERROR);
    }
  }, []);

  const startWordDetective = useCallback((settings: WordDetectiveSettings) => {
    setError(null);
    setGameSettings(null);
    try {
      const puzzles = getWordDetectivePuzzles(settings);
      setWordDetectivePuzzles(puzzles);
      setWordDetectiveSettings(settings);
      setGameState(GameState.WORD_DETECTIVE_PLAYING);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while preparing Word Detective.');
      setGameState(GameState.ERROR);
    }
  }, []);

  const handleGameEnd = useCallback((finalScore: number) => {
    const oldProgress = { ...userProgress };
    const xpPerCorrectAnswer = 10 + (difficulties.indexOf(gameSettings!.difficulty) * 5);
    const xpGained = finalScore * xpPerCorrectAnswer;
    
    let newXp = userProgress.xp + xpGained;
    let newLevel = userProgress.level;
    let levelledUp = false;

    let xpForNext = getXPForNextLevel(newLevel);
    while (newXp >= xpForNext) {
      newXp -= xpForNext;
      newLevel++;
      levelledUp = true;
      xpForNext = getXPForNextLevel(newLevel);
    }

    const newProgress = { level: newLevel, xp: newXp };
    setUserProgress(newProgress);
    saveUserProgress(newProgress);
    
    setLastGameResult({ score: finalScore, xpGained, levelledUp, oldProgress });
    setGameState(GameState.FINISHED);
  }, [userProgress, gameSettings]);

  const handleWordDetectiveEnd = useCallback((finalScore: number) => {
    const oldProgress = { ...userProgress };
    // Grant slightly more XP for the added difficulty of Word Detective
    const xpPerCorrectAnswer = 15 + (difficulties.indexOf(wordDetectiveSettings!.difficulty) * 5);
    const xpGained = finalScore * xpPerCorrectAnswer;
    
    let newXp = userProgress.xp + xpGained;
    let newLevel = userProgress.level;
    let levelledUp = false;

    let xpForNext = getXPForNextLevel(newLevel);
    while (newXp >= xpForNext) {
      newXp -= xpForNext;
      newLevel++;
      levelledUp = true;
      xpForNext = getXPForNextLevel(newLevel);
    }

    const newProgress = { level: newLevel, xp: newXp };
    setUserProgress(newProgress);
    saveUserProgress(newProgress);
    
    setLastGameResult({ score: finalScore, xpGained, levelledUp, oldProgress });
    setGameState(GameState.FINISHED);
  }, [userProgress, wordDetectiveSettings]);

  const handleReturnToHome = () => {
    setGameState(GameState.MENU);
    setError(null);
    setGameSettings(null);
    setCrosswordPuzzle(null);
    setCrosswordSettings(null);
    setWordDetectivePuzzles([]);
    setWordDetectiveSettings(null);
  };
  
  const handleReturnToMoreGames = () => {
    setGameState(GameState.MORE_GAMES);
  }

  const handleNavigateToMoreGames = () => {
    setGameState(GameState.MORE_GAMES);
  };
  
  const handleNavigateToCrosswordMenu = () => {
    setGameState(GameState.CROSSWORD_MENU);
  };

  const handleNavigateToWordDetectiveMenu = () => {
    setGameState(GameState.WORD_DETECTIVE_MENU);
  };
  
  const returnToCrosswordMenu = () => {
    setGameState(GameState.CROSSWORD_MENU);
    setCrosswordPuzzle(null);
    setCrosswordSettings(null);
  };

  const returnToWordDetectiveMenu = () => {
    setGameState(GameState.WORD_DETECTIVE_MENU);
    setWordDetectivePuzzles([]);
    setWordDetectiveSettings(null);
  };

  const restartGame = () => {
    if (gameSettings) {
      startGame(gameSettings);
    } else if (wordDetectiveSettings) {
      startWordDetective(wordDetectiveSettings);
    }
    else {
      handleReturnToHome(); // Fallback if settings are lost
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.MENU:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} onNavigateToMoreGames={handleNavigateToMoreGames} />;
      case GameState.LOADING: 
      case GameState.PLAYING:
        if (!gameSettings || questions.length === 0) {
          setError("Game data is missing. Please return to the menu.");
          setGameState(GameState.ERROR);
          return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
        }
        return (
          <GameBoard
            questions={questions}
            settings={gameSettings}
            onGameEnd={handleGameEnd}
            onReturnToHome={handleReturnToHome}
          />
        );
      case GameState.FINISHED: {
        const totalQuestions = gameSettings?.numQuestions || wordDetectiveSettings?.numQuestions;
        if (!lastGameResult || !totalQuestions) {
          setError("Results data is missing. Please return to the menu.");
          setGameState(GameState.ERROR);
          return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
        }
        return (
          <ResultsScreen
            score={lastGameResult.score}
            totalQuestions={totalQuestions}
            onRestart={restartGame}
            onBackToMenu={handleReturnToHome}
            xpGained={lastGameResult.xpGained}
            levelledUp={lastGameResult.levelledUp}
            oldProgress={lastGameResult.oldProgress}
            newProgress={userProgress}
          />
        );
      }
      case GameState.MORE_GAMES:
        return <MoreGames userProgress={userProgress} onBackToMenu={handleReturnToHome} onNavigateToCrosswordMenu={handleNavigateToCrosswordMenu} onNavigateToWordDetectiveMenu={handleNavigateToWordDetectiveMenu} />;
      case GameState.CROSSWORD_MENU:
        return <CrosswordMenu onStartCrossword={startCrossword} userProgress={userProgress} onBackToMenu={handleReturnToMoreGames} />;
      case GameState.CROSSWORD_PLAYING:
        if (!crosswordPuzzle || !crosswordSettings) {
          setError("Crossword puzzle is missing. Please return to the menu.");
          setGameState(GameState.ERROR);
          return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
        }
        return <CrosswordBoard puzzle={crosswordPuzzle} settings={crosswordSettings} onReturnToMenu={returnToCrosswordMenu} />;
      case GameState.WORD_DETECTIVE_MENU:
        return <WordDetectiveMenu onStartGame={startWordDetective} userProgress={userProgress} onBackToMenu={handleReturnToMoreGames} />;
      case GameState.WORD_DETECTIVE_PLAYING:
        if (wordDetectivePuzzles.length === 0 || !wordDetectiveSettings) {
          setError("Word Detective puzzle is missing. Please return to the menu.");
          setGameState(GameState.ERROR);
          return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
        }
        return <WordDetectiveBoard puzzles={wordDetectivePuzzles} settings={wordDetectiveSettings} onReturnToMenu={returnToWordDetectiveMenu} onGameEnd={handleWordDetectiveEnd} />;
      case GameState.ERROR:
        return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
      default:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} onNavigateToMoreGames={handleNavigateToMoreGames} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative">
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;