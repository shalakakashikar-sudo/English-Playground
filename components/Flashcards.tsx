import React, { useState, useEffect, useRef } from 'react';
import { FlashcardData, FlashcardStatus } from '../types';
import { updateFlashcardStatus } from '../utils/flashcardProgress';

type CardState = FlashcardData & {
    id: number;
    isFlipped: boolean;
    disappearing: boolean;
};

interface FlashcardsProps {
    initialData: FlashcardData[] | null;
    reviewCount: number;
}

const WordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const IdiomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const Flashcards: React.FC<FlashcardsProps> = ({ initialData, reviewCount }) => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [allCardsReviewed, setAllCardsReviewed] = useState(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setAllCardsReviewed(false);
      setCards(initialData.map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        disappearing: false,
      })));
    } else if (initialData) {
      // Data loaded, but it's empty
      setAllCardsReviewed(true);
    }
  }, [initialData]);

  const handleSpeak = (e: React.MouseEvent, textToSpeak: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  const handleCardClick = (id: number) => {
    setCards(currentCards =>
      currentCards.map(c => (c.id === id ? { ...c, isFlipped: !c.isFlipped } : c))
    );
  };
  
  const handleMarkCard = (e: React.MouseEvent, id: number, term: string, status: FlashcardStatus) => {
    e.stopPropagation();
    updateFlashcardStatus(term, status);
    
    // Trigger disappearing animation
    setCards(currentCards => currentCards.map(c => c.id === id ? { ...c, disappearing: true } : c));
    
    // Remove the card after animation
    setTimeout(() => {
        setCards(currentCards => {
            const remainingCards = currentCards.filter(c => c.id !== id);
            if (remainingCards.length === 0) {
                setAllCardsReviewed(true);
            }
            return remainingCards;
        });
    }, 500);
  };

  const renderContent = () => {
    if (!initialData) {
      return <div className="h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-mustard rounded-full animate-spin border-t-transparent"></div>
             </div>;
    }

    if (allCardsReviewed) {
        return (
            <div className="h-48 flex flex-col items-center justify-center text-dark-brown/70 bg-dark-brown/5 rounded-2xl">
                <p className="text-lg font-semibold">Great work!</p>
                <p>All flashcards reviewed for today.</p>
            </div>
        )
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {cards.map(card => (
          <div
            key={card.id}
            className={`flashcard-container cursor-pointer min-h-48 ${card.isFlipped ? 'flipped' : ''} ${card.disappearing ? 'disappearing' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-front p-3 sm:p-4">
                <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs uppercase font-semibold text-dark-brown/40">
                    {card.type === 'word' ? <WordIcon /> : <IdiomIcon />}
                    <span>{card.type}</span>
                </div>
                <button
                    onClick={(e) => handleSpeak(e, card.term)}
                    className="absolute bottom-2 right-2 p-2 rounded-full text-dark-brown/40 hover:bg-dark-brown/10 hover:text-dark-brown focus:outline-none focus:ring-2 focus:ring-dark-brown/50 transition-colors"
                    aria-label="Pronounce term"
                >
                    <SpeakerIcon />
                </button>
                <p className="text-lg sm:text-xl font-bold px-4">{card.term}</p>
              </div>
              <div className="flashcard-back p-3 sm:p-4 flex flex-col justify-between">
                <p className="text-sm sm:text-base flex-grow">{card.definition}</p>
                <div className="w-full flex justify-around items-center pt-2">
                  <button
                    onClick={(e) => handleMarkCard(e, card.id, card.term, 'known')}
                    className="text-xs font-semibold bg-white/10 hover:bg-white/30 rounded-full px-3 py-1.5 transition-colors"
                  >
                    I Know This
                  </button>
                  <button
                    onClick={(e) => handleMarkCard(e, card.id, card.term, 'needs_review')}
                    className="text-xs font-semibold bg-white/10 hover:bg-white/30 rounded-full px-3 py-1.5 transition-colors"
                  >
                    Needs Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-dark-brown/5 p-4 sm:p-6 rounded-2xl mb-8 w-full">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-dark-brown/60 tracking-wider uppercase">Daily Flashcards</h2>
        {reviewCount > 0 && (
            <div className="relative group">
                <div className="absolute -inset-1.5 bg-rose-500 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative h-4 w-4 bg-rose-500 rounded-full"></div>
                <span className="absolute -top-6 -right-12 w-max px-2 py-1 text-xs text-white bg-dark-brown rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {reviewCount} card{reviewCount > 1 ? 's' : ''} for review!
                </span>
            </div>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default Flashcards;
