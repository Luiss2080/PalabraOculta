import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, AlertTriangle, User, Volume2, Palette } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Modal.css';

const AVATARS = ['🤖', '👽', '👻', '🦊', '🦁', '🦉', '🐱', '🐶'];
const ACCENT_COLORS = [
  { name: 'Azul', value: '#3e8ed0' },
  { name: 'Verde Neón', value: '#10b981' },
  { name: 'Púrpura', value: '#8b5cf6' },
  { name: 'Rojo Rubí', value: '#f43f5e' },
  { name: 'Naranja', value: '#f97316' }
];

const SettingsModal = ({ 
  isOpen, onClose, 
  theme, setTheme, 
  difficulty, setDifficulty, 
  volume, setVolume,
  useTimer, setUseTimer,
  accentColor, setAccentColor,
  profile, setProfile,
  onHardReset
}) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const modalRef = useFocusTrap(isOpen, onClose);

  const handleReset = () => {
    if (confirmReset) {
      onHardReset();
      setConfirmReset(false);
      onClose();
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
            tabIndex={-1}
          >
            <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={24} /></button>
            <h2 id="settings-modal-title"><SettingsIcon /> Ajustes & Perfil</h2>
            
            {/* Perfil */}
            <div className="settings-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={18}/> Jugador</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select 
                  value={profile.avatar} 
                  onChange={e => setProfile({...profile, avatar: e.target.value})}
                  style={{ fontSize: '2rem', padding: '0.5rem', borderRadius: '8px', background: 'var(--surface-color)', border: '1px solid var(--surface-border)' }}
                >
                  {AVATARS.map(av => <option key={av} value={av}>{av}</option>)}
                </select>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  placeholder="Tu Nombre"
                  maxLength={12}
                  style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--primary-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Tema y Acento */}
            <div className="settings-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={18}/> Apariencia</h3>
              <div className="btn-group" style={{ marginBottom: '1rem' }}>
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Claro</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Oscuro</button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(color => (
                  <button 
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: color.value, border: accentColor === color.value ? '3px solid white' : 'none',
                      cursor: 'pointer', outline: accentColor === color.value ? '2px solid ' + color.value : 'none'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sonido */}
            <div className="settings-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Volume2 size={18}/> Volumen de Sonido</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem' }}>0%</span>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: '0.85rem' }}>100%</span>
              </div>
            </div>

            {/* Dificultad y Timer */}
            <div className="settings-section">
              <h3>Dificultad (Intentos)</h3>
              <div className="btn-group">
                <button className={difficulty === 'easy' ? 'active' : ''} onClick={() => setDifficulty('easy')}>Fácil (8)</button>
                <button className={difficulty === 'normal' ? 'active' : ''} onClick={() => setDifficulty('normal')}>Normal (6)</button>
                <button className={difficulty === 'hard' ? 'active' : ''} onClick={() => setDifficulty('hard')}>Difícil (4)</button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Contrarreloj</h3>
              <div className="btn-group">
                <button className={useTimer ? 'active' : ''} onClick={() => setUseTimer(true)}>60s ON</button>
                <button className={!useTimer ? 'active' : ''} onClick={() => setUseTimer(false)}>OFF</button>
              </div>
            </div>

            <div className="settings-section" style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <button 
                onClick={handleReset}
                style={{
                  width: '100%', padding: '0.75rem', background: 'var(--danger-color)', 
                  color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <AlertTriangle size={20} />
                {confirmReset ? '¿Estás seguro? Clic para confirmar' : 'Borrar todo el progreso'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
