import React, { useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import HangmanFigure from './components/HangmanFigure';
import Keyboard from './components/Keyboard';
import { PALABRAS } from './data/dictionary';
import './App.css';

function App() {
  const {
    word,
    category,
    guessedLetters,
    mistakes,
    status,
    stats,
    startNewGame,
    guess,
    maxMistakes
  } = useGameEngine();

  // Initialize game on first load
  useEffect(() => {
    if (status === 'idle') {
      startNewGame();
    }
  }, [status, startNewGame]);

  const renderWord = () => {
    return word.split('').map((letter, i) => (
      <span key={i} className={`word-letter ${guessedLetters.has(letter) || status === 'lost' ? 'visible' : ''}`}>
        {guessedLetters.has(letter) || status === 'lost' ? letter : '_'}
      </span>
    ));
  };

  return (
    <div className="glass-panel">
      <h1>🎯 Ahorcado Premium</h1>
      
      <div className="stats-header">
        <span>Victorias: {stats.wins}</span>
        <span>Racha: {stats.streak}🔥</span>
      </div>
      
      {status !== 'idle' && (
        <>
          <div className="game-info">
            <p>Categoría: <strong>{category}</strong></p>
            <p>Intentos restantes: <strong>{maxMistakes - mistakes}</strong></p>
          </div>

          <HangmanFigure mistakes={mistakes} />

          <div className={`word-container ${status === 'lost' ? 'animate-shake' : ''}`}>
            {renderWord()}
          </div>

          <Keyboard 
            guessedLetters={guessedLetters} 
            word={word} 
            onGuess={guess} 
            status={status} 
          />

          {(status === 'won' || status === 'lost') && (
            <div className={`result-modal animate-pop-in ${status}`}>
              <h2>{status === 'won' ? '🎉 ¡Ganaste!' : '💀 Perdiste'}</h2>
              {status === 'lost' && <p>La palabra era: <strong>{word}</strong></p>}
              
              <div className="category-selector">
                <p>Elige la siguiente categoría:</p>
                <div className="cat-buttons">
                  <button onClick={() => startNewGame()}>Aleatoria</button>
                  {Object.keys(PALABRAS).map(cat => (
                    <button key={cat} onClick={() => startNewGame(cat)}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
