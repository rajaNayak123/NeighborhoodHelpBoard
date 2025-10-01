import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser"; // Import cookie-parser
import { errorHandler } from "./middleware/errorHandler.js";
import { configurePassport } from "./config/passport.js";

// Import routes
import { authRoutes } from "./routes/authRoutes.js";
import { requestRoutes } from "./routes/requestRoutes.js";
import { offerRoutes } from "./routes/offerRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
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
        process.env.FRONTEND_URL
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser

// Passport Middleware
app.use(passport.initialize());
configurePassport(passport);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Global Error Handler
app.use(errorHandler);

export { app };
