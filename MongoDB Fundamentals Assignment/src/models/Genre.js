const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Genre name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    targetAudience: {
      type: String,
      enum: ['General', 'Children', 'Young Adult', 'Academic', 'Adult'],
      default: 'General'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Genre', genreSchema);
