import { Server } from "socket.io";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        // Allow localhost with any port for development
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
          return callback(null, true);
        }

        // Allow specific ports for Vite development
        const allowedOrigins = [
          "http://localhost:5173",
        ];

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room (e.g., user's own ID for private notifications)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined room ${userId}`);
    });

    // Handle sending a private message
    socket.on("sendMessage", (data) => {
      // 'data' should include { receiverId, senderId, content }
      // Emitting to the receiver's room
      io.to(data.receiverId).emit("receiveMessage", data);
    });

    // Handle sending a notification
    socket.on("sendNotification", (data) => {
      // 'data' should include { receiverId, message }
      io.to(data.receiverId).emit("receiveNotification", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { initSocket, getIO };