import { useState, useEffect, useCallback } from 'react';
import { getRandomWord } from '../data/dictionary';

export function useGameEngine(difficulty = 'normal', useTimer = false) {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'playing', 'won', 'lost'
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastAction, setLastAction] = useState(null); // 'correct', 'wrong', 'win', 'lose'
  
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
      unlocks: parsed.unlocks || [] 
    };
  });

  const startNewGame = useCallback((selectedCategory = null, customWord = null) => {
    if (customWord) {
      setWord(customWord.toUpperCase());
      setCategory('Reto de un amigo');
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
    setStats(s => ({ ...s, unlocks: newUnlocks, coins: s.coins - cost }));
  }, []);
  
  const hardReset = useCallback(() => {
    const resetData = { wins: 0, losses: 0, streak: 0, coins: 0, unlocks: [] };
    setStats(resetData);
    localStorage.setItem('ahorcado_stats', JSON.stringify(resetData));
    setStatus('idle');
  }, []);

  // Timer logic
  useEffect(() => {
    if (status !== 'playing' || !useTimer) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('lost');
          setLastAction('lose');
          setStats(s => ({ ...s, losses: s.losses + 1, streak: 0 }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [status, useTimer]);

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
        setStats(s => ({ ...s, losses: s.losses + 1, streak: 0 }));
      }
    } else {
      setLastAction('correct');
    }
  }, [word, status, guessedLetters, mistakes, maxMistakes]);

  // Handle keyboard events globally
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
      setStats(s => ({ ...s, wins: s.wins + 1, streak: s.streak + 1, coins: (s.coins || 0) + coinsReward }));
    }
  }, [guessedLetters, word, status, coinsReward]);

  return {
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
  };
}
