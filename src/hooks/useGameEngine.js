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
  
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('ahorcado_stats');
    return saved ? JSON.parse(saved) : { wins: 0, losses: 0, streak: 0 };
  });

  const startNewGame = useCallback((selectedCategory = null) => {
    const { category, word } = getRandomWord(selectedCategory);
    setWord(word);
    setCategory(category);
    setGuessedLetters(new Set());
    setMistakes(0);
    setTimeLeft(60);
    setStatus('playing');
    setLastAction(null);
  }, []);

  useEffect(() => {
    localStorage.setItem('ahorcado_stats', JSON.stringify(stats));
  }, [stats]);

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
      setStats(s => ({ ...s, wins: s.wins + 1, streak: s.streak + 1 }));
    }
  }, [guessedLetters, word, status]);

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
    maxMistakes
  };
}
