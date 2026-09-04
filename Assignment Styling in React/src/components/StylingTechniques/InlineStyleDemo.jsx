import React, { useState } from 'react';
import { Sliders, Code, CheckCircle, Info } from 'lucide-react';

export default function InlineStyleDemo({ theme }) {
  const [bgColor, setBgColor] = useState('#4f46e5');
  const [textColor, setTextColor] = useState('#ffffff');
  const [padding, setPadding] = useState(20);
  const [borderRadius, setBorderRadius] = useState(12);
  const [fontSize, setFontSize] = useState(18);
  const [hasShadow, setHasShadow] = useState(true);

  // Dynamic JS Style Object
  const dynamicInlineStyle = {
    backgroundColor: bgColor,
    color: textColor,
    padding: `${padding}px`,
    borderRadius: `${borderRadius}px`,
    fontSize: `${fontSize}px`,
    fontWeight: '600',
    textAlign: 'center',
    boxShadow: hasShadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.25)' : 'none',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  };

  const cardContainerStyle = {
    backgroundColor: theme.cardBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: '1rem',
    padding: '1.75rem',
    boxShadow: theme.shadow,
  };

  const controlGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
    marginBottom: '1.5rem',
    backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
  };

  const codeBoxStyle = {
    backgroundColor: theme.mode === 'light' ? '#1e293b' : '#020617',
    color: '#38bdf8',
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.85rem',
    overflowX: 'auto',
    fontFamily: 'Fira Code, monospace',
    border: '1px solid #334155',
  };

  return (
    <div style={cardContainerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} color={theme.primary} /> Inline Styles Demonstration
        </h3>
        <span style={{
          backgroundColor: '#e0e7ff',
          color: '#3730a3',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          style={`{{ ... }}`}
        </span>
      </div>

      <p style={{ color: theme.textSecondary, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Inline styles in React are written as JavaScript objects with camelCase properties. They allow dynamic computation at runtime based on component state.
      </p>

      {/* Interactive Controls */}
      <div style={controlGroupStyle}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Background Color
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: '100%', height: '36px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Text Color
          </label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            style={{ width: '100%', height: '36px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Border Radius ({borderRadius}px)
          </label>
          <input
            type="range"
            min="0"
            max="30"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Font Size ({fontSize}px)
          </label>
          <input
            type="range"
            min="12"
            max="28"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Dynamic Element */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: theme.textSecondary }}>
          Live Rendered Inline Component:
        </p>
        <div style={dynamicInlineStyle}>
          🚀 Dynamic Inline Styled Container
        </div>
      </div>

      {/* Code Inspector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Code size={16} color={theme.textSecondary} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.textSecondary }}>Evaluated Style Object Code:</span>
        </div>
        <pre style={codeBoxStyle}>
{`<div style={{
  backgroundColor: "${bgColor}",
  color: "${textColor}",
  padding: "${padding}px",
  borderRadius: "${borderRadius}px",
  fontSize: "${fontSize}px",
  fontWeight: "600",
  boxShadow: "${hasShadow ? '0 10px 25px -5px rgba(0,0,0,0.25)' : 'none'}"
}}>
  🚀 Dynamic Inline Styled Container
</div>`}
        </pre>
      </div>
    </div>
  );
}
