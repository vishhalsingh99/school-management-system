import db from "../../database/db.js";
import bcrypt from "bcrypt";
import {
  isSetupRequired,
  createSchoolInfo,
  createSuperAdmin,
} from "./setup.model.js";
import { success, error } from "../../utils/response.js";
import { validatePassword } from "../../utils/validatePassword.js";


/**
 * GET /api/setup/status
 */
export function checkSetupStatus(req, res) {
  return success(res, {
    setupRequired: isSetupRequired(),
  });
}


/**
 * POST /api/setup/init
 */
export function initSetup(req, res) {
  const { school, admin } = req.body;

  // Prevent re-setup
  if (!isSetupRequired()) {
    return error(res, "Setup has already been completed", 400);
  }

  // Required fields with clear messages
  if (!school?.name?.trim()) {
    return error(res, "School name is required", 400);
  }
  if (!admin?.username?.trim()) {
    return error(res, "Admin username (email) is required", 400);
  }
  if (!admin?.password) {
    return error(res, "Admin password is required", 400);
  }

  // Password strength
  const pwdError = validatePassword(admin.password);
  if (pwdError) {
    return error(res, pwdError, 400);
  }

  const tx = db.transaction(() => {
    // Clean school data
    createSchoolInfo({
      name: school.name.trim(),
      address: school.address?.trim() || null,
      phone: school.phone?.trim() || null,
    });

    // Save admin with lowercase username
    createSuperAdmin({
      username: admin.username.toLowerCase().trim(),
      password: bcrypt.hashSync(admin.password, 10),
    });
  });

  try {
    tx();
    return success(res, {
  message: "School setup completed successfully! You can now login.",
  nextStep: "login"
});
  } catch (err) {
    console.error("Setup error:", err);
    // Duplicate username catch (if unique constraint on username)
    if (err.message.includes("UNIQUE constraint failed: users.username")) {
      return error(res, "This username is already taken", 409);
    }
    return error(res, "Setup failed. Please try again.", 500);
  }
}