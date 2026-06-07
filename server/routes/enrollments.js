const express = require("express");
const router = express.Router();
const {
  applyForEnrollment,
  getAllEnrollments,
  getMyEnrollments,
  approveEnrollment,
  rejectEnrollment,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.post("/", protect, authorize("visitor", "student"), applyForEnrollment);
router.get("/", protect, authorize("admin"), getAllEnrollments);
router.get("/my", protect, authorize("student", "visitor"), getMyEnrollments);
router.put("/:id/approve", protect, authorize("admin"), approveEnrollment);
router.put("/:id/reject", protect, authorize("admin"), rejectEnrollment);

module.exports = router;
