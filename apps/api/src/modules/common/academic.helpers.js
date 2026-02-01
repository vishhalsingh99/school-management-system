import db from "../../database/db.js";

export function studentExists(id) {
  return db.prepare(`SELECT id FROM students WHERE id = ?`).get(id);
}

export function academicYearExists(id) {
  return db.prepare(`SELECT id FROM academic_years WHERE id = ?`).get(id);
}

export function classExists(id) {
  return db.prepare(`SELECT id FROM classes WHERE id = ?`).get(id);
}

export function sectionExistsInClass(class_id, section_id) {
  return db
    .prepare(`SELECT id FROM sections WHERE id = ? AND class_id = ?`)
    .get(section_id, class_id);
}


export function teacherExists(id) {
  return db.prepare(`SELECT id FROM teachers WHERE id = ?`).get(id);
}