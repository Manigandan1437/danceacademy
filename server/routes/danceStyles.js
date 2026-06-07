const express = require("express");
const router = express.Router();
const {
  getAllDanceStyles,
  getDanceStyleById,
  createDanceStyle,
  updateDanceStyle,
  deleteDanceStyle,
} = require("../controllers/danceStyleController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.get("/", getAllDanceStyles);
router.get("/:id", getDanceStyleById);
router.post("/", protect, authorize("admin"), createDanceStyle);
router.put("/:id", protect, authorize("admin"), updateDanceStyle);
router.delete("/:id", protect, authorize("admin"), deleteDanceStyle);

module.exports = router;
