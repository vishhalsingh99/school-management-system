import express from "express";
const router = express.Router();

import { collectFeeController, getFeeReceiptController,  } from "./feePayments.controller.js";

router.post("/collect", collectFeeController);
router.get("/:paymentId", getFeeReceiptController);


export default router;
