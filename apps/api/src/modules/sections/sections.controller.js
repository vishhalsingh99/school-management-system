import {
  createSection,
  getSectionsByClass,
  getSectionById,
  updateSection,
  deleteSection,
  sectionExists,
} from "./sections.model.js";
import { success, error } from "../../utils/response.js";

/**
 * POST /api/sections/create
 */
export function createSectionController(req, res) {
  try {
    let { class_id, name } = req.body;

    if (!class_id || !name) {
      return error(res, "class_id and name are required", 400);
    }

    name = name.trim();
    class_id = Number(class_id);

    const exists = sectionExists({ class_id, name });
    if (exists) {
      return error(res, "Section already exists in this class", 409);
    }

    const result = createSection({ class_id, name });
    return success(res, { message: "Section created", section: result }, 201);
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return error(res, "Section already exists in this class", 409);
    }

    console.error("Create section error:", err);
    return error(res, "Failed to create section", 500);
  }
}

/**
 * GET /api/sections/list?class_id=1
 */
export function getSectionsByClassController(req, res) {
  try {
    const { class_id } = req.query;

    if (!class_id) {
      return error(res, "class_id is required", 400);
    }

    const sections = getSectionsByClass(class_id);
    return success(res, sections);
  } catch (err) {
    console.error("Get sections error:", err);
    return error(res, "Failed to fetch sections");
  }
}

/**
 * GET /api/sections/:id
 */
export function getSectionByIdController(req, res) {
  try {
    const section = getSectionById(req.params.id);
    if (!section) return error(res, "Section not found", 404);

    return success(res, section);
  } catch (err) {
    console.error("Get section error:", err);
    return error(res, "Failed to fetch section");
  }
}

/**
 * PUT /api/sections/:id/update
 */
export function updateSectionController(req, res) {
  try {
    const { id } = req.params;
    let { name } = req.body;

    if (!name) {
      return error(res, "name is required to update", 400);
    }

    name = name.trim();

    const existing = getSectionById(id);
    if (!existing) return error(res, "Section not found", 404);

    const duplicate = sectionExists(
      { class_id: existing.class_id, name },
      id
    );
    if (duplicate) {
      return error(res, "Section already exists in this class", 409);
    }

    updateSection(id, { name });
    return success(res, "Section updated successfully");
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return error(res, "Section already exists in this class", 409);
    }

    console.error("Update section error:", err);
    return error(res, "Failed to update section", 500);
  }
}

/**
 * DELETE /api/sections/:id/delete
 */
export function deleteSectionController(req, res) {
  try {
    const deleted = deleteSection(req.params.id);
    if (!deleted) return error(res, "Section not found", 404);

    return success(res, "Section deleted successfully");
  } catch (err) {
    console.error("Delete section error:", err);
    return error(res, "Failed to delete section", 500);
  }
}
