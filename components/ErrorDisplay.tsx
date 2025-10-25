
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-100 border-2 border-red-500 text-red-700 shadow-2xl rounded-3xl p-8 md:p-12 text-center">
    <div className="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
    <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
    <p className="mb-6">{message}</p>
    <button 
      onClick={onRetry}
      className="bg-red-500 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg hover:bg-red-600 transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300"
    >
      Try Again
    </button>
  </div>
);

export default ErrorDisplay;
