import {
  studentExists,
  academicYearExists,
  studentCurrentAcademic,
  subjectAssignedToClass,
  enrollmentExists,
  enrollStudentSubject,
  getStudentEnrollments,
  deactivateEnrollment,
} from "./studentSubjectEnrollments.model.js";
import { success, error } from "../../utils/response.js";

/**
 * POST /api/student-subject-enrollments/enroll
 */
export function enrollStudentSubjectController(req, res) {
  try {
    const { student_id, subject_id, academic_year_id } = req.body;

    if (!student_id || !subject_id || !academic_year_id) {
      return error(
        res,
        "student_id, subject_id and academic_year_id are required",
        400
      );
    }

    if (!studentExists(student_id)) {
      return error(res, "Invalid student_id", 400);
    }

    if (!academicYearExists(academic_year_id)) {
      return error(res, "Invalid academic_year_id", 400);
    }

    const academic = studentCurrentAcademic(student_id);
    if (!academic) {
      return error(res, "Student has no current academic record", 400);
    }

    if (academic.academic_year_id !== academic_year_id) {
      return error(
        res,
        "Student is not active in this academic year",
        400
      );
    }

    const assigned = subjectAssignedToClass({
      subject_id,
      class_id: academic.class_id,
      section_id: academic.section_id,
      academic_year_id,
    });

    if (!assigned) {
      return error(
        res,
        "Subject not assigned to student's class/section",
        400
      );
    }

    if (enrollmentExists(student_id, subject_id, academic_year_id)) {
      return error(
        res,
        "Student already enrolled in this subject",
        409
      );
    }

    const result = enrollStudentSubject({
      student_id,
      subject_id,
      academic_year_id,
    });

    return success(
      res,
      { message: "Subject enrolled successfully", enrollment: result },
      201
    );
  } catch (err) {
    console.error("Enroll subject error:", err);
    return error(res, "Failed to enroll subject", 500);
  }
}

/**
 * GET /api/student-subject-enrollments/:student_id?academic_year_id=1
 */
export function getStudentEnrollmentsController(req, res) {
  const { student_id } = req.params;
  const { academic_year_id } = req.query;

  if (!academic_year_id) {
    return error(res, "academic_year_id is required", 400);
  }

  if (!studentExists(student_id)) {
    return error(res, "Invalid student_id", 404);
  }

  const academic = studentCurrentAcademic(student_id);
  if (!academic || academic.academic_year_id !== Number(academic_year_id)) {
    return error(res, "Student is not active in this academic year", 400);
  }

  return success(
    res,
    getStudentEnrollments(student_id, academic_year_id)
  );
}


/**
 * DELETE /api/student-subject-enrollments/:id/remove
 */
export function removeStudentEnrollmentController(req, res) {
  const enrollmentId = req.params.id;

  const removed = deactivateEnrollment(enrollmentId);
  if (!removed) {
    return error(res, "Enrollment not found or already inactive", 404);
  }

  return success(res, {
    message: "Subject enrollment removed successfully",
  });
}


