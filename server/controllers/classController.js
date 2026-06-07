const Class = require("../models/Class");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/classes — Public
const getAllClasses = asyncHandler(async (req, res) => {
  const {
    danceStyle,
    level,
    ageGroup,
    instructor,
    isActive = true,
    page = 1,
    limit = 20,
  } = req.query;
  const query = {};

  if (isActive !== undefined)
    query.isActive = isActive === "true" || isActive === true;
  if (danceStyle) query.danceStyle = danceStyle;
  if (level) query.level = level;
  if (ageGroup) query.ageGroup = ageGroup;
  if (instructor) query.instructor = instructor;

  const skip = (Number(page) - 1) * Number(limit);
  const [classes, total] = await Promise.all([
    Class.find(query)
      .populate("danceStyle", "name category")
      .populate("instructor", "name avatar bio")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Class.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, {
      classes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

// @route GET /api/classes/:id — Public
const getClassById = asyncHandler(async (req, res) => {
  const cls = await Class.findById(req.params.id)
    .populate("danceStyle", "name category description")
    .populate(
      "instructor",
      "name avatar bio experience qualifications specializations",
    );
  if (!cls) throw new ApiError(404, "Class not found");
  res.json(new ApiResponse(200, cls));
});

// @route POST /api/classes — Admin
const createClass = asyncHandler(async (req, res) => {
  if (req.file) req.body.thumbnail = req.file.path;
  const cls = await Class.create(req.body);
  res.status(201).json(new ApiResponse(201, cls, "Class created"));
});

// @route PUT /api/classes/:id — Admin
const updateClass = asyncHandler(async (req, res) => {
  if (req.file) req.body.thumbnail = req.file.path;
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("danceStyle", "name")
    .populate("instructor", "name");
  if (!cls) throw new ApiError(404, "Class not found");
  res.json(new ApiResponse(200, cls, "Class updated"));
});

// @route DELETE /api/classes/:id — Admin
const deleteClass = asyncHandler(async (req, res) => {
  const cls = await Class.findByIdAndDelete(req.params.id);
  if (!cls) throw new ApiError(404, "Class not found");
  res.json(new ApiResponse(200, {}, "Class deleted"));
});

// @route GET /api/classes/instructor/my — Instructor
const getInstructorClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find({ instructor: req.user._id })
    .populate("danceStyle", "name category")
    .sort({ createdAt: -1 });
  res.json(new ApiResponse(200, classes));
});

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getInstructorClasses,
};
