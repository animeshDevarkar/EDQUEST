import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Layers, Sparkles, Code, Check } from 'lucide-react';

// Styled Components Definitions
const StyledCard = styled.div`
  background-color: ${(props) => props.theme.cardBg};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 1rem;
  padding: 1.75rem;
  box-shadow: ${(props) => props.theme.shadow};
  transition: all 0.3s ease;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.text};
`;

const StyledBadge = styled.span`
  background-color: ${(props) => (props.$primary ? props.theme.primaryLight : '#fef3c7')};
  color: ${(props) => (props.$primary ? props.theme.primary : '#d97706')};
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
`;

// Dynamic Props Button with styled-components
const CustomButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${(props) => (props.$size === 'lg' ? '0.85rem 1.75rem' : props.$size === 'sm' ? '0.4rem 0.85rem' : '0.65rem 1.25rem')};
  font-size: ${(props) => (props.$size === 'lg' ? '1rem' : props.$size === 'sm' ? '0.8rem' : '0.9rem')};
  font-weight: 600;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  /* Variant Driven Styling */
  ${(props) =>
    props.$variant === 'primary' &&
    css`
      background-color: ${props.theme.primary};
      color: #ffffff;
      border: 1px solid ${props.theme.primary};
      &:hover {
        background-color: ${props.theme.primaryHover};
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      }
    `}

  ${(props) =>
    props.$variant === 'outline' &&
    css`
      background-color: transparent;
      color: ${props.theme.text};
      border: 2px solid ${props.theme.border};
      &:hover {
        border-color: ${props.theme.primary};
        color: ${props.theme.primary};
        transform: translateY(-2px);
      }
    `}

  ${(props) =>
    props.$variant === 'gradient' &&
    css`
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: #ffffff;
      border: none;
      &:hover {
        opacity: 0.95;
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(6, 182, 212, 0.4);
      }
    `}

  /* Glowing Effect Prop */
  ${(props) =>
    props.$isGlowing &&
    css`
      animation: glowPulse 2s infinite alternate;
      @keyframes glowPulse {
        from {
          box-shadow: 0 0 5px rgba(99, 102, 241, 0.4);
        }
        to {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.9);
        }
      }
    `}
`;

// Style Extension: Extending CustomButton
const ExtendedSpecialButton = styled(CustomButton)`
  border-radius: 9999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export default function StyledCompDemo({ theme }) {
  const [variant, setVariant] = useState('primary');
  const [size, setSize] = useState('md');
  const [isGlowing, setIsGlowing] = useState(false);

  const codeSnippet = `const CustomButton = styled.button\`
  padding: \${props => props.$size === 'lg' ? '0.85rem' : '0.65rem'};
  background: \${props => props.$variant === 'primary' ? '${theme.primary}' : 'transparent'};
  color: \${props => props.$variant === 'primary' ? '#fff' : '${theme.text}'};
  border-radius: 0.6rem;

  \${props => props.$isGlowing && css\`
    animation: glowPulse 2s infinite alternate;
  \`}
\`;`;

  return (
    <StyledCard>
      <StyledHeader>
        <Title>
          <Layers size={20} color={theme.primary} /> Styled Components Demonstration
        </Title>
        <StyledBadge $primary={true}>styled-components</StyledBadge>
      </StyledHeader>

      <p style={{ color: theme.textSecondary, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Styled Components utilizes tagged template literals to write actual CSS in JS. Component styles automatically adapt based on React props and Theme Context.
      </p>

      {/* Interactive Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '1.5rem',
        backgroundColor: theme.mode === 'light' ? '#f1f5f9' : '#0f172a',
        padding: '1rem',
        borderRadius: '0.75rem'
      }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Button Variant
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['primary', 'outline', 'gradient'].map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '0.4rem',
                  border: variant === v ? '2px solid #6366f1' : '1px solid #cbd5e1',
                  backgroundColor: variant === v ? '#eef2ff' : 'transparent',
                  color: variant === v ? '#4f46e5' : theme.text,
                  cursor: 'pointer'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
            Button Size
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['sm', 'md', 'lg'].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '0.4rem',
                  border: size === s ? '2px solid #6366f1' : '1px solid #cbd5e1',
                  backgroundColor: size === s ? '#eef2ff' : 'transparent',
                  color: size === s ? '#4f46e5' : theme.text,
                  cursor: 'pointer'
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
          <input
            type="checkbox"
            id="glowingToggle"
            checked={isGlowing}
            onChange={(e) => setIsGlowing(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label htmlFor="glowingToggle" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            Enable Glowing Prop ($isGlowing)
          </label>
        </div>
      </div>

      {/* Rendered Styled Components */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <CustomButton $variant={variant} $size={size} $isGlowing={isGlowing}>
          <Sparkles size={16} /> Styled Button ({variant})
        </CustomButton>

        <ExtendedSpecialButton $variant="gradient" $size={size}>
          Extended Pill Button
        </ExtendedSpecialButton>
      </div>

      {/* Code Inspector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Code size={16} color={theme.textSecondary} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.textSecondary }}>Styled Components Source Code:</span>
        </div>
        <pre style={{
          backgroundColor: theme.mode === 'light' ? '#1e293b' : '#020617',
          color: '#a7f3d0',
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          overflowX: 'auto',
          fontFamily: 'Fira Code, monospace',
          border: '1px solid #334155',
        }}>
          {codeSnippet}
        </pre>
      </div>
    </StyledCard>
  );
}
