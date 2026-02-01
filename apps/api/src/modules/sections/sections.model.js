import db from "../../database/db.js";

/**
 * Check duplicate section in same class
 */
export function sectionExists({ class_id, name }, excludeId = null) {
  let query = `
    SELECT * FROM sections
    WHERE class_id = ? AND name = ?
  `;
  const params = [class_id, name];

  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }

  return db.prepare(query).get(...params);
}

export function createSection({ class_id, name }) {
  const result = db.prepare(`
    INSERT INTO sections (class_id, name)
    VALUES (?, ?)
  `).run(class_id, name);

  return { id: result.lastInsertRowid };
}

export function getSectionsByClass(class_id) {
  return db.prepare(`
    SELECT id, name
    FROM sections
    WHERE class_id = ?
    ORDER BY name ASC
  `).all(class_id);
}

export function getSectionById(id) {
  return db.prepare(`
    SELECT *
    FROM sections
    WHERE id = ?
  `).get(id);
}

/**
 * PARTIAL UPDATE SUPPORTED
 */
export function updateSection(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }

  if (fields.length === 0) return false;

  params.push(id);

  const result = db.prepare(`
    UPDATE sections
    SET ${fields.join(", ")}
    WHERE id = ?
  `).run(...params);

  return result.changes > 0;
}

export function deleteSection(id) {
  const result = db.prepare(`
    DELETE FROM sections
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}
