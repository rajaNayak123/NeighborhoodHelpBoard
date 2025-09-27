import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      default: null,
    },
    profilePhoto: {
      url: { type: String, default: "https://i.ibb.co/4pDNDk1/avatar.png" },
      public_id: { type: String },
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
      address: { type: String },
    },
    contactPreference: {
      type: String,
      enum: ["chat", "chat_and_phone"],
      default: "chat",
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    reputation: {
      score: { type: Number, default: 0 },
      badges: [{ type: String }],
    },
    ratings: [
      {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        byUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
