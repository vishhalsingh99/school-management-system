import {
  assignClassTeacher,           // yeh ab upsert logic wala hai (model se)
  getClassTeacher,
  teacherAlreadyClassTeacher,
  // classTeacherExists → ab directly model mein use nahi kar rahe, kyunki upsert handle karega
  // removeClassTeacher → hataya
} from "./classTeachers.model.js";

import { success, error } from "../../utils/response.js";

import {
  teacherExists,
  classExists,
  sectionExistsInClass,
  academicYearExists,
} from "../common/academic.helpers.js";

/**
 * POST /api/class-teachers/assign
 * 
 * - First time assign → creates new record
 * - Already assigned hai → updates teacher_id (change class teacher)
 */
export function assignClassTeacherController(req, res) {
  try {
    const { teacher_id, class_id, section_id, academic_year_id } = req.body;

    if (!teacher_id || !class_id || !section_id || !academic_year_id) {
      return error(res, "All fields required", 400);
    }

    // Basic type coercion + validation
    const tid = Number(teacher_id);
    const cid = Number(class_id);
    const sid = Number(section_id);
    const ayid = Number(academic_year_id);

    if (isNaN(tid) || isNaN(cid) || isNaN(sid) || isNaN(ayid)) {
      return error(res, "Invalid numeric IDs", 400);
    }

    if (!teacherExists(tid)) {
      return error(res, "Invalid teacher", 400);
    }

    if (!classExists(cid)) {
      return error(res, "Invalid class", 400);
    }

    if (!sectionExistsInClass(cid, sid)) {
      return error(res, "Section does not belong to this class", 400);
    }

    if (!academicYearExists(ayid)) {
      return error(res, "Invalid academic year", 400);
    }

    // Teacher already class teacher kahin aur?
    const existingAssignment = teacherAlreadyClassTeacher(tid, ayid);

    if (existingAssignment) {
      // Sirf tab allow agar SAME class-section pe re-assign kar rahe hain
      // (mostly unnecessary lekin safe)
      if (
        String(existingAssignment.class_name) !== String(cid) ||
        String(existingAssignment.section_name) !== String(sid)
      ) {
        return error(
          res,
          `Teacher is already class teacher of ${existingAssignment.class_name} - ${existingAssignment.section_name}`,
          409,
        );
      }
    }

    // Ab actual upsert call
    const result = assignClassTeacher({
      teacher_id: tid,
      class_id: cid,
      section_id: sid,
      academic_year_id: ayid,
    });

    const isNew = !result.existing; // agar model mein existing flag return kar rahe ho to

    return success(
      res,
      {
        message: isNew 
          ? "Class teacher assigned successfully" 
          : "Class teacher updated successfully",
        id: result.id,
      },
      isNew ? 201 : 200,
    );
  } catch (err) {
    console.error("Assign class teacher error:", err);
    return error(res, "Failed to assign/update class teacher", 500);
  }
}

/**
 * GET /api/class-teachers/current
 */
export function getClassTeacherController(req, res) {
  try {
    const { class_id, section_id, academic_year_id } = req.query;

    const cid = Number(class_id);
    const sid = Number(section_id);
    const ayid = Number(academic_year_id);

    if (isNaN(cid) || isNaN(sid) || isNaN(ayid)) {
      return error(res, "Invalid parameters", 400);
    }

    const teacher = getClassTeacher(cid, sid, ayid);
    return success(res, teacher || null);
  } catch (err) {
    console.error("Get class teacher error:", err);
    return error(res, "Failed to fetch class teacher", 500);
  }
}

// DELETE route → intentionally hataya gaya hai
// Agar future mein zarurat pade to wapas add kar sakte ho