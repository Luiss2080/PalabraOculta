import React from 'react';
import './Keyboard.css';

const KEYS = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');

const Keyboard = ({ guessedLetters, word, onGuess, status }) => {
  return (
    <div className="keyboard">
      {KEYS.map((key) => {
        const isGuessed = guessedLetters.has(key);
        const isCorrect = isGuessed && word.includes(key);
        const isIncorrect = isGuessed && !word.includes(key);

        let className = 'key-btn';
        if (isCorrect) className += ' correct';
        if (isIncorrect) className += ' incorrect';

        return (
          <button
            key={key}
            className={className}
            disabled={isGuessed || status !== 'playing'}
            onClick={() => onGuess(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
