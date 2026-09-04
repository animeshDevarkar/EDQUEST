const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    avatarColor: {
      type: String,
      default: '#4F46E5'
    },
    room: {
      type: String,
      required: true,
      default: 'general',
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

messageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
