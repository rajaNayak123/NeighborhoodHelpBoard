import { Server } from "socket.io";
import { Message } from "../models/Message.js";
import { Request } from "../models/Request.js";

let io;
const userSockets = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      userSockets.set(socket.id, userId);
      console.log(`User ${socket.id} (User ID: ${userId}) joined room ${userId}`);
    });

    socket.on("sendMessage", async (data, callback) => {
      const senderId = userSockets.get(socket.id);
      if (!senderId) return;

      const { receiverId, requestId, content } = data;

      try {
        const request = await Request.findById(requestId);
        if (!request) throw new Error("Request not found");

        const requesterId = request.createdBy.toString();
        const helperId = request.helper ? request.helper.toString() : null;

        const isAuthorized =
          (senderId === requesterId && receiverId === helperId) ||
          (senderId === helperId && receiverId === requesterId);

        if (!isAuthorized) throw new Error("Not authorized to send message");

        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          request: requestId,
          content: content,
        });

        const populatedMessage = await Message.findById(message._id).populate(
          "sender",
          "name profilePhoto"
        );

        // Send message to the recipient's room
        io.to(receiverId).emit("receiveMessage", populatedMessage);
        
        // Acknowledge to the sender that the message was saved
        callback(populatedMessage);

      } catch (error) {
        console.error("Error in sendMessage socket event:", error.message);
        callback(null); // Acknowledge failure
      }
    });

    socket.on("disconnect", () => {
      userSockets.delete(socket.id);
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