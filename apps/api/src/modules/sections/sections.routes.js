import express from "express";

const router = express.Router();



import {
    createSectionController,
    getSectionsByClassController,
    getSectionByIdController,
    updateSectionController,
    deleteSectionController
} from "./sections.controller.js"


router.post("/create",  createSectionController);
router.get("/list", getSectionsByClassController);
router.get("/:id", getSectionByIdController);
router.put("/:id/update", updateSectionController);
router.delete("/:id/delete", deleteSectionController);

export default router;
