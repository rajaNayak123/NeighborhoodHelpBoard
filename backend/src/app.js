import express from "express";
import cors from "cors";
import passport from "passport";
import { errorHandler } from "./middleware/errorHandler.js";
import { configurePassport } from "./config/passport.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
