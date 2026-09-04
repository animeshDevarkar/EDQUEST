/**
 * Frontend Development Assignment — Interactive JavaScript Engine
 * Features: Dark/Light Theme Switching, Project Filtering & Search,
 * Modal Popups, Real-Time Form Validation, Stats Counter Animation & Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Theme Switcher (LocalStorage Persistence & System Detection)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Initialize theme from LocalStorage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = htmlElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  });

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer Toggle
     -------------------------------------------------------------------------- */
  const menuToggleBtn = document.getElementById('menu-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggleBtn.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });

  // Close mobile drawer when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
    });
  });

  /* --------------------------------------------------------------------------
     3. Active Navigation Link Highlighting on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Scroll to Top Button Visibility
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  document.getElementById('scroll-top-btn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --------------------------------------------------------------------------
     4. Projects Showcase Filtering & Real-Time Search
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('project-search');
  const noProjectsMsg = document.getElementById('no-projects');
  const resetFiltersBtn = document.getElementById('reset-filters');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const tags = card.getAttribute('data-tags').toLowerCase();
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const desc = card.querySelector('.project-desc').textContent.toLowerCase();

      const matchesCategory = (currentCategory === 'all' || category === currentCategory);
      const matchesSearch = searchQuery === '' || 
                            title.includes(searchQuery) || 
                            desc.includes(searchQuery) || 
                            tags.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      noProjectsMsg.classList.remove('hidden');
    } else {
      noProjectsMsg.classList.add('hidden');
    }
  }

  // Filter Button Click Events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterProjects();
    });
  });

  // Search Input Event
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    filterProjects();
  });

  // Reset Filters Handler
  resetFiltersBtn.addEventListener('click', () => {
    currentCategory = 'all';
    searchQuery = '';
    searchInput.value = '';
    filterBtns.forEach(b => b.classList.remove('active'));
    filterBtns[0].classList.add('active');
    filterProjects();
  });

  /* --------------------------------------------------------------------------
     5. Project Details Interactive Modal Dialog
     -------------------------------------------------------------------------- */
  const projectData = {
    '1': {
      title: 'Frontend Developer Portfolio',
      category: 'Web UI',
      desc: 'A responsive developer portfolio built using HTML5 semantic elements, CSS Custom Variables, Flexbox, CSS Grid layouts, and Vanilla JS interactivity.',
      highlights: [
        'Semantic HTML5 structure (<header>, <main>, <section>, <article>, <footer>)',
        'CSS Custom Properties (Variables) enabling dark & light theme modes',
        'Responsive layouts with CSS Flexbox & CSS Grid for all viewport breakpoints',
        'Interactive project search filtering, modal details, and real-time form validation'
      ],
      tags: ['HTML5', 'CSS Grid', 'Flexbox', 'JavaScript ES6+', 'Responsive Design']
    },
    '2': {
      title: 'Interactive UI Development Dashboard',
      category: 'JavaScript App',
      desc: 'Single-page React dashboard built with component modularity, state management, custom hooks, and dynamic data filtering.',
      highlights: [
        'Component-driven architecture using functional components & React Hooks',
        'Client-side state management for live data updates',
        'Dynamic search and categorical filtering with instant feedback',
        'Responsive dashboard layout with CSS Grid'
      ],
      tags: ['React.js', 'State Management', 'Custom Hooks', 'CSS Grid', 'Vite']
    },
    '3': {
      title: 'Express.js Production REST API & Dashboard',
      category: 'Full-Stack',
      desc: 'Scalable backend API service built with Express.js featuring authentication middlewares, rate limiting, error handling, and web client integration.',
      highlights: [
        'Modular Express routes, controllers, and services architecture',
        'Robust middleware layer for authentication, validation, logging, and rate limiting',
        'Comprehensive error handling middleware and structured JSON responses',
        'Integrated HTML/JS web dashboard for REST API interaction'
      ],
      tags: ['Express.js', 'Node.js', 'REST API', 'Middleware', 'JavaScript']
    },
    '4': {
      title: 'MongoDB & Mongoose Digital Library System',
      category: 'Full-Stack',
      desc: 'Database system modeling complex relationships between Authors, Books, and Genres, featuring MongoDB seed scripts and query aggregations.',
      highlights: [
        'Mongoose Schema design with validation, virtual fields, and index optimization',
        'MongoDB aggregation pipelines for multi-collection analytical queries',
        'Automated database seed scripts with synthetic data generation',
        'Full REST API endpoints connected to web frontend dashboard'
      ],
      tags: ['MongoDB', 'Mongoose', 'Aggregation', 'Node.js', 'Database']
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalCloseBtnBottom = document.getElementById('modal-close-btn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;

    // Highlights list
    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

    // Tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('');

    modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      openModal(projId);
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseBtnBottom.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalBackdrop.classList.contains('hidden')) {
      closeModal();
    }
  });

  /* --------------------------------------------------------------------------
     6. Stats Animated Counter (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      let current = 0;
      const increment = Math.ceil(target / 40);

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = current;
        }
      }, 30);
    });
  }

  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------------------------
     7. Skill Progress Bars Animation (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const skillsSection = document.getElementById('skills');
  const progressFills = document.querySelectorAll('.progress-fill');

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width;
          });
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  }

  /* --------------------------------------------------------------------------
     8. Real-Time Contact Form Validation & Toast Handling
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateInput(input, errorElement, validationFn) {
    const isValid = validationFn(input.value.trim());
    const formGroup = input.closest('.form-group');

    if (!isValid) {
      formGroup.classList.add('error');
    } else {
      formGroup.classList.remove('error');
    }
    return isValid;
  }

  nameInput.addEventListener('blur', () => {
    validateInput(nameInput, null, val => val.length >= 2);
  });

  emailInput.addEventListener('blur', () => {
    validateInput(emailInput, null, val => validateEmail(val));
  });

  messageInput.addEventListener('blur', () => {
    validateInput(messageInput, null, val => val.length >= 10);
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateInput(nameInput, null, val => val.length >= 2);
    const isEmailValid = validateInput(emailInput, null, val => validateEmail(val));
    const isMessageValid = validateInput(messageInput, null, val => val.length >= 10);

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simulate form submission
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.', 'success');
      }, 1200);
    } else {
      showToast('Please fix the errors in the form before submitting.', 'error');
    }
  });

  /* --------------------------------------------------------------------------
     9. Toast Notification Handler
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

});
