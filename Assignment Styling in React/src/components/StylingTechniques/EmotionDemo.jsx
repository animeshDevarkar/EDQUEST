/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Sparkles, Flame, Code, Zap } from 'lucide-react';

// Emotion Keyframes
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
`;

// Emotion Styled Component
const EmotionCardContainer = styled.div`
  background-color: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: ${(props) => props.theme.shadow};
`;

export default function EmotionDemo({ theme }) {
  const [isAnimated, setIsAnimated] = useState(true);
  const [activeColor, setActiveColor] = useState('#ec4899');

  // Dynamic Emotion object styles via css prop
  const emotionObjectStyle = css({
    padding: '1.25rem',
    borderRadius: '0.75rem',
    background: `linear-gradient(135deg, ${activeColor} 0%, #8b5cf6 100%)`,
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: isAnimated ? `${bounceAnimation} 3s ease-in-out infinite` : 'none',
    '&:hover': {
      filter: 'brightness(1.1)',
      transform: 'translateY(-4px)',
    },
  });

  const emotionPulseStyle = css`
    padding: 0.85rem 1.5rem;
    border-radius: 9999px;
    background-color: #10b981;
    color: white;
    font-weight: 700;
    border: none;
    cursor: pointer;
    animation: ${isAnimated ? `${pulseGlow} 2s infinite` : 'none'};
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  `;

  return (
    <EmotionCardContainer theme={theme}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={20} color="#ec4899" /> Emotion CSS-in-JS Demonstration
        </h3>
        <span style={{
          backgroundColor: '#fce7f3',
          color: '#be185d',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          @emotion/react
        </span>
      </div>

      <p style={{ color: theme.textSecondary, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Emotion provides high-performance CSS-in-JS with flexible object styles, tagged template literals, keyframes, and the <code>css</code> prop.
      </p>

      {/* Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1.25rem',
        marginBottom: '1.5rem',
        backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0f172a',
        padding: '1rem',
        borderRadius: '0.75rem'
      }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Accent Color
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['#ec4899', '#f59e0b', '#3b82f6', '#10b981'].map((c) => (
              <button
                key={c}
                onClick={() => setActiveColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: activeColor === c ? '3px solid #ffffff' : 'none',
                  boxShadow: activeColor === c ? '0 0 0 2px #6366f1' : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
          <input
            type="checkbox"
            id="emotionAnimToggle"
            checked={isAnimated}
            onChange={(e) => setIsAnimated(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="emotionAnimToggle" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            Enable Keyframe Animations
          </label>
        </div>
      </div>

      {/* Rendered Emotion Elements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div css={emotionObjectStyle}>
          <Flame size={20} /> Emotion Object CSS Banner
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button css={emotionPulseStyle}>
            <Zap size={18} /> Emotion Keyframe Pulse
          </button>
        </div>
      </div>

      {/* Code Inspector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Code size={16} color={theme.textSecondary} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.textSecondary }}>Emotion Code Snippet:</span>
        </div>
        <pre style={{
          backgroundColor: theme.mode === 'light' ? '#1e293b' : '#020617',
          color: '#f472b6',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          overflowX: 'auto',
          fontFamily: 'Fira Code, monospace',
          border: '1px solid #334155',
        }}>
{`// Keyframe Definition
const pulseGlow = keyframes\`
  0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
  100% { box-shadow: 0 0 0 15px rgba(236, 72, 153, 0); }
\`;

// CSS Object style via JSX css prop
<div css={css({
  background: 'linear-gradient(135deg, ${activeColor}, #8b5cf6)',
  animation: '\${bounceAnimation} 3s ease-in-out infinite'
})}>
  <Flame size={20} /> Emotion Banner
</div>`}
        </pre>
      </div>
    </EmotionCardContainer>
  );
}
