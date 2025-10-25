import React from 'react';

interface MascotProps {
  isAnimated?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ isAnimated = true }) => {
  const wrapperClass = isAnimated ? "animate-gentle-bounce" : "";
  
  return (
    <div className={wrapperClass}>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <circle cx="50" cy="60" r="35" fill="#FFB000"/>
        
        {/* Eyes */}
        <circle cx="38" cy="55" r="5" fill="#1E1A18"/>
        <circle cx="62" cy="55" r="5" fill="#1E1A18"/>
        <circle cx="37" cy="54" r="2" fill="white"/>
        <circle cx="61" cy="54" r="2" fill="white"/>

        {/* Mouth */}
        <path d="M 40 70 Q 50 80 60 70" stroke="#1E1A18" strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* Spark Tail */}
        <g transform="translate(80, 45) rotate(20)">
          <path d="M0 0 L10 10 L0 20 L-10 10 Z" fill="#00C2B2"/>
          <path d="M-5 -5 L5 -15 L-5 -25 L-15 -15 Z" fill="#00C2B2" opacity="0.8"/>
        </g>

        {/* Cheeks */}
        <circle cx="30" cy="65" r="7" fill="#FF6B6B" opacity="0.5"/>
        <circle cx="70" cy="65" r="7" fill="#FF6B6B" opacity="0.5"/>
      </svg>
    </div>
  );
};

export default Mascot;
