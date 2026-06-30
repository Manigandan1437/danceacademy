const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    announcedDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Announcement = mongoose.model("announcement", announcementSchema);

module.exports = Announcement;
