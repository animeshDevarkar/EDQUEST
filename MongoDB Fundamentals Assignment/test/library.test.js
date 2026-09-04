const assert = require('assert');
const { connectDB, disconnectDB } = require('../src/config/db');
const Author = require('../src/models/Author');
const Genre = require('../src/models/Genre');
const Book = require('../src/models/Book');

async function runTests() {
  console.log(' Starting MongoDB Library System Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(` ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(` ❌ FAIL: ${name}`);
      console.error(err);
      failed++;
    }
  }

  try {
    await connectDB();

    // Reset Database for testing
    await Author.deleteMany({});
    await Genre.deleteMany({});
    await Book.deleteMany({});

    let authorId, genreId, bookId;

    // Test 1: Author Creation
    await test('Create Author Document', async () => {
      const author = await Author.create({
        name: 'J.R.R. Tolkien',
        bio: 'English writer, poet, philologist, and academic.',
        birthYear: 1892,
        nationality: 'British',
        awards: ['Locus Award']
      });
      assert.strictEqual(author.name, 'J.R.R. Tolkien');
      assert.strictEqual(author.nationality, 'British');
      authorId = author._id;
    });

    // Test 2: Genre Creation
    await test('Create Genre Document', async () => {
      const genre = await Genre.create({
        name: 'High Fantasy',
        description: 'Subgenre of fantasy set in an epic fictional world.',
        targetAudience: 'General'
      });
      assert.strictEqual(genre.name, 'High Fantasy');
      genreId = genre._id;
    });

    // Test 3: Book Creation with References
    await test('Create Book Document with References & Indexes', async () => {
      const book = await Book.create({
        title: 'The Hobbit',
        isbn: '978-0261102217',
        author: authorId,
        genre: genreId,
        publishedYear: 1937,
        pages: 310,
        availableCopies: 4,
        totalCopies: 5,
        rating: 4.9,
        tags: ['hobbit', 'ring', 'dragon', 'middle-earth'],
        summary: 'Bilbo Baggins embarks on an epic quest to reclaim Erebor from Smaug.'
      });
      assert.strictEqual(book.title, 'The Hobbit');
      assert.strictEqual(book.publishedYear, 1937);
      bookId = book._id;
    });

    // Test 4: Querying Books by Author and Genre
    await test('Query Books by Author and Genre Filtering', async () => {
      const books = await Book.find({ author: authorId, genre: genreId })
        .populate('author')
        .populate('genre');

      assert.strictEqual(books.length, 1);
      assert.strictEqual(books[0].author.name, 'J.R.R. Tolkien');
      assert.strictEqual(books[0].genre.name, 'High Fantasy');
    });

    // Test 5: Full-Text Search Query
    await test('Full-Text Search on Title & Summary', async () => {
      const searchResults = await Book.find({ $text: { $search: 'dragon Bilbo' } });
      assert.strictEqual(searchResults.length, 1);
      assert.strictEqual(searchResults[0].title, 'The Hobbit');
    });

    // Test 6: Update Book Inventory & Rating
    await test('Update Book Copies and Ratings', async () => {
      const updated = await Book.findByIdAndUpdate(
        bookId,
        { $inc: { availableCopies: -1 }, $set: { rating: 5.0 } },
        { new: true }
      );
      assert.strictEqual(updated.availableCopies, 3);
      assert.strictEqual(updated.rating, 5.0);
    });

    // Test 7: Aggregation Pipeline ($lookup, $group)
    await test('Execute Aggregation Pipeline for Genre Statistics', async () => {
      const stats = await Book.aggregate([
        {
          $lookup: {
            from: 'genres',
            localField: 'genre',
            foreignField: '_id',
            as: 'genreInfo'
          }
        },
        { $unwind: '$genreInfo' },
        {
          $group: {
            _id: '$genreInfo.name',
            bookCount: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        }
      ]);
      assert.strictEqual(stats.length, 1);
      assert.strictEqual(stats[0]._id, 'High Fantasy');
      assert.strictEqual(stats[0].bookCount, 1);
      assert.strictEqual(stats[0].avgRating, 5.0);
    });

    // Test 8: Delete Document
    await test('Delete Book Document', async () => {
      await Book.findByIdAndDelete(bookId);
      const checkBook = await Book.findById(bookId);
      assert.strictEqual(checkBook, null);
    });

    console.log(`\n==================================================`);
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`==================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error during test run:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
