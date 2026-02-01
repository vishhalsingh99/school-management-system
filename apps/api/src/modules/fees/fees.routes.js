import express from "express";
const router = express.Router();

import feeLedgerRoutes from "./feeLedger/feeLedger.routes.js";
import feePaymentRoutes from "./feePayments/feePayments.routes.js";
import feeStructureRoutes from "./feeStructures/feeStructures.routes.js";

// 👇 sub-modules mount
router.use("/ledger", feeLedgerRoutes);
router.use("/payments", feePaymentRoutes);
router.use("/structures", feeStructureRoutes);

export default router;
