const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollement",
      required: true,
    },
    attendedDate: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Attendence = mongoose.model("attendence", attendanceSchema);

module.exports = Attendence;
