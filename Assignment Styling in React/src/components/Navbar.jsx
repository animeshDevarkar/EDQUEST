import React, { useState } from 'react';
import styles from '../styles/Layout.module.css';
import { Sun, Moon, Palette, Menu, X, Code2, Sparkles } from 'lucide-react';

export default function Navbar({ themeMode, toggleTheme, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'demos', label: 'Styling Demos' },
    { id: 'portfolio', label: 'Responsive Projects' },
    { id: 'contact', label: 'UI/UX Form' },
  ];

  return (
    <header className={styles.navbar}>
      <div className={styles.navLogo}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          color: '#fff',
          padding: '0.4rem',
          borderRadius: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Code2 size={22} />
        </div>
        <span>ReactStyleLab</span>
      </div>

      <nav className={`${styles.navLinks} ${mobileMenuOpen ? styles.navLinksMobileOpen : ''}`}>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.navLink} ${activeTab === item.id ? styles.activeNavLink : ''}`}
            onClick={() => {
              setActiveTab(item.id);
              setMobileMenuOpen(false);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.navActions}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: themeMode === 'light' ? '1px solid #cbd5e1' : '1px solid #475569',
            backgroundColor: themeMode === 'light' ? '#f1f5f9' : '#334155',
            color: themeMode === 'light' ? '#0f172a' : '#f8fafc',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
          }}
          title="Toggle Light/Dark Theme"
        >
          {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span>{themeMode === 'light' ? 'Dark' : 'Light'}</span>
        </button>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
