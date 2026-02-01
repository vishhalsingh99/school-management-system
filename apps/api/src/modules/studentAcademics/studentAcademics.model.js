import db from "../../database/db.js";

/* =========================
   HELPERS
========================= */




export function recordExists(student_id, academic_year_id) {
  return db.prepare(
    `
    SELECT id
    FROM student_academic_records
    WHERE student_id = ? AND academic_year_id = ?
    `
  ).get(student_id, academic_year_id);
}

/* =========================
   CORE OPERATIONS
========================= */

export function deactivateCurrentRecord(student_id) {
  db.prepare(
    `
    UPDATE student_academic_records
    SET is_current = 0
    WHERE student_id = ? AND is_current = 1
    `
  ).run(student_id);
}

export function createAcademicRecord(data) {
  db.prepare(
    `
    INSERT INTO student_academic_records
      (student_id, academic_year_id, class_id, section_id, roll_no, status, is_current)
    VALUES (?, ?, ?, ?, ?, ?, 1)
    `
  ).run(
    data.student_id,
    data.academic_year_id,
    data.class_id,
    data.section_id,
    data.roll_no || null,
    data.status || "studying"
  );
}

export function getAcademicHistory(student_id) {
  return db.prepare(`
    SELECT
      ar.id,
      ay.name AS academic_year,
      c.name AS class_name,
      s.name AS section_name,
      ar.roll_no,
      ar.status,
      ar.is_current
    FROM student_academic_records ar
    LEFT JOIN academic_years ay ON ay.id = ar.academic_year_id
    LEFT JOIN classes c ON c.id = ar.class_id
    LEFT JOIN sections s ON s.id = ar.section_id
    WHERE ar.student_id = ?
    ORDER BY ay.start_date DESC
  `).all(student_id);
}

