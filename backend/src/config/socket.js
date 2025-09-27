// backend/src/config/socket.js

const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Your frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room (e.g., user's own ID for private notifications)
    socket.on('joinRoom', (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room ${userId}`);
    });

    // Handle sending a private message
    socket.on('sendMessage', (data) => {
      // 'data' should include { receiverId, senderId, content }
      // Emitting to the receiver's room
      io.to(data.receiverId).emit('receiveMessage', data);
    });
    
    // Handle sending a notification
    socket.on('sendNotification', (data) => {
        // 'data' should include { receiverId, message }
        io.to(data.receiverId).emit('receiveNotification', data);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIO };