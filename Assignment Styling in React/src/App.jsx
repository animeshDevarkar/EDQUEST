import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import styles from './styles/Layout.module.css';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InlineStyleDemo from './components/StylingTechniques/InlineStyleDemo';
import StyledCompDemo from './components/StylingTechniques/StyledCompDemo';
import EmotionDemo from './components/StylingTechniques/EmotionDemo';
import CssGridDemo from './components/StylingTechniques/CssGridDemo';
import ProjectGrid from './components/ProjectGrid';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const [themeMode, setThemeMode] = useState('light');
  const [activeTab, setActiveTab] = useState('demos');
  const [activeTechnique, setActiveTechnique] = useState('all');

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <div style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <div className={styles.container}>
          <Navbar
            themeMode={themeMode}
            toggleTheme={toggleTheme}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <main style={{ paddingTop: '1.5rem' }}>
            <HeroSection />

            <section id="demos" style={{ marginBottom: '4rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 className={styles.sectionTitle}>Styling Technique Interactive Demos</h2>
                <p className={styles.sectionSubtitle}>
                  Explore each React styling methodology with live interactive state controls and code inspection.
                </p>

                {/* Filter Tabs for Demos */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {[
                    { id: 'all', label: 'Show All Techniques' },
                    { id: 'inline', label: 'Inline Styles' },
                    { id: 'styled', label: 'Styled Components' },
                    { id: 'emotion', label: 'Emotion CSS-in-JS' },
                    { id: 'grid', label: 'CSS Modules & Grid' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTechnique(tab.id)}
                      style={{
                        padding: '0.45rem 1rem',
                        borderRadius: '9999px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: activeTechnique === tab.id ? `2px solid ${currentTheme.primary}` : `1px solid ${currentTheme.border}`,
                        backgroundColor: activeTechnique === tab.id ? currentTheme.primaryLight : currentTheme.cardBg,
                        color: activeTechnique === tab.id ? currentTheme.primary : currentTheme.textSecondary,
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.gridTwoColumns}>
                {(activeTechnique === 'all' || activeTechnique === 'inline') && (
                  <InlineStyleDemo theme={currentTheme} />
                )}
                {(activeTechnique === 'all' || activeTechnique === 'styled') && (
                  <StyledCompDemo theme={currentTheme} />
                )}
                {(activeTechnique === 'all' || activeTechnique === 'emotion') && (
                  <EmotionDemo theme={currentTheme} />
                )}
                {(activeTechnique === 'all' || activeTechnique === 'grid') && (
                  <CssGridDemo theme={currentTheme} />
                )}
              </div>
            </section>

            <ProjectGrid theme={currentTheme} />

            <ContactForm theme={currentTheme} />
          </main>

          <Footer theme={currentTheme} />
        </div>
      </div>
    </ThemeProvider>
  );
}
