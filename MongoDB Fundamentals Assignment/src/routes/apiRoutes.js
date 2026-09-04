const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Authors Routes
router.get('/authors', libraryController.getAuthors);
router.get('/authors/:id', libraryController.getAuthorById);
router.post('/authors', libraryController.createAuthor);
router.put('/authors/:id', libraryController.updateAuthor);
router.delete('/authors/:id', libraryController.deleteAuthor);

// Genres Routes
router.get('/genres', libraryController.getGenres);
router.post('/genres', libraryController.createGenre);

// Books Routes
router.get('/books', libraryController.getBooks);
router.get('/books/:id', libraryController.getBookById);
router.post('/books', libraryController.createBook);
router.put('/books/:id', libraryController.updateBook);
router.delete('/books/:id', libraryController.deleteBook);

// Aggregation Stats Routes
router.get('/analytics/genres', libraryController.getGenreStats);
router.get('/analytics/authors', libraryController.getAuthorStats);

module.exports = router;
