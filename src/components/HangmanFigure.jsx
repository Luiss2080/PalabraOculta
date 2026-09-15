import React from 'react';
import './HangmanFigure.css';

const HangmanFigure = ({ mistakes }) => {
  return (
    <div className="hangman-container">
      <svg viewBox="0 0 200 200" width="200" height="200">
        <line x1="20" y1="180" x2="120" y2="180" stroke="#333" strokeWidth="4"/>
        <line x1="50" y1="180" x2="50" y2="20" stroke="#333" strokeWidth="4"/>
        <line x1="50" y1="20" x2="130" y2="20" stroke="#333" strokeWidth="4"/>
        <line x1="130" y1="20" x2="130" y2="40" stroke="#333" strokeWidth="4"/>
        
        {/* Head */}
        <circle className={`figure-part ${mistakes > 0 ? 'visible' : ''}`} cx="130" cy="55" r="15" stroke="#333" strokeWidth="3" fill="none" />
        {/* Body */}
        <line className={`figure-part ${mistakes > 1 ? 'visible' : ''}`} x1="130" y1="70" x2="130" y2="120" stroke="#333" strokeWidth="3" />
        {/* Left Arm */}
        <line className={`figure-part ${mistakes > 2 ? 'visible' : ''}`} x1="130" y1="85" x2="110" y2="105" stroke="#333" strokeWidth="3" />
        {/* Right Arm */}
        <line className={`figure-part ${mistakes > 3 ? 'visible' : ''}`} x1="130" y1="85" x2="150" y2="105" stroke="#333" strokeWidth="3" />
        {/* Left Leg */}
        <line className={`figure-part ${mistakes > 4 ? 'visible' : ''}`} x1="130" y1="120" x2="110" y2="150" stroke="#333" strokeWidth="3" />
        {/* Right Leg */}
        <line className={`figure-part ${mistakes > 5 ? 'visible' : ''}`} x1="130" y1="120" x2="150" y2="150" stroke="#333" strokeWidth="3" />
      </svg>
    </div>
  );
};

export default HangmanFigure;
