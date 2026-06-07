const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getPublicInstructors,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

// Public route — no auth required
router.get("/public/instructors", getPublicInstructors);

// All routes below require admin
router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/toggle-status", toggleUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;
