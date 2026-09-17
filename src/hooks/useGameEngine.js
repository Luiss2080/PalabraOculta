import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, PALABRAS } from '../data/dictionary';

const HINT_COST = 50;

function getDailySeed() {
  // Use UTC components (not local time) so every player gets the same
  // "Reto Diario" word on the same calendar day regardless of timezone.
  // Using local time meant a player in UTC-4 and one in UTC+8 could see
  // two different daily words at any given moment.
  const date = new Date();
  return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
}

function seededRandom(seed) {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function useGameEngine(difficulty = 'normal', useTimer = false) {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastAction, setLastAction] = useState(null); 
  const [newAchieved, setNewAchieved] = useState([]);

  // Synchronous, render-independent guards against double-processing the
  // same input twice (e.g. a key-repeat event or a double-click firing
  // before React has re-rendered the "already guessed"/"can't afford"
  // disabled state). Plain state reads inside guess()/revealHint() are not
  // enough because two calls can both read the same stale closure value
  // when they happen within the same React batch.
  const processedLettersRef = useRef(new Set());
  const hintLockRef = useRef(false);

  const maxMistakes = difficulty === 'easy' ? 8 : difficulty === 'hard' ? 4 : 6;
  const coinsReward = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 30 : 20;
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ahorcado_stats');
    const parsed = saved ? JSON.parse(saved) : {};
    return { 
      wins: parsed.wins || 0, 
      losses: parsed.losses || 0, 
      streak: parsed.streak || 0, 
      coins: parsed.coins || 0, 
      unlocks: parsed.unlocks || [],
      achievements: parsed.achievements || [],
      topStreaks: parsed.topStreaks || []
    };
  });

  const checkAchievements = useCallback((currentStats, currentMistakes, isWon) => {
    const unlocks = [];
    const hasAch = (id) => currentStats.achievements.includes(id);

    if (isWon) {
      if (!hasAch('first_blood')) unlocks.push({ id: 'first_blood', name: 'Primera Sangre' });
      if (currentMistakes === 0 && !hasAch('flawless')) unlocks.push({ id: 'flawless', name: 'Impecable' });
      if (currentMistakes === maxMistakes - 1 && !hasAch('survivor')) unlocks.push({ id: 'survivor', name: 'Sobreviviente' });
    }
    
    if (currentStats.coins >= 500 && !hasAch('millionaire')) unlocks.push({ id: 'millionaire', name: 'Millonario' });

    if (unlocks.length > 0) {
      setNewAchieved(unlocks.map(u => u.name));
      setStats(s => ({
        ...s,
        achievements: [...s.achievements, ...unlocks.map(u => u.id)]
      }));
    }
  }, [maxMistakes]);

  const startNewGame = useCallback((selectedCategory = null, customWord = null, isDaily = false) => {
    if (customWord) {
      setWord(customWord.toUpperCase());
      setCategory('Reto de un amigo');
    } else if (isDaily) {
      const seed = getDailySeed();
      const catKeys = Object.keys(PALABRAS);
      const catIndex = Math.floor(seededRandom(seed) * catKeys.length);
      const randomCat = catKeys[catIndex];
      const words = PALABRAS[randomCat];
      const wordIndex = Math.floor(seededRandom(seed + 1) * words.length);
      
      setWord(words[wordIndex].toUpperCase());
      setCategory(`Reto Diario`);
    } else {
      const { category, word } = getRandomWord(selectedCategory);
      setWord(word);
      setCategory(category);
    }
    
    processedLettersRef.current = new Set();
    setGuessedLetters(new Set());
    setMistakes(0);
    setTimeLeft(60);
    setStatus('playing');
    setLastAction(null);
  }, []);

  useEffect(() => {
    localStorage.setItem('ahorcado_stats', JSON.stringify(stats));
  }, [stats]);

  // Takes the item id and its price rather than a precomputed unlocks array,
  // and does the "already owned?" / "can afford it?" checks *inside* the
  // setStats updater against the latest state. That makes it safe against a
  // rapid double-click on the buy button: React applies functional updaters
  // one after another against the freshest state, so the second call always
  // sees the first one's result and will no-op instead of double-charging
  // (which could previously send coins negative) or duplicating the unlock.
  const purchaseUnlock = useCallback((itemId, cost) => {
    setStats(s => {
      if (s.unlocks.includes(itemId) || s.coins < cost) return s;
      const newState = { ...s, unlocks: [...s.unlocks, itemId], coins: s.coins - cost };
      checkAchievements(newState, 0, false);
      return newState;
    });
  }, [checkAchievements]);

  const revealHint = useCallback(() => {
    if (status !== 'playing' || hintLockRef.current) return false;
    if (stats.coins < HINT_COST) return false;

    const unrevealed = word.split('').filter(l => !guessedLetters.has(l));
    if (unrevealed.length === 0) return false;

    // Lock synchronously before touching any state: a double-click/rapid
    // repeat firing before this component re-renders would otherwise read
    // the same stale `stats.coins` above and reveal two letters for the
    // price of one (or push coins negative).
    hintLockRef.current = true;

    const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    processedLettersRef.current.add(randomLetter);

    setStats(s => {
      if (s.coins < HINT_COST) return s; // defensive re-check against stale reads
      return { ...s, coins: s.coins - HINT_COST };
    });

    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(randomLetter);
      return newSet;
    });
    setLastAction('correct');

    return true;
  }, [word, guessedLetters, status, stats.coins]);

  // Release the hint lock once the coin deduction has actually landed in
  // state, so a genuinely new hint request (after a real render) is allowed.
  useEffect(() => {
    hintLockRef.current = false;
  }, [stats.coins]);

  const handleLoss = useCallback((s) => {
    const newStreak = s.streak;
    let newTop = [...s.topStreaks];
    if (newStreak > 0) {
      newTop.push(newStreak);
      newTop.sort((a, b) => b - a);
      newTop = newTop.slice(0, 5);
    }
    return { ...s, losses: s.losses + 1, streak: 0, topStreaks: newTop };
  }, []);

  const hardReset = useCallback(() => {
    const resetData = { wins: 0, losses: 0, streak: 0, coins: 0, unlocks: [], achievements: [], topStreaks: [] };
    setStats(resetData);
    localStorage.setItem('ahorcado_stats', JSON.stringify(resetData));
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (status !== 'playing' || !useTimer) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('lost');
          setLastAction('lose');
          setStats(handleLoss);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, useTimer, handleLoss]);

  const guess = useCallback((letter) => {
    if (status !== 'playing') return;

    const upperLetter = letter.toUpperCase();
    // Synchronous guard: prevents a double-click or a browser key-repeat
    // event on the same letter from being processed twice (which used to
    // risk double-decrementing lives) even when the two events fire before
    // React re-renders the disabled keyboard button / updates
    // `guessedLetters` state.
    if (processedLettersRef.current.has(upperLetter)) return;
    processedLettersRef.current.add(upperLetter);

    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(upperLetter);
      return newSet;
    });

    if (!word.includes(upperLetter)) {
      setMistakes(prevMistakes => {
        const newMistakes = prevMistakes + 1;
        if (newMistakes >= maxMistakes) {
          setStatus('lost');
          setLastAction('lose');
          setStats(handleLoss);
        } else {
          setLastAction('wrong');
        }
        return newMistakes;
      });
    } else {
      setLastAction('correct');
    }
  }, [word, status, maxMistakes, handleLoss]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-ZÑ]$/.test(key)) {
        guess(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guess]);

  useEffect(() => {
    if (status !== 'playing' || !word) return;
    const isWon = word.split('').every(l => guessedLetters.has(l));
    if (isWon) {
      setStatus('won');
      setLastAction('win');
      
      const multiplier = category.includes('Reto Diario') ? 2 : 1;
      const earnedCoins = coinsReward * multiplier;

      setStats(s => {
        const newState = { ...s, wins: s.wins + 1, streak: s.streak + 1, coins: (s.coins || 0) + earnedCoins };
        checkAchievements(newState, mistakes, true);
        return newState;
      });
    }
  }, [guessedLetters, word, status, coinsReward, category, mistakes, checkAchievements]);

  return {
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
    revealHint,
    maxMistakes,
    purchaseUnlock,
    hardReset
  };
}
