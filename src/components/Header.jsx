import React from 'react';
import { Settings, BarChart2, BookOpen } from 'lucide-react';
import './Header.css';

const Header = ({ onOpenSettings, onOpenStats, onOpenManual }) => {
  return (
    <header className="app-header">
      <div className="header-actions">
        <button className="icon-btn" onClick={onOpenManual} aria-label="Manual">
          <BookOpen size={24} />
        </button>
      </div>
      
      <div className="header-actions">
        <button className="icon-btn" onClick={onOpenStats} aria-label="Estadísticas">
          <BarChart2 size={24} />
        </button>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Ajustes">
          <Settings size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
