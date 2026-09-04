const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const seedDatabase = require('./scripts/seed');
const Book = require('./models/Book');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api', apiRoutes);

// Root route redirects to dashboard
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MongoDB Library System API is healthy' });
});

async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      console.log(' Database is empty. Seeding initial dataset...');
      await seedDatabase();
      await connectDB();
    }

    app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 MongoDB Assignment Server is running on port ${PORT}`);
      console.log(`🌐 Dashboard URL: http://localhost:${PORT}`);
      console.log(`==================================================\n`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
