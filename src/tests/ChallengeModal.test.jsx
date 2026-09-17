import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ChallengeModal from '../components/modals/ChallengeModal';

describe('ChallengeModal challenge link generation', () => {
  beforeEach(() => {
    // navigator.clipboard is not implemented in jsdom.
    Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
  });

  test('encodes the typed word as Base64 in the generated link', () => {
    render(<ChallengeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText('Escribe la palabra (sin acentos)');
    fireEvent.change(input, { target: { value: 'sorpresa' } });

    // The app always encodes the uppercased, trimmed word.
    const expectedLink = `${window.location.origin}${window.location.pathname}?reto=${btoa('SORPRESA')}`;

    expect(screen.getByText(expectedLink)).toBeInTheDocument();
  });

  test('the encoded link round-trips back to the original word via atob', () => {
    render(<ChallengeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText('Escribe la palabra (sin acentos)');
    fireEvent.change(input, { target: { value: 'clave' } });

    const link = screen.getByText(new RegExp(`reto=${btoa('CLAVE')}`));
    const encoded = new URL(link.textContent).searchParams.get('reto');

    expect(atob(encoded)).toBe('CLAVE');
  });

  test('strips characters outside A-Z/Ñ as the player types', () => {
    render(<ChallengeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText('Escribe la palabra (sin acentos)');
    fireEvent.change(input, { target: { value: 'a1b2 c3!' } });

    expect(input.value).toBe('abc');
  });

  test('does not generate a link for words of 2 characters or fewer', () => {
    render(<ChallengeModal isOpen={true} onClose={() => {}} />);

    const input = screen.getByPlaceholderText('Escribe la palabra (sin acentos)');
    fireEvent.change(input, { target: { value: 'hi' } });

    expect(screen.queryByText(/Enlace generado/)).not.toBeInTheDocument();
  });
});
