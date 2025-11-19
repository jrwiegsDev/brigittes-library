const Book = require('../models/Book');
const { searchOpenLibrary, getBookByISBN } = require('../utils/openLibrary');

// @desc    Search Open Library API for books
// @route   GET /api/books/search
// @access  Private
const searchBooks = async (req, res, next) => {
  try {
    const { title, author } = req.query;

    if (!title && !author) {
      res.status(400);
      throw new Error('Please provide at least a title or author to search');
    }

    const results = await searchOpenLibrary(title, author);

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books with search/filter
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
  try {
    const {
      search,
      genre,
      author,
      minRating,
      maxRating,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    // Text search on title and author
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = new RegExp(genre, 'i');
    }

    // Filter by author
    if (author) {
      query.author = new RegExp(author, 'i');
    }

    // Filter by rating range
    if (minRating || maxRating) {
      query.brigittesRating = {};
      if (minRating) query.brigittesRating.$gte = parseFloat(minRating);
      if (maxRating) query.brigittesRating.$lte = parseFloat(maxRating);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('addedBy', 'username');

    // Get total count for pagination
    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      count: books.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'username');

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res, next) => {
  try {
    // Add the user who created the book
    req.body.addedBy = req.user._id;

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    await book.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchBooks,
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};
