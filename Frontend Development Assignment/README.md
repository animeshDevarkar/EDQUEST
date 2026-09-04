# Frontend Development Project — Personal Developer Portfolio

Welcome to the **Frontend Development Project** assignment submission! This project is a modern, responsive personal developer portfolio website designed to showcase proficiency in **HTML5**, **CSS3 (Flexbox & CSS Grid)**, and **JavaScript (ES6+)**.

---

## 🌟 Overview & Features

The webpage provides a professional, interactive showcase for a frontend engineer, incorporating responsive web design principles and accessibility standards.

### Key Features
1. **Semantic HTML5 Architecture**:
   - Structured with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` elements.
   - Accessible form controls with explicit labels, custom submit buttons, SVG vector graphics, and modal dialog containers.

2. **CSS3 Styling & Layout Systems**:
   - **CSS Flexbox**: Used for header navigation, action button groups, tag badges, and feature rows.
   - **CSS Grid**: Powers the responsive Projects Showcase grid (`repeat(auto-fill, minmax(280px, 1fr))`), Skills grid, and Stats counter grid.
   - **CSS Custom Variables (`:root` & `[data-theme="light"]`)**: Dynamic color tokens allowing seamless switching between Dark Mode and Light Mode.
   - **Responsive Breakpoints**: Media queries tailored for Desktop (>1024px), Tablet (768px - 1024px), and Mobile (<768px) screens.
   - **Micro-Interactions**: Hover elevation transforms, keyframe progress bar fills, glassmorphism backdrop blurs, and pulse dot indicators.

3. **Vanilla JavaScript (ES6+) Interactivity**:
   - **Theme Switching**: Toggle between dark and light themes with `localStorage` state persistence and system preference fallback (`prefers-color-scheme`).
   - **Project Search & Category Filtering**: Real-time client-side DOM filtering by category buttons (`All`, `Web UI`, `JavaScript App`, `Full-Stack`) and search query string matching.
   - **Interactive Detail Modals**: View technical project breakdowns in a popup modal with keyboard shortcut (`Escape`) and backdrop click dismissals.
   - **Form Validation & Feedback**: Real-time field validation (name min 2 chars, valid email pattern, message min 10 chars) with floating error state indicators and toast alert notifications.
   - **IntersectionObserver Animated Stats**: Triggers number count-up animations when the stats section scrolls into viewport.
   - **Mobile Drawer Menu**: Smooth mobile navigation menu drawer toggle.

---

## 🎨 Figma Mockup & Design System Concept

```
+-----------------------------------------------------------------------+
|  <Animesh/>        About    Skills    Projects    Experience  [🌙/☀️] |  <-- Sticky Navbar
+-----------------------------------------------------------------------+
|  [● Available]                                                        |
|  Crafting Modern, Responsive & Interactive Web Experiences            |  <-- Hero Header
|  [Explore Projects]  [Get In Touch]        +-----------------------+  |
|                                            | developer.js Terminal |  |
+-----------------------------------------------------------------------+
|  ABOUT ME                                                             |
|  +-----------------------------------+  +--------------------------+  |
|  | Bio & UX Development Philosophy   |  | Profile Card (Avatar/Info) |  |  <-- About Section
|  +-----------------------------------+  +--------------------------+  |
+-----------------------------------------------------------------------+
|  TECHNICAL EXPERTISE (HTML5, CSS Flexbox/Grid, JS ES6+, Git/Express)  |  <-- Skills Section
+-----------------------------------------------------------------------+
|  STATS COUNTER (15+ Projects | 100% Responsive | 6 Skills | 99% Code) |  <-- Stats Bar
+-----------------------------------------------------------------------+
|  PROJECTS SHOWCASE                                                    |
|  [All] [Web UI] [JavaScript App] [Full-Stack]      [🔍 Search...]     |
|  +------------------+  +------------------+  +------------------+    |  <-- Projects Grid
|  | Portfolio Site   |  | React Dashboard  |  | Express REST API |    |
|  +------------------+  +------------------+  +------------------+    |
+-----------------------------------------------------------------------+
|  GET IN TOUCH (Interactive Contact Form with Validation)              |  <-- Contact Section
+-----------------------------------------------------------------------+
|  © 2026 Animesh Devarkar — EDQUEST Monorepo                           |  <-- Footer
+-----------------------------------------------------------------------+
```

---

## 📁 Directory Structure

```text
Frontend Development Assignment/
├── index.html        # Semantic HTML5 page structure & sections
├── styles.css        # CSS Flexbox, Grid, theme variables, & media queries
├── script.js        # Interactive JS engine (filter, search, modal, theme, form)
└── README.md         # Assignment documentation & submission guidelines
```

---

## 🚀 How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/animeshDevarkar/EDQUEST.git
   cd EDQUEST/"Frontend Development Assignment"
   ```

2. **Open in Browser**:
   - Double-click `index.html` or open it with Live Server in VS Code / Antigravity IDE.
   - Alternatively, serve via any static HTTP server:
     ```bash
     npx serve .
     ```

---

## 📝 Submission Metadata

- **Assignment Title**: `Frontend Development Project — Personal Developer Portfolio`
- **GitHub Repository**: [https://github.com/animeshDevarkar/EDQUEST](https://github.com/animeshDevarkar/EDQUEST)
- **Direct Directory**: `Frontend Development Assignment/`
