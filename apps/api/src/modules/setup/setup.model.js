import db from "../../database/db.js";

export function isSetupRequired() {
  const admin = db
    .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    .get();
  return !admin;
}

export function createSchoolInfo(school) {
  db.prepare(`
    INSERT OR REPLACE INTO school_info (id, name, address, phone)
    VALUES (1, ?, ?, ?)
  `).run(school.name, school.address, school.phone);
}

export function createSuperAdmin(admin) {
  db.prepare(`
    INSERT INTO users (username, password, role)
    VALUES (?, ?, 'admin')
  `).run(admin.username, admin.password);
}
