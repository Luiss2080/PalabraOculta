import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon } from 'lucide-react';
import './Modal.css';

const SettingsModal = ({ isOpen, onClose, theme, setTheme, difficulty, setDifficulty }) => {
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
              <h3>Dificultad (Intentos Máximos)</h3>
              <div className="btn-group">
                <button className={difficulty === 'easy' ? 'active' : ''} onClick={() => setDifficulty('easy')}>Fácil (8)</button>
                <button className={difficulty === 'normal' ? 'active' : ''} onClick={() => setDifficulty('normal')}>Normal (6)</button>
                <button className={difficulty === 'hard' ? 'active' : ''} onClick={() => setDifficulty('hard')}>Difícil (4)</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
