import { useState, useEffect, useCallback } from 'react';
import { getRandomWord } from '../data/dictionary';

const MAX_MISTAKES = 6;

export function useGameEngine() {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'playing', 'won', 'lost'
  
  // Stats state
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
    setStatus('playing');
  }, []);

  useEffect(() => {
    localStorage.setItem('ahorcado_stats', JSON.stringify(stats));
  }, [stats]);

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
      if (newMistakes >= MAX_MISTAKES) {
        setStatus('lost');
        setStats(s => ({ ...s, losses: s.losses + 1, streak: 0 }));
      }
    }
  }, [word, status, guessedLetters, mistakes]);

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
    startNewGame,
    guess,
    maxMistakes: MAX_MISTAKES
  };
}
