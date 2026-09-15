import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import './Modal.css';

const SettingsModal = ({ 
  isOpen, onClose, 
  theme, setTheme, 
  difficulty, setDifficulty, 
  soundEnabled, setSoundEnabled,
  useTimer, setUseTimer,
  onHardReset
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

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
          >
            <button className="modal-close" onClick={onClose}><X size={24} /></button>
            <h2><SettingsIcon /> Ajustes</h2>
            
            <div className="settings-section">
              <h3>Tema Visual</h3>
              <div className="btn-group">
                <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>Claro</button>
                <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>Oscuro</button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Dificultad (Intentos)</h3>
              <div className="btn-group">
                <button className={difficulty === 'easy' ? 'active' : ''} onClick={() => setDifficulty('easy')}>Fácil (8)</button>
                <button className={difficulty === 'normal' ? 'active' : ''} onClick={() => setDifficulty('normal')}>Normal (6)</button>
                <button className={difficulty === 'hard' ? 'active' : ''} onClick={() => setDifficulty('hard')}>Difícil (4)</button>
              </div>
            </div>

            <div className="settings-section">
              <h3>Experiencia</h3>
              <div className="btn-group">
                <button className={soundEnabled ? 'active' : ''} onClick={() => setSoundEnabled(true)}>Sonido ON</button>
                <button className={!soundEnabled ? 'active' : ''} onClick={() => setSoundEnabled(false)}>Sonido OFF</button>
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
