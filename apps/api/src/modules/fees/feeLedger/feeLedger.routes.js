import express from "express";
const router = express.Router();

import {
  getStudentFeeLedgerController,
  getStudentMonthlyFeesController,
  getMonthlyComponentFeesController,
} from "./feeLedger.controller.js";

router.get("/:student_id", getStudentFeeLedgerController);
router.get("/:student_id/monthly", getStudentMonthlyFeesController);
router.get(
  "/:student_id/monthly-components",
  getMonthlyComponentFeesController,
);

export default router;
