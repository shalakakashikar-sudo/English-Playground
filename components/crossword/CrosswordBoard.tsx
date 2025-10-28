import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CrosswordPuzzle, CrosswordClue, CrosswordSettings } from '../../types';
import { getCrosswordPuzzle } from '../../services/gameDataService';
import { addPlayedCrosswordId } from '../../utils/crosswordProgress';
import LoadingSpinner from '../LoadingSpinner';
import { playSound } from '../../utils/audio';


// SVG Icon Components
const NewPuzzleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
    </svg>
);


const RevealIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.125 9l-3 3m0 0l3 3m-3-3h7.5" />
    </svg>
);

const SubmitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BackspaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
    </svg>
);


interface CrosswordBoardProps {
  settings: CrosswordSettings;
  onReturnToMenu: () => void;
}

const CrosswordBoard: React.FC<CrosswordBoardProps> = ({ settings, onReturnToMenu }) => {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [showResultsOverlay, setShowResultsOverlay] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  
  const loadNewPuzzle = useCallback(() => {
    playSound('start');
    setIsLoading(true);
    // This is now a synchronous call, but we keep the loading state for UI consistency.
    setTimeout(() => {
        const newPuzzle = getCrosswordPuzzle(settings.difficulty);
        setPuzzle(newPuzzle);
        setIsLoading(false);
    }, 200); // A small delay to make the transition feel smoother
  }, [settings.difficulty]);

  useEffect(() => {
    loadNewPuzzle();
  }, [loadNewPuzzle]);

  const initializeBoard = useCallback(() => {
    if (!puzzle) return;
    const newGrid = Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill(''));
    setUserGrid(newGrid);
    setIsSubmitted(false);
    setShowResultsOverlay(false);
    setIsReviewMode(false);
    setRevealedCells(new Set());
    setTimeUp(false);
    setActiveCell(null);
    setDirection('across');

    if (settings.timerDuration > 0) {
        setTimeLeft(settings.timerDuration * 60);
    } else {
        setTimeLeft(null);
    }
    
    // Set initial active cell
    for(let r=0; r<puzzle.size; r++) {
      for(let c=0; c<puzzle.size; c++) {
        if(puzzle.gridSolution[r][c] !== null) {
          setActiveCell({ row: r, col: c });
          return;
        }
      }
    }
  }, [puzzle, settings.timerDuration]);

  useEffect(() => {
    if (puzzle && !isLoading) {
      initializeBoard();
    }
  }, [puzzle, isLoading, initializeBoard]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted || timeLeft <= 0) {
        return;
    }
    const timerId = setInterval(() => {
        setTimeLeft(prev => (prev ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);
  
  const handleSubmit = useCallback(() => {
    if (isSubmitted || !puzzle) return;
    playSound('gameOver');
    setIsSubmitted(true);
    setShowResultsOverlay(true);

    // Mark static puzzle as played
    if (puzzle && !puzzle.id.startsWith('db-gen-')) {
        addPlayedCrosswordId(puzzle.id);
    }
  }, [isSubmitted, puzzle]);

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
        setTimeUp(true);
        handleSubmit();
    }
  }, [timeLeft, isSubmitted, handleSubmit]);

  const clueMap = useMemo(() => {
    if (!puzzle) return new Map();
    const map = new Map<string, { across?: number; down?: number }>();
    puzzle.clues.across.forEach(clue => {
      const key = `${clue.row},${clue.col}`;
      map.set(key, { ...map.get(key), across: clue.num });
    });
    puzzle.clues.down.forEach(clue => {
      const key = `${clue.row},${clue.col}`;
      map.set(key, { ...map.get(key), down: clue.num });
    });
    return map;
  }, [puzzle]);
  
  const getWordForClue = (clue: CrosswordClue): string => {
     if (!puzzle) return '';
     const isAcross = puzzle.clues.across.includes(clue);
     let word = '';
     for (let i = 0; i < clue.length; i++) {
        const r = isAcross ? clue.row : clue.row + i;
        const c = isAcross ? clue.col + i : clue.col;
        word += puzzle.gridSolution[r][c] || '';
     }
     return word;
  };

  const { currentClue, highlightedCells } = useMemo(() => {
    if (!activeCell || !puzzle) return { currentClue: null, highlightedCells: new Set() };
    
    const { row, col } = activeCell;
    let clue: CrosswordClue | undefined;
    
    const acrossClue = puzzle.clues.across.find(c => c.row === row && col >= c.col && col < c.col + c.length);
    const downClue = puzzle.clues.down.find(c => c.col === col && row >= c.row && row < c.row + c.length);

    if (direction === 'across' && acrossClue) clue = acrossClue;
    else if (direction === 'down' && downClue) clue = downClue;
    else clue = acrossClue || downClue;

    if (!clue) return { currentClue: null, highlightedCells: new Set() };
    
    const cells = new Set<string>();
    const clueDirection = puzzle.clues.across.includes(clue) ? 'across' : 'down';

    if (clueDirection === 'across') {
      for (let i = 0; i < clue.length; i++) cells.add(`${clue.row},${clue.col + i}`);
    } else {
      for (let i = 0; i < clue.length; i++) cells.add(`${clue.row + i},${clue.col}`);
    }
    
    return { currentClue: clue, highlightedCells: cells };
  }, [activeCell, direction, puzzle]);

  const handleCellClick = (row: number, col: number) => {
    if (!puzzle || puzzle.gridSolution[row][col] === null || (isSubmitted && !isReviewMode)) return;
    playSound('click');
    if (activeCell && activeCell.row === row && activeCell.col === col) {
      setDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setActiveCell({ row, col });
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    if (!currentClue || !puzzle) return;
    const clueDirection = puzzle.clues.across.includes(currentClue) ? 'across' : 'down';
    if (clueDirection === 'across') {
      const nextCol = col + 1;
      if (nextCol < currentClue.col + currentClue.length && puzzle.gridSolution[row][nextCol] !== null) {
        setActiveCell({ row, col: nextCol });
      }
    } else {
      const nextRow = row + 1;
      if (nextRow < currentClue.row + currentClue.length && puzzle.gridSolution[nextRow][col] !== null) {
        setActiveCell({ row: nextRow, col });
      }
    }
  };

  const moveToPrevCell = (row: number, col: number) => {
    if (!currentClue) return;
    const clueDirection = puzzle.clues.across.includes(currentClue) ? 'across' : 'down';
    if (clueDirection === 'across') {
        const prevCol = col - 1;
      if (prevCol >= currentClue.col) {
        setActiveCell({ row, col: prevCol });
      }
    } else {
        const prevRow = row - 1;
      if (prevRow >= currentClue.row) {
        setActiveCell({ row: prevRow, col });
      }
    }
  };

  const handleKeyInput = useCallback((key: string) => {
    if (!activeCell || isSubmitted) return;
    playSound('click');
    const { row, col } = activeCell;
    const newGrid = [...userGrid.map(r => [...r])];
    
    if (key === 'Backspace') {
      if (newGrid[row][col] === '') {
        moveToPrevCell(row, col);
      } else {
        newGrid[row][col] = '';
        setUserGrid(newGrid);
      }
    } else if (key.length === 1 && key.match(/[a-z]/i)) {
      newGrid[row][col] = key.toUpperCase();
      setUserGrid(newGrid);
      moveToNextCell(row, col);
    }
  }, [activeCell, userGrid, isSubmitted, currentClue, puzzle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(!puzzle || e.metaKey || e.ctrlKey || isSubmitted) return;
      
      e.preventDefault();
      if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        handleKeyInput(e.key);
      } else if (e.key === 'Backspace') {
        handleKeyInput(e.key);
      } else if (e.key.startsWith('Arrow')) {
         if(!activeCell) return;
         playSound('click');
         const {row, col} = activeCell;
         let newRow = row, newCol = col;
         
         if (e.key === 'ArrowUp') { newRow = Math.max(0, row - 1); if(direction === 'across') setDirection('down'); }
         if (e.key === 'ArrowDown') { newRow = Math.min(puzzle.size - 1, row + 1); if(direction === 'across') setDirection('down'); }
         if (e.key === 'ArrowLeft') { newCol = Math.max(0, col - 1); if(direction === 'down') setDirection('across'); }
         if (e.key === 'ArrowRight') { newCol = Math.min(puzzle.size - 1, col + 1); if(direction === 'down') setDirection('across'); }
         
         if(puzzle.gridSolution[newRow][newCol] !== null) {
            setActiveCell({row: newRow, col: newCol});
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyInput, activeCell, puzzle, direction, isSubmitted]);
  
    const handleRevealLetter = () => {
        if (!activeCell || isSubmitted || !puzzle) return;
        playSound('correct');
        const { row, col } = activeCell;
        const correctLetter = puzzle.gridSolution[row][col];
        if (correctLetter) {
            const newGrid = [...userGrid.map(r => [...r])];
            newGrid[row][col] = correctLetter;
            setUserGrid(newGrid);
            setRevealedCells(prev => new Set(prev).add(`${row},${col}`));
            moveToNextCell(row, col);
        }
    };
    
    const score = useMemo(() => {
        if (!isSubmitted || !puzzle) return { correct: 0, total: 0 };
        let correct = 0;
        let total = 0;
        for (let r = 0; r < puzzle.size; r++) {
            for (let c = 0; c < puzzle.size; c++) {
                if (puzzle.gridSolution[r][c] !== null) {
                    total++;
                    if (userGrid[r] && userGrid[r][c] === puzzle.gridSolution[r][c]) {
                        correct++;
                    }
                }
            }
        }
        return { correct, total };
    }, [isSubmitted, userGrid, puzzle]);

    const goToClue = (offset: number) => {
        if (!currentClue || !puzzle) return;
        playSound('click');
        const clueList = puzzle.clues[direction];
        const currentIndex = clueList.findIndex(c => c.num === currentClue.num && c.row === currentClue.row && c.col === currentClue.col);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + offset + clueList.length) % clueList.length;
        const nextClue = clueList[nextIndex];
        setActiveCell({ row: nextClue.row, col: nextClue.col });
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    const handleStartReview = () => {
        playSound('click');
        setShowResultsOverlay(false);
        setIsReviewMode(true);
    };

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
  ];

  if (isLoading || !puzzle) {
    return (
      <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-4 md:p-8 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in-down w-full flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner messages="Building a new puzzle..."/>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-4 md:p-8 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 animate-fade-in-down w-full relative">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Word Weaver</h1>
             {settings.timerDuration > 0 && timeLeft !== null && (
                <div className={`text-lg font-bold bg-mustard text-dark-brown px-4 py-1 rounded-full tabular-nums ${timeLeft <= 10 && timeLeft > 0 ? 'animate-pulse' : ''}`}>
                    {formatTime(timeLeft)}
                </div>
            )}
            <button
                onClick={() => {
                  playSound('click');
                  onReturnToMenu();
                }}
                className="text-dark-brown/50 hover:text-dark-brown dark:text-cream/50 dark:hover:text-cream transition-all p-2 rounded-full hover:bg-dark-brown/10 dark:hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-dark-brown/50 dark:focus:ring-cream/50 transform hover:scale-110"
                aria-label="Return to Menu"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
            </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="flex-shrink-0 w-full lg:w-auto">
                <div 
                    ref={gridRef}
                    className="crossword-grid mx-auto"
                    style={{ '--grid-size': puzzle.size } as React.CSSProperties}
                    tabIndex={-1}
                >
                    {Array.from({ length: puzzle.size }).map((_, r) =>
                        Array.from({ length: puzzle.size }).map((_, c) => {
                            const isBlack = puzzle.gridSolution[r][c] === null;
                            const isActive = activeCell?.row === r && activeCell?.col === c && !isSubmitted;
                            const isHighlighted = highlightedCells.has(`${r},${c}`) && !isSubmitted;
                            const clue = clueMap.get(`${r},${c}`);
                            const clueNumber = clue?.across || clue?.down;
                            
                            let cellClass = '';
                            let cellContent = userGrid[r]?.[c] || '';

                            if (isReviewMode) {
                                const userLetter = userGrid[r]?.[c];
                                const correctLetter = puzzle.gridSolution[r][c];
                                if (!isBlack) {
                                    if (userLetter === correctLetter) {
                                        cellClass = 'correct';
                                        cellContent = userLetter;
                                    } else {
                                        cellClass = 'corrected';
                                        cellContent = correctLetter || '';
                                    }
                                }
                            } else if (isSubmitted) {
                                if (!isBlack) {
                                    if (userGrid[r]?.[c] === puzzle.gridSolution[r][c]) {
                                        cellClass = 'correct';
                                    } else {
                                        cellClass = 'incorrect';
                                    }
                                }
                            } else {
                                if (revealedCells.has(`${r},${c}`)) {
                                    cellClass = 'revealed';
                                }
                            }
                            
                            return (
                                <div
                                    key={`${r}-${c}`}
                                    className={`crossword-cell ${isBlack ? 'black' : ''} ${isActive ? 'active' : ''} ${isHighlighted ? 'highlight' : ''} ${cellClass}`}
                                    onClick={() => handleCellClick(r, c)}
                                >
                                    {clueNumber && <span className="clue-number">{clueNumber}</span>}
                                    {cellContent}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="flex-grow flex flex-col">
                <div className="bg-dark-brown/5 dark:bg-slate-900/50 p-4 rounded-2xl h-auto min-h-[6rem] mb-4 flex items-center justify-between text-center">
                    <button onClick={() => goToClue(-1)} disabled={isReviewMode} className="p-2 rounded-full hover:bg-dark-brown/10 dark:hover:bg-cream/10 transition-colors disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <div className="flex-grow px-2">
                        {currentClue ? (
                            <>
                                <p className="font-semibold">
                                    <span className="font-bold text-teal">{currentClue.num}{puzzle.clues.across.includes(currentClue) ? 'A' : 'D'}. </span>
                                    {currentClue.clue}
                                </p>
                                {isReviewMode && (
                                    <p className="font-bold text-mustard mt-1 text-sm">
                                        Answer: {getWordForClue(currentClue)}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-dark-brown/60 dark:text-cream/60">Select a cell to see the clue.</p>
                        )}
                    </div>
                     <button onClick={() => goToClue(1)} disabled={isReviewMode} className="p-2 rounded-full hover:bg-dark-brown/10 dark:hover:bg-cream/10 transition-colors disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                
                 <div className="mt-auto space-y-4">
                    {!isReviewMode && (
                        <>
                        <div className="keyboard">
                            {keyboardLayout.map((row, rowIndex) => (
                                <div key={rowIndex} className="keyboard-row">
                                {row.map(key => (
                                    <button 
                                        key={key} 
                                        className={`key ${key.length > 1 ? 'wide' : ''}`}
                                        onClick={() => handleKeyInput(key)}
                                        disabled={isSubmitted}
                                    >
                                    {key === 'Backspace' ? <BackspaceIcon /> : key}
                                    </button>
                                ))}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-2">
                            <button onClick={handleRevealLetter} disabled={isSubmitted} className="flex-1 flex items-center justify-center gap-2 bg-dark-brown/5 dark:bg-cream/5 text-dark-brown/80 dark:text-cream/80 font-semibold py-3 px-4 rounded-xl hover:bg-dark-brown/10 dark:hover:bg-cream/10 disabled:opacity-50 transition-colors"><RevealIcon /> Reveal</button>
                            <button onClick={() => { playSound('click'); initializeBoard(); }} disabled={isSubmitted} className="flex-1 flex items-center justify-center gap-2 bg-dark-brown/5 dark:bg-cream/5 text-dark-brown/80 dark:text-cream/80 font-semibold py-3 px-4 rounded-xl hover:bg-dark-brown/10 dark:hover:bg-cream/10 disabled:opacity-50 transition-colors"><ClearIcon /> Clear</button>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitted}
                            className="w-full bg-teal text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:bg-teal/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-teal/50 disabled:bg-teal/50 disabled:transform-none"
                        >
                            <span className="flex items-center justify-center gap-2"><SubmitIcon /> Submit Puzzle</span>
                        </button>
                         <button
                            onClick={loadNewPuzzle}
                            disabled={isSubmitted}
                            className="w-full bg-mustard text-dark-brown font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:bg-mustard/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-mustard/50 disabled:bg-mustard/50 disabled:transform-none"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <NewPuzzleIcon />
                                New Puzzle
                            </span>
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>

       {showResultsOverlay && (
         <div className="absolute inset-0 bg-cream/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center border-2 border-dark-brown/20 dark:border-cream/20 w-11/12 max-w-sm">
              <h2 className="text-3xl font-bold mb-2">{timeUp ? "Time's Up!" : 'Puzzle Submitted!'}</h2>
              <p className="text-xl mb-4">You got <span className="font-bold text-teal">{score.correct}</span> out of <span className="font-bold">{score.total}</span> cells correct.</p>
              <div className="space-y-3">
                 <button 
                  onClick={handleStartReview}
                  className="w-full bg-mustard text-dark-brown font-bold py-3 px-6 rounded-xl text-lg shadow-md hover:bg-mustard/90 transform hover:-translate-y-0.5 transition-all"
                >
                  Review Answers
                </button>
                <button 
                  onClick={loadNewPuzzle}
                  className="w-full bg-dark-brown/10 dark:bg-cream/10 text-dark-brown dark:text-cream font-bold py-3 px-6 rounded-xl text-lg shadow-sm hover:bg-dark-brown/20 dark:hover:bg-cream/20 transform hover:-translate-y-0.5 transition-all"
                >
                  Play New Puzzle
                </button>
                <button 
                  onClick={() => { playSound('click'); onReturnToMenu(); }}
                  className="w-full bg-dark-brown/10 dark:bg-cream/10 text-dark-brown dark:text-cream font-bold py-3 px-6 rounded-xl text-lg shadow-sm hover:bg-dark-brown/20 dark:hover:bg-cream/20 transform hover:-translate-y-0.5 transition-all"
                >
                  Back to Menu
                </button>
              </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default CrosswordBoard;
