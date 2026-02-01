// src/modules/auth/auth.controller.js
import {
  validateLogin,
  resetPasswordByUsername,
} from "./auth.model.js";
import { success, error } from "../../utils/response.js";

export function loginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password are required", 400);
    }

    const result = validateLogin(username, password);

   

    if (!result) {
      return error(res, "Invalid username or password", 401);
    }


    return success(
      res,
      {
        message: "Login successful",
        user: result.user,
        token: result.token,
      },
      200
    );
  } catch (err) {
    console.error("Login error:", err);
    return error(res, "Login failed", 500);
  }
}

export function forgotPasswordController(req, res) {
  try {
    const { username, new_password } = req.body;

    if (!username || !new_password) {
      return error(res, "Username and new password are required", 400);
    }

    if (new_password.length < 8) {
      return error(res, "Password must be at least 8 characters", 400);
    }

    // model handles DB + hashing
    resetPasswordByUsername(username, new_password);

    // same response for security
    return success(res, {
      message: "If username exists, password has been reset",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return error(res, "Failed to reset password", 500);
  }
}
