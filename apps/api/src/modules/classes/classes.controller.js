import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  classExists,
} from "./classes.model.js";
import { success, error } from "../../utils/response.js";

/**
 * POST /api/classes/create
 */
export function createClassController(req, res) {
  try {
    let { name, order_no } = req.body;

    if (!name || order_no === undefined) {
      return error(res, "Class name and order_no are required", 400);
    }

    name = name.trim();
    order_no = Number(order_no);

    const exists = classExists({ name, order_no });
    if (exists) {
      return error(res, "Class name or order already exists", 409);
    }

    const result = createClass({ name, order_no });
 return success(
  res,
  { message: "Class created successfully", class: result },
  201
);

  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed: classes.name")) {
      return error(res, "A class with this name already exists", 409);
    }
    if (err.message.includes("UNIQUE constraint failed: classes.order_no")) {
      return error(res, "This order number is already assigned", 409);
    }

    console.error("Create class error:", err);
    return error(res, "Failed to create class", 500);
  }
}

/**
 * GET /api/classes/list
 */
export function getAllClassesController(req, res) {
  try {
    return success(res, getAllClasses());
  } catch (err) {
    console.error("Get all classes error:", err);
    return error(res, "Failed to fetch classes");
  }
}

/**
 * GET /api/classes/:id
 */
export function getClassByIdController(req, res) {
  try {
    const cls = getClassById(req.params.id);
    if (!cls) return error(res, "Class not found", 404);

    return success(res, cls);
  } catch (err) {
    console.error("Get class error:", err);
    return error(res, "Failed to fetch class");
  }
}

/**
 * PUT /api/classes/:id/update
 */
export function updateClassController(req, res) {
  try {
    const { id } = req.params;
    let { name, order_no } = req.body;

    if (!name && order_no === undefined) {
      return error(
        res,
        "At least one field (name or order_no) is required to update",
        400
      );
    }

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (order_no !== undefined) data.order_no = Number(order_no);

    const exists = classExists(data, id);
    if (exists) {
      return error(res, "Another class already has this name or order", 409);
    }

    const updated = updateClass(id, data);
    if (!updated) return error(res, "Class not found", 404);

    return success(res, "Class updated successfully");
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed: classes.name")) {
      return error(res, "A class with this name already exists", 409);
    }
    if (err.message.includes("UNIQUE constraint failed: classes.order_no")) {
      return error(res, "This order number is already assigned", 409);
    }

    console.error("Update class error:", err);
    return error(res, "Failed to update class", 500);
  }
}


export function deleteClassController(req, res) {
  try {
    const { id } = req.params;
    const classId = Number(id);

    if (isNaN(classId)) {
      return error(res, "Invalid class ID", 400);
    }

    // Class exists check
    const cls = getClassById(classId);
    if (!cls) {
      return error(res, "Class not found", 404);
    }

    // Critical safety check
    if (hasClassDependencies(classId)) {
      return error(
        res,
        "Cannot delete this class. It has sections, enrolled students, assigned subjects, or other records linked to it. Please remove or reassign all dependencies first.",
        409  // Conflict
      );
    }

    // Safe delete
    const deleted = deleteClass(classId);

    if (!deleted) {
      return error(res, "Class not found or already deleted", 404);
    }

    return success(res, { message: "Class deleted successfully" });
  } catch (err) {
    console.error("Delete class error:", err);
    return error(res, "Failed to delete class", 500);
  }
}