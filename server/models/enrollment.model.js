const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
    select: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classFees: {
    type: Number,
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  isFeesPaid: {
    type: String,
    enum: ["paid", "unpaid", "pending", "failed"],
    required: true,
    default: "unpaid",
  },
  feesMsg: {
    type: String,
    default: "Payment is pending",
  },
  PaidDate: {
    type: Date,
  },
  paymentId: {
    type: String,
  },
});
