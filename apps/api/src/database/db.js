import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "school.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log("✅ SQLite database connected:", dbPath);

export default db;
