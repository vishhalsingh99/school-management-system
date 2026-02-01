import {
  recordExists,
  deactivateCurrentRecord,
  createAcademicRecord,
  getAcademicHistory,
} from "./studentAcademics.model.js";
import { success, error } from "../../utils/response.js";

import {
  studentExists,
  academicYearExists,
  classExists,
  sectionExistsInClass,
} from "../common/academic.helpers.js";

/**
 * POST /api/student-academics/assign
 */
export function assignAcademicRecordController(req, res) {
  try {
    const {
      student_id,
      academic_year_id,
      class_id,
      section_id,
      roll_no,
      status,
    } = req.body;

    if (!student_id || !academic_year_id || !class_id || !section_id) {
      return error(
        res,
        "student_id, academic_year_id, class_id, section_id are required",
        400
      );
    }

    if (!studentExists(student_id)) {
      return error(res, "Invalid student_id", 400);
    }

    if (!academicYearExists(academic_year_id)) {
      return error(res, "Invalid academic year", 400);
    }

    if (!classExists(class_id)) {
      return error(res, "Invalid class", 400);
    }

    if (!sectionExistsInClass(class_id, section_id)) {
      return error(res, "Section does not belong to class", 400);
    }

    // 🚫 Prevent duplicate academic year entry
    if (recordExists(student_id, academic_year_id)) {
      return error(res, "Academic record already exists for this year", 409);
    }

    // ✅ Deactivate old record
    deactivateCurrentRecord(student_id);

    // ✅ Create new record
    createAcademicRecord({
      student_id,
      academic_year_id,
      class_id,
      section_id,
      roll_no,
      status: status || "studying",
    });

    return success(res, {
      message: "Academic record assigned successfully",
    }, 201);

  } catch (err) {
    console.error("Assign academic record error:", err);
    return error(res, "Failed to assign academic record", 500);
  }
}

/**
 * GET /api/student-academics/:student_id/history
 */
export function getAcademicHistoryController(req, res) {
  try {
    const studentId = Number(req.params.student_id);

    if (!studentId) {
      return error(res, "Invalid student_id", 400);
    }

    if (!studentExists(studentId)) {
      return error(res, "Student not found", 404);
    }

    const history = getAcademicHistory(studentId);
    return success(res, history);
  } catch (err) {
    console.error("Get academic history error:", err);
    return error(res, "Failed to fetch academic history", 500);
  }
}
