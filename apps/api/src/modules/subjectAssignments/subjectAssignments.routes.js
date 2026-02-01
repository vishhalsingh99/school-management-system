import express from "express";
const router = express.Router();

import {
  assignSubjectController,
  getAssignmentsByClassController,
  deleteAssignmentController,
} from "./subjectAssignments.controller.js";

router.post("/assign", assignSubjectController);
router.get("/by-class", getAssignmentsByClassController);
router.delete("/:id/delete", deleteAssignmentController);

export default router;
