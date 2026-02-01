// src/modules/students/students.routes.js
import express from "express";
const router = express.Router();

import {
  createStudentController,
  getAllStudentsController,
  getNextRegistrationNumberController,
  getStudentByIdController,
  getStudentsByClassSectionController,
} from "./students.controller.js";

router.post("/create", createStudentController);
router.get("/list", getAllStudentsController);
router.get("/by-class-section", getStudentsByClassSectionController);
router.get("/next-reg-no", getNextRegistrationNumberController);
router.get("/:id", getStudentByIdController);

export default router;