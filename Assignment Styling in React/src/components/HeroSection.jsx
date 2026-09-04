import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Sparkles, Layers, LayoutGrid, Paintbrush, ArrowRight } from 'lucide-react';

const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const HeroContainer = styled.section`
  padding: 4rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: ${(props) => props.theme.heroGradient};
  color: #ffffff;
  box-shadow: 0 20px 25px -5px rgba(79, 70, 229, 0.25);
  margin-bottom: 3.5rem;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: ${floatAnim} 4s ease-in-out infinite;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  max-width: 720px;
  margin: 0 auto 2.5rem;
  opacity: 0.92;
  font-weight: 400;
`;

const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const SkillPill = styled.span`
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.9rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

export default function HeroSection() {
  return (
    <HeroContainer>
      <HeroBadge>
        <Sparkles size={16} /> React Styling Masterclass Assignment
      </HeroBadge>
      <HeroTitle>Exploring Modern React Styling Paradigms</HeroTitle>
      <HeroSubtitle>
        From standard inline styles & CSS Modules to Styled Components, Emotion CSS-in-JS, and fully responsive Flexbox & CSS Grid layouts.
      </HeroSubtitle>
      <BadgeGrid>
        <SkillPill><Paintbrush size={14} /> Inline Styles</SkillPill>
        <SkillPill><Layers size={14} /> Styled Components</SkillPill>
        <SkillPill><Sparkles size={14} /> Emotion CSS-in-JS</SkillPill>
        <SkillPill><LayoutGrid size={14} /> CSS Modules & Grid</SkillPill>
        <SkillPill><ArrowRight size={14} /> Responsive UI/UX</SkillPill>
      </BadgeGrid>
    </HeroContainer>
  );
}
