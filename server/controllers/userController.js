const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/users  — Admin only
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20, isActive } = req.query;
  const query = {};

  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken")
      .populate("specializations", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, {
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

// @route GET /api/users/:id — Admin only
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password -refreshToken")
    .populate("specializations", "name category");
  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user));
});

// @route PUT /api/users/:id — Admin only
const updateUser = asyncHandler(async (req, res) => {
  const forbidden = ["password", "refreshToken", "email"];
  forbidden.forEach((f) => delete req.body[f]);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");
  res.json(new ApiResponse(200, user, "User updated"));
});

// @route PUT /api/users/:id/toggle-status — Admin only
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.json(
    new ApiResponse(
      200,
      { isActive: user.isActive },
      `User ${user.isActive ? "activated" : "deactivated"}`,
    ),
  );
});

// @route DELETE /api/users/:id — Admin only
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User deleted");
  res.json(new ApiResponse(200, {}, "User deleted"));
});

// @route GET /api/users/public/instructors — Public
const getPublicInstructors = asyncHandler(async (req, res) => {
  const instructors = await User.find({
    role: "instructor",
    isActive: true,
    isProfilePublic: true,
  })
    .select("name avatar bio experience qualifications specializations")
    .populate("specializations", "name")
    .sort({ experience: -1 })
    .lean();

  res.json(new ApiResponse(200, instructors));
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getPublicInstructors,
};
