import {
  assignmentExists,
  assignSubjectToClass,
  getAssignmentsByClass,
  deleteAssignment,
} from "./subjectAssignments.model.js";

import { success, error } from "../../utils/response.js";
import {
  academicYearExists,
  classExists,
  sectionExistsInClass,
} from "../common/academic.helpers.js";

/**
 * POST /api/subject-assignments/assign
 */
export function assignSubjectController(req, res) {
  try {
    const {
      teacher_id,
      subject_id,
      class_id,
      section_id,
      academic_year_id,
    } = req.body;

    if (
      !teacher_id ||
      !subject_id ||
      !class_id ||
      !section_id ||
      !academic_year_id
    ) {
      return error(res, "All fields are required", 400);
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

    if (
      assignmentExists({
        subject_id,
        class_id,
        section_id,
        academic_year_id,
      })
    ) {
      return error(
        res,
        "Subject already assigned to this class & section",
        409
      );
    }

    const result = assignSubjectToClass({
      teacher_id,
      subject_id,
      class_id,
      section_id,
      academic_year_id,
    });

    return success(
      res,
      { message: "Subject assigned successfully", id: result.id },
      201
    );
  } catch (err) {
    console.error("Assign subject error:", err);
    return error(res, "Failed to assign subject", 500);
  }
}

/**
 * GET /api/subject-assignments/by-class?class_id=1&academic_year_id=2
 */
export function getAssignmentsByClassController(req, res) {
  const { class_id, academic_year_id } = req.query;

  if (!class_id || !academic_year_id) {
    return error(res, "class_id and academic_year_id are required", 400);
  }

  return success(
    res,
    getAssignmentsByClass(class_id, academic_year_id)
  );
}

/**
 * DELETE /api/subject-assignments/:id/delete
 */
export function deleteAssignmentController(req, res) {
  const deleted = deleteAssignment(req.params.id);
  if (!deleted) return error(res, "Assignment not found", 404);

  return success(res, "Assignment removed successfully");
}
