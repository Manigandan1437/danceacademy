const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "enrollment_approved",
        "enrollment_rejected",
        "payment_received",
        "payment_due",
        "announcement",
        "attendance",
        "achievement",
        "class_update",
        "schedule_change",
        "general",
      ],
      default: "general",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    channels: {
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false },
      smsSent: { type: Boolean, default: false },
      whatsappSent: { type: Boolean, default: false },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
