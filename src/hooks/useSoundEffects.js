import { useCallback, useRef, useEffect } from 'react';

export function useSoundEffects(volume = 0.5) {
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

  const playTone = useCallback((frequency, type, duration, volMultiplier = 1) => {
    if (volume <= 0 || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    const finalVol = (volume * 0.2) * volMultiplier; // base volume scaling
    
    gainNode.gain.setValueAtTime(finalVol, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [volume]);

  const playClick = useCallback(() => playTone(300, 'sine', 0.1, 0.5), [playTone]);
  const playCorrect = useCallback(() => playTone(600, 'sine', 0.2, 1), [playTone]);
  const playWrong = useCallback(() => playTone(150, 'sawtooth', 0.3, 1), [playTone]);
  
  const playWin = useCallback(() => {
    playTone(400, 'square', 0.1, 1);
    setTimeout(() => playTone(500, 'square', 0.1, 1), 100);
    setTimeout(() => playTone(600, 'square', 0.4, 1), 200);
  }, [playTone]);

  const playLose = useCallback(() => {
    playTone(300, 'sawtooth', 0.2, 1);
    setTimeout(() => playTone(250, 'sawtooth', 0.2, 1), 200);
    setTimeout(() => playTone(200, 'sawtooth', 0.5, 1), 400);
  }, [playTone]);

  return { playClick, playCorrect, playWrong, playWin, playLose };
}
