const { connectDB, disconnectDB } = require('../config/db');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Book = require('../models/Book');

const authorsData = [
  {
    name: 'J.K. Rowling',
    bio: 'British author best known for writing the Harry Potter fantasy series.',
    birthYear: 1965,
    nationality: 'British',
    awards: ['Order of the British Empire', 'Hugo Award'],
    website: 'https://jkrowling.com'
  },
  {
    name: 'George Orwell',
    bio: 'English novelist, essayist, journalist, and critic noted for dystopian fiction.',
    birthYear: 1903,
    nationality: 'British',
    awards: ['Prometheus Hall of Fame Award'],
    website: 'https://orwellfoundation.com'
  },
  {
    name: 'Isaac Asimov',
    bio: 'American writer and professor of biochemistry, famous for science fiction.',
    birthYear: 1920,
    nationality: 'American',
    awards: ['Hugo Award', 'Nebula Award', 'Locus Award'],
    website: 'https://asimovonline.com'
  },
  {
    name: 'Agatha Christie',
    bio: 'English writer known for 66 detective novels and short story collections.',
    birthYear: 1890,
    nationality: 'British',
    awards: ['Edgar Grand Master Award'],
    website: 'https://agathachristie.com'
  },
  {
    name: 'Haruki Murakami',
    bio: 'Japanese writer whose work fuses surrealism, magic realism, and loneliness.',
    birthYear: 1949,
    nationality: 'Japanese',
    awards: ['Franz Kafka Prize', 'Jerusalem Prize'],
    website: 'https://harukimurakami.com'
  }
];

const genresData = [
  {
    name: 'Fantasy',
    description: 'Literature featuring magical elements, mythical creatures, and imaginary worlds.',
    targetAudience: 'General'
  },
  {
    name: 'Dystopian',
    description: 'Exploration of futuristic societies experiencing oppressive social control or disaster.',
    targetAudience: 'Young Adult'
  },
  {
    name: 'Science Fiction',
    description: 'Speculative fiction dealing with futuristic science, technology, and space exploration.',
    targetAudience: 'General'
  },
  {
    name: 'Mystery & Detective',
    description: 'Fiction involving crime investigation, suspense, and puzzle solving.',
    targetAudience: 'Adult'
  },
  {
    name: 'Magical Realism',
    description: 'Realistic view of the modern world while adding magical or surreal elements.',
    targetAudience: 'General'
  }
];

async function seedDatabase() {
  try {
    console.log(' Starting database seed sequence...');
    await connectDB();

    // Clear existing data
    await Author.deleteMany({});
    await Genre.deleteMany({});
    await Book.deleteMany({});
    console.log(' Cleared existing collection data.');

    // Insert Authors
    const insertedAuthors = await Author.insertMany(authorsData);
    console.log(` Created ${insertedAuthors.length} authors.`);

    // Insert Genres
    const insertedGenres = await Genre.insertMany(genresData);
    console.log(` Created ${insertedGenres.length} genres.`);

    // Map helper
    const authorMap = {};
    insertedAuthors.forEach((a) => { authorMap[a.name] = a._id; });

    const genreMap = {};
    insertedGenres.forEach((g) => { genreMap[g.name] = g._id; });

    // Seed Books
    const booksData = [
      {
        title: "Harry Potter and the Philosopher's Stone",
        isbn: '978-0747532743',
        author: authorMap['J.K. Rowling'],
        genre: genreMap['Fantasy'],
        publishedYear: 1997,
        pages: 223,
        availableCopies: 5,
        totalCopies: 6,
        rating: 4.9,
        tags: ['wizard', 'magic', 'hogwarts', 'friendship'],
        summary: 'A young wizard discovers his magical heritage on his eleventh birthday.'
      },
      {
        title: 'Harry Potter and the Chamber of Secrets',
        isbn: '978-0747538486',
        author: authorMap['J.K. Rowling'],
        genre: genreMap['Fantasy'],
        publishedYear: 1998,
        pages: 251,
        availableCopies: 3,
        totalCopies: 4,
        rating: 4.8,
        tags: ['wizard', 'snake', 'basilisk', 'mystery'],
        summary: 'Harry returns to Hogwarts for his second year as a shadowy creature attacks students.'
      },
      {
        title: '1984',
        isbn: '978-0451524935',
        author: authorMap['George Orwell'],
        genre: genreMap['Dystopian'],
        publishedYear: 1949,
        pages: 328,
        availableCopies: 4,
        totalCopies: 5,
        rating: 4.7,
        tags: ['big brother', 'surveillance', 'totalitarianism'],
        summary: 'Winston Smith wrestles with oppression in Oceania under the watchful eye of Big Brother.'
      },
      {
        title: 'Animal Farm',
        isbn: '978-0451526342',
        author: authorMap['George Orwell'],
        genre: genreMap['Dystopian'],
        publishedYear: 1945,
        pages: 112,
        availableCopies: 2,
        totalCopies: 3,
        rating: 4.6,
        tags: ['satire', 'allegory', 'revolution'],
        summary: 'Farm animals overthrow their human master only to succumb to tyranny among themselves.'
      },
      {
        title: 'Foundation',
        isbn: '978-0553293357',
        author: authorMap['Isaac Asimov'],
        genre: genreMap['Science Fiction'],
        publishedYear: 1951,
        pages: 255,
        availableCopies: 3,
        totalCopies: 4,
        rating: 4.8,
        tags: ['psychohistory', 'empire', 'space'],
        summary: 'Hari Seldon uses mathematics and psychohistory to predict the collapse of the Galactic Empire.'
      },
      {
        title: 'I, Robot',
        isbn: '978-0553382563',
        author: authorMap['Isaac Asimov'],
        genre: genreMap['Science Fiction'],
        publishedYear: 1950,
        pages: 224,
        availableCopies: 2,
        totalCopies: 2,
        rating: 4.5,
        tags: ['robotics', 'three laws', 'ai'],
        summary: 'A collection of interconnected short stories establishing the Three Laws of Robotics.'
      },
      {
        title: 'And Then There Were None',
        isbn: '978-0062073488',
        author: authorMap['Agatha Christie'],
        genre: genreMap['Mystery & Detective'],
        publishedYear: 1939,
        pages: 272,
        availableCopies: 1,
        totalCopies: 3,
        rating: 4.9,
        tags: ['island', 'murder', 'suspense'],
        summary: 'Ten strangers are invited to an isolated island and killed off one by one.'
      },
      {
        title: 'Kafka on the Shore',
        isbn: '978-1400079278',
        author: authorMap['Haruki Murakami'],
        genre: genreMap['Magical Realism'],
        publishedYear: 2002,
        pages: 505,
        availableCopies: 3,
        totalCopies: 3,
        rating: 4.4,
        tags: ['cats', 'fate', 'metaphysical'],
        summary: 'A teenage runaway and an elderly man who speaks with cats embark on parallel journeys.'
      }
    ];

    const insertedBooks = await Book.insertMany(booksData);
    console.log(` Created ${insertedBooks.length} books successfully.`);

    console.log(' Database seed operation completed perfectly.');
  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await disconnectDB();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
