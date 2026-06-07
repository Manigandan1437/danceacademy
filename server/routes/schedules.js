const express = require("express");
const router = express.Router();
const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.get("/", getAllSchedules);
router.post("/", protect, authorize("admin"), createSchedule);
router.put("/:id", protect, authorize("admin"), updateSchedule);
router.delete("/:id", protect, authorize("admin"), deleteSchedule);

module.exports = router;
