import db from "../../database/db.js";

/* =========================
   HELPERS
========================= */

export function teacherAlreadyClassTeacher(teacher_id, academic_year_id) {
  return db
    .prepare(
      `
    SELECT
      ct.id,
      c.name AS class_name,
      s.name AS section_name
    FROM class_teachers ct
    JOIN classes c ON c.id = ct.class_id
    JOIN sections s ON s.id = ct.section_id
    WHERE ct.teacher_id = ?
      AND ct.academic_year_id = ?
  `,
    )
    .get(teacher_id, academic_year_id);
}

export function classTeacherExists(class_id, section_id, academic_year_id) {
  return !!db
    .prepare(
      `
    SELECT 1 FROM class_teachers
    WHERE class_id = ? AND section_id = ? AND academic_year_id = ?
    LIMIT 1
  `,
    )
    .get(class_id, section_id, academic_year_id);
}

export function getClassTeacher(class_id, section_id, academic_year_id) {
  return db
    .prepare(
      `
    SELECT
      ct.id,
      t.id AS teacher_id,
      t.name AS teacher_name,
      t.phone,
      t.email
    FROM class_teachers ct
    JOIN teachers t ON t.id = ct.teacher_id
    WHERE ct.class_id = ?
      AND ct.section_id = ?
      AND ct.academic_year_id = ?
  `,
    )
    .get(class_id, section_id, academic_year_id);
}

/* =========================
   CORE – Upsert with safety
========================= */

export function assignClassTeacher(data) {
  const { teacher_id, class_id, section_id, academic_year_id } = data;

  // Basic validation
  if (
    !Number.isInteger(teacher_id) ||
    !Number.isInteger(class_id) ||
    !Number.isInteger(section_id) ||
    !Number.isInteger(academic_year_id)
  ) {
    throw new Error("Invalid IDs provided");
  }

  // 1. Teacher already assigned kahin aur?
  const existingAssignment = teacherAlreadyClassTeacher(teacher_id, academic_year_id);

  if (existingAssignment) {
    // Allow only if same class-section (re-assign same teacher)
    if (
      existingAssignment.class_name !== String(class_id) ||
      existingAssignment.section_name !== String(section_id)
    ) {
      throw new Error(
        `Teacher is already class teacher of ${existingAssignment.class_name} - ${existingAssignment.section_name}`,
      );
    }
    // Agar same hai to update unnecessary hai, lekin allowed
  }

  // 2. Current record fetch karo
  const existing = getClassTeacher(class_id, section_id, academic_year_id);

  if (existing) {
    // UPDATE
    db.prepare(
      `
      UPDATE class_teachers
      SET teacher_id = ?
      WHERE id = ?
    `,
    ).run(teacher_id, existing.id);

    return {
      id: existing.id,
      action: "updated",
      message: "Class teacher changed successfully",
    };
  } else {
    // INSERT
    const result = db
      .prepare(
        `
      INSERT INTO class_teachers
        (teacher_id, class_id, section_id, academic_year_id)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(teacher_id, class_id, section_id, academic_year_id);

    return {
      id: result.lastInsertRowid,
      action: "inserted",
      message: "Class teacher assigned successfully",
    };
  }
}
