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

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log("\n🚀 ===========================================");
  console.log("   Neighborhood Help Board - Backend Server");
  console.log("===========================================");
  console.log(`🌐 Server running on: http://localhost:${PORT}`);

  // Check for missing environment variables
  const requiredEnvVars = ["JWT_SECRET"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.log("⚠️  Missing required environment variables:");
    missingVars.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
    console.log("💡 Check the README.md for setup instructions\n");
  }
});
