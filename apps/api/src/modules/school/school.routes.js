import express from "express";
const router = express.Router();

import { getSchoolInfo } from "./school.controller.js";

router.get("/", getSchoolInfo);


export default router;