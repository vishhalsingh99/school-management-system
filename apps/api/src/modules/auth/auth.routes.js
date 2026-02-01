// src/modules/auth/auth.routes.js
import express from "express";
const router = express.Router();

import { loginController, forgotPasswordController } from "./auth.controller.js";

router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

export default router;