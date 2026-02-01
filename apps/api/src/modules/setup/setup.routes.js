import { Router } from "express";
import {
  checkSetupStatus,
  initSetup,
} from "./setup.controller.js";

const router = Router();

router.get("/status", checkSetupStatus);
router.post("/init", initSetup);

export default router;
