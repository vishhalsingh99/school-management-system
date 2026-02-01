import db from "../../database/db.js";

/* ===================================
   HELPERS
=================================== */

export function studentExistsByRegNo(reg_no) {
  return db.prepare(
    "SELECT id FROM students WHERE reg_no = ?"
  ).get(reg_no);
}

/* ===================================
   CREATE STUDENT + ENROLLMENT
   (ATOMIC & FUTURE-PROOF)
=================================== */

export function createStudentWithEnrollment(data) {
  const tx = db.transaction(() => {
    // 1️⃣ Create student profile
    const result = db.prepare(`
      INSERT INTO students
        (reg_no, first_name, last_name, gender, dob, parent_phone, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.reg_no,
      data.first_name,
      data.last_name || null,
      data.gender || null,
      data.dob || null,
      data.parent_phone || null,
      data.address || null
    );

    const student_id = result.lastInsertRowid;

    // 2️⃣ Safety: deactivate any existing academic record (future-proof)
    db.prepare(`
      UPDATE student_academic_records
      SET is_current = 0
      WHERE student_id = ?
    `).run(student_id);

    // 3️⃣ Insert current academic record
    db.prepare(`
      INSERT INTO student_academic_records
        (student_id, academic_year_id, class_id, section_id, roll_no, status, is_current)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      student_id,
      data.academic_year_id,
      data.class_id,
      data.section_id,
      data.roll_no || null,
      "studying"
    );

    return { student_id };
  });

  return tx.immediate(); // all-or-nothing guarantee
}

/* ===================================
   READ OPERATIONS
=================================== */

export function getAllStudents() {
  return db.prepare(`
    SELECT
      s.id,
      s.reg_no,
      s.first_name,
      s.last_name,
      s.gender,
      s.dob,
      s.parent_phone,
      s.address,
      s.status,
      c.name  AS class_name,
      sec.name AS section_name,
      ar.roll_no,
      ay.name AS academic_year
    FROM students s
    LEFT JOIN student_academic_records ar
      ON ar.student_id = s.id AND ar.is_current = 1
    LEFT JOIN classes c ON c.id = ar.class_id
    LEFT JOIN sections sec ON sec.id = ar.section_id
    LEFT JOIN academic_years ay ON ay.id = ar.academic_year_id
    ORDER BY s.first_name ASC
  `).all();
}

export function getStudentById(id) {
  return db.prepare(`
    SELECT
      s.*,
      c.name AS class_name,
      sec.name AS section_name,
      ar.roll_no,
      ay.name AS academic_year
    FROM students s
    LEFT JOIN student_academic_records ar
      ON ar.student_id = s.id AND ar.is_current = 1
    LEFT JOIN classes c ON c.id = ar.class_id
    LEFT JOIN sections sec ON sec.id = ar.section_id
    LEFT JOIN academic_years ay ON ay.id = ar.academic_year_id
    WHERE s.id = ?
  `).get(id);
}

export function getStudentsByClassSection(class_id, section_id) {
  return db.prepare(`
    SELECT
      s.id,
      s.reg_no,
      s.first_name,
      s.last_name,
      s.gender,
      s.parent_phone,
      ar.roll_no
    FROM student_academic_records ar
    JOIN students s ON s.id = ar.student_id
    WHERE ar.class_id = ?
      AND ar.section_id = ?
      AND ar.is_current = 1
    ORDER BY ar.roll_no ASC, s.first_name ASC
  `).all(class_id, section_id);
}
