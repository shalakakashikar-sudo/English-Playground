import React from 'react';

interface MascotCommentaryProps {
    message: string;
    isVisible: boolean;
}

const MascotCommentary: React.FC<MascotCommentaryProps> = ({ message, isVisible }) => {
    return (
        <div className={`speech-bubble ${isVisible ? 'visible' : ''}`}>
            {message}
        </div>
    );
};

export default MascotCommentary;