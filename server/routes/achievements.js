const express = require("express");
const router = express.Router();
const {
  getAllAchievements,
  getMyAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.get("/", protect, authorize("admin", "instructor"), getAllAchievements);
router.get("/my", protect, authorize("student"), getMyAchievements);
router.post("/", protect, authorize("admin", "instructor"), createAchievement);
router.put(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  updateAchievement,
);
router.delete("/:id", protect, authorize("admin"), deleteAchievement);

module.exports = router;
