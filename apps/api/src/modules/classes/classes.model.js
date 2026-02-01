import db from "../../database/db.js";

/**
 * check if class exists by name or order_no
 * excludeId used during update
 */
export function classExists(data, excludeId = null) {
  const conditions = [];
  const params = [];

  if (data.name !== undefined) {
    conditions.push("name = ?");
    params.push(data.name);
  }

  if (data.order_no !== undefined) {
    conditions.push("order_no = ?");
    params.push(data.order_no);
  }

  if (conditions.length === 0) return null;

  let query = `
    SELECT * FROM classes
    WHERE (${conditions.join(" OR ")})
  `;

  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }

  return db.prepare(query).get(...params);
}

// classes.model.js (add yeh function)

// Returns true if class has ANY dependent records
export function hasClassDependencies(classId) {
  classId = Number(classId);

  // 1. Sections
  const sections = db
    .prepare("SELECT COUNT(*) as cnt FROM sections WHERE class_id = ?")
    .get(classId).cnt;

  if (sections > 0) return true;

  // 2. Student academic records (enrollments)
  const enrollments = db
    .prepare("SELECT COUNT(*) as cnt FROM student_academic_records WHERE class_id = ?")
    .get(classId).cnt;

  if (enrollments > 0) return true;

  // 3. Subject assignments
  const assignments = db
    .prepare("SELECT COUNT(*) as cnt FROM subject_assignments WHERE class_id = ?")
    .get(classId).cnt;

  if (assignments > 0) return true;

  // 4. Fee structures (agar use kar rahe ho)
  const fees = db
    .prepare("SELECT COUNT(*) as cnt FROM fee_structures WHERE class_id = ?")
    .get(classId).cnt;

  if (fees > 0) return true;

  // Agar aur tables depend karte hain (exams, etc.) to yahan add kar dena

  return false;
}

export function createClass(data) {
  const result = db.prepare(`
    INSERT INTO classes (name, order_no)
    VALUES (?, ?)
  `).run(data.name, data.order_no);

  return { id: result.lastInsertRowid };
}

export function getAllClasses() {
  return db.prepare(`
    SELECT *
    FROM classes
    ORDER BY order_no ASC
  `).all();
}

export function getClassById(id) {
  return db.prepare(`
    SELECT *
    FROM classes
    WHERE id = ?
  `).get(id);
}

/**
 * PARTIAL UPDATE SUPPORTED
 */
export function updateClass(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    params.push(data.name);
  }

  if (data.order_no !== undefined) {
    fields.push("order_no = ?");
    params.push(data.order_no);
  }

  if (fields.length === 0) return false;

  params.push(id);

  const result = db.prepare(`
    UPDATE classes
    SET ${fields.join(", ")}
    WHERE id = ?
  `).run(...params);

  return result.changes > 0;
}

export function deleteClass(id) {
  const result = db.prepare(`
    DELETE FROM classes
    WHERE id = ?
  `).run(id);

  return result.changes > 0;
}