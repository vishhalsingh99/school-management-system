import db from "../../database/db.js";

export function getActiveAcademicYear() {
  return db
    .prepare("SELECT * FROM academic_years WHERE is_active = 1 LIMIT 1")
    .get();
}

export function deactivateAllAcademicYears() {
  db.prepare("UPDATE academic_years SET is_active = 0").run();
}

export function activateAcademicYearById(id) {
  db.prepare(
    `
    UPDATE academic_years
    SET is_active = 1
    WHERE id = ?
  `,
  ).run(id);
}

export function createAcademicYear(data) {
  return db
    .prepare(
      `
    INSERT INTO academic_years (name, start_date, end_date, is_active)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(data.name, data.start_date, data.end_date, data.is_active);
}

export function getAllAcademicYears() {
  return db
    .prepare(
      `
    SELECT * FROM academic_years
    ORDER BY start_date DESC
  `,
    )
    .all();
}

export function getAcademicYearCount() {
  return db.prepare("SELECT COUNT(*) as count FROM academic_years").get().count;
}

export function getAcademicYearById(id) {
  return db.prepare("SELECT * FROM academic_years WHERE id = ?").get(id);
}

/**
 * 🔥 SMART DUPLICATE CHECK
 * - create → id undefined
 * - update → id provided (exclude itself)
 */
export function checkAcademicYearExists(
  name,
  start_date,
  end_date,
  excludeId = null,
) {
  if (excludeId) {
    return db
      .prepare(
        `
      SELECT id FROM academic_years
      WHERE name = ?
        AND id != ?
    `,
      )
      .get(name, excludeId);
  }

  return db
    .prepare(
      `
    SELECT id FROM academic_years
    WHERE name = ?
  `,
    )
    .get(name);
}

/**
 * UPDATE
 */
export function updateAcademicYearById(id, data) {
  return db
    .prepare(
      `
    UPDATE academic_years
    SET name = ?, start_date = ?, end_date = ?
    WHERE id = ?
  `,
    )
    .run(data.name, data.start_date, data.end_date, id);
}
