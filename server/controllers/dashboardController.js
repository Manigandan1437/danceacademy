const User = require("../models/User");
const Class = require("../models/Class");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");
const Announcement = require("../models/Announcement");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/dashboard/stats — Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalStudents,
    totalInstructors,
    totalClasses,
    pendingEnrollments,
    monthlyRevenue,
    totalRevenue,
    recentEnrollments,
    recentPayments,
    activeAnnouncements,
  ] = await Promise.all([
    User.countDocuments({ role: "student", isActive: true }),
    User.countDocuments({ role: "instructor", isActive: true }),
    Class.countDocuments({ isActive: true }),
    Enrollment.countDocuments({ status: "pending" }),
    Payment.aggregate([
      { $match: { status: "completed", paidAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.find({ status: "pending" })
      .populate("student", "name avatar email")
      .populate("class", "name")
      .sort({ createdAt: -1 })
      .limit(5),
    Payment.find({ status: "completed" })
      .populate("student", "name")
      .populate("class", "name")
      .sort({ paidAt: -1 })
      .limit(5),
    Announcement.countDocuments({
      isActive: true,
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
    }),
  ]);

  res.json(
    new ApiResponse(200, {
      stats: {
        totalStudents,
        totalInstructors,
        totalClasses,
        pendingEnrollments,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeAnnouncements,
      },
      recentEnrollments,
      recentPayments,
    }),
  );
});

module.exports = { getDashboardStats };
