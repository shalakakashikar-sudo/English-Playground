import React, { useState, useCallback, useEffect } from 'react';
import GameMenu from './components/GameMenu';
import GameBoard from './components/GameBoard';
import ResultsScreen from './components/ResultsScreen';
import ErrorDisplay from './components/ErrorDisplay';
import { GameState, Question, GameSettings, UserProgress, difficulties, ThemeName, themes } from './types';
import { generateQuestions } from './services/gameDataService';
import { getUserProgress, saveUserProgress, getXPForNextLevel } from './utils/progress';

const THEME_KEY = 'englishPlaygroundTheme';

const getSavedTheme = (): ThemeName => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  // Type guard to ensure the saved value is a valid ThemeName
  if (savedTheme && Object.keys(themes).includes(savedTheme)) {
    return savedTheme as ThemeName;
  }
  return 'Classic'; // Default theme
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(() => getUserProgress());
  const [lastGameResult, setLastGameResult] = useState<{ score: number; xpGained: number; levelledUp: boolean, oldProgress: UserProgress } | null>(null);
  const [theme, setTheme] = useState<ThemeName>(getSavedTheme);

  useEffect(() => {
    const applyTheme = (themeName: ThemeName) => {
      const themeColors = themes[themeName].colors;
      const root = document.documentElement;
      root.style.setProperty('--color-cream', themeColors.cream);
      root.style.setProperty('--color-dark-brown', themeColors.darkBrown);
      root.style.setProperty('--color-mustard', themeColors.mustard);
      root.style.setProperty('--color-teal', themeColors.teal);
      localStorage.setItem(THEME_KEY, themeName);
    };
    applyTheme(theme);
  }, [theme]);


  const startGame = useCallback((settings: GameSettings) => {
    setGameSettings(settings);
    setError(null);

    try {
      // The call is now synchronous and local! No loading state needed.
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
    
    // Note: Adaptive learning data is removed as it's no longer applicable with a static DB.

    setLastGameResult({ score: finalScore, xpGained, levelledUp, oldProgress });
    setGameState(GameState.FINISHED);
  }, [userProgress, gameSettings]);

  const handleReturnToHome = () => {
    setGameState(GameState.MENU);
    setError(null);
  };
  
  const restartGame = () => {
    if (gameSettings) {
      startGame(gameSettings);
    } else {
      handleReturnToHome(); // Fallback if settings are lost
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.MENU:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} currentTheme={theme} onThemeChange={setTheme} />;
      // LOADING state is no longer needed as content loads instantly.
      // Kept for potential future use, but currently skipped.
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
      case GameState.FINISHED:
        if (!lastGameResult || !gameSettings) {
          setError("Results data is missing. Please return to the menu.");
          setGameState(GameState.ERROR);
          return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
        }
        return (
          <ResultsScreen
            score={lastGameResult.score}
            totalQuestions={gameSettings.numQuestions}
            onRestart={restartGame}
            onBackToMenu={handleReturnToHome}
            xpGained={lastGameResult.xpGained}
            levelledUp={lastGameResult.levelledUp}
            oldProgress={lastGameResult.oldProgress}
            newProgress={userProgress}
          />
        );
      case GameState.ERROR:
        return <ErrorDisplay message={error || "An unknown error occurred."} onRetry={handleReturnToHome} />;
      default:
        return <GameMenu onStartGame={startGame} userProgress={userProgress} currentTheme={theme} onThemeChange={setTheme} />;
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