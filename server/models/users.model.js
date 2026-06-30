const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    contactNumber: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "student", "visitor"],
      default: "visitor",
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const User = mongoose.model("user", userSchema);

module.exports = User;
