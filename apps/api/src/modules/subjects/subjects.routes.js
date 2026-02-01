import express from "express";
const router = express.Router();

import {
  createSubjectController,
  getAllSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  deleteSubjectController,
} from "./subjects.controller.js";

router.post("/create", createSubjectController);
router.get("/list", getAllSubjectsController);
router.get("/:id", getSubjectByIdController);
router.put("/:id/update", updateSubjectController);
router.delete("/:id/delete", deleteSubjectController);

export default router;
