import React from 'react';
import styles from '../styles/Layout.module.css';
import { Heart, Code2, Sparkles } from 'lucide-react';

export default function Footer({ theme }) {
  const footerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 0',
    borderTop: `1px solid ${theme.border}`,
    marginTop: '3rem',
    color: theme.textSecondary,
    fontSize: '0.9rem',
    gap: '1rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <Code2 size={20} color={theme.primary} />
        <span>React Styling Assignment Showcase</span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span>Inline Styles</span>
        <span>•</span>
        <span>Styled Components</span>
        <span>•</span>
        <span>Emotion</span>
        <span>•</span>
        <span>CSS Modules & Grid</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        Built with <Heart size={16} color="#ef4444" fill="#ef4444" /> for EDQuest
      </div>
    </footer>
  );
}
