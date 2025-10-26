import React from 'react';
import { QuoteOfTheDayData } from '../types';

interface QuoteOfTheDayProps {
  data: QuoteOfTheDayData | null;
}

const QuoteOfTheDay: React.FC<QuoteOfTheDayProps> = ({ data }) => {

  const renderContent = () => {
    if (data) {
      return (
        <>
          <p className="text-lg italic text-dark-brown/90 dark:text-cream/90 before:content-['“'] before:mr-1 after:content-['”'] after:ml-1">
            {data.quote}
          </p>
          <p className="text-right font-semibold text-dark-brown dark:text-cream mt-2">— {data.author}</p>
        </>
      );
    }

    return (
        <div className="h-24 flex items-center justify-center text-dark-brown/50 dark:text-cream/50">
            <p className="text-sm text-center italic">Quote is not available.</p>
        </div>
    );
  };

  return (
    <div className="bg-dark-brown/5 dark:bg-slate-900/50 p-4 rounded-2xl mt-8 w-full text-center">
      {renderContent()}
    </div>
  );
};

export default QuoteOfTheDay;