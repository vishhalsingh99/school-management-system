import db from "../../database/db.js";

/* =========================
   CREATE EXAM
========================= */
export function createExam(data) {
  const result = db.prepare(`
    INSERT INTO exams (
      name,
      exam_type,
      academic_year_id,
      class_id,
      is_school_wide,
      start_date,
      end_date,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled')
  `).run(
    data.name,
    data.exam_type,
    data.academic_year_id,
    data.class_id ?? null,
    data.is_school_wide ?? 0,
    data.start_date ?? null,
    data.end_date ?? null
  );

  return { id: result.lastInsertRowid };
}

/* =========================
   LIST EXAMS
========================= */
export function getExams({ academic_year_id, class_id }) {
  let sql = `
    SELECT *
    FROM exams
    WHERE academic_year_id = ?
  `;
  const params = [academic_year_id];

  if (class_id) {
    sql += ` AND (class_id = ? OR is_school_wide = 1)`;
    params.push(class_id);
  }

  sql += ` ORDER BY start_date`;

  return db.prepare(sql).all(...params);
}

/* =========================
   GET EXAM BY ID
========================= */
export function getExamById(id) {
  return db.prepare(`
    SELECT *
    FROM exams
    WHERE id = ?
  `).get(id);
}

/* =========================
   UPDATE EXAM
========================= */
export function updateExam(id, data) {
  const result = db.prepare(`
    UPDATE exams
    SET
      name = COALESCE(@name, name),
      start_date = COALESCE(@start_date, start_date),
      end_date = COALESCE(@end_date, end_date),
      status = COALESCE(@status, status)
    WHERE id = @id
  `).run({
    id,
    name: data.name,
    start_date: data.start_date,
    end_date: data.end_date,
    status: data.status,
  });

  return result.changes > 0;
}

/* =========================
   DELETE EXAM
========================= */
export function deleteExam(id) {
  return db.prepare(`
    DELETE FROM exams
    WHERE id = ?
  `).run(id);
}