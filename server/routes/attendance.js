const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getEnrolledStudentsForClass,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.post("/", protect, authorize("instructor", "admin"), markAttendance);
router.get(
  "/class/:classId",
  protect,
  authorize("instructor", "admin"),
  getClassAttendance,
);
router.get(
  "/enrolled-students/:classId",
  protect,
  authorize("instructor", "admin"),
  getEnrolledStudentsForClass,
);
router.get("/student/:studentId", protect, getStudentAttendance);
router.get(
  "/:classId/:date",
  protect,
  authorize("instructor", "admin"),
  getAttendanceByDate,
);

module.exports = router;
