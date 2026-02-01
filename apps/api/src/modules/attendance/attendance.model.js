import db from "../../database/db.js";

/* ================================
   MARK / UPDATE ATTENDANCE
================================ */
export function markAttendance(data) {
  const stmt = db.prepare(`
    INSERT INTO attendance_students (student_id, date, status)
    VALUES (@student_id, @date, @status)
    ON CONFLICT(student_id, date)
    DO UPDATE SET status = excluded.status
  `);

  stmt.run({
    student_id: data.student_id,
    date: data.date,
    status: data.status,
  });
}


/* ================================
   GET ATTENDANCE (CLASS + DATE)
================================ */
export function getAttendance({ class_id, date }) {
  return db.prepare(`
    SELECT
      s.id AS student_id,
      s.first_name,
      s.last_name,
      a.status
    FROM students s
    LEFT JOIN attendance_students a
      ON a.student_id = s.id AND a.date = ?
    WHERE s.class_id = ?
      AND s.deleted_at IS NULL
    ORDER BY s.first_name ASC
  `).all(date, class_id);
}


/* ================================
   GET STUDENT ATTENDANCE HISTORY
================================ */
export function getStudentAttendance(student_id) {
  return db.prepare(`
    SELECT date, status
    FROM attendance_students
    WHERE student_id = ?
    ORDER BY date DESC
  `).all(student_id);
}


