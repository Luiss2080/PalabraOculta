import React, { useEffect, useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import HangmanFigure from './components/HangmanFigure';
import Keyboard from './components/Keyboard';
import Header from './components/Header';
import SettingsModal from './components/modals/SettingsModal';
import StatsModal from './components/modals/StatsModal';
import ManualModal from './components/modals/ManualModal';
import { PALABRAS } from './data/dictionary';
import Confetti from 'react-confetti';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ahorcado_theme') || 'light');
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('ahorcado_difficulty') || 'normal');
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isManualOpen, setManualOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

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
  } = useGameEngine(difficulty);

  // Resize listener for Confetti
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ahorcado_theme', theme);
  }, [theme]);

  // Difficulty effect
  useEffect(() => {
    localStorage.setItem('ahorcado_difficulty', difficulty);
  }, [difficulty]);

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
    <>
      {status === 'won' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}
      
      <div className="glass-panel">
        <Header 
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenStats={() => setStatsOpen(true)}
          onOpenManual={() => setManualOpen(true)}
        />

        <h1 style={{ marginBottom: '1.5rem' }}>🎯 Ahorcado Premium</h1>
        
        {status !== 'idle' && (
          <>
            <div className="game-info">
              <p>Categoría: <strong>{category}</strong></p>
              <p>Intentos restantes: <strong style={{ color: mistakes >= maxMistakes - 1 ? 'var(--danger-color)' : 'inherit' }}>{maxMistakes - mistakes}</strong></p>
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

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        theme={theme}
        setTheme={setTheme}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setStatsOpen(false)} 
        stats={stats}
      />
      <ManualModal 
        isOpen={isManualOpen} 
        onClose={() => setManualOpen(false)} 
      />
    </>
  );
}

export default App;
