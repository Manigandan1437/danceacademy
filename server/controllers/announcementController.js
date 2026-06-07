const Announcement = require("../models/Announcement");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/announcements — Auth (filtered by role) or Public (public ones)
const getAnnouncements = asyncHandler(async (req, res) => {
  const query = { isActive: true };

  if (!req.user) {
    // Public access: only public announcements
    query.isPublic = true;
  } else {
    // Authenticated: show announcements targeted to their role or 'all'
    query.$or = [
      { targetAudience: "all" },
      { targetAudience: req.user.role },
      { isPublic: true },
    ];
  }

  // Exclude expired announcements
  query.$or = query.$or || [{}];
  query.$and = [
    { $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] },
  ];

  const announcements = await Announcement.find(query)
    .populate("author", "name avatar role")
    .sort({ priority: -1, createdAt: -1 })
    .limit(50);

  res.json(new ApiResponse(200, announcements));
});

// @route POST /api/announcements — Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    ...req.body,
    author: req.user._id,
  });
  res
    .status(201)
    .json(new ApiResponse(201, announcement, "Announcement created"));
});

// @route PUT /api/announcements/:id — Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!announcement) throw new ApiError(404, "Announcement not found");
  res.json(new ApiResponse(200, announcement, "Announcement updated"));
});

// @route DELETE /api/announcements/:id — Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) throw new ApiError(404, "Announcement not found");
  res.json(new ApiResponse(200, {}, "Announcement deleted"));
});

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
