const Enrollment = require("../models/Enrollment");
const Class = require("../models/Class");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { createNotification } = require("../services/notificationService");

// @route POST /api/enrollments — Student
const applyForEnrollment = asyncHandler(async (req, res) => {
  const { class: classId, feePlan } = req.body;

  const cls = await Class.findById(classId);
  if (!cls || !cls.isActive)
    throw new ApiError(404, "Class not found or inactive");

  const existing = await Enrollment.findOne({
    student: req.user._id,
    class: classId,
  });
  if (existing) {
    if (["pending", "approved"].includes(existing.status)) {
      throw new ApiError(
        400,
        `You already have a ${existing.status} enrollment for this class`,
      );
    }
    // Re-apply if previously rejected/cancelled
    existing.status = "pending";
    existing.feePlan = feePlan || "monthly";
    existing.rejectionReason = undefined;
    await existing.save();
    return res
      .status(200)
      .json(new ApiResponse(200, existing, "Re-application submitted"));
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    class: classId,
    feePlan: feePlan || "monthly",
  });

  // Notify all admins in parallel (fire-and-forget — don't block response)
  const admins = await User.find({ role: "admin" }).select("_id");
  Promise.all(
    admins.map((admin) =>
      createNotification({
        recipientId: admin._id,
        title: "New Enrollment Application",
        message: `${req.user.name} has applied for ${cls.name}`,
        type: "enrollment_approved",
        link: `/admin/enrollments`,
      }),
    ),
  ).catch((err) =>
    console.error("[Notification] Admin notify error:", err.message),
  );

  res
    .status(201)
    .json(new ApiResponse(201, enrollment, "Enrollment application submitted"));
});

// @route GET /api/enrollments — Admin
const getAllEnrollments = asyncHandler(async (req, res) => {
  const { status, classId, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (classId) query.class = classId;

  const skip = (Number(page) - 1) * Number(limit);
  const [enrollments, total] = await Promise.all([
    Enrollment.find(query)
      .populate("student", "name email phone avatar")
      .populate("class", "name danceStyle fees")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Enrollment.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, {
      enrollments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

// @route GET /api/enrollments/my — Student
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "class",
      select: "name danceStyle instructor thumbnail fees level",
      populate: [
        { path: "danceStyle", select: "name" },
        { path: "instructor", select: "name avatar" },
      ],
    })
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, enrollments));
});

// @route PUT /api/enrollments/:id/approve — Admin
const approveEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate(
    "student class",
  );
  if (!enrollment) throw new ApiError(404, "Enrollment not found");
  if (enrollment.status === "approved")
    throw new ApiError(400, "Already approved");

  enrollment.status = "approved";
  enrollment.approvedBy = req.user._id;
  enrollment.approvedAt = new Date();
  enrollment.startDate = req.body.startDate || new Date();
  if (req.body.endDate) enrollment.endDate = req.body.endDate;
  if (req.body.adminNote) enrollment.adminNote = req.body.adminNote;
  await enrollment.save();

  // Run class count update and student role update in parallel
  await Promise.all([
    Class.findByIdAndUpdate(enrollment.class._id, {
      $inc: { enrolledCount: 1 },
    }),
    User.findByIdAndUpdate(enrollment.student._id, {
      enrollmentStatus: "approved",
      role: "student",
    }),
  ]);

  // Notify student (fire-and-forget — enrollment.student is already populated)
  createNotification({
    recipientId: enrollment.student._id,
    title: "Enrollment Approved!",
    message: `Your enrollment for ${enrollment.class.name} has been approved. Welcome aboard!`,
    type: "enrollment_approved",
    link: "/student/classes",
    channels: { inApp: true, sms: true, whatsapp: true },
    phone: enrollment.student?.phone,
  }).catch((err) => console.error("[Notification] Error:", err.message));

  res.json(new ApiResponse(200, enrollment, "Enrollment approved"));
});

// @route PUT /api/enrollments/:id/reject — Admin
const rejectEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate(
    "student class",
  );
  if (!enrollment) throw new ApiError(404, "Enrollment not found");

  enrollment.status = "rejected";
  enrollment.rejectionReason =
    req.body.reason || "Application rejected by admin";
  await enrollment.save();

  // Notify student (fire-and-forget — enrollment.student is already populated)
  createNotification({
    recipientId: enrollment.student._id,
    title: "Enrollment Update",
    message: `Your enrollment application for ${enrollment.class.name} was not approved. Reason: ${enrollment.rejectionReason}`,
    type: "enrollment_rejected",
    channels: { inApp: true, sms: true, whatsapp: false },
    phone: enrollment.student?.phone,
  }).catch((err) => console.error("[Notification] Error:", err.message));

  res.json(new ApiResponse(200, enrollment, "Enrollment rejected"));
});

module.exports = {
  applyForEnrollment,
  getAllEnrollments,
  getMyEnrollments,
  approveEnrollment,
  rejectEnrollment,
};
