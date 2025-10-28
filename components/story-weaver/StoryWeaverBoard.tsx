import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { StoryWeaverSettings, StoryTurn, MascotState } from '../../types';
import { generateStoryPrompt } from '../../services/gameDataService';
import Mascot from '../Mascot';
import LoadingSpinner from '../LoadingSpinner';
import { playSound } from '../../utils/audio';

interface StoryWeaverBoardProps {
  settings: StoryWeaverSettings;
  onReturnToMenu: () => void;
}

const StoryWeaverBoard: React.FC<StoryWeaverBoardProps> = ({ settings, onReturnToMenu }) => {
    const [story, setStory] = useState<StoryTurn[]>([]);
    const [userText, setUserText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [mascotState, setMascotState] = useState<MascotState>('thinking');
    
    const chatRef = useRef<Chat | null>(null);
    const storyContainerRef = useRef<HTMLDivElement>(null);

    const currentTurn = story.length;
    const isUserTurn = currentTurn % 2 === 1;

    useEffect(() => {
        const initializeStory = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: `You are a creative and collaborative storyteller. Your role is to continue the story started by the user in a compelling and consistent way, matching the established tone and genre of ${settings.genre}. Keep your responses to one or two paragraphs.`,
                    },
                });

                const firstLine = await generateStoryPrompt(settings.genre);
                setStory([{ author: 'ai', text: firstLine }]);
            } catch (err: any) {
                setError(err.message || "Failed to start the story. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        initializeStory();
    }, [settings.genre]);
    
    useEffect(() => {
        // Scroll to the bottom of the story container when new content is added
        if (storyContainerRef.current) {
            storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
        }
    }, [story, isLoading]);

    const handleContinueStory = async () => {
        if (!userText.trim() || isLoading) return;
        
        playSound('swoosh');
        setIsLoading(true);
        setMascotState('thinking');
        const userTurn: StoryTurn = { author: 'user', text: userText };
        
        // Add user turn and a placeholder for AI turn
        setStory(prev => [...prev, userTurn, { author: 'ai', text: '' }]);
        setUserText('');

        try {
            if (!chatRef.current) throw new Error("Chat not initialized.");

            const response = await chatRef.current.sendMessageStream({ message: userText });

            for await (const chunk of response) {
                setStory(prev => {
                    const newStory = [...prev];
                    newStory[newStory.length - 1].text += chunk.text;
                    return newStory;
                });
            }
            
            if (currentTurn + 2 >= settings.length) {
              playSound('levelUp');
              setIsFinished(true);
              setMascotState('happy');
            }

        } catch (err: any) {
            setError(err.message || "The AI failed to continue the story. Please try again.");
            // Remove the placeholder turns
            setStory(prev => prev.slice(0, -2));
        } finally {
            setIsLoading(false);
            setMascotState('default');
        }
    };

    const handleCopyStory = () => {
        playSound('click');
        const storyText = story.map(turn => `${turn.author.toUpperCase()}:\n${turn.text}`).join('\n\n');
        navigator.clipboard.writeText(storyText).then(() => {
            alert('Story copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy story: ', err);
            alert('Failed to copy story.');
        });
    };

    const handleReturnClick = () => {
        playSound('click');
        onReturnToMenu();
    }
    
    if (isLoading && story.length === 0) {
        return (
             <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20">
                <LoadingSpinner messages={`Finding inspiration for a ${settings.genre} story...`} />
            </div>
        )
    }

    if (error) {
         return (
             <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-4">An Error Occurred</h2>
                <p className="mb-6">{error}</p>
                <button onClick={handleReturnClick} className="bg-teal text-white font-bold py-3 px-6 rounded-xl">Back to Menu</button>
             </div>
         )
    }
    
  return (
    <div className="bg-white/10 backdrop-blur-sm shadow-2xl rounded-3xl p-6 md:p-8 border-2 border-dark-brown/20 dark:bg-slate-800/50 dark:border-cream/20 w-full max-w-3xl mx-auto animate-fade-in relative">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Story Weaver</h1>
            <button
                onClick={handleReturnClick}
                className="text-dark-brown/50 hover:text-dark-brown dark:text-cream/50 dark:hover:text-cream transition-all p-2 rounded-full hover:bg-dark-brown/10 dark:hover:bg-cream/10 focus:outline-none focus:ring-2 focus:ring-dark-brown/50 dark:focus:ring-cream/50 transform hover:scale-110"
                aria-label="Return to Menu"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
            </button>
        </div>
        <div className="flex justify-between items-center text-sm font-semibold text-dark-brown/80 dark:text-cream/80 mb-4 px-2">
            <span>Genre: <span className="font-bold text-teal">{settings.genre}</span></span>
            <span>Turn: <span className="font-bold text-mustard">{Math.ceil(currentTurn / 2) + 1} / {settings.length / 2 + 1}</span></span>
        </div>
        
        <div ref={storyContainerRef} className="h-96 overflow-y-auto bg-dark-brown/5 dark:bg-slate-900/50 p-4 rounded-2xl mb-4 flex flex-col">
            {story.map((turn, index) => (
                <div key={index} className={`story-turn ${turn.author}`} style={{ animationDelay: `${index * 100}ms` }}>
                    <p className="author-label">{turn.author}</p>
                    <p>{turn.text}</p>
                    {isLoading && index === story.length - 1 && <span className="animate-pulse">...</span>}
                </div>
            ))}
        </div>

        {!isFinished && (
            <div className="space-y-4">
                <textarea
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder={isUserTurn ? "What happens next?" : "Waiting for the AI..."}
                    disabled={!isUserTurn || isLoading}
                    rows={4}
                    className="w-full bg-cream border-2 border-dark-brown rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-teal transition-all dark:bg-slate-700 dark:border-slate-500 dark:text-cream disabled:opacity-60"
                />
                <button
                    onClick={handleContinueStory}
                    disabled={!isUserTurn || isLoading || !userText.trim()}
                    className="w-full bg-rose-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:bg-rose-500/90 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-rose-500/50 disabled:bg-rose-500/50 disabled:transform-none disabled:cursor-not-allowed"
                >
                    {isLoading ? "Weaving..." : "Continue the Story"}
                </button>
            </div>
        )}
        
        {isFinished && (
            <div className="story-finished-overlay">
                 <div className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <Mascot state={mascotState} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">The End!</h2>
                    <p className="text-lg text-dark-brown/80 dark:text-cream/80 mb-6">A fantastic story has been woven!</p>
                    <div className="space-y-3">
                        <button 
                            onClick={handleCopyStory}
                            className="w-full bg-mustard text-dark-brown font-bold py-3 px-6 rounded-xl text-lg shadow-md hover:bg-mustard/90"
                        >
                            Copy Story
                        </button>
                        <button 
                            onClick={handleReturnClick}
                            className="w-full bg-teal text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md hover:bg-teal/90"
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

export default StoryWeaverBoard;
