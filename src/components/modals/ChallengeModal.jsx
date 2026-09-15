import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Copy, Check } from 'lucide-react';
import './Modal.css';

const ChallengeModal = ({ isOpen, onClose }) => {
  const [customWord, setCustomWord] = useState('');
  const [copied, setCopied] = useState(false);

  const link = customWord.length > 2 
    ? `${window.location.origin}${window.location.pathname}?reto=${btoa(customWord.toUpperCase().trim())}`
    : '';

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button className="modal-close" onClick={onClose}><X size={24} /></button>
            <h2><Users /> Desafiar a un amigo</h2>
            
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Escribe una palabra secreta. Generaremos un enlace mágico que puedes enviarle a cualquier amigo para que intente adivinarla.
              </p>
              
              <input 
                type="text" 
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value.replace(/[^A-Za-zÑñ]/g, ''))}
                placeholder="Escribe la palabra (sin acentos)"
                maxLength={15}
                style={{
                  width: '100%', padding: '1rem', fontSize: '1.2rem',
                  borderRadius: '8px', border: '1px solid var(--primary-color)',
                  background: 'var(--bg-color)', color: 'var(--text-primary)',
                  marginBottom: '1rem', textTransform: 'uppercase'
                }}
              />

              {link && (
                <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', wordBreak: 'break-all' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Enlace generado:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <code style={{ flex: 1, fontSize: '0.8rem' }}>{link}</code>
                    <button 
                      onClick={handleCopy}
                      style={{
                        background: copied ? 'var(--success-color)' : 'var(--primary-color)',
                        color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
