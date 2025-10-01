import mongoose from "mongoose";
import dotenv from "dotenv";
import { Request } from "../models/Request.js";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://nayakraja151:helloMongoDB@cluster0.xzcz0ry.mongodb.net/NeighborhoodHelpBoard"

    // Check if MongoDB is available
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");

    // Ensure 2dsphere index exists for location queries
    try {
      await Request.collection.createIndex({
        "location.coordinates": "2dsphere",
      });
      console.log("✅ 2dsphere index created/verified for location queries");
    } catch (indexError) {
      console.log("ℹ️  Location index already exists or couldn't be created");
    }
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
  }
};

export { connectDB };