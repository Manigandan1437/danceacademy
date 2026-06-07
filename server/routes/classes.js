const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getInstructorClasses,
} = require("../controllers/classController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");
const { uploadImage } = require("../config/cloudinary");

router.get("/", getAllClasses);
router.get(
  "/instructor/my",
  protect,
  authorize("instructor", "admin"),
  getInstructorClasses,
);
router.get("/:id", getClassById);
router.post(
  "/",
  protect,
  authorize("admin"),
  uploadImage.single("thumbnail"),
  createClass,
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  uploadImage.single("thumbnail"),
  updateClass,
);
router.delete("/:id", protect, authorize("admin"), deleteClass);

module.exports = router;
