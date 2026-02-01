// src/modules/teachers/teachers.model.js
import db from "../../database/db.js";

/* ======================
   HELPERS
====================== */

export function teacherExistsByCode(code) {
  return db
    .prepare("SELECT id FROM teachers WHERE code = ?")
    .get(code);
}

export function teacherExistsByEmail(email) {
  if (!email) return null;
  return db
    .prepare("SELECT id FROM teachers WHERE email = ?")
    .get(email);
}

/* ======================
   CREATE
====================== */

export function createTeacher(data) {
  const result = db.prepare(`
    INSERT INTO teachers
      (code, name, department, phone, email, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    data.code,
    data.name,
    data.department || null,
    data.phone || null,
    data.email || null,
    "active"
  );

  return { id: result.lastInsertRowid };
}

/* ======================
   READ
====================== */

export function getAllTeachers() {
  return db.prepare(`
    SELECT
      id,
      code,
      name,
      department,
      phone,
      email,
      status,
      created_at
    FROM teachers
    ORDER BY name ASC
  `).all();
}

export function getTeacherById(id) {
  return db.prepare(`
    SELECT *
    FROM teachers
    WHERE id = ?
  `).get(id);
}

/* ======================
   UPDATE
====================== */

export function updateTeacher(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }
  if (data.department !== undefined) {
    fields.push("department = ?");
    params.push(data.department);
  }
  if (data.phone !== undefined) {
    fields.push("phone = ?");
    params.push(data.phone);
  }
  if (data.email !== undefined) {
    fields.push("email = ?");
    params.push(data.email);
  }
  if (data.status !== undefined) {
    fields.push("status = ?");
    params.push(data.status);
  }

  if (!fields.length) return false;

  params.push(id);

  const result = db.prepare(`
    UPDATE teachers
    SET ${fields.join(", ")}
    WHERE id = ?
  `).run(...params);

  return result.changes > 0;
}

/* ======================
   DELETE (SOFT)
====================== */

export function deactivateTeacher(id) {
  const result = db.prepare(`
    UPDATE teachers
    SET status = 'inactive'
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
