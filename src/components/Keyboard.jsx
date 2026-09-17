import React from 'react';
import './Keyboard.css';

const KEYS = 'QWERTYUIOPASDFGHJKLÑZXCVBNM'.split('');

const Keyboard = ({ guessedLetters, word, onGuess, status }) => {
  return (
    <div className="keyboard" role="group" aria-label="Teclado del juego">
      {KEYS.map((key) => {
        const isGuessed = guessedLetters.has(key);
        const isCorrect = isGuessed && word.includes(key);
        const isIncorrect = isGuessed && !word.includes(key);

        let className = 'key-btn';
        if (isCorrect) className += ' correct';
        if (isIncorrect) className += ' incorrect';

        let stateLabel = '';
        if (isCorrect) stateLabel = ', letra correcta, ya usada';
        else if (isIncorrect) stateLabel = ', letra incorrecta, ya usada';

        return (
          <button
            key={key}
            type="button"
            className={className}
            disabled={isGuessed || status !== 'playing'}
            onClick={() => onGuess(key)}
            aria-label={`Letra ${key}${stateLabel}`}
            aria-pressed={isGuessed}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
