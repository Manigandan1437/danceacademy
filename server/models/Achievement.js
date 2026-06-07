const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Achievement title is required"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["milestone", "award", "competition", "certificate", "recognition"],
      default: "milestone",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert", "master"],
    },
    relatedClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    achievedDate: {
      type: Date,
      default: Date.now,
    },
    badge: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Achievement", achievementSchema);
