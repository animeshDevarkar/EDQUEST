document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api';

  // DOM Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const booksGrid = document.getElementById('books-grid');
  const authorsGrid = document.getElementById('authors-grid');
  const genreFilter = document.getElementById('genre-filter');
  const authorFilter = document.getElementById('author-filter');
  const searchInput = document.getElementById('search-input');
  const minYearInput = document.getElementById('min-year');
  const maxYearInput = document.getElementById('max-year');
  const availableFilter = document.getElementById('available-filter');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const booksCountBadge = document.getElementById('books-count-badge');

  // Modal Elements
  const bookModal = document.getElementById('book-modal');
  const bookForm = document.getElementById('book-form');
  const openAddBookBtn = document.getElementById('open-add-book-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const modalTitle = document.getElementById('modal-title');
  const bookAuthorSelect = document.getElementById('book-author');
  const bookGenreSelect = document.getElementById('book-genre');

  // Tab Navigation
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'analytics-tab') {
        loadAnalytics();
      } else if (targetTab === 'authors-tab') {
        loadAuthors();
      }
    });
  });

  // Initial Load
  init();

  async function init() {
    await Promise.all([loadGenres(), loadAuthorsDropdown()]);
    await loadBooks();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Search & Filters
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadBooks, 300);
    });

    genreFilter.addEventListener('change', loadBooks);
    authorFilter.addEventListener('change', loadBooks);
    minYearInput.addEventListener('change', loadBooks);
    maxYearInput.addEventListener('change', loadBooks);
    availableFilter.addEventListener('change', loadBooks);

    resetFiltersBtn.addEventListener('click', () => {
      searchInput.value = '';
      genreFilter.value = '';
      authorFilter.value = '';
      minYearInput.value = '';
      maxYearInput.value = '';
      availableFilter.checked = false;
      loadBooks();
    });

    // Modal Events
    openAddBookBtn.addEventListener('click', () => openBookModal());
    closeModalBtn.addEventListener('click', closeBookModal);
    cancelModalBtn.addEventListener('click', closeBookModal);
    bookForm.addEventListener('submit', handleBookFormSubmit);
  }

  // Load Genres
  async function loadGenres() {
    try {
      const res = await fetch(`${API_BASE}/genres`);
      const result = await res.json();
      if (result.success) {
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        bookGenreSelect.innerHTML = '<option value="">Select Genre</option>';
        result.data.forEach(g => {
          genreFilter.innerHTML += `<option value="${g._id}">${g.name}</option>`;
          bookGenreSelect.innerHTML += `<option value="${g._id}">${g.name}</option>`;
        });
      }
    } catch (err) {
      console.error('Error loading genres:', err);
    }
  }

  // Load Authors for Dropdown
  async function loadAuthorsDropdown() {
    try {
      const res = await fetch(`${API_BASE}/authors`);
      const result = await res.json();
      if (result.success) {
        authorFilter.innerHTML = '<option value="">All Authors</option>';
        bookAuthorSelect.innerHTML = '<option value="">Select Author</option>';
        result.data.forEach(a => {
          authorFilter.innerHTML += `<option value="${a._id}">${a.name}</option>`;
          bookAuthorSelect.innerHTML += `<option value="${a._id}">${a.name}</option>`;
        });
      }
    } catch (err) {
      console.error('Error loading authors dropdown:', err);
    }
  }

  // Load Books with Filters
  async function loadBooks() {
    try {
      const params = new URLSearchParams();
      if (searchInput.value.trim()) params.append('search', searchInput.value.trim());
      if (genreFilter.value) params.append('genre', genreFilter.value);
      if (authorFilter.value) params.append('author', authorFilter.value);
      if (minYearInput.value) params.append('minYear', minYearInput.value);
      if (maxYearInput.value) params.append('maxYear', maxYearInput.value);
      if (availableFilter.checked) params.append('availableOnly', 'true');

      const res = await fetch(`${API_BASE}/books?${params.toString()}`);
      const result = await res.json();

      if (result.success) {
        booksCountBadge.textContent = result.count;
        renderBooks(result.data);
      }
    } catch (err) {
      console.error('Error loading books:', err);
      booksGrid.innerHTML = `<div class="error-msg">Failed to load books from server.</div>`;
    }
  }

  // Render Books Grid
  function renderBooks(books) {
    if (books.length === 0) {
      booksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem;">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <p>No books match your query criteria.</p>
        </div>`;
      return;
    }

    booksGrid.innerHTML = books.map(book => `
      <div class="book-card">
        <div>
          <h4 class="book-title">${escapeHtml(book.title)}</h4>
          <div class="book-meta">
            <span><i class="fa-solid fa-user"></i> ${escapeHtml(book.author ? book.author.name : 'Unknown')}</span> &bull; 
            <span><i class="fa-solid fa-bookmark"></i> ${escapeHtml(book.genre ? book.genre.name : 'General')}</span> &bull; 
            <span><i class="fa-solid fa-calendar"></i> ${book.publishedYear}</span>
          </div>
          <p class="book-summary">${escapeHtml(book.summary || 'No summary available.')}</p>
          <div class="book-tags">
            ${(book.tags || []).map(t => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>

        <div class="book-footer">
          <div>
            <span style="color: var(--accent-gold); font-weight: 600;">
              <i class="fa-solid fa-star"></i> ${book.rating}
            </span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">
              Copies: ${book.availableCopies}/${book.totalCopies}
            </span>
          </div>
          <div class="card-actions">
            <button class="icon-btn" onclick="window.editBook('${book._id}')" title="Edit Book">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="icon-btn delete" onclick="window.deleteBook('${book._id}')" title="Delete Book">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load Authors Directory
  async function loadAuthors() {
    try {
      const res = await fetch(`${API_BASE}/authors`);
      const result = await res.json();
      if (result.success) {
        authorsGrid.innerHTML = result.data.map(author => `
          <div class="book-card">
            <div>
              <h4 class="book-title">${escapeHtml(author.name)}</h4>
              <div class="book-meta">
                <span><i class="fa-solid fa-earth-americas"></i> ${escapeHtml(author.nationality || 'N/A')}</span> &bull; 
                <span>Born: ${author.birthYear || 'N/A'}</span>
              </div>
              <p class="book-summary">${escapeHtml(author.bio || 'No bio available.')}</p>
              <div class="book-tags" style="margin-top: 10px;">
                ${(author.awards || []).map(a => `<span class="tag" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold);"><i class="fa-solid fa-trophy"></i> ${escapeHtml(a)}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Error loading authors:', err);
    }
  }

  // Load Aggregation Analytics
  async function loadAnalytics() {
    try {
      const [resGenres, resAuthors] = await Promise.all([
        fetch(`${API_BASE}/analytics/genres`),
        fetch(`${API_BASE}/analytics/authors`)
      ]);

      const genreData = await resGenres.json();
      const authorData = await resAuthors.json();

      if (genreData.success) {
        document.getElementById('genre-analytics-list').innerHTML = genreData.data.map(g => `
          <div class="stat-item">
            <div>
              <strong style="color: #fff;">${escapeHtml(g.genreName)}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Avg Rating: ${g.avgRating} ★ | Avg Pages: ${g.avgPages}</div>
            </div>
            <div>
              <span class="badge" style="background: var(--accent-blue);">${g.totalBooks} Titles</span>
              <span class="badge">${g.totalCopies} Copies</span>
            </div>
          </div>
        `).join('');
      }

      if (authorData.success) {
        document.getElementById('author-analytics-list').innerHTML = authorData.data.map(a => `
          <div class="stat-item">
            <div>
              <strong style="color: #fff;">${escapeHtml(a.name)}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(a.nationality)}</div>
            </div>
            <div>
              <span class="badge" style="background: var(--primary-color);">${a.bookCount} Books</span>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  }

  // Modal Helpers
  function openBookModal(book = null) {
    bookForm.reset();
    if (book) {
      modalTitle.textContent = 'Edit Book';
      document.getElementById('book-id').value = book._id;
      document.getElementById('book-title').value = book.title;
      document.getElementById('book-isbn').value = book.isbn;
      document.getElementById('book-year').value = book.publishedYear;
      document.getElementById('book-author').value = book.author ? (book.author._id || book.author) : '';
      document.getElementById('book-genre').value = book.genre ? (book.genre._id || book.genre) : '';
      document.getElementById('book-pages').value = book.pages || '';
      document.getElementById('book-available').value = book.availableCopies;
      document.getElementById('book-total').value = book.totalCopies;
      document.getElementById('book-tags').value = (book.tags || []).join(', ');
      document.getElementById('book-summary').value = book.summary || '';
    } else {
      modalTitle.textContent = 'Add New Book';
      document.getElementById('book-id').value = '';
    }
    bookModal.classList.add('open');
  }

  function closeBookModal() {
    bookModal.classList.remove('open');
  }

  async function handleBookFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('book-id').value;
    const payload = {
      title: document.getElementById('book-title').value.trim(),
      isbn: document.getElementById('book-isbn').value.trim(),
      publishedYear: parseInt(document.getElementById('book-year').value, 10),
      author: document.getElementById('book-author').value,
      genre: document.getElementById('book-genre').value,
      pages: parseInt(document.getElementById('book-pages').value, 10) || 100,
      availableCopies: parseInt(document.getElementById('book-available').value, 10) || 1,
      totalCopies: parseInt(document.getElementById('book-total').value, 10) || 1,
      tags: document.getElementById('book-tags').value.split(',').map(t => t.trim()).filter(Boolean),
      summary: document.getElementById('book-summary').value.trim()
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE}/books/${id}` : `${API_BASE}/books`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        closeBookModal();
        loadBooks();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (err) {
      console.error('Error saving book:', err);
    }
  }

  // Global Actions
  window.editBook = async function (id) {
    try {
      const res = await fetch(`${API_BASE}/books/${id}`);
      const result = await res.json();
      if (result.success) {
        openBookModal(result.data);
      }
    } catch (err) {
      console.error('Error fetching book:', err);
    }
  };

  window.deleteBook = async function (id) {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          loadBooks();
        }
      } catch (err) {
        console.error('Error deleting book:', err);
      }
    }
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
