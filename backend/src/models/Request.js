import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["groceries", "repairs", "tools", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "expired"],
      default: "open",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true, index: "2dsphere" }, // [longitude, latitude]
      address: { type: String, required: true },
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completionDate: { type: Date },
    expiresAt: { type: Date, index: { expires: "1m" } }, // TTL index for auto-expiry
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

export { Request };
