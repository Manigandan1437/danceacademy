const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    danceStyle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanceStyle",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      default: "all",
    },
    ageGroup: {
      type: String,
      enum: ["kids", "teens", "adults", "seniors", "all"],
      default: "all",
    },
    maxStudents: {
      type: Number,
      default: 20,
    },
    fees: {
      monthly: { type: Number, required: true, default: 0 },
      quarterly: { type: Number, default: 0 },
      yearly: { type: Number, default: 0 },
    },
    duration: {
      type: Number,
      default: 60,
      description: "Duration in minutes",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Class", classSchema);
