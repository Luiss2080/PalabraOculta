import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2 } from 'lucide-react';
import './Modal.css';

const StatsModal = ({ isOpen, onClose, stats }) => {
  const totalGames = stats.wins + stats.losses;
  const winRate = totalGames > 0 ? Math.round((stats.wins / totalGames) * 100) : 0;

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
            <h2><BarChart2 /> Estadísticas</h2>
            
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
              <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.wins}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Victorias</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>{stats.losses}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Derrotas</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{winRate}%</div>
                <div style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--surface-color)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>{stats.streak}🔥</div>
                <div style={{ color: 'var(--text-secondary)' }}>Racha Actual</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
