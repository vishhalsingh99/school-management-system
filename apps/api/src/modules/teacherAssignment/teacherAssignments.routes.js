import express from "express";
const router = express.Router();

import {
  assignTeacherController,
  getTeacherAssignmentsController,
} from "./teacherAssignments.controller.js";

router.post("/assign", assignTeacherController);
router.get("/:teacher_id", getTeacherAssignmentsController);

export default router;
