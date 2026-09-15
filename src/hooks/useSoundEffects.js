import { useCallback, useRef, useEffect } from 'react';

export function useSoundEffects(enabled = true) {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
  }, []);

  const playTone = useCallback((frequency, type, duration, vol = 0.1) => {
    if (!enabled || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [enabled]);

  const playClick = useCallback(() => playTone(300, 'sine', 0.1, 0.02), [playTone]);
  const playCorrect = useCallback(() => playTone(600, 'sine', 0.2, 0.05), [playTone]);
  const playWrong = useCallback(() => playTone(150, 'sawtooth', 0.3, 0.05), [playTone]);
  
  const playWin = useCallback(() => {
    playTone(400, 'square', 0.1, 0.05);
    setTimeout(() => playTone(500, 'square', 0.1, 0.05), 100);
    setTimeout(() => playTone(600, 'square', 0.4, 0.05), 200);
  }, [playTone]);

  const playLose = useCallback(() => {
    playTone(300, 'sawtooth', 0.2, 0.05);
    setTimeout(() => playTone(250, 'sawtooth', 0.2, 0.05), 200);
    setTimeout(() => playTone(200, 'sawtooth', 0.5, 0.05), 400);
  }, [playTone]);

  return { playClick, playCorrect, playWrong, playWin, playLose };
}
