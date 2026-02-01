import {
  markAttendance,
  getAttendance,
  getStudentAttendance,
} from "./attendance.model.js";


export function markAttendanceController(req, res) {
  try {
    const { student_id, date, status } = req.body;

    if (!student_id || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "student_id, date and status are required",
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be present or absent",
      });
    }

    markAttendance({ student_id, date, status });

    res.json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
    });
  }
}


export function getAttendanceController(req, res) {
  try {
    const { class_id, date } = req.query;

    if (!class_id || !date) {
      return res.status(400).json({
        success: false,
        message: "class_id and date are required",
      });
    }

    const data = getAttendance({ class_id, date });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Get attendance error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
}


export function getStudentAttendanceController(req, res) {
  try {
    const data = getStudentAttendance(req.params.student_id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Get student attendance error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
}
