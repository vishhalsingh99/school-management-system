import express from "express";
import {
  listAcademicYears,
  createAcademicYearController,
  updateAcademicYear,
  selectAcademicYear,
  getCurrentAcademicYear,
} from "./academicYears.controller.js";

const router = express.Router();

router.get("/list", listAcademicYears);
router.get("/current", getCurrentAcademicYear);

router.post("/create", createAcademicYearController);
router.put("/update/:id", updateAcademicYear);

router.post("/select", selectAcademicYear);

export default router;
