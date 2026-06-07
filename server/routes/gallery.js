const express = require("express");
const router = express.Router();
const {
  getGallery,
  uploadGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const multer = require("multer");

// Dynamic storage: check type in body
const upload = multer({ dest: "uploads/temp/" });

router.get("/", getGallery);
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("file"),
  uploadGalleryItem,
);
router.put("/:id", protect, authorize("admin"), updateGalleryItem);
router.delete("/:id", protect, authorize("admin"), deleteGalleryItem);

module.exports = router;
