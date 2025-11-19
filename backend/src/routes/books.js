const express = require('express');
const router = express.Router();
const {
  searchBooks,
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');
const {
  createBookValidation,
  updateBookValidation,
  bookQueryValidation,
  idValidation
} = require('../middleware/validators');

// Public routes
router.get('/', bookQueryValidation, getBooks);
router.get('/:id', idValidation, getBook);

// Protected routes
router.get('/api/search', protect, searchBooks); // Open Library search
router.post('/', protect, createBookValidation, createBook);
router.put('/:id', protect, updateBookValidation, updateBook);
router.delete('/:id', protect, idValidation, deleteBook);

module.exports = router;
