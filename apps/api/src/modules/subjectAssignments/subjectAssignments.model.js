import db from "../../database/db.js";

/* =========================
   HELPERS
========================= */

export function assignmentExists(data) {
  return db.prepare(`
    SELECT id
    FROM subject_assignments
    WHERE subject_id = ?
      AND class_id = ?
      AND section_id = ?
      AND academic_year_id = ?
  `).get(
    data.subject_id,
    data.class_id,
    data.section_id,
    data.academic_year_id
  );
}

/* =========================
   CORE
========================= */

export function assignSubjectToClass(data) {
  const result = db.prepare(`
    INSERT INTO subject_assignments
      (teacher_id, subject_id, class_id, section_id, academic_year_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    data.teacher_id,
    data.subject_id,
    data.class_id,
    data.section_id,
    data.academic_year_id
  );

  return { id: result.lastInsertRowid };
}

export function getAssignmentsByClass(class_id, academic_year_id) {
  return db.prepare(`
    SELECT
      sa.id,
      sub.name AS subject_name,
      t.name AS teacher_name,
      sec.name AS section_name
    FROM subject_assignments sa
    JOIN subjects sub ON sub.id = sa.subject_id
    JOIN teachers t ON t.id = sa.teacher_id
    JOIN sections sec ON sec.id = sa.section_id
    WHERE sa.class_id = ?
      AND sa.academic_year_id = ?
    ORDER BY sub.name
  `).all(class_id, academic_year_id);
}

export function deleteAssignment(id) {
  const result = db.prepare(`
    DELETE FROM subject_assignments
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
