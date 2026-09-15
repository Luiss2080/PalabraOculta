import React, { useEffect, useState } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { useSoundEffects } from './hooks/useSoundEffects';
import HangmanFigure from './components/HangmanFigure';
import Keyboard from './components/Keyboard';
import Header from './components/Header';
import SettingsModal from './components/modals/SettingsModal';
import StatsModal from './components/modals/StatsModal';
import ManualModal from './components/modals/ManualModal';
import ShopModal from './components/modals/ShopModal';
import ChallengeModal from './components/modals/ChallengeModal';
import { PALABRAS } from './data/dictionary';
import Confetti from 'react-confetti';
import Tilt from 'react-parallax-tilt';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ahorcado_theme') || 'light');
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('ahorcado_difficulty') || 'normal');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('ahorcado_sound') !== 'false');
  const [useTimer, setUseTimer] = useState(() => localStorage.getItem('ahorcado_timer') === 'true');
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isManualOpen, setManualOpen] = useState(false);
  const [isShopOpen, setShopOpen] = useState(false);
  const [isChallengeOpen, setChallengeOpen] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [challengeWord, setChallengeWord] = useState(null);

  const { playClick, playCorrect, playWrong, playWin, playLose } = useSoundEffects(soundEnabled);

  const {
    word,
    category,
    guessedLetters,
    mistakes,
    status,
    stats,
    timeLeft,
    lastAction,
    startNewGame,
    guess,
    maxMistakes,
    updateUnlocks,
    hardReset
  } = useGameEngine(difficulty, useTimer);

  // Check URL for challenges
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reto = params.get('reto');
    if (reto) {
      try {
        const decoded = atob(reto);
        if (decoded && decoded.length > 0) {
          setChallengeWord(decoded);
        }
      } catch (e) {
        console.error("Reto inválido");
      }
    }
  }, []);

  // Initialize game on first load
  useEffect(() => {
    if (status === 'idle') {
      startNewGame(null, challengeWord);
    }
  }, [status, startNewGame, challengeWord]);

  // Sound effects listener
  useEffect(() => {
    if (lastAction === 'correct') playCorrect();
    else if (lastAction === 'wrong') playWrong();
    else if (lastAction === 'win') playWin();
    else if (lastAction === 'lose') playLose();
  }, [lastAction, playCorrect, playWrong, playWin, playLose]);

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

  // Settings effect
  useEffect(() => {
    localStorage.setItem('ahorcado_difficulty', difficulty);
    localStorage.setItem('ahorcado_sound', soundEnabled);
    localStorage.setItem('ahorcado_timer', useTimer);
  }, [difficulty, soundEnabled, useTimer]);

  const handleGuess = (letter) => {
    playClick();
    guess(letter);
  };
  
  const handlePurchase = (item) => {
    playWin();
    updateUnlocks([...stats.unlocks, item.id], item.price);
  };

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
      
      <Tilt 
        tiltMaxAngleX={3} 
        tiltMaxAngleY={3} 
        glareEnable={true} 
        glareMaxOpacity={0.1} 
        glarePosition="all"
        scale={1.01}
        transitionSpeed={2500}
        className="parallax-container"
      >
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
          <Header 
            onOpenSettings={() => { playClick(); setSettingsOpen(true); }}
            onOpenStats={() => { playClick(); setStatsOpen(true); }}
            onOpenManual={() => { playClick(); setManualOpen(true); }}
            onOpenShop={() => { playClick(); setShopOpen(true); }}
            onOpenChallenge={() => { playClick(); setChallengeOpen(true); }}
          />

          <h1 style={{ marginBottom: '1.5rem' }}>🎯 Ahorcado Premium</h1>
          
          {status !== 'idle' && (
            <>
              <div className="game-info">
                <p>Categoría: <strong>{category}</strong></p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                  <p>Intentos: <strong style={{ color: mistakes >= maxMistakes - 1 ? 'var(--danger-color)' : 'inherit' }}>{maxMistakes - mistakes}</strong></p>
                  {useTimer && (
                    <p>Tiempo: <strong style={{ color: timeLeft <= 10 ? 'var(--danger-color)' : 'inherit' }}>{timeLeft}s</strong></p>
                  )}
                </div>
              </div>

              <HangmanFigure mistakes={mistakes} />

              <div className={`word-container ${status === 'lost' ? 'animate-shake' : ''}`}>
                {renderWord()}
              </div>

              <Keyboard 
                guessedLetters={guessedLetters} 
                word={word} 
                onGuess={handleGuess} 
                status={status} 
              />

              {(status === 'won' || status === 'lost') && (
                <div className={`result-modal animate-pop-in ${status}`}>
                  <h2>{status === 'won' ? '🎉 ¡Ganaste!' : '💀 Perdiste'}</h2>
                  {status === 'lost' && <p>La palabra era: <strong>{word}</strong></p>}
                  
                  <div className="category-selector">
                    <p>{challengeWord ? 'Vuelve a jugar o elige una categoría:' : 'Elige la siguiente categoría:'}</p>
                    <div className="cat-buttons">
                      <button onClick={() => { playClick(); window.history.replaceState({}, '', '/'); setChallengeWord(null); startNewGame(); }}>Aleatoria</button>
                      {Object.keys(PALABRAS).map(cat => (
                        <button key={cat} onClick={() => { playClick(); window.history.replaceState({}, '', '/'); setChallengeWord(null); startNewGame(cat); }}>{cat}</button>
                      ))}
                      {stats.unlocks.includes('cat_movies') && <button onClick={() => { playClick(); window.history.replaceState({}, '', '/'); setChallengeWord(null); startNewGame('Películas'); }}>Películas 🎬</button>}
                      {stats.unlocks.includes('cat_games') && <button onClick={() => { playClick(); window.history.replaceState({}, '', '/'); setChallengeWord(null); startNewGame('Videojuegos'); }}>Videojuegos 🎮</button>}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Tilt>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => { playClick(); setSettingsOpen(false); }} 
        theme={theme}
        setTheme={setTheme}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        useTimer={useTimer}
        setUseTimer={setUseTimer}
        onHardReset={hardReset}
      />
      <StatsModal 
        isOpen={isStatsOpen} 
        onClose={() => { playClick(); setStatsOpen(false); }} 
        stats={stats}
      />
      <ManualModal 
        isOpen={isManualOpen} 
        onClose={() => { playClick(); setManualOpen(false); }} 
      />
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => { playClick(); setShopOpen(false); }}
        coins={stats.coins || 0}
        unlocks={stats.unlocks || []}
        onPurchase={handlePurchase}
      />
      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => { playClick(); setChallengeOpen(false); }}
      />
    </>
  );
}

export default App;
