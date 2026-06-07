const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { createOrder, verifySignature } = require("../services/razorpayService");
const { createNotification } = require("../services/notificationService");

// @route POST /api/payments/create-order — Student
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { enrollmentId, amount, description } = req.body;

  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    student: req.user._id,
  });
  if (!enrollment) throw new ApiError(404, "Enrollment not found");
  if (enrollment.status !== "approved")
    throw new ApiError(400, "Enrollment must be approved before payment");

  const receipt = `rcpt_${Date.now()}_${req.user._id.toString().slice(-4)}`;
  const order = await createOrder(amount, receipt, {
    studentId: req.user._id.toString(),
    enrollmentId: enrollmentId,
  });

  // Create a pending payment record
  const payment = await Payment.create({
    student: req.user._id,
    enrollment: enrollmentId,
    class: enrollment.class,
    amount,
    razorpayOrderId: order.id,
    description,
    status: "pending",
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id,
        key: process.env.RAZORPAY_KEY_ID,
      },
      "Order created",
    ),
  );
});

// @route POST /api/payments/verify — Student
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } =
    req.body;

  const isValid = verifySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  );
  if (!isValid)
    throw new ApiError(400, "Payment verification failed: invalid signature");

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      razorpayPaymentId,
      razorpaySignature,
      status: "completed",
      paidAt: new Date(),
      paymentMethod: "razorpay",
    },
    { new: true },
  );

  // Notify student (fire-and-forget — don't block the payment response)
  createNotification({
    recipientId: req.user._id,
    title: "Payment Successful",
    message: `Payment of ₹${payment.amount} received. Receipt: ${payment.receiptNumber}`,
    type: "payment_received",
    channels: { inApp: true, sms: true, whatsapp: true },
    phone: req.user.phone,
  }).catch((err) => console.error("[Notification] Error:", err.message));

  res.json(new ApiResponse(200, payment, "Payment verified successfully"));
});

// @route GET /api/payments — Admin
const getAllPayments = asyncHandler(async (req, res) => {
  const {
    status,
    studentId,
    classId,
    from,
    to,
    page = 1,
    limit = 20,
  } = req.query;
  const query = {};
  if (status) query.status = status;
  if (studentId) query.student = studentId;
  if (classId) query.class = classId;
  if (from || to) {
    query.paidAt = {};
    if (from) query.paidAt.$gte = new Date(from);
    if (to) query.paidAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("student", "name email phone")
      .populate("class", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, {
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

// @route GET /api/payments/my — Student
const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ student: req.user._id })
    .populate("class", "name")
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, payments));
});

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getAllPayments,
  getMyPayments,
};
