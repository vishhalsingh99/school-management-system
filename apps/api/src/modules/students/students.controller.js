import {
  createStudentWithEnrollment,
  getAllStudents,
  getStudentById,
  getStudentsByClassSection,
  studentExistsByRegNo,
} from "./students.model.js";

import { success, error } from "../../utils/response.js";

import {
  academicYearExists,
  classExists,
  sectionExistsInClass,
} from "../common/academic.helpers.js";

import db from "../../database/db.js";

import { generateStudentFees } from "../fees/feeGeneration.service.js";

/* =========================================================
   POST /api/students/create
   Admit student + enroll in current academic year
========================================================= */
export function createStudentController(req, res) {
  try {
    const {
      reg_no,
      first_name,
      last_name,
      gender,
      dob,
      parent_phone,
      address,
      academic_year_id,
      class_id,
      section_id,
      roll_no,
    } = req.body;

    if (!reg_no || !first_name || !academic_year_id || !class_id || !section_id) {
      return error(res, "Required fields missing", 400);
    }

    const trimmedRegNo = reg_no.trim();

    if (studentExistsByRegNo(trimmedRegNo)) {
      return error(res, "Student already exists", 409);
    }

    if (!academicYearExists(academic_year_id)) {
      return error(res, "Invalid academic year", 400);
    }

    if (!classExists(class_id)) {
      return error(res, "Invalid class", 400);
    }

    if (!sectionExistsInClass(class_id, section_id)) {
      return error(res, "Invalid section for class", 400);
    }

    // ✅ Create student + academic enrollment
    const result = createStudentWithEnrollment({
      reg_no: trimmedRegNo,
      first_name: first_name.trim(),
      last_name: last_name?.trim() || null,
      gender,
      dob,
      parent_phone,
      address,
      academic_year_id,
      class_id,
      section_id,
      roll_no,
    });

    // 🔐 SAFETY CHECK (IMPORTANT)
    const feeAccountExists = db.prepare(`
      SELECT 1 FROM student_fee_accounts
      WHERE student_id = ? AND academic_year_id = ?
    `).get(result.student_id, academic_year_id);

    // ✅ Generate fees ONLY ONCE
    if (!feeAccountExists) {
      generateStudentFees({
        student_id: result.student_id,
        class_id,
        academic_year_id,
      });
    }

    return success(
      res,
      {
        message: "Student admitted successfully",
        student_id: result.student_id,
      },
      201
    );
  } catch (err) {
    console.error("Create student error:", err);
    return error(res, "Failed to admit student", 500);
  }
}

/* =========================================================
   GET /api/students/list
========================================================= */
export function getAllStudentsController(req, res) {
  try {
    const students = getAllStudents();
    return success(res, students);
  } catch (err) {
    console.error("Get students error:", err);
    return error(res, "Failed to fetch students", 500);
  }
}

/* =========================================================
   GET /api/students/:id
========================================================= */
export function getStudentByIdController(req, res) {
  try {
    const student = getStudentById(req.params.id);

    if (!student) {
      return error(res, "Student not found", 404);
    }

    return success(res, student);
  } catch (err) {
    console.error("Get student error:", err);
    return error(res, "Failed to fetch student", 500);
  }
}

/* =========================================================
   GET /api/students/by-class-section
   ?class_id=1&section_id=2
========================================================= */
export function getStudentsByClassSectionController(req, res) {
  try {
    const { class_id, section_id } = req.query;

    if (!class_id || !section_id) {
      return error(
        res,
        "class_id and section_id are required query parameters",
        400
      );
    }

    const students = getStudentsByClassSection(class_id, section_id);
    return success(res, students);
  } catch (err) {
    console.error("Get students by class/section error:", err);
    return error(res, "Failed to fetch students", 500);
  }
}

/**
 * GET /api/students/next-reg-no?academic_year_id=1
 */
export function getNextRegistrationNumberController(req, res) {
  try {
    const { academic_year_id } = req.query;

    if (!academic_year_id) {
      return error(res, "academic_year_id is required", 400);
    }

    const year = db.prepare(`
      SELECT name FROM academic_years WHERE id = ?
    `).get(academic_year_id);

    if (!year) {
      return error(res, "Invalid academic year", 400);
    }

    const yearPrefix = year.name.split("-")[0]; // "2026"

    const last = db.prepare(`
      SELECT reg_no
      FROM students
      WHERE reg_no LIKE ?
      ORDER BY id DESC
      LIMIT 1
    `).get(`SCH-${yearPrefix}-%`);

    let nextNumber = 1;

    if (last) {
      const parts = last.reg_no.split("-");
      nextNumber = parseInt(parts[2]) + 1;
    }

    const reg_no = `SCH-${yearPrefix}-${String(nextNumber).padStart(4, "0")}`;

    return success(res, { reg_no });
  } catch (err) {
    console.error("Next reg no error:", err);
    return error(res, "Failed to generate registration number", 500);
  }
}
