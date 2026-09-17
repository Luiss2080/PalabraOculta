import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart2, Trophy, Flame, Coins, Lock, CheckCircle, ListOrdered } from 'lucide-react';
import './Modal.css';

const ACHIEVEMENTS_LIST = [
  { id: 'first_blood', name: 'Primera Sangre', desc: 'Gana tu primera partida' },
  { id: 'flawless', name: 'Impecable', desc: 'Gana sin cometer ningún error' },
  { id: 'millionaire', name: 'Millonario', desc: 'Acumula más de 500 monedas' },
  { id: 'survivor', name: 'Sobreviviente', desc: 'Gana con solo 1 intento restante' }
];

const StatsModal = ({ isOpen, onClose, stats }) => {
  const [tab, setTab] = useState('stats'); // 'stats', 'achievements', 'leaderboard'

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
            <h2><BarChart2 /> Perfil del Jugador</h2>
            
            <div className="btn-group" style={{ marginBottom: '1.5rem', display: 'flex' }}>
              <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')} style={{flex: 1}}>General</button>
              <button className={tab === 'achievements' ? 'active' : ''} onClick={() => setTab('achievements')} style={{flex: 1}}>Trofeos</button>
              <button className={tab === 'leaderboard' ? 'active' : ''} onClick={() => setTab('leaderboard')} style={{flex: 1}}>Top 5</button>
            </div>

            {tab === 'stats' && (
              <div className="stats-grid">
                <div className="stat-card">
                  <Trophy size={32} color="var(--success-color)" className="stat-card-icon" />
                  <div className="stat-card-value">{stats.wins}</div>
                  <div className="stat-card-label">Victorias</div>
                </div>
                <div className="stat-card">
                  <Flame size={32} color="var(--danger-color)" className="stat-card-icon" />
                  <div className="stat-card-value">{stats.streak}</div>
                  <div className="stat-card-label">Racha Actual</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-value">{winRate}%</div>
                  <div className="stat-card-label">Win Rate</div>
                </div>
                <div className="stat-card">
                  <Coins size={32} color="var(--warning-color)" className="stat-card-icon" />
                  <div className="stat-card-value">{stats.coins || 0}</div>
                  <div className="stat-card-label">Monedas</div>
                </div>
              </div>
            )}

            {tab === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '250px', overflowY: 'auto' }}>
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
            )}

            {tab === 'leaderboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <ListOrdered size={20} color="var(--primary-color)" />
                  <strong style={{ color: 'var(--primary-color)' }}>Mejores Rachas Históricas</strong>
                </div>
                {(!stats.topStreaks || stats.topStreaks.length === 0) ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Aún no hay rachas registradas. ¡Juega y pierde tu primera racha para entrar al ranking!</p>
                ) : (
                  stats.topStreaks.map((streak, index) => (
                    <div key={index} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.8rem 1.2rem', background: 'var(--surface-color)', 
                      borderRadius: '8px', borderLeft: `4px solid ${index === 0 ? '#fcd34d' : index === 1 ? '#e2e8f0' : index === 2 ? '#b45309' : 'var(--surface-border)'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>#{index + 1}</span>
                        <strong>Racha de {streak}</strong>
                      </div>
                      <Flame color="var(--danger-color)" size={20} />
                    </div>
                  ))
                )}
              </div>
            )}
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatsModal;
