// src/modules/teachers/teachers.controller.js
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deactivateTeacher,
  teacherExistsByCode,
  teacherExistsByEmail,
} from "./teachers.model.js";

import { success, error } from "../../utils/response.js";

/**
 * POST /api/teachers/create
 */
export function createTeacherController(req, res) {
  try {
    const { code, name, department, phone, email } = req.body;

    if (!code || !name) {
      return error(res, "code and name are required", 400);
    }

    const trimmedCode = code.trim().toUpperCase();

    if (teacherExistsByCode(trimmedCode)) {
      return error(res, "Teacher with this code already exists", 409);
    }

    if (teacherExistsByEmail(email)) {
      return error(res, "Email already assigned to another teacher", 409);
    }

    const result = createTeacher({
      code: trimmedCode,
      name: name.trim(),
      department,
      phone,
      email,
    });

    return success(
      res,
      { message: "Teacher created successfully", teacher_id: result.id },
      201
    );
  } catch (err) {
    console.error("Create teacher error:", err);
    return error(res, "Failed to create teacher", 500);
  }
}

/**
 * GET /api/teachers/list
 */
export function getAllTeachersController(req, res) {
  try {
    return success(res, getAllTeachers());
  } catch (err) {
    console.error("Get teachers error:", err);
    return error(res, "Failed to fetch teachers", 500);
  }
}

/**
 * GET /api/teachers/:id
 */
export function getTeacherByIdController(req, res) {
  try {
    const teacher = getTeacherById(req.params.id);
    if (!teacher) {
      return error(res, "Teacher not found", 404);
    }
    return success(res, teacher);
  } catch (err) {
    console.error("Get teacher error:", err);
    return error(res, "Failed to fetch teacher", 500);
  }
}

/**
 * PUT /api/teachers/:id/update
 */
export function updateTeacherController(req, res) {
  try {
    const updated = updateTeacher(req.params.id, req.body);
    if (!updated) {
      return error(res, "Teacher not found or no changes", 404);
    }
    return success(res, "Teacher updated successfully");
  } catch (err) {
    console.error("Update teacher error:", err);
    return error(res, "Failed to update teacher", 500);
  }
}

/**
 * DELETE /api/teachers/:id/deactivate
 */
export function deactivateTeacherController(req, res) {
  try {
    const done = deactivateTeacher(req.params.id);
    if (!done) {
      return error(res, "Teacher not found", 404);
    }
    return success(res, "Teacher deactivated successfully");
  } catch (err) {
    console.error("Deactivate teacher error:", err);
    return error(res, "Failed to deactivate teacher", 500);
  }
}
