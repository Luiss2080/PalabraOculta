import { describe, test, expect } from 'vitest';
import { PALABRAS, getRandomWord } from '../data/dictionary';

describe('dictionary data integrity', () => {
  test('every category has at least one non-empty, uppercase word', () => {
    Object.entries(PALABRAS).forEach(([, words]) => {
      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBeGreaterThan(0);
      words.forEach((word) => {
        expect(typeof word).toBe('string');
        expect(word.length).toBeGreaterThan(0);
        expect(word).toBe(word.toUpperCase());
      });
    });
  });
});

describe('getRandomWord', () => {
  test('with no category, returns a word that belongs to the returned category', () => {
    for (let i = 0; i < 25; i++) {
      const { category, word } = getRandomWord();
      expect(Object.keys(PALABRAS)).toContain(category);
      expect(PALABRAS[category]).toContain(word);
    }
  });

  test('with an explicit valid category, always honors it', () => {
    for (let i = 0; i < 25; i++) {
      const { category, word } = getRandomWord('Frutas');
      expect(category).toBe('Frutas');
      expect(PALABRAS['Frutas']).toContain(word);
    }
  });
});
