# MongoDB Fundamentals Assignment - Library Management System

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

A production-ready **Library Management System** database and web application built for the **EDquest MongoDB Fundamentals Assignment**. This repository demonstrates core NoSQL concepts including dynamic BSON data modeling, CRUD operations, full-text search indexing, complex query criteria, server-side aggregation pipelines, and automated unit testing.

---

## 📚 Table of Contents

- [Features](#-features)
- [Project Architecture](#-project-architecture)
- [Quick Start & Setup](#-quick-start--setup)
- [NPM Scripts Command Catalog](#-npm-scripts-command-catalog)
- [REST API Endpoints](#-rest-api-endpoints)
- [MongoDB Aggregation Pipelines](#-mongodb-aggregation-pipelines)
- [Automated Test Suite](#-automated-test-suite)
- [In-Depth Reflection Report](#-in-depth-reflection-report)
- [Author](#-author)

---

## 🚀 Features

- **Document Schemas & Models:**
  - `Author`: Stores author profiles, biographies, birth year, nationality, awards, and website links.
  - `Genre`: Categories with target audience classifications (General, Young Adult, Children, Academic).
  - `Book`: Includes ISBN, title, references to Author and Genre, published year, available/total copies, star ratings, tags, and summary.
- **CRUD Operations & Search:**
  - Create, view, edit, and delete books and authors via REST API and interactive Web UI.
  - Filter books by genre, author, publication year range, availability, or full-text keywords.
- **Aggregation Framework Analytics:**
  - Genre breakdown metrics (total titles, total copies, average rating, average page count).
  - Author productivity overview (number of books cataloged per author).
- **Interactive Web Dashboard:**
  - Clean HTML5/CSS3/JS user interface with live filtering, statistics, and modal book editor.
- **Zero-Dependency Fallback Engine:**
  - Built-in automatic fallback to `mongodb-memory-server` if no local MongoDB instance is running, ensuring instant execution out-of-the-box.
- **Academic Research Report:**
  - Comprehensive report on MongoDB architecture, installation, data modeling choices, and NoSQL reflection in [REPORT.md](./REPORT.md).

---

## 📁 Project Architecture

```
MongoDB Fundamentals Assignment/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & memory-server fallback
│   ├── models/
│   │   ├── Author.js             # Author Mongoose schema & indexes
│   │   ├── Genre.js              # Genre Mongoose schema
│   │   └── Book.js               # Book Mongoose schema & text search indexes
│   ├── controllers/
│   │   └── libraryController.js  # CRUD operations & aggregation pipelines
│   ├── routes/
│   │   └── apiRoutes.js          # Express REST API routes
│   ├── scripts/
│   │   ├── seed.js               # Database seeding script
│   │   └── mongoShellQueries.js  # CLI Mongo Shell query demo script
│   └── server.js                 # Main Express application server
├── public/                       # Interactive Web Dashboard Client
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── test/
│   └── library.test.js           # Automated assertion test suite
├── REPORT.md                     # Comprehensive NoSQL research report
├── README.md                     # Project documentation
└── package.json                  # Node.js dependencies & scripts
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1. Clone repository and navigate to the project directory:
   ```bash
   cd "MongoDB Fundamentals Assignment"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```
   Open your browser at `http://localhost:5000` to interact with the Library System Dashboard!

---

## 🛠️ NPM Scripts Command Catalog

| Command | Description |
| :--- | :--- |
| `npm start` | Launches Express web server & interactive dashboard (auto-seeds database if empty). |
| `npm run seed` | Seeds fresh sample data (5 authors, 5 genres, 8 books) into MongoDB. |
| `npm run shell-demo` | Executes CLI MongoDB query demonstration showcasing shell commands and raw BSON outputs. |
| `npm test` | Runs the automated unit test suite verifying CRUD operations, filters, and aggregations. |

---

## 📡 REST API Endpoints

### Books
- `GET /api/books` - List all books (supports query parameters: `search`, `genre`, `author`, `minYear`, `maxYear`, `availableOnly`).
- `GET /api/books/:id` - Fetch single book details.
- `POST /api/books` - Create new book document.
- `PUT /api/books/:id` - Update existing book document.
- `DELETE /api/books/:id` - Delete book document.

### Authors
- `GET /api/authors` - List authors (supports `nationality` & `search` filters).
- `GET /api/authors/:id` - Fetch author by ID.
- `POST /api/authors` - Create new author.
- `PUT /api/authors/:id` - Update author details.
- `DELETE /api/authors/:id` - Delete author and associated books.

### Genres
- `GET /api/genres` - List genres.
- `POST /api/genres` - Create new genre.

### Analytics (Aggregations)
- `GET /api/analytics/genres` - Aggregation pipeline breakdown of books per genre.
- `GET /api/analytics/authors` - Aggregation pipeline breakdown of books per author.

---

## 📊 MongoDB Aggregation Pipelines

### Genre Metrics Pipeline Example
```javascript
db.books.aggregate([
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
      avgRating: { $avg: '$rating' },
      avgPages: { $avg: '$pages' }
    }
  },
  { $sort: { totalBooks: -1 } }
]);
```

---

## 🧪 Automated Test Suite

Run the automated test suite with:
```bash
npm test
```

Verifies:
-  Author and Genre document creation & schema validation.
-  Book creation with object ID references.
-  Query filtering by author, genre, and range parameters.
-  Full-text search queries using text indexes.
-  Atomic inventory update operations.
-  Aggregation pipeline execution and metric formatting.
-  Document deletion and cascading updates.

---

## 📝 In-Depth Reflection Report

For detailed academic analysis on MongoDB architecture, installation guides, security, BSON data modeling, dynamic indexing, and NoSQL reflection, refer to [REPORT.md](./REPORT.md).

---

## 👤 Author

**Animesh Devarkar**  
- GitHub: [@animeshDevarkar](https://github.com/animeshDevarkar)
- Project Repository: [EDQUEST](https://github.com/animeshDevarkar/EDQUEST)
