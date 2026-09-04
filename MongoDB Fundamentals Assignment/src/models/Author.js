const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      index: true
    },
    bio: {
      type: String,
      trim: true
    },
    birthYear: {
      type: Number,
      min: [1000, 'Birth year must be valid'],
      max: [new Date().getFullYear(), 'Birth year cannot be in the future']
    },
    nationality: {
      type: String,
      trim: true,
      index: true
    },
    awards: [{ type: String, trim: true }],
    website: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

authorSchema.index({ name: 'text', nationality: 'text' });

module.exports = mongoose.model('Author', authorSchema);
