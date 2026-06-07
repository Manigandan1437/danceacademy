const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cash", "bank_transfer", "upi"],
      default: "razorpay",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    billingPeriod: {
      from: Date,
      to: Date,
    },
    description: { type: String },
    receiptNumber: { type: String, unique: true },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

// Auto-generate receipt number
paymentSchema.pre("save", async function (next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model("Payment").countDocuments();
    this.receiptNumber = `REC-${Date.now()}-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
