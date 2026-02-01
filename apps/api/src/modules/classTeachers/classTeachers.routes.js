import express from "express";
const router = express.Router();

import {
  assignClassTeacherController,
  getClassTeacherController,
  // removeClassTeacherController,
} from "./classTeachers.controller.js";

router.post("/assign", assignClassTeacherController);
router.get("/current", getClassTeacherController);
// router.delete("/:id", removeClassTeacherController);

export default router;