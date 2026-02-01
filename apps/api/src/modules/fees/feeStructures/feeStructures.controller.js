import {
  createFeeStructure,
  addFeeComponent,
  getFeeStructure,
} from "./feeStructures.model.js";
import { success, error } from "../../../utils/response.js";

export function createFeeStructureController(req, res) {
  const { class_id, academic_year_id } = req.body;

  if (!class_id || !academic_year_id) {
    return error(res, "class_id & academic_year_id required", 400);
  }

  try {
    const result = createFeeStructure({ class_id, academic_year_id });
    return success(res, result, 201);
  } catch (e) {
    return error(res, "Fee structure already exists", 409);
  }
}

export function addFeeComponentController(req, res) {
  const { fee_structure_id, name, frequency, amount, is_optional } = req.body;

  if (!fee_structure_id || !name || !frequency || !amount) {
    return error(res, "Missing fields", 400);
  }

  addFeeComponent({
    fee_structure_id,
    name,
    frequency,
    amount,
    is_optional,
  });

  return success(res, { message: "Component added" }, 201);
}

export function getFeeStructureController(req, res) {
  const { class_id, academic_year_id } = req.query;

  const data = getFeeStructure(class_id, academic_year_id);
  if (!data) return error(res, "Not found", 404);

  return success(res, data);
}
