import crypto from "crypto";
import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message:
          "Registration successful. Please check your email for verification.",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404);
      throw new Error("There is no user with that email");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetURL = `${
      process.env.FRONTEND_URL
    }/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click the link below to reset your password: \n\n ${resetURL} \n\n This link will expire in 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("Email sending failed:", emailError);
      throw new Error("Failed to send reset email. Please try again.");
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Token is invalid or has expired");
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, getMe, forgotPassword, resetPassword, logout };
