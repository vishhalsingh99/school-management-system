import db from "../../database/db.js";

export function subjectExists(data, excludeId = null) {
  const conditions = [];
  const params = [];

  if (data.name) {
    conditions.push("name = ?");
    params.push(data.name);
  }

  if (data.code) {
    conditions.push("code = ?");
    params.push(data.code);
  }

  if (!conditions.length) return null;

  let query = `
    SELECT id FROM subjects
    WHERE (${conditions.join(" OR ")})
  `;

  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }

  return db.prepare(query).get(...params);
}

export function createSubject(data) {
  const result = db.prepare(`
    INSERT INTO subjects (name, code, is_elective)
    VALUES (?, ?, ?)
  `).run(
    data.name,
    data.code,
    data.is_elective ? 1 : 0
  );

  return { id: result.lastInsertRowid };
}

export function getAllSubjects() {
  return db.prepare(`
    SELECT * FROM subjects
    WHERE status = 1
    ORDER BY name ASC
  `).all();
}

export function getSubjectById(id) {
  return db.prepare(`
    SELECT * FROM subjects WHERE id = ?
  `).get(id);
}

export function updateSubject(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }

  if (data.code !== undefined) {
    fields.push("code = ?");
    params.push(data.code);
  }

  if (data.is_elective !== undefined) {
    fields.push("is_elective = ?");
    params.push(data.is_elective ? 1 : 0);
  }

  if (!fields.length) return false;

  params.push(id);

  const result = db.prepare(`
    UPDATE subjects
    SET ${fields.join(", ")}
    WHERE id = ?
  `).run(...params);

  return result.changes > 0;
}

export function deactivateSubject(id) {
  const result = db.prepare(`
    UPDATE subjects
    SET status = 0
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
