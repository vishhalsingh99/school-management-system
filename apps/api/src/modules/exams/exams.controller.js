import {
  createExam,
  getExams,
  getExamById,
  updateExam,
} from "./exams.model.js";
import { success, error } from "../../utils/response.js";

/* =========================
   CREATE EXAM
========================= */
export function createExamController(req, res) {
  const {
    name,
    exam_type,
    academic_year_id,
    class_id,
    is_school_wide,
    start_date,
    end_date,
  } = req.body;

  if (!name || !exam_type || !academic_year_id) {
    return error(
      res,
      "name, exam_type, academic_year_id are required",
      400
    );
  }

  if (exam_type !== "board" && !class_id) {
    return error(res, "class_id is required for internal exams", 400);
  }

  const exam = createExam({
    name,
    exam_type,
    academic_year_id,
    class_id,
    is_school_wide,
    start_date,
    end_date,
  });

  return success(res, exam, 201);
}

/* =========================
   LIST EXAMS
========================= */
export function listExamsController(req, res) {
  const { academic_year_id, class_id } = req.query;

  if (!academic_year_id) {
    return error(res, "academic_year_id is required", 400);
  }

  const exams = getExams({ academic_year_id, class_id });
  return success(res, exams);
}

/* =========================
   GET EXAM
========================= */
export function getExamByIdController(req, res) {
  const exam = getExamById(req.params.id);
  if (!exam) return error(res, "Exam not found", 404);

  return success(res, exam);
}

/* =========================
   UPDATE EXAM
========================= */
export function updateExamController(req, res) {
  const updated = updateExam(req.params.id, req.body);
  if (!updated) return error(res, "Exam not found", 404);

  return success(res, "Exam updated successfully");
}

/* =========================
   DELETE EXAM
========================= */
export function deleteExamController(req, res) {
  const deleted = deleteExam(req.params.id);
  if (!deleted) return error(res, "Exam not found", 404);

  return success(res, "Exam deleted successfully");
}