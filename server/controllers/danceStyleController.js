const DanceStyle = require("../models/DanceStyle");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/dance-styles — Public
const getAllDanceStyles = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  const query = {};
  if (isActive !== undefined) query.isActive = isActive === "true";
  else query.isActive = true;

  const styles = await DanceStyle.find(query).sort({ name: 1 });
  res.json(new ApiResponse(200, styles));
});

// @route GET /api/dance-styles/:id — Public
const getDanceStyleById = asyncHandler(async (req, res) => {
  const style = await DanceStyle.findById(req.params.id);
  if (!style) throw new ApiError(404, "Dance style not found");
  res.json(new ApiResponse(200, style));
});

// @route POST /api/dance-styles — Admin
const createDanceStyle = asyncHandler(async (req, res) => {
  const style = await DanceStyle.create(req.body);
  res.status(201).json(new ApiResponse(201, style, "Dance style created"));
});

// @route PUT /api/dance-styles/:id — Admin
const updateDanceStyle = asyncHandler(async (req, res) => {
  const style = await DanceStyle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!style) throw new ApiError(404, "Dance style not found");
  res.json(new ApiResponse(200, style, "Dance style updated"));
});

// @route DELETE /api/dance-styles/:id — Admin
const deleteDanceStyle = asyncHandler(async (req, res) => {
  const style = await DanceStyle.findByIdAndDelete(req.params.id);
  if (!style) throw new ApiError(404, "Dance style not found");
  res.json(new ApiResponse(200, {}, "Dance style deleted"));
});

module.exports = {
  getAllDanceStyles,
  getDanceStyleById,
  createDanceStyle,
  updateDanceStyle,
  deleteDanceStyle,
};
