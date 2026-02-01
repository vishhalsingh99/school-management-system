import express from "express";
const router = express.Router();

import {
  createExamController,
  listExamsController,
  getExamByIdController,
  updateExamController,
  deleteExamController
} from "./exams.controller.js";

router.post("/create", createExamController);
router.get("/", listExamsController);
router.get("/:id", getExamByIdController);
router.put("/:id/update", updateExamController);
router.delete("/:id/delete", deleteExamController);

export default router;
