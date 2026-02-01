import express from "express";
const router = express.Router();

import {
  markAttendanceController,
  getAttendanceController,
  getStudentAttendanceController,
} from "./attendance.controller.js";

/* ROUTES */

// mark / update attendance
router.post("/mark", markAttendanceController);

// get class attendance (date wise)
router.get("/", getAttendanceController);

// student attendance history
router.get("/student/:student_id", getStudentAttendanceController);

export default router;

