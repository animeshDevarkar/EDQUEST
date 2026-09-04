import React, { useState } from 'react';
import styles from '../../styles/Layout.module.css';
import { LayoutGrid, Smartphone, Monitor, Tablet, Code, Check } from 'lucide-react';

export default function CssGridDemo({ theme }) {
  const [columns, setColumns] = useState('repeat(auto-fit, minmax(200px, 1fr))');
  const [columnCount, setColumnCount] = useState('auto');
  const [gap, setGap] = useState(16);
  const [layoutType, setLayoutType] = useState('grid'); // 'grid' | 'flex'

  const sampleItems = [
    { id: 1, title: 'CSS Grid Item 1', desc: 'Auto-responsive 2D Layouts' },
    { id: 2, title: 'Flexbox Item 2', desc: '1D Alignment & Distribution' },
    { id: 3, title: 'Media Query Item 3', desc: '@media Breakpoints' },
    { id: 4, title: 'CSS Module Item 4', desc: 'Scoped Local Class Names' },
  ];

  const gridStyle = {
    display: layoutType === 'grid' ? 'grid' : 'flex',
    flexWrap: layoutType === 'flex' ? 'wrap' : 'nowrap',
    gridTemplateColumns: layoutType === 'grid' ? columns : 'none',
    gap: `${gap}px`,
    padding: '1.25rem',
    backgroundColor: theme.mode === 'light' ? '#f8fafc' : '#0f172a',
    borderRadius: '0.75rem',
    border: `1px dashed ${theme.border}`,
    transition: 'all 0.3s ease',
  };

  const itemStyle = {
    backgroundColor: theme.cardBg,
    color: theme.text,
    padding: '1.25rem',
    borderRadius: '0.6rem',
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadow,
    flex: layoutType === 'flex' ? '1 1 200px' : 'initial',
  };

  return (
    <div style={{
      backgroundColor: theme.cardBg,
      color: theme.text,
      border: `1px solid ${theme.border}`,
      borderRadius: '1rem',
      padding: '1.75rem',
      boxShadow: theme.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={20} color={theme.primary} /> CSS Modules, Grid & Flexbox
        </h3>
        <span style={{
          backgroundColor: '#dcfce7',
          color: '#15803d',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          Layout.module.css
        </span>
      </div>

      <p style={{ color: theme.textSecondary, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        CSS Modules allow writing scoped CSS files where class names are automatically hashed to prevent global conflicts. Combined with CSS Grid and Flexbox, they enable robust, fully responsive design.
      </p>

      {/* Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
        backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0f172a',
        padding: '1rem',
        borderRadius: '0.75rem'
      }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Layout Mode
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setLayoutType('grid')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '0.4rem',
                border: layoutType === 'grid' ? '2px solid #10b981' : '1px solid #cbd5e1',
                backgroundColor: layoutType === 'grid' ? '#dcfce7' : 'transparent',
                color: layoutType === 'grid' ? '#15803d' : theme.text,
                cursor: 'pointer'
              }}
            >
              CSS Grid
            </button>
            <button
              onClick={() => setLayoutType('flex')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '0.4rem',
                border: layoutType === 'flex' ? '2px solid #10b981' : '1px solid #cbd5e1',
                backgroundColor: layoutType === 'flex' ? '#dcfce7' : 'transparent',
                color: layoutType === 'flex' ? '#15803d' : theme.text,
                cursor: 'pointer'
              }}
            >
              Flexbox
            </button>
          </div>
        </div>

        {layoutType === 'grid' && (
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Grid Template Columns
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Auto-Fit', val: 'repeat(auto-fit, minmax(200px, 1fr))', key: 'auto' },
                { label: '2 Col', val: 'repeat(2, 1fr)', key: '2' },
                { label: '4 Col', val: 'repeat(4, 1fr)', key: '4' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setColumns(item.val);
                    setColumnCount(item.key);
                  }}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: '0.4rem',
                    border: columnCount === item.key ? '2px solid #6366f1' : '1px solid #cbd5e1',
                    backgroundColor: columnCount === item.key ? '#eef2ff' : 'transparent',
                    color: columnCount === item.key ? '#4f46e5' : theme.text,
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Gap ({gap}px)
          </label>
          <input
            type="range"
            min="8"
            max="40"
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Interactive Grid Render */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: theme.textSecondary }}>
          Live Responsive Container ({layoutType.toUpperCase()}):
        </p>
        <div style={gridStyle}>
          {sampleItems.map((item) => (
            <div key={item.id} style={itemStyle}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem', color: theme.primary }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: theme.textSecondary }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Code Inspector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Code size={16} color={theme.textSecondary} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.textSecondary }}>CSS Module & Grid Code:</span>
        </div>
        <pre style={{
          backgroundColor: theme.mode === 'light' ? '#1e293b' : '#020617',
          color: '#4ade80',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          overflowX: 'auto',
          fontFamily: 'Fira Code, monospace',
          border: '1px solid #334155',
        }}>
{`/* Layout.module.css */
.responsiveGrid {
  display: ${layoutType};
  ${layoutType === 'grid' ? `grid-template-columns: ${columns};` : 'flex-wrap: wrap;'}
  gap: ${gap}px;
}

@media (max-width: 768px) {
  .responsiveGrid {
    grid-template-columns: 1fr; /* Stacks vertically on mobile */
  }
}`}
        </pre>
      </div>
    </div>
  );
}
