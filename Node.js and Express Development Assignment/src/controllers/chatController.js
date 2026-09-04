const Message = require('../models/Message');

const AVAILABLE_ROOMS = [
  { id: 'general', name: 'General', description: 'General community chatter', icon: '💬' },
  { id: 'tech', name: 'Tech Talk', description: 'Node.js, Express & Web Dev discussions', icon: '💻' },
  { id: 'random', name: 'Random', description: 'Memes, fun, and random topics', icon: '🎲' }
];

// @desc    Get message history for a specific room
// @route   GET /api/chat/messages/:room
const getMessagesByRoom = async (req, res, next) => {
  try {
    const room = req.params.room.toLowerCase();
    const limit = parseInt(req.query.limit, 10) || 50;

    const messages = await Message.find({ room })
      .sort({ createdAt: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      room,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of available chat rooms
// @route   GET /api/chat/rooms
const getRooms = (req, res) => {
  res.status(200).json({
    success: true,
    rooms: AVAILABLE_ROOMS
  });
};

// @desc    Post a message via REST API
// @route   POST /api/chat/messages
const postMessage = async (req, res, next) => {
  try {
    const { room = 'general', content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      senderName: req.user.username,
      avatarColor: req.user.avatarColor,
      room: room.toLowerCase(),
      content: content.trim()
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AVAILABLE_ROOMS,
  getMessagesByRoom,
  getRooms,
  postMessage
};
