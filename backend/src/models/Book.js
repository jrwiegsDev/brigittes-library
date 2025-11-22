const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: 500
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: 200
  },
  genre: {
    type: String,
    trim: true,
    maxlength: 100
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 1
  },
  isbn: {
    type: String,
    trim: true,
    sparse: true, // Allows multiple null values but enforces uniqueness for non-null
    default: null,
    match: [/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits']
  },
  coverImage: {
    type: String,
    trim: true
  },
  brigittesRating: {
    type: Number,
    min: 0,
    max: 10,
    default: null
  },
  brigittesNotes: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  pageCount: {
    type: Number,
    min: 1
  },
  status: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'read'],
    default: 'want-to-read'
  },
  dateStarted: {
    type: Date
  },
  dateFinished: {
    type: Date
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for search and filter performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ brigittesRating: 1 });
bookSchema.index({ tags: 1 });

module.exports = mongoose.model('Book', bookSchema);
