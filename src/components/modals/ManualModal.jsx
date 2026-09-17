import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Target, Award, Keyboard } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Modal.css';

const ManualModal = ({ isOpen, onClose }) => {
  const modalRef = useFocusTrap(isOpen, onClose);
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
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-modal-title"
            tabIndex={-1}
          >
            <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={24} /></button>
            <h2 id="manual-modal-title"><BookOpen /> Manual de Uso</h2>
            
            <div style={{ marginTop: '1.5rem', lineHeight: '1.6' }}>
              <p>¡Bienvenido a <strong>Ahorcado Premium</strong>!</p>
              
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                  <Target size={20} /> Objetivo
                </h3>
                <p>Adivina la palabra secreta antes de quedarte sin intentos. Si el dibujo del ahorcado se completa, pierdes.</p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                  <Keyboard size={20} /> Controles
                </h3>
                <p>Puedes usar el <strong>teclado en pantalla</strong> o tu <strong>teclado físico</strong>. Acepta letras de la A a la Z incluyendo la Ñ.</p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                  <Award size={20} /> Rachas y Estadísticas
                </h3>
                <p>Cada vez que ganas, tu racha aumenta. Si pierdes, la racha vuelve a cero. ¡Intenta conseguir la racha más alta posible!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ManualModal;
