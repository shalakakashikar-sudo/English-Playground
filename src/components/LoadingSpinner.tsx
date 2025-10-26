import React, { useState, useEffect } from 'react';
import Mascot from './Mascot';

interface LoadingSpinnerProps {
    messages: string | string[];
    spinnerColor?: 'teal' | 'mustard';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ messages, spinnerColor = 'teal' }) => {
    const messageArray = Array.isArray(messages) ? messages : [messages];
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (messageArray.length > 1) {
            const intervalId = setInterval(() => {
                setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messageArray.length);
            }, 3000); // Change message every 3 seconds

            return () => clearInterval(intervalId);
        }
    }, [messageArray]);

    const colorClasses = {
        teal: 'border-teal',
        mustard: 'border-mustard',
    };

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-bounce">
            <Mascot state="thinking" />
        </div>
        <div className="relative mt-4">
          <div className={`w-12 h-12 border-4 ${colorClasses[spinnerColor]} rounded-full animate-spin border-t-transparent`}></div>
        </div>
        <div className="mt-6 text-xl font-semibold min-h-[56px] flex items-center justify-center">
            <p key={currentMessageIndex} className="animate-fade-in">
                {messageArray[currentMessageIndex]}
            </p>
        </div>
      </div>
    );
};

export default LoadingSpinner;