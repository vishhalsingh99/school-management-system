import express from "express";
const router = express.Router();

import {
  createFeeStructureController,
  addFeeComponentController,
  getFeeStructureController,
} from "./feeStructures.controller.js";

router.post("/create", createFeeStructureController);
router.post("/component/add", addFeeComponentController);
router.get("/view", getFeeStructureController);

export default router;
