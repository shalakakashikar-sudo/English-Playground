import React from 'react';
// FIX: Import MascotState from the central types file.
import { MascotState } from '../types';

interface MascotProps {
  state?: MascotState;
}

interface EyeProps {
  cx: number;
  cy: number;
  mood: MascotState;
}

interface MouthProps {
  mood: MascotState;
}

// FIX: Add type assertion to default prop to fix type inference issue with React.FC.
const Mascot: React.FC<MascotProps> = ({ state = 'default' as MascotState }) => {
  const getAnimationClass = () => {
    switch (state) {
      case 'correct':
      case 'happy':
        return 'animate-mascot-correct';
      case 'incorrect':
        return 'animate-mascot-incorrect';
      case 'wowed':
        return 'animate-mascot-wowed';
      case 'sad':
        return 'animate-mascot-sad';
      default:
        return 'animate-gentle-bounce';
    }
  };

  const Eye = ({ cx, cy, mood }: EyeProps) => {
    switch (mood) {
      case 'correct':
      case 'happy':
        return (
          // FIX: Corrected camelCase for strokeLinecap.
          <path d={`M ${cx - 7} ${cy} Q ${cx} ${cy - 6} ${cx + 7} ${cy}`} stroke="#1E1A18" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        );
      case 'wowed':
        return (
          <>
            <circle cx={cx} cy={cy} r="8" fill="#1E1A18" />
            <circle cx={cx - 1.5} cy={cy - 1.5} r="3" fill="white" />
          </>
        );
      case 'sad':
        // FIX: Corrected camelCase for strokeLinecap.
        return <path d={`M ${cx - 6} ${cy + 4} a 6 6 0 0 0 12 0`} stroke="#1E1A18" strokeWidth="3.5" strokeLinecap="round" fill="none" />;
      case 'default':
      case 'thinking':
      case 'incorrect':
        return (
          <>
            <circle cx={cx} cy={cy} r="6" fill="#1E1A18" />
            <circle cx={cx - 1} cy={cy - 1} r="2" fill="white" />
          </>
        );
    }
  };
  
  const Mouth = ({ mood }: MouthProps) => {
    switch(mood) {
      case 'correct':
      case 'happy':
        // FIX: Corrected camelCase for strokeLinecap.
        return <path d="M 40 72 Q 50 85 60 72" stroke="#1E1A18" strokeWidth="3" fill="none" strokeLinecap="round"/>;
      case 'incorrect':
        // FIX: Corrected camelCase for strokeLinecap.
        return <path d="M 42 75 C 47 70, 53 80, 58 75" stroke="#1E1A18" strokeWidth="3" fill="none" strokeLinecap="round"/>;
      case 'thinking':
        return <circle cx="50" cy="74" r="3" fill="#1E1A18" />;
      case 'wowed':
        return <ellipse cx="50" cy="75" rx="8" ry="10" fill="#1E1A18" />;
      case 'sad':
        // FIX: Corrected camelCase for strokeLinecap.
        return <path d="M 42 75 Q 50 65 58 75" stroke="#1E1A18" strokeWidth="3" fill="none" strokeLinecap="round"/>;
      case 'default':
        // FIX: Corrected camelCase for strokeLinecap.
        return <path d="M 42 72 Q 50 78 58 72" stroke="#1E1A18" strokeWidth="3" fill="none" strokeLinecap="round"/>;
    }
  };

  return (
    <div className={getAnimationClass()}>
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
          </filter>
        </defs>

        <g filter="url(#shadow)">
            {/* Body - Rounder Shape */}
            <path d="M 15 60 C 15 30, 85 30, 85 60 C 85 90, 15 90, 15 60 Z" fill="#FFB000"/>
            
            {/* Leaf - Adjusted position for new body shape */}
            <g transform="translate(45, 20) rotate(-20)">
                <path d="M0 0 C 10 -10, 20 0, 10 10 S -10 10, 0 0 Z" fill="#00C2B2" />
                {/* FIX: Corrected camelCase for strokeLinecap. */}
                <line x1="5" y1="5" x2="15" y2="-2" stroke="#FFF8EE" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            
            {/* Cheeks - Adjusted position */}
            <circle cx="30" cy="68" r="7" fill="#FF6B6B" opacity="0.6"/>
            <circle cx="70" cy="68" r="7" fill="#FF6B6B" opacity="0.6"/>
        
            {/* Eyes - Adjusted position */}
            <Eye cx={38} cy={58} mood={state} />
            <Eye cx={62} cy={58} mood={state} />

            {/* Mouth */}
            <Mouth mood={state} />
        </g>
      </svg>
    </div>
  );
};

export default Mascot;