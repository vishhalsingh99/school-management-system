import db from "../../database/db.js";

/* ======================
   HELPERS
====================== */

export function assignmentExists(data) {
  return db.prepare(`
    SELECT id FROM subject_assignments
    WHERE teacher_id = ?
      AND subject_id = ?
      AND class_id = ?
      AND section_id = ?
      AND academic_year_id = ?
  `).get(
    data.teacher_id,
    data.subject_id,
    data.class_id,
    data.section_id,
    data.academic_year_id
  );
}

/* ======================
   CORE
====================== */

export function assignTeacherToSubject(data) {
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

export function getTeacherAssignments(teacher_id) {
  return db.prepare(`
    SELECT
      sa.id,
      sub.name AS subject,
      c.name AS class,
      sec.name AS section,
      ay.name AS academic_year
    FROM subject_assignments sa
    JOIN subjects sub ON sub.id = sa.subject_id
    JOIN classes c ON c.id = sa.class_id
    JOIN sections sec ON sec.id = sa.section_id
    JOIN academic_years ay ON ay.id = sa.academic_year_id
    WHERE sa.teacher_id = ?
    ORDER BY ay.start_date DESC
  `).all(teacher_id);
}
