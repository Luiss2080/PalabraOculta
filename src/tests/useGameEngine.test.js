import { renderHook, act } from '@testing-library/react';
import { useGameEngine } from '../hooks/useGameEngine';
import { expect, test, describe, beforeEach, afterEach, vi } from 'vitest';

describe('useGameEngine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should initialize with status idle', () => {
    const { result } = renderHook(() => useGameEngine('normal', false));
    expect(result.current.status).toBe('idle');
    expect(result.current.mistakes).toBe(0);
  });

  test('startNewGame should change status to playing', () => {
    const { result } = renderHook(() => useGameEngine('normal', false));
    act(() => {
      result.current.startNewGame();
    });
    expect(result.current.status).toBe('playing');
    expect(result.current.word.length).toBeGreaterThan(0);
  });

  describe('difficulty configuration', () => {
    test('easy allows 8 mistakes', () => {
      const { result } = renderHook(() => useGameEngine('easy', false));
      expect(result.current.maxMistakes).toBe(8);
    });

    test('normal allows 6 mistakes', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      expect(result.current.maxMistakes).toBe(6);
    });

    test('hard allows 4 mistakes', () => {
      const { result } = renderHook(() => useGameEngine('hard', false));
      expect(result.current.maxMistakes).toBe(4);
    });
  });

  describe('guess()', () => {
    test('a correct letter is added to guessedLetters without increasing mistakes', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      act(() => result.current.guess('G'));

      expect(result.current.guessedLetters.has('G')).toBe(true);
      expect(result.current.mistakes).toBe(0);
    });

    test('a wrong letter increases the mistake count', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      act(() => result.current.guess('Z'));

      expect(result.current.guessedLetters.has('Z')).toBe(true);
      expect(result.current.mistakes).toBe(1);
    });

    test('re-guessing an already-guessed letter does not count a second mistake', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      // Two separate calls (separated by a render, unlike a same-tick
      // double-click) so this exercises the ordinary "already guessed"
      // early-return path.
      act(() => result.current.guess('Z'));
      act(() => result.current.guess('Z'));

      expect(result.current.mistakes).toBe(1);
    });

    test('guessing a repeated letter reveals every occurrence at once, so unique letters are enough to win', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'BANANA'));

      // BANANA has only 3 unique letters (B, A, N) despite being 6 letters
      // long; guessing each unique letter once should be enough to win.
      act(() => result.current.guess('B'));
      act(() => result.current.guess('A'));
      act(() => result.current.guess('N'));

      expect(result.current.status).toBe('won');
    });

    test('losing is triggered once mistakes reach maxMistakes for the chosen difficulty', () => {
      const { result } = renderHook(() => useGameEngine('hard', false)); // maxMistakes = 4
      act(() => result.current.startNewGame(null, 'GATO'));

      // Letters guaranteed not to be in "GATO".
      act(() => result.current.guess('X'));
      act(() => result.current.guess('W'));
      act(() => result.current.guess('K'));
      act(() => result.current.guess('J'));

      expect(result.current.mistakes).toBe(4);
      expect(result.current.status).toBe('lost');
    });

    test('guesses are ignored once the game is no longer playing', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));
      act(() => result.current.guess('G'));
      act(() => result.current.guess('A'));
      act(() => result.current.guess('T'));
      act(() => result.current.guess('O'));
      expect(result.current.status).toBe('won');

      act(() => result.current.guess('X'));
      // A guess after the game ended must not start counting mistakes again.
      expect(result.current.mistakes).toBe(0);
    });
  });

  describe('custom word (challenge) and category selection', () => {
    test('a custom word is uppercased and tagged with the challenge category', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'gato'));

      expect(result.current.word).toBe('GATO');
      expect(result.current.category).toBe('Reto de un amigo');
    });
  });

  describe('daily challenge seeding', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    test('is deterministic: two independent players opening the app the same day get the same word', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-09-17T12:00:00Z'));

      const playerOne = renderHook(() => useGameEngine('normal', false));
      act(() => playerOne.result.current.startNewGame(null, null, true));

      const playerTwo = renderHook(() => useGameEngine('normal', false));
      act(() => playerTwo.result.current.startNewGame(null, null, true));

      expect(playerOne.result.current.word).toBe(playerTwo.result.current.word);
      expect(playerOne.result.current.category).toBe('Reto Diario');
      expect(playerTwo.result.current.category).toBe('Reto Diario');
    });

    test('grants double coins for winning the daily challenge', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-09-17T12:00:00Z'));

      const { result } = renderHook(() => useGameEngine('normal', false)); // coinsReward = 20
      act(() => result.current.startNewGame(null, null, true));

      const dailyWord = result.current.word;
      const uniqueLetters = [...new Set(dailyWord.split(''))];

      act(() => {
        uniqueLetters.forEach((letter) => result.current.guess(letter));
      });

      expect(result.current.status).toBe('won');
      expect(result.current.stats.coins).toBe(40); // 20 * 2 (daily multiplier)
    });
  });

  describe('achievements', () => {
    test('unlocks "first_blood" and "flawless" on a mistake-free win', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'SOL'));

      act(() => result.current.guess('S'));
      act(() => result.current.guess('O'));
      act(() => result.current.guess('L'));

      expect(result.current.status).toBe('won');
      expect(result.current.stats.achievements).toEqual(
        expect.arrayContaining(['first_blood', 'flawless'])
      );
    });

    test('does not unlock "flawless" when a mistake was made along the way', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'SOL'));

      act(() => result.current.guess('Z')); // wrong guess first
      act(() => result.current.guess('S'));
      act(() => result.current.guess('O'));
      act(() => result.current.guess('L'));

      expect(result.current.status).toBe('won');
      expect(result.current.stats.achievements).toContain('first_blood');
      expect(result.current.stats.achievements).not.toContain('flawless');
    });
  });

  describe('useHint', () => {
    test('does nothing when the player cannot afford it', () => {
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      expect(result.current.stats.coins).toBe(0);

      let hintUsed;
      act(() => {
        hintUsed = result.current.useHint();
      });

      expect(hintUsed).toBe(false);
      expect(result.current.guessedLetters.size).toBe(0);
    });

    test('reveals one letter and costs 50 coins when affordable', () => {
      localStorage.setItem('ahorcado_stats', JSON.stringify({ coins: 100 }));
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      let hintUsed;
      act(() => {
        hintUsed = result.current.useHint();
      });

      expect(hintUsed).toBe(true);
      expect(result.current.guessedLetters.size).toBe(1);
      expect(result.current.stats.coins).toBe(50);
    });
  });

  describe('updateUnlocks', () => {
    test('adds the item to unlocks and subtracts its price from coins', () => {
      localStorage.setItem('ahorcado_stats', JSON.stringify({ coins: 200, unlocks: [] }));
      const { result } = renderHook(() => useGameEngine('normal', false));

      act(() => {
        result.current.updateUnlocks([...result.current.stats.unlocks, 'cat_movies'], 100);
      });

      expect(result.current.stats.unlocks).toContain('cat_movies');
      expect(result.current.stats.coins).toBe(100);
    });
  });

  describe('hardReset', () => {
    test('resets stats to their defaults and status to idle', () => {
      localStorage.setItem(
        'ahorcado_stats',
        JSON.stringify({ coins: 500, wins: 10, losses: 3, streak: 2, unlocks: ['cat_movies'] })
      );
      const { result } = renderHook(() => useGameEngine('normal', false));
      act(() => result.current.startNewGame(null, 'GATO'));

      act(() => result.current.hardReset());

      expect(result.current.status).toBe('idle');
      expect(result.current.stats).toEqual({
        wins: 0,
        losses: 0,
        streak: 0,
        coins: 0,
        unlocks: [],
        achievements: [],
        topStreaks: [],
      });
    });
  });
});
