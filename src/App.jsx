import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import ToastNotification from './components/ToastNotification';
import ParticlesBackground from './components/ParticlesBackground';
import { PALABRAS } from './data/dictionary';
import Confetti from 'react-confetti';
import Tilt from 'react-parallax-tilt';
import { Lightbulb, User } from 'lucide-react';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ahorcado_theme') || 'light');
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('ahorcado_difficulty') || 'normal');
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('ahorcado_volume') || '0.5'));
  const [useTimer, setUseTimer] = useState(() => localStorage.getItem('ahorcado_timer') === 'true');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('ahorcado_accent') || '#3e8ed0');
  
  const [profile, setProfile] = useState(() => {
    const p = localStorage.getItem('ahorcado_profile');
    return p ? JSON.parse(p) : { avatar: '🤖', name: 'Jugador 1' };
  });
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);
  const [isManualOpen, setManualOpen] = useState(false);
  const [isShopOpen, setShopOpen] = useState(false);
  const [isChallengeOpen, setChallengeOpen] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [challengeWord, setChallengeWord] = useState(null);

  const [toasts, setToasts] = useState([]);

  const { playClick, playCorrect, playWrong, playWin, playLose } = useSoundEffects(volume);

  const {
    word,
    category,
    guessedLetters,
    mistakes,
    status,
    stats,
    timeLeft,
    lastAction,
    newAchieved,
    setNewAchieved,
    startNewGame,
    guess,
    useHint,
    maxMistakes,
    updateUnlocks,
    hardReset
  } = useGameEngine(difficulty, useTimer);

  const addToast = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Handle new achievements
  useEffect(() => {
    if (newAchieved.length > 0) {
      newAchieved.forEach(achName => addToast(achName));
      setNewAchieved([]);
      playWin();
    }
  }, [newAchieved, addToast, playWin, setNewAchieved]);

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

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--primary-color', accentColor);
    localStorage.setItem('ahorcado_theme', theme);
    localStorage.setItem('ahorcado_accent', accentColor);
  }, [theme, accentColor]);

  useEffect(() => {
    localStorage.setItem('ahorcado_difficulty', difficulty);
    localStorage.setItem('ahorcado_volume', volume);
    localStorage.setItem('ahorcado_timer', useTimer);
    localStorage.setItem('ahorcado_profile', JSON.stringify(profile));
  }, [difficulty, volume, useTimer, profile]);

  const handleGuess = (letter) => {
    playClick();
    guess(letter);
  };

  // Human-readable status announced to screen-reader users via an aria-live region.
  // Covers correct/incorrect guesses, remaining lives, and win/loss so non-visual
  // players get the same feedback sighted players get from the hangman figure and word.
  const liveMessage = useMemo(() => {
    if (status === 'won') return `¡Ganaste! La palabra era ${word}.`;
    if (status === 'lost') return `Perdiste. La palabra era ${word}.`;
    const remaining = maxMistakes - mistakes;
    if (lastAction === 'correct') return `Letra correcta. Te quedan ${remaining} intentos.`;
    if (lastAction === 'wrong') return `Letra incorrecta. Te quedan ${remaining} intentos.`;
    return '';
  }, [status, lastAction, word, mistakes, maxMistakes]);
  
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
      <ParticlesBackground theme={theme} accentColor={accentColor} />
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <ToastNotification toasts={toasts} removeToast={removeToast} />
      {status === 'won' && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} colors={[accentColor, '#fcd34d', '#ffffff']} />}
      
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{profile.avatar}</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{profile.name}</h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nivel de Racha: {stats.streak} 🔥</span>
            </div>
          </div>
          
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
              
              {status === 'playing' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                  <button 
                    onClick={() => { playClick(); useHint(); }}
                    disabled={stats.coins < 50}
                    style={{
                      background: stats.coins >= 50 ? 'var(--warning-color)' : 'var(--surface-border)',
                      color: stats.coins >= 50 ? '#333' : 'var(--text-secondary)',
                      border: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      cursor: stats.coins >= 50 ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold', fontSize: '0.85rem'
                    }}
                    title="Revelar una letra por 50 monedas"
                  >
                    <Lightbulb size={18} /> Pista (-50 💰)
                  </button>
                </div>
              )}

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
                    <div className="cat-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => { playClick(); window.history.replaceState({}, '', '/'); setChallengeWord(null); startNewGame(null, null, true); }} style={{ background: 'var(--warning-color)', color: '#333' }}>🌟 Reto Diario</button>
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
        volume={volume}
        setVolume={setVolume}
        useTimer={useTimer}
        setUseTimer={setUseTimer}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        profile={profile}
        setProfile={setProfile}
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
