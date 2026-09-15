import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, Trophy, Flame, Coins, Lock, CheckCircle } from 'lucide-react';
import './Modal.css';

const ACHIEVEMENTS_LIST = [
  { id: 'first_blood', name: 'Primera Sangre', desc: 'Gana tu primera partida' },
  { id: 'flawless', name: 'Impecable', desc: 'Gana sin cometer ningún error' },
  { id: 'millionaire', name: 'Millonario', desc: 'Acumula más de 500 monedas' },
  { id: 'survivor', name: 'Sobreviviente', desc: 'Gana con solo 1 intento restante' }
];

const StatsModal = ({ isOpen, onClose, stats }) => {
  const winRate = stats.wins + stats.losses > 0 
    ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) 
    : 0;

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
            <h2><BarChart2 /> Estadísticas & Trofeos</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <Trophy size={32} color="var(--success-color)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.wins}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Victorias</div>
              </div>
              <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <Flame size={32} color="var(--danger-color)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.streak}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Racha Actual</div>
              </div>
              <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{winRate}%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Win Rate</div>
              </div>
              <div style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <Coins size={32} color="var(--warning-color)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.coins || 0}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monedas</div>
              </div>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Logros</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '150px', overflowY: 'auto' }}>
              {ACHIEVEMENTS_LIST.map(ach => {
                const unlocked = (stats.achievements || []).includes(ach.id);
                return (
                  <div key={ach.id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '1rem', 
                    padding: '0.8rem', background: 'var(--surface-color)', 
                    borderRadius: '8px', opacity: unlocked ? 1 : 0.6 
                  }}>
                    {unlocked ? <CheckCircle color="#fcd34d" size={24} /> : <Lock color="var(--text-secondary)" size={24} />}
                    <div>
                      <strong style={{ display: 'block', color: unlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{ach.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ach.desc}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
