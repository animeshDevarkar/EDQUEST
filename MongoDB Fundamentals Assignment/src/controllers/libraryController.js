const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Book = require('../models/Book');

// -----------------------------------------------------------------
// AUTHORS CONTROLLERS
// -----------------------------------------------------------------
exports.getAuthors = async (req, res) => {
  try {
    const { nationality, search } = req.query;
    let query = {};

    if (nationality) {
      query.nationality = { $regex: new RegExp(nationality, 'i') };
    }
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { bio: { $regex: new RegExp(search, 'i') } }
      ];
    }

    const authors = await Author.find(query).sort({ name: 1 });
    res.json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, data: author });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    // Also clear books associated with author or set null
    await Book.deleteMany({ author: req.params.id });
    res.json({ success: true, message: 'Author and associated books deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------------------------
// GENRES CONTROLLERS
// -----------------------------------------------------------------
exports.getGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json({ success: true, count: genres.length, data: genres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const genre = await Genre.create(req.body);
    res.status(201).json({ success: true, data: genre });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------------------------
// BOOKS CONTROLLERS
// -----------------------------------------------------------------
exports.getBooks = async (req, res) => {
  try {
    const { genre, author, search, minYear, maxYear, availableOnly } = req.query;
    let query = {};

    if (genre) query.genre = genre;
    if (author) query.author = author;

    if (minYear || maxYear) {
      query.publishedYear = {};
      if (minYear) query.publishedYear.$gte = parseInt(minYear, 10);
      if (maxYear) query.publishedYear.$lte = parseInt(maxYear, 10);
    }

    if (availableOnly === 'true') {
      query.availableCopies = { $gt: 0 };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { summary: { $regex: new RegExp(search, 'i') } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const books = await Book.find(query)
      .populate('author', 'name nationality')
      .populate('genre', 'name targetAudience')
      .sort({ title: 1 });

    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author')
      .populate('genre');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    const populatedBook = await Book.findById(book._id)
      .populate('author', 'name')
      .populate('genre', 'name');
    res.status(201).json({ success: true, data: populatedBook });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name').populate('genre', 'name');

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------------------------
// AGGREGATION CONTROLLERS (ANALYTICS)
// -----------------------------------------------------------------
exports.getGenreStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $lookup: {
          from: 'genres',
          localField: 'genre',
          foreignField: '_id',
          as: 'genreDetails'
        }
      },
      { $unwind: '$genreDetails' },
      {
        $group: {
          _id: '$genreDetails.name',
          totalBooks: { $sum: 1 },
          totalCopies: { $sum: '$totalCopies' },
          availableCopies: { $sum: '$availableCopies' },
          avgRating: { $avg: '$rating' },
          avgPages: { $avg: '$pages' }
        }
      },
      {
        $project: {
          genreName: '$_id',
          totalBooks: 1,
          totalCopies: 1,
          availableCopies: 1,
          avgRating: { $round: ['$avgRating', 2] },
          avgPages: { $round: ['$avgPages', 0] }
        }
      },
      { $sort: { totalBooks: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuthorStats = async (req, res) => {
  try {
    const stats = await Author.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'authoredBooks'
        }
      },
      {
        $project: {
          name: 1,
          nationality: 1,
          birthYear: 1,
          bookCount: { $size: '$authoredBooks' },
          avgBookRating: { $avg: '$authoredBooks.rating' }
        }
      },
      { $sort: { bookCount: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
