import db from "../../database/db.js";

/* =========================
   HELPERS
========================= */

export function studentExists(id) {
  return db.prepare(`SELECT id FROM students WHERE id = ?`).get(id);
}

export function academicYearExists(id) {
  return db.prepare(`SELECT id FROM academic_years WHERE id = ?`).get(id);
}

export function studentCurrentAcademic(student_id) {
  return db.prepare(`
    SELECT *
    FROM student_academic_records
    WHERE student_id = ? AND is_current = 1
  `).get(student_id);
}

export function subjectAssignedToClass({
  subject_id,
  class_id,
  section_id,
  academic_year_id,
}) {
  return db.prepare(`
    SELECT id
    FROM subject_assignments
    WHERE subject_id = ?
      AND class_id = ?
      AND section_id = ?
      AND academic_year_id = ?
  `).get(subject_id, class_id, section_id, academic_year_id);
}

export function enrollmentExists(student_id, subject_id, academic_year_id) {
  return db.prepare(`
    SELECT id
    FROM student_subject_enrollments
    WHERE student_id = ?
      AND subject_id = ?
      AND academic_year_id = ?
  `).get(student_id, subject_id, academic_year_id);
}

/* =========================
   CORE OPERATIONS
========================= */

export function enrollStudentSubject(data) {
  const result = db.prepare(`
    INSERT INTO student_subject_enrollments
      (student_id, subject_id, academic_year_id, status)
    VALUES (?, ?, ?, 'active')
  `).run(
    data.student_id,
    data.subject_id,
    data.academic_year_id
  );

  return { id: result.lastInsertRowid };
}

export function getStudentEnrollments(student_id, academic_year_id) {
  return db.prepare(`
    SELECT
      sse.id,
      sub.id AS subject_id,
      sub.name AS subject_name,
      sub.code AS subject_code,
      sse.status
    FROM student_subject_enrollments sse
    JOIN subjects sub ON sub.id = sse.subject_id
    WHERE sse.student_id = ?
      AND sse.academic_year_id = ?
      AND sse.status = 'active'
    ORDER BY sub.name
  `).all(student_id, academic_year_id);
}

export function deactivateEnrollment(id) {
  const result = db.prepare(`
    UPDATE student_subject_enrollments
    SET status = 'inactive'
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
