import React from 'react';
import Mascot from './Mascot';

interface LoadingSpinnerProps {
    message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="animate-bounce">
        <Mascot isAnimated={false} />
    </div>
    <div className="relative mt-4">
      <div className="w-12 h-12 border-4 border-teal rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p className="mt-6 text-xl font-semibold">{message}</p>
  </div>
);

export default LoadingSpinner;