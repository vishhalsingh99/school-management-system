import {
  subjectExists,
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deactivateSubject,
} from "./subjects.model.js";

import { success, error } from "../../utils/response.js";

export function createSubjectController(req, res) {
  const { name, code, is_elective } = req.body;

  if (!name || !code) {
    return error(res, "name and code are required", 400);
  }

  if (subjectExists({ name, code })) {
    return error(res, "Subject name or code already exists", 409);
  }

  const result = createSubject({
    name: name.trim(),
    code: code.trim().toUpperCase(),
    is_elective,
  });

  return success(res, {
    message: "Subject created successfully",
    subject_id: result.id,
  }, 201);
}

export function getAllSubjectsController(req, res) {
  return success(res, getAllSubjects());
}

export function getSubjectByIdController(req, res) {
  const subject = getSubjectById(req.params.id);
  if (!subject) return error(res, "Subject not found", 404);
  return success(res, subject);
}

export function updateSubjectController(req, res) {
  const exists = subjectExists(req.body, req.params.id);
  if (exists) {
    return error(res, "Subject name or code already exists", 409);
  }

  const updated = updateSubject(req.params.id, req.body);
  if (!updated) return error(res, "Subject not found", 404);

  return success(res, "Subject updated successfully");
}

export function deleteSubjectController(req, res) {
  const deleted = deactivateSubject(req.params.id);
  if (!deleted) return error(res, "Subject not found", 404);

  return success(res, "Subject deleted successfully");
}
