document.addEventListener('DOMContentLoaded', () => {
  let socket = null;
  let currentRoom = 'general';
  let currentUser = null;
  let typingTimeout = null;
  let isCurrentlyTyping = false;

  const ROOM_DESCRIPTIONS = {
    general: 'General community chatter',
    tech: 'Node.js, Express & Web Dev discussions',
    random: 'Memes, fun, and random topics'
  };

  // DOM Elements
  const myAvatar = document.getElementById('myAvatar');
  const myUsername = document.getElementById('myUsername');
  const roomList = document.getElementById('roomList');
  const roomUsersList = document.getElementById('roomUsersList');
  const userCount = document.getElementById('userCount');
  const activeRoomTitle = document.getElementById('activeRoomTitle');
  const activeRoomDesc = document.getElementById('activeRoomDesc');
  const connectionPill = document.getElementById('connectionPill');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');

  // Initialize Auth
  Auth.init((token, user) => {
    currentUser = user;
    renderCurrentUser(user);
    initSocketConnection(token, user);
  });

  const renderCurrentUser = (user) => {
    myUsername.textContent = user.username;
    myAvatar.textContent = user.username.charAt(0).toUpperCase();
    if (user.avatarColor) {
      myAvatar.style.backgroundColor = user.avatarColor;
    }
  };

  const initSocketConnection = (token, user) => {
    if (socket) {
      socket.disconnect();
    }

    const socketOptions = {
      auth: { token },
      query: { username: user.username }
    };

    socket = io(window.location.origin, socketOptions);

    socket.on('connect', () => {
      connectionPill.textContent = 'Connected';
      connectionPill.className = 'status-pill connected';
      joinRoom(currentRoom);
    });

    socket.on('disconnect', () => {
      connectionPill.textContent = 'Disconnected';
      connectionPill.className = 'status-pill disconnected';
    });

    socket.on('newMessage', (msg) => {
      if (msg.room === currentRoom) {
        appendMessage(msg);
      }
    });

    socket.on('systemMessage', (data) => {
      appendSystemMessage(data.text);
    });

    socket.on('roomUsers', ({ room, users }) => {
      if (room === currentRoom) {
        renderRoomUsers(users);
      }
    });

    socket.on('userTyping', ({ username }) => {
      typingIndicator.textContent = `${username} is typing...`;
    });

    socket.on('userStoppedTyping', () => {
      typingIndicator.textContent = '';
    });
  };

  // Switch Room
  const joinRoom = async (room) => {
    currentRoom = room;
    activeRoomTitle.textContent = `#${room}`;
    activeRoomDesc.textContent = ROOM_DESCRIPTIONS[room] || 'Active Channel';
    messageInput.placeholder = `Type a message in #${room}...`;

    // Highlight active item in sidebar
    document.querySelectorAll('.room-item').forEach((el) => {
      if (el.dataset.room === room) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    chatMessages.innerHTML = '';

    // Fetch message history from REST API
    await loadMessageHistory(room);

    // Tell socket server we joined this room
    if (socket && socket.connected) {
      socket.emit('joinRoom', { room });
    }
  };

  const loadMessageHistory = async (room) => {
    try {
      const res = await fetch(`/api/chat/messages/${room}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        data.messages.forEach((msg) => appendMessage(msg));
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load room messages:', err);
    }
  };

  const appendMessage = (msg) => {
    const isSelf = currentUser && (msg.senderName === currentUser.username);
    const row = document.createElement('div');
    row.className = `message-row ${isSelf ? 'self' : ''}`;

    const initial = (msg.senderName || 'U').charAt(0).toUpperCase();
    const color = msg.avatarColor || '#6366F1';
    const time = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    row.innerHTML = `
      <div class="msg-avatar" style="background-color: ${color}">${initial}</div>
      <div class="msg-content-wrapper">
        <div class="msg-header">
          <span class="msg-sender">${escapeHtml(msg.senderName)}</span>
          <span class="msg-time">${time}</span>
        </div>
        <div class="msg-bubble">${escapeHtml(msg.content)}</div>
      </div>
    `;

    chatMessages.appendChild(row);
    scrollToBottom();
  };

  const appendSystemMessage = (text) => {
    const notice = document.createElement('div');
    notice.className = 'system-notice';
    notice.textContent = text;
    chatMessages.appendChild(notice);
    scrollToBottom();
  };

  const renderRoomUsers = (users) => {
    userCount.textContent = users.length;
    roomUsersList.innerHTML = '';
    users.forEach((u) => {
      const li = document.createElement('li');
      li.className = 'user-item';
      li.innerHTML = `
        <span class="small-avatar" style="background-color: ${u.avatarColor || '#6366F1'}">
          ${u.username.charAt(0).toUpperCase()}
        </span>
        <span>${escapeHtml(u.username)}</span>
      `;
      roomUsersList.appendChild(li);
    });
  };

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const escapeHtml = (unsafe) => {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Event Listeners for UI
  roomList.addEventListener('click', (e) => {
    const item = e.target.closest('.room-item');
    if (item && item.dataset.room) {
      const room = item.dataset.room;
      if (room !== currentRoom) {
        joinRoom(room);
      }
    }
  });

  // Sending message
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content || !socket) return;

    socket.emit('sendMessage', { room: currentRoom, content });
    messageInput.value = '';

    if (isCurrentlyTyping) {
      isCurrentlyTyping = false;
      socket.emit('stopTyping', { room: currentRoom });
      clearTimeout(typingTimeout);
    }
  });

  // Typing event
  messageInput.addEventListener('input', () => {
    if (!socket) return;

    if (!isCurrentlyTyping) {
      isCurrentlyTyping = true;
      socket.emit('typing', { room: currentRoom });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      isCurrentlyTyping = false;
      socket.emit('stopTyping', { room: currentRoom });
    }, 1500);
  });
});
