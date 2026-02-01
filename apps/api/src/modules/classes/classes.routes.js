import express from "express";
const router = express.Router();

import {
  createClassController,
  getAllClassesController,
  getClassByIdController,
  updateClassController,
  deleteClassController,
} from "./classes.controller.js";

router.post("/create", createClassController);
router.get("/list", getAllClassesController);
router.get("/:id", getClassByIdController);
router.put("/:id/update", updateClassController);
router.delete("/:id/delete", deleteClassController);

export default router;