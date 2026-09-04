const { connectDB, disconnectDB } = require('../config/db');
const seedDatabase = require('./seed');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Book = require('../models/Book');

async function runMongoShellQueryDemos() {
  console.log('\n===========================================================');
  console.log('   MONGODB FUNDAMENTALS ASSIGNMENT: QUERY & SHELL DEMO    ');
  console.log('===========================================================\n');

  // Seed database keeping active DB connection open
  await seedDatabase(false);

  try {
    // -----------------------------------------------------------------
    // 1. CREATE OPERATION DEMO
    // -----------------------------------------------------------------
    console.log('\n--- [1] CREATE DEMO (db.authors.insertOne & db.books.insertOne) ---');
    const newAuthor = await Author.create({
      name: 'Arthur Conan Doyle',
      bio: 'Scottish writer who created the character Sherlock Holmes.',
      birthYear: 1859,
      nationality: 'British',
      awards: ['Knight Bachelor']
    });
    console.log(' Inserted Author:', newAuthor.name, `(ID: ${newAuthor._id})`);

    const mysteryGenre = await Genre.findOne({ name: 'Mystery & Detective' });

    const newBook = await Book.create({
      title: 'A Study in Scarlet',
      isbn: '978-0140439083',
      author: newAuthor._id,
      genre: mysteryGenre._id,
      publishedYear: 1887,
      pages: 144,
      availableCopies: 3,
      totalCopies: 3,
      rating: 4.8,
      tags: ['sherlock holmes', 'watson', 'detective'],
      summary: 'The first novel featuring legendary detective Sherlock Holmes and Dr. Watson.'
    });
    console.log(' Inserted Book:', newBook.title, `(ISBN: ${newBook.isbn})`);

    // -----------------------------------------------------------------
    // 2. READ & SEARCH QUERIES
    // -----------------------------------------------------------------
    console.log('\n--- [2] READ QUERIES (db.books.find) ---');

    // Query A: Search Books by Specific Author
    console.log('\n Query A: Books authored by George Orwell');
    console.log(' Shell Command: db.books.find({ author: ObjectId("...") })');
    const orwell = await Author.findOne({ name: 'George Orwell' });
    const orwellBooks = await Book.find({ author: orwell._id }).select('title publishedYear pages rating');
    console.log(' Result:', JSON.stringify(orwellBooks, null, 2));

    // Query B: Search Books by Genre and Publication Year Range
    console.log('\n Query B: Science Fiction books published between 1945 and 1955');
    console.log(' Shell Command: db.books.find({ genre: ObjectId("..."), publishedYear: { $gte: 1945, $lte: 1955 } })');
    const sciFi = await Genre.findOne({ name: 'Science Fiction' });
    const sciFiBooks = await Book.find({
      genre: sciFi._id,
      publishedYear: { $gte: 1945, $lte: 1955 }
    }).select('title publishedYear rating');
    console.log(' Result:', JSON.stringify(sciFiBooks, null, 2));

    // Query C: Full-Text Search on Title & Summary
    console.log('\n Query C: Text search for keyword "magic" or "wizard"');
    console.log(' Shell Command: db.books.find({ $text: { $search: "magic wizard" } })');
    const textSearchBooks = await Book.find({ $text: { $search: 'magic wizard' } }).select('title summary rating');
    console.log(' Result:', JSON.stringify(textSearchBooks, null, 2));

    // Query D: Regex Search (Case-insensitive title search)
    console.log('\n Query D: Regex search for titles starting with "Harry"');
    console.log(' Shell Command: db.books.find({ title: { $regex: "^Harry", $options: "i" } })');
    const harryBooks = await Book.find({ title: { $regex: '^Harry', $options: 'i' } }).select('title publishedYear');
    console.log(' Result:', JSON.stringify(harryBooks, null, 2));

    // -----------------------------------------------------------------
    // 3. UPDATE OPERATION DEMO
    // -----------------------------------------------------------------
    console.log('\n--- [3] UPDATE DEMO (db.books.updateOne & db.authors.updateMany) ---');
    console.log(' Shell Command: db.books.updateOne({ _id: ObjectId("...") }, { $inc: { availableCopies: -1 }, $set: { rating: 5.0 } })');
    const updatedBook = await Book.findOneAndUpdate(
      { isbn: '978-0451524935' }, // 1984
      { $inc: { availableCopies: -1 }, $set: { rating: 5.0 }, $push: { tags: 'classic' } },
      { new: true }
    );
    console.log(' Updated Book (1984):', {
      title: updatedBook.title,
      availableCopies: updatedBook.availableCopies,
      rating: updatedBook.rating,
      tags: updatedBook.tags
    });

    // -----------------------------------------------------------------
    // 4. AGGREGATION PIPELINE DEMOS
    // -----------------------------------------------------------------
    console.log('\n--- [4] AGGREGATION PIPELINES (db.books.aggregate) ---');

    // Aggregation 1: Genre breakdown with stats
    console.log('\n Aggregation 1: Genre Stats (Count, Avg Rating, Avg Pages, Total Copies)');
    console.log(` Shell Pipeline:
      db.books.aggregate([
        { $lookup: { from: 'genres', localField: 'genre', foreignField: '_id', as: 'genreInfo' } },
        { $unwind: '$genreInfo' },
        { $group: {
            _id: '$genreInfo.name',
            bookCount: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            avgPages: { $avg: '$pages' },
            totalCopies: { $sum: '$totalCopies' }
          }
        },
        { $sort: { bookCount: -1 } }
      ])`);

    const genreStats = await Book.aggregate([
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
          avgRating: { $avg: '$rating' },
          avgPages: { $avg: '$pages' },
          totalCopies: { $sum: '$totalCopies' }
        }
      },
      { $sort: { bookCount: -1 } }
    ]);
    console.log(' Aggregation 1 Result:', JSON.stringify(genreStats, null, 2));

    // Aggregation 2: Authors with their full book lists and total library copies
    console.log('\n Aggregation 2: Authors with Published Book Summary');
    const authorSummary = await Author.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: 'author',
          as: 'books'
        }
      },
      {
        $project: {
          name: 1,
          nationality: 1,
          totalBooksInLibrary: { $size: '$books' },
          bookTitles: '$books.title'
        }
      },
      { $sort: { totalBooksInLibrary: -1 } }
    ]);
    console.log(' Aggregation 2 Result:', JSON.stringify(authorSummary, null, 2));

    // -----------------------------------------------------------------
    // 5. DELETE OPERATION DEMO
    // -----------------------------------------------------------------
    console.log('\n--- [5] DELETE DEMO (db.books.deleteOne) ---');
    console.log(' Shell Command: db.books.deleteOne({ title: "A Study in Scarlet" })');
    const deleteResult = await Book.deleteOne({ title: 'A Study in Scarlet' });
    console.log(' Delete Result:', deleteResult);

    console.log('\n===========================================================');
    console.log(' MONGODB SHELL QUERY & AGGREGATION DEMO COMPLETED!');
    console.log('===========================================================\n');
  } catch (err) {
    console.error(' Error running shell queries demo:', err);
  } finally {
    await disconnectDB();
  }
}

if (require.main === module) {
  runMongoShellQueryDemos();
}

module.exports = runMongoShellQueryDemos;
