// src/modules/teachers/teachers.routes.js
import express from "express";
const router = express.Router();

import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  deactivateTeacherController,
} from "./teachers.controller.js";

router.post("/create", createTeacherController);
router.get("/list", getAllTeachersController);
router.get("/:id", getTeacherByIdController);
router.put("/:id/update", updateTeacherController);
router.delete("/:id/deactivate", deactivateTeacherController);

export default router;
