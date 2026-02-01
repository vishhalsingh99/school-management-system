import {
  assignTeacherToSubject,
  assignmentExists,
  getTeacherAssignments,
} from "./teacherAssignments.model.js";

import { success, error } from "../../utils/response.js";

export function assignTeacherController(req, res) {
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

    if (assignmentExists(req.body)) {
      return error(res, "Assignment already exists", 409);
    }

    const result = assignTeacherToSubject(req.body);

    return success(
      res,
      { message: "Teacher assigned successfully", id: result.id },
      201
    );
  } catch (err) {
    console.error("Assign teacher error:", err);
    return error(res, "Failed to assign teacher", 500);
  }
}

export function getTeacherAssignmentsController(req, res) {
  return success(
    res,
    getTeacherAssignments(req.params.teacher_id)
  );
}
