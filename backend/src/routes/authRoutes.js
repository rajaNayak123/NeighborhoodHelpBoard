// backend/src/routes/authRoutes.js

import express from "express";
import passport from "passport";
import {
  register,
  login,
  getMe,
  forgotPassword,
} from "../controllers/authController";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.get("/me", protect, getMe);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    // On successful authentication, req.user is available
    const accessToken = generateAccessToken(req.user._id);
    const refreshToken = generateRefreshToken(req.user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // Redirect to the frontend dashboard
    res.redirect("http://localhost:3000/dashboard");
  }
);

export { router as authRoutes };
