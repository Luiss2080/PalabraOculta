import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Lock, CheckCircle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Modal.css';

const ITEMS = [
  { id: 'cat_movies', title: 'Categoría: Películas', price: 100, type: 'category' },
  { id: 'cat_games', title: 'Categoría: Videojuegos', price: 150, type: 'category' },
  { id: 'theme_neon', title: 'Tema: Neón (Próximamente)', price: 300, type: 'theme' },
];

const ShopModal = ({ isOpen, onClose, coins, unlocks, onPurchase }) => {
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-modal-title"
            tabIndex={-1}
          >
            <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={24} /></button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="shop-modal-title"><ShoppingCart /> Tienda</h2>
              <div style={{ background: 'var(--warning-color)', color: '#333', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
                💰 {coins}
              </div>
            </div>
            
            <div className="shop-items" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ITEMS.map(item => {
                const isUnlocked = unlocks.includes(item.id);
                const canAfford = coins >= item.price;
                return (
                  <div key={item.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                    padding: '1rem', background: 'var(--surface-color)', borderRadius: '12px',
                    border: '1px solid var(--surface-border)'
                  }}>
                    <div>
                      <strong style={{ display: 'block' }}>{item.title}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.type.toUpperCase()}</span>
                    </div>
                    {isUnlocked ? (
                      <div style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} /> Desbloqueado
                      </div>
                    ) : (
                      <button 
                        onClick={() => onPurchase(item)}
                        disabled={!canAfford}
                        style={{
                          background: canAfford ? 'var(--primary-color)' : 'var(--surface-border)',
                          color: canAfford ? 'white' : 'var(--text-secondary)',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: canAfford ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <Lock size={16} /> 💰 {item.price}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShopModal;
