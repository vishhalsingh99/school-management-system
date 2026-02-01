import {
  getStudentFeeAccount,
  getStudentFeeDues,
  getPaymentHistory,
  getMonthlyFeeStatus,
  getMonthlyComponentDues
} from "./feeLedger.model.js";

import { success, error } from "../../../utils/response.js";
/**
 * GET /api/fees/ledger/:student_id?academic_year_id=1
 */
export function getStudentFeeLedgerController(req, res) {
  try {
    const { student_id } = req.params;
    const { academic_year_id } = req.query;

    if (!academic_year_id) {
      return error(res, "academic_year_id required", 400);
    }

    const account = getStudentFeeAccount(student_id, academic_year_id);
    if (!account) {
      return error(res, "Fee account not found", 404);
    }

    const dues = getStudentFeeDues(student_id, academic_year_id);
    const payments = getPaymentHistory(student_id, academic_year_id);

    return success(res, {
      account,
      dues,
      payments,
    });
  } catch (err) {
    console.error("Fee ledger error:", err);
    return error(res, "Failed to load fee ledger", 500);
  }
}



export function getStudentMonthlyFeesController(req, res) {
  try {
    const { student_id } = req.params;
    const { academic_year_id } = req.query;

    if (!academic_year_id) {
      return error(res, "academic_year_id required", 400);
    }

    const data = getMonthlyFeeStatus(student_id, academic_year_id);

    return success(res, data);
  } catch (err) {
    console.error(err);
    return error(res, "Failed to load monthly fees", 500);
  }
}

export function getMonthlyComponentFeesController(req, res) {
  const { student_id } = req.params;
  const { academic_year_id } = req.query;

  const data = getMonthlyComponentDues(
    student_id,
    academic_year_id
  );

  return success(res, data);
}
