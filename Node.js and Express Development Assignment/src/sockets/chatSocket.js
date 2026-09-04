const Message = require('../models/Message');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Map to track active socket connections: socket.id -> { userId, username, room, avatarColor }
const activeUsers = new Map();

const setupChatSocket = (io) => {
  // Middleware to authenticate socket connections if token is provided
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          socket.user = user;
        }
      }
      next();
    } catch (err) {
      // If token is invalid, still allow connection as guest or continue
      next();
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    const username = user ? user.username : (socket.handshake.query?.username || `Guest_${socket.id.substring(0, 4)}`);
    const avatarColor = user ? user.avatarColor : '#6366F1';
    const userId = user ? user._id : null;

    activeUsers.set(socket.id, {
      socketId: socket.id,
      userId,
      username,
      avatarColor,
      room: null
    });

    if (userId) {
      User.findByIdAndUpdate(userId, { isOnline: true }).catch(() => {});
    }

    console.log(`[Socket] Client connected: ${username} (${socket.id})`);

    // Helper: emit current online users list for a room
    const emitRoomUsers = (room) => {
      const roomUsers = Array.from(activeUsers.values())
        .filter((u) => u.room === room)
        .map((u) => ({ username: u.username, avatarColor: u.avatarColor }));
      io.to(room).emit('roomUsers', { room, users: roomUsers });
    };

    // Event: Join Room
    socket.on('joinRoom', async ({ room = 'general' }) => {
      const currentUser = activeUsers.get(socket.id);
      if (!currentUser) return;

      const previousRoom = currentUser.room;
      if (previousRoom) {
        socket.leave(previousRoom);
        socket.to(previousRoom).emit('systemMessage', {
          text: `${currentUser.username} left the channel.`,
          timestamp: new Date()
        });
        currentUser.room = null;
        emitRoomUsers(previousRoom);
      }

      currentUser.room = room.toLowerCase();
      socket.join(currentUser.room);

      // Welcome current user
      socket.emit('systemMessage', {
        text: `Welcome to #${currentUser.room}, ${currentUser.username}!`,
        timestamp: new Date()
      });

      // Broadcast to room
      socket.to(currentUser.room).emit('systemMessage', {
        text: `${currentUser.username} has joined #${currentUser.room}.`,
        timestamp: new Date()
      });

      emitRoomUsers(currentUser.room);
    });

    // Event: Send Message
    socket.on('sendMessage', async ({ room = 'general', content }, callback) => {
      try {
        const currentUser = activeUsers.get(socket.id);
        if (!currentUser || !content || !content.trim()) {
          if (callback) callback({ error: 'Message content is empty or invalid' });
          return;
        }

        const cleanContent = content.trim();
        const targetRoom = (room || currentUser.room || 'general').toLowerCase();

        // Persist message to database if registered user, or create with placeholder
        let savedMessage;
        if (currentUser.userId) {
          savedMessage = await Message.create({
            sender: currentUser.userId,
            senderName: currentUser.username,
            avatarColor: currentUser.avatarColor,
            room: targetRoom,
            content: cleanContent
          });
        } else {
          savedMessage = {
            _id: new Date().getTime().toString(),
            senderName: currentUser.username,
            avatarColor: currentUser.avatarColor,
            room: targetRoom,
            content: cleanContent,
            createdAt: new Date()
          };
        }

        // Broadcast to all sockets in the room (including sender)
        io.to(targetRoom).emit('newMessage', {
          id: savedMessage._id,
          senderName: currentUser.username,
          avatarColor: currentUser.avatarColor,
          room: targetRoom,
          content: cleanContent,
          createdAt: savedMessage.createdAt
        });

        if (callback) callback({ success: true });
      } catch (error) {
        console.error('[Socket] sendMessage error:', error.message);
        if (callback) callback({ error: 'Failed to send message' });
      }
    });

    // Event: Typing indicator
    socket.on('typing', ({ room }) => {
      const currentUser = activeUsers.get(socket.id);
      if (currentUser && room) {
        socket.to(room.toLowerCase()).emit('userTyping', {
          username: currentUser.username
        });
      }
    });

    socket.on('stopTyping', ({ room }) => {
      const currentUser = activeUsers.get(socket.id);
      if (currentUser && room) {
        socket.to(room.toLowerCase()).emit('userStoppedTyping', {
          username: currentUser.username
        });
      }
    });

    // Event: Disconnect
    socket.on('disconnect', async () => {
      const currentUser = activeUsers.get(socket.id);
      if (currentUser) {
        if (currentUser.room) {
          socket.to(currentUser.room).emit('systemMessage', {
            text: `${currentUser.username} disconnected.`,
            timestamp: new Date()
          });
          emitRoomUsers(currentUser.room);
        }

        if (currentUser.userId) {
          await User.findByIdAndUpdate(currentUser.userId, { isOnline: false }).catch(() => {});
        }

        activeUsers.delete(socket.id);
        console.log(`[Socket] Client disconnected: ${currentUser.username} (${socket.id})`);
      }
    });
  });
};

module.exports = { setupChatSocket, activeUsers };
