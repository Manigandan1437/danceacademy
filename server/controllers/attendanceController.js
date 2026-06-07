const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const Class = require("../models/Class");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @route POST /api/attendance — Instructor / Admin
const markAttendance = asyncHandler(async (req, res) => {
  const { class: classId, date, records } = req.body;

  // Verify instructor owns the class
  if (req.user.role === "instructor") {
    const cls = await Class.findOne({ _id: classId, instructor: req.user._id });
    if (!cls) throw new ApiError(403, "Not authorized for this class");
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({
    class: classId,
    date: attendanceDate,
  });
  if (existing) {
    existing.records = records;
    existing.markedBy = req.user._id;
    await existing.save();
    return res.json(new ApiResponse(200, existing, "Attendance updated"));
  }

  const attendance = await Attendance.create({
    class: classId,
    date: attendanceDate,
    markedBy: req.user._id,
    records,
  });

  res.status(201).json(new ApiResponse(201, attendance, "Attendance marked"));
});

// @route GET /api/attendance/class/:classId — Instructor / Admin
const getClassAttendance = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { from, to } = req.query;
  const query = { class: classId };

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const attendance = await Attendance.find(query)
    .populate("records.student", "name avatar")
    .sort({ date: -1 });

  res.json(new ApiResponse(200, attendance));
});

// @route GET /api/attendance/student/:studentId — Admin / Instructor / Student (own)
const getStudentAttendance = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (req.user.role === "student" && req.user._id.toString() !== studentId) {
    throw new ApiError(403, "Access denied");
  }

  const attendance = await Attendance.find({ "records.student": studentId })
    .populate("class", "name")
    .sort({ date: -1 });

  const summary = attendance.map((a) => {
    const record = a.records.find((r) => r.student.toString() === studentId);
    return {
      classId: a.class._id,
      className: a.class.name,
      date: a.date,
      status: record?.status || "absent",
    };
  });

  res.json(new ApiResponse(200, { records: summary }));
});

// @route GET /api/attendance/:classId/:date — Instructor / Admin (fetch attendance for a specific class on a date)
const getAttendanceByDate = asyncHandler(async (req, res) => {
  const { classId, date } = req.params;
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const attendance = await Attendance.findOne({
    class: classId,
    date: attendanceDate,
  }).populate("records.student", "name avatar");

  res.json(new ApiResponse(200, attendance));
});

// @route GET /api/attendance/enrolled-students/:classId — Get enrolled students for a class
const getEnrolledStudentsForClass = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({
    class: req.params.classId,
    status: "approved",
  }).populate("student", "name avatar email phone");

  const students = enrollments.map((e) => e.student);
  res.json(new ApiResponse(200, students));
});

module.exports = {
  markAttendance,
  getClassAttendance,
  getStudentAttendance,
  getAttendanceByDate,
  getEnrolledStudentsForClass,
};
