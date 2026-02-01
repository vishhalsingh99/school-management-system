// src/modules/auth/auth.model.js
import db from "../../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "school-erp-super-secret-key-2026";

export function validateLogin(username, password) {
  const user = db
    .prepare("SELECT id, username, password, role FROM users WHERE username = ?")
    .get(username);

  if (!user) return null;

  const match = bcrypt.compareSync(password, user.password);
  if (!match) return null;

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}

export function resetPasswordByUsername(username, newPassword) {
  const user = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(username);

  // security: caller ko nahi batayenge user exist karta hai ya nahi
  if (!user) return false;

  const hashed = bcrypt.hashSync(newPassword, 10);

  db.prepare("UPDATE users SET password = ? WHERE id = ?")
    .run(hashed, user.id);

  return true;
}
