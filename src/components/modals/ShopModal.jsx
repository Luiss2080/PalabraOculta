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
            <div className="shop-header">
              <h2 id="shop-modal-title"><ShoppingCart /> Tienda</h2>
              <div className="shop-coin-balance">💰 {coins}</div>
            </div>

            <div className="shop-items">
              {ITEMS.map(item => {
                const isUnlocked = unlocks.includes(item.id);
                const canAfford = coins >= item.price;
                return (
                  <div key={item.id} className="shop-item">
                    <div>
                      <strong className="shop-item-title">{item.title}</strong>
                      <span className="shop-item-type">{item.type.toUpperCase()}</span>
                    </div>
                    {isUnlocked ? (
                      <div className="shop-item-unlocked">
                        <CheckCircle size={20} /> Desbloqueado
                      </div>
                    ) : (
                      <button
                        className={`shop-buy-button ${canAfford ? 'affordable' : ''}`}
                        onClick={() => onPurchase(item)}
                        disabled={!canAfford}
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
