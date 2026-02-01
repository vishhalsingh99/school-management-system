import express from "express";
const router = express.Router();

import {
  assignAcademicRecordController,
  getAcademicHistoryController,
} from "./studentAcademics.controller.js";

router.post("/assign", assignAcademicRecordController);
router.get("/:student_id/history", getAcademicHistoryController);

export default router;
