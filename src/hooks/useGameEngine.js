import { useState, useEffect, useCallback } from 'react';
import { getRandomWord, PALABRAS } from '../data/dictionary';

function getDailySeed() {
  const date = new Date();
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
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
    
    setGuessedLetters(new Set());
    setMistakes(0);
    setTimeLeft(60);
    setStatus('playing');
    setLastAction(null);
  }, []);

  useEffect(() => {
    localStorage.setItem('ahorcado_stats', JSON.stringify(stats));
  }, [stats]);

  const updateUnlocks = useCallback((newUnlocks, cost) => {
    setStats(s => {
      const newState = { ...s, unlocks: newUnlocks, coins: s.coins - cost };
      checkAchievements(newState, 0, false);
      return newState;
    });
  }, [checkAchievements]);
  
  const useHint = useCallback(() => {
    if (status !== 'playing' || stats.coins < 50) return false;
    
    const unrevealed = word.split('').filter(l => !guessedLetters.has(l));
    if (unrevealed.length === 0) return false;
    
    const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    
    setStats(s => ({ ...s, coins: s.coins - 50 }));
    
    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(randomLetter);
      return newSet;
    });
    setLastAction('correct');
    
    return true;
  }, [word, guessedLetters, status, stats.coins]);

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
    if (guessedLetters.has(upperLetter)) return;

    setGuessedLetters(prev => {
      const newSet = new Set(prev);
      newSet.add(upperLetter);
      return newSet;
    });

    if (!word.includes(upperLetter)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setLastAction('wrong');
      if (newMistakes >= maxMistakes) {
        setStatus('lost');
        setLastAction('lose');
        setStats(handleLoss);
      }
    } else {
      setLastAction('correct');
    }
  }, [word, status, guessedLetters, mistakes, maxMistakes, handleLoss]);

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
    useHint,
    maxMistakes,
    updateUnlocks,
    hardReset
  };
}
