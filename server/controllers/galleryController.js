const Gallery = require("../models/Gallery");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { cloudinary } = require("../config/cloudinary");

// @route GET /api/gallery — Public
const getGallery = asyncHandler(async (req, res) => {
  const { type, category, relatedClass, page = 1, limit = 24 } = req.query;
  const query = { isPublic: true };
  if (type) query.type = type;
  if (category) query.category = category;
  if (relatedClass) query.relatedClass = relatedClass;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Gallery.find(query)
      .populate("relatedClass", "name")
      .populate("uploadedBy", "name")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Gallery.countDocuments(query),
  ]);

  res.json(
    new ApiResponse(200, {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

// @route POST /api/gallery — Admin
const uploadGalleryItem = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "File is required");

  const item = await Gallery.create({
    ...req.body,
    url: req.file.path,
    publicId: req.file.filename,
    thumbnail:
      req.body.type === "video"
        ? req.file.path.replace("/upload/", "/upload/c_thumb,w_400,g_auto/")
        : req.file.path,
    uploadedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, item, "Gallery item uploaded"));
});

// @route PUT /api/gallery/:id — Admin
const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, "Gallery item not found");
  res.json(new ApiResponse(200, item, "Gallery item updated"));
});

// @route DELETE /api/gallery/:id — Admin
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findById(req.params.id);
  if (!item) throw new ApiError(404, "Gallery item not found");

  if (item.publicId) {
    await cloudinary.uploader.destroy(item.publicId, {
      resource_type: item.type === "video" ? "video" : "image",
    });
  }

  await item.deleteOne();
  res.json(new ApiResponse(200, {}, "Gallery item deleted"));
});

module.exports = {
  getGallery,
  uploadGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
