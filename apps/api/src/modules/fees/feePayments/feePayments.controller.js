import db from "../../../database/db.js";
import {
  collectFeeTransaction,
  getPaymentReceipt,
} from "./feePayments.model.js";
import { success, error } from "../../../utils/response.js";

/**
 * POST /api/fees/payments/collect
 * Body:
 * {
 *   student_id,
 *   academic_year_id,
 *   amount,
 *   mode,
 *   receipt_no,
 *   reference_no?,
 *   remarks?
 * }
 */
export function collectFeeController(req, res) {
  try {
    const {
      student_id,
      academic_year_id,
      amount,
      mode,
      receipt_no,
      reference_no,
      remarks,
    } = req.body;

    /* =====================
       BASIC VALIDATION
    ====================== */
    if (!student_id || !academic_year_id || !amount || !receipt_no) {
      return error(res, "Required fields missing", 400);
    }

    if (amount <= 0) {
      return error(res, "Invalid payment amount", 400);
    }

    const allowedModes = ["cash", "upi", "bank", "cheque", "online"];
    if (mode && !allowedModes.includes(mode)) {
      return error(res, "Invalid payment mode", 400);
    }

    /* =====================
       EXECUTE TRANSACTION
    ====================== */
    const paymentId = collectFeeTransaction({
      student_id,
      academic_year_id,
      amount,
      mode,
      receipt_no,
      reference_no,
      remarks,
    });

    return success(res, {
      message: "Fee payment recorded successfully",
      payment_id: paymentId,
    });
  } catch (err) {
    console.error("Collect fee error:", err);

    // Unique receipt constraint
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return error(res, "Receipt number already exists", 409);
    }

    return error(res, "Failed to record fee payment", 500);
  }
}


export function getFeeReceiptController(req, res) {
  const { paymentId } = req.params;

  const receipt = getPaymentReceipt(paymentId);
  if (!receipt) {
    return error(res, "Receipt not found", 404);
  }

  return success(res, receipt);
}
