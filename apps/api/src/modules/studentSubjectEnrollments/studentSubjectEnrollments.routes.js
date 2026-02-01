import express from "express";
const router = express.Router();

import {
  enrollStudentSubjectController,
  getStudentEnrollmentsController,
  removeStudentEnrollmentController,
} from "./studentSubjectEnrollments.controller.js";

router.post("/enroll", enrollStudentSubjectController);
router.get("/:student_id", getStudentEnrollmentsController);
router.delete("/:id/remove", removeStudentEnrollmentController);

export default router;
