const express = require('express');
const router = express.Router();
const { getMessagesByRoom, getRooms, postMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/rooms', getRooms);
router.get('/messages/:room', getMessagesByRoom);
router.post('/messages', protect, postMessage);

module.exports = router;
