import { renderHook, act } from '@testing-library/react';
import { useGameEngine } from '../hooks/useGameEngine';
import { expect, test, describe, beforeEach } from 'vitest';

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
});
