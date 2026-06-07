const Schedule = require("../models/Schedule");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/schedules — Public
const getAllSchedules = asyncHandler(async (req, res) => {
  const { classId, day, isActive = true } = req.query;
  const query = {};
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (classId) query.class = classId;
  if (day) query.dayOfWeek = day;

  const schedules = await Schedule.find(query)
    .populate({
      path: "class",
      select: "name level ageGroup duration instructor danceStyle thumbnail",
      populate: [
        { path: "instructor", select: "name avatar" },
        { path: "danceStyle", select: "name category" },
      ],
    })
    .sort({ startTime: 1 });

  res.json(new ApiResponse(200, schedules));
});

// @route POST /api/schedules — Admin
const createSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.create(req.body);
  res.status(201).json(new ApiResponse(201, schedule, "Schedule created"));
});

// @route PUT /api/schedules/:id — Admin
const updateSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!schedule) throw new ApiError(404, "Schedule not found");
  res.json(new ApiResponse(200, schedule, "Schedule updated"));
});

// @route DELETE /api/schedules/:id — Admin
const deleteSchedule = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule) throw new ApiError(404, "Schedule not found");
  res.json(new ApiResponse(200, {}, "Schedule deleted"));
});

module.exports = {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
