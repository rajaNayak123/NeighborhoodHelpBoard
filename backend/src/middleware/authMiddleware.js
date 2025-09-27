import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // We'll read the JWT from the httpOnly cookie
  if (req.headers.cookie && req.headers.cookie.startsWith("accessToken=")) {
    try {
      token = req.headers.cookie.split("accessToken=")[1].split(";")[0];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

export { protect };
