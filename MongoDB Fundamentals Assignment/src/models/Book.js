const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      index: true
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: [true, 'Author reference is required'],
      index: true
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, 'Genre reference is required'],
      index: true
    },
    publishedYear: {
      type: Number,
      required: [true, 'Published year is required'],
      index: true
    },
    pages: {
      type: Number,
      min: [1, 'Pages must be greater than 0']
    },
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, 'Available copies cannot be negative']
    },
    totalCopies: {
      type: Number,
      default: 1,
      min: [1, 'Total copies must be at least 1']
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.0
    },
    tags: [{ type: String, trim: true }],
    summary: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create compound index and full-text index for fast search queries
bookSchema.index({ title: 'text', summary: 'text' });
bookSchema.index({ genre: 1, publishedYear: -1 });

module.exports = mongoose.model('Book', bookSchema);
