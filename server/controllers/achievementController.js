const Achievement = require("../models/Achievement");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { createNotification } = require("../services/notificationService");

// @route GET /api/achievements — Admin
const getAllAchievements = asyncHandler(async (req, res) => {
  const { studentId, type, classId } = req.query;
  const query = {};
  if (studentId) query.student = studentId;
  if (type) query.type = type;
  if (classId) query.relatedClass = classId;

  const achievements = await Achievement.find(query)
    .populate("student", "name avatar email")
    .populate("relatedClass", "name")
    .populate("awardedBy", "name")
    .sort({ achievedDate: -1 });

  res.json(new ApiResponse(200, achievements));
});

// @route GET /api/achievements/my — Student
const getMyAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ student: req.user._id })
    .populate("relatedClass", "name")
    .populate("awardedBy", "name avatar")
    .sort({ achievedDate: -1 });
  res.json(new ApiResponse(200, achievements));
});

// @route POST /api/achievements — Admin / Instructor
const createAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.create({
    ...req.body,
    awardedBy: req.user._id,
  });

  // Notify student (fire-and-forget — no extra DB query for phone needed)
  createNotification({
    recipientId: req.body.student,
    title: "🏆 New Achievement Unlocked!",
    message: `Congratulations! You earned: ${req.body.title}`,
    type: "achievement",
    link: "/student/achievements",
    channels: { inApp: true, sms: false, whatsapp: false },
  }).catch((err) => console.error("[Notification] Error:", err.message));

  res
    .status(201)
    .json(new ApiResponse(201, achievement, "Achievement awarded"));
});

// @route PUT /api/achievements/:id — Admin / Instructor
const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!achievement) throw new ApiError(404, "Achievement not found");
  res.json(new ApiResponse(200, achievement, "Achievement updated"));
});

// @route DELETE /api/achievements/:id — Admin
const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  if (!achievement) throw new ApiError(404, "Achievement not found");
  res.json(new ApiResponse(200, {}, "Achievement deleted"));
});

module.exports = {
  getAllAchievements,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
