import http from "http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";
import dotenv from "dotenv";
dotenv.config();

// Connect to Database
connectDB(); 

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
