import React from 'react';
import { Settings, BarChart2, BookOpen, ShoppingCart, Users } from 'lucide-react';
import './Header.css';

const Header = ({ onOpenSettings, onOpenStats, onOpenManual, onOpenShop, onOpenChallenge }) => {
  return (
    <header className="app-header">
      <div className="header-actions">
        <button className="icon-btn" onClick={onOpenManual} title="Manual de Uso" aria-label="Manual">
          <BookOpen size={24} />
        </button>
        <button className="icon-btn" onClick={onOpenChallenge} title="Desafiar Amigo" aria-label="Reto">
          <Users size={24} />
        </button>
      </div>
      
      <div className="header-actions">
        <button className="icon-btn" onClick={onOpenShop} title="Tienda" aria-label="Tienda">
          <ShoppingCart size={24} />
        </button>
        <button className="icon-btn" onClick={onOpenStats} title="Estadísticas" aria-label="Estadísticas">
          <BarChart2 size={24} />
        </button>
        <button className="icon-btn" onClick={onOpenSettings} title="Ajustes" aria-label="Ajustes">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
