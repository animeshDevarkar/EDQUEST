import React, { useState } from 'react';
import styled from 'styled-components';
import { ExternalLink, Github, Tag, Eye, Filter } from 'lucide-react';

const ProjectsSection = styled.section`
  margin-top: 4rem;
  margin-bottom: 4rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterPill = styled.button`
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$active ? props.theme.primary : props.theme.border)};
  background-color: ${(props) => (props.$active ? props.theme.primaryLight : props.theme.cardBg)};
  color: ${(props) => (props.$active ? props.theme.primary : props.theme.textSecondary)};

  &:hover {
    border-color: ${(props) => props.theme.primary};
    color: ${(props) => props.theme.primary};
  }
`;

// Responsive CSS Grid for Projects
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background-color: ${(props) => props.theme.cardBg};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadow};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CardHeader = styled.div`
  height: 160px;
  background: ${(props) => props.$gradient || 'linear-gradient(135deg, #4f46e5, #06b6d4)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const TechTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 1rem;
  margin-bottom: 1.25rem;
`;

const TechTag = styled.span`
  background-color: ${(props) => props.theme.mode === 'light' ? '#f1f5f9' : '#0f172a'};
  color: ${(props) => props.theme.textSecondary};
  padding: 0.2rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${(props) => props.theme.border};
  margin-top: auto;
`;

const ActionLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${(props) => props.theme.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function ProjectGrid({ theme }) {
  const [filter, setFilter] = useState('All');

  const projects = [
    {
      id: 1,
      title: 'Responsive Dashboard UI',
      category: 'Styled Components',
      description: 'Fully responsive admin layout built using CSS Grid and styled-components dynamic themes.',
      tags: ['Styled Components', 'CSS Grid', 'Theme Context'],
      gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      emoji: '📊',
    },
    {
      id: 2,
      title: 'E-Commerce Showcase',
      category: 'Flexbox',
      description: 'Product catalog featuring dynamic inline price badges, cart drawer, and mobile swipe layouts.',
      tags: ['Inline Styles', 'Flexbox', 'UI/UX'],
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      emoji: '🛍️',
    },
    {
      id: 3,
      title: 'Interactive Animation Suite',
      category: 'Emotion',
      description: 'Smooth keyframe animations and interactive hover effects powered by Emotion CSS-in-JS.',
      tags: ['Emotion', 'Keyframes', 'CSS-in-JS'],
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      emoji: '✨',
    },
    {
      id: 4,
      title: 'Developer Portfolio',
      category: 'CSS Modules',
      description: 'Clean responsive developer portfolio showcasing CSS Modules with dark mode toggle.',
      tags: ['CSS Modules', 'Media Queries', 'Vite'],
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      emoji: '👨‍💻',
    },
  ];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <ProjectsSection id="portfolio">
      <SectionHeader>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: theme.text, letterSpacing: '-0.02em' }}>
            Responsive Project Gallery
          </h2>
          <p style={{ color: theme.textSecondary, marginTop: '0.25rem' }}>
            Demonstrating CSS Grid layout adaptability across viewport sizes
          </p>
        </div>

        <FilterGroup>
          {['All', 'Styled Components', 'Emotion', 'CSS Modules', 'Flexbox'].map((cat) => (
            <FilterPill
              key={cat}
              theme={theme}
              $active={filter === cat}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </FilterPill>
          ))}
        </FilterGroup>
      </SectionHeader>

      <GridContainer>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} theme={theme}>
            <CardHeader $gradient={project.gradient}>
              <span>{project.emoji}</span>
            </CardHeader>

            <CardBody>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: theme.text, marginBottom: '0.5rem' }}>
                {project.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: theme.textSecondary, lineHeight: 1.5 }}>
                {project.description}
              </p>

              <TechTagList>
                {project.tags.map((tag) => (
                  <TechTag key={tag} theme={theme}>
                    #{tag}
                  </TechTag>
                ))}
              </TechTagList>

              <CardFooter theme={theme}>
                <ActionLink href="#" theme={theme}>
                  <Eye size={16} /> Live Demo
                </ActionLink>
                <ActionLink href="#" theme={theme}>
                  <Github size={16} /> Code
                </ActionLink>
              </CardFooter>
            </CardBody>
          </ProjectCard>
        ))}
      </GridContainer>
    </ProjectsSection>
  );
}
