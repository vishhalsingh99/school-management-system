import {
  getActiveAcademicYear,
  deactivateAllAcademicYears,
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearCount,
  getAcademicYearById,
  activateAcademicYearById,
  checkAcademicYearExists,
  updateAcademicYearById,
} from "./academicYears.model.js";
import { success, error } from "../../utils/response.js";

/**
 * GET /api/academic-years/list
 */
export function listAcademicYears(req, res) {
  const years = getAllAcademicYears();
  return success(res, years);
}

/**
 * POST /api/academic-years/create
 */
export function createAcademicYearController(req, res) {
  const { name, start_date, end_date } = req.body;

  if (!name || !start_date || !end_date) {
    return error(res, "name, start_date and end_date are required", 400);
  }

  // ❌ same name not allowed
  const exists = checkAcademicYearExists(name);
  if (exists) {
    return error(res, "Academic year already exists", 400);
  }

  try {
    const count = getAcademicYearCount();

    createAcademicYear({
      name,
      start_date,
      end_date,
      is_active: count === 0 ? 1 : 0,
    });

    return success(res, "Academic year created successfully", 201);
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * PUT /api/academic-years/update/:id
 */
export function updateAcademicYear(req, res) {
  const { id } = req.params;
  const { name, start_date, end_date } = req.body;

  if (!name || !start_date || !end_date) {
    return error(res, "name, start_date and end_date are required", 400);
  }

  const year = getAcademicYearById(id);
  if (!year) {
    return error(res, "Academic year not found", 404);
  }

  // ❌ conflict check (exclude itself)
  const duplicate = checkAcademicYearExists(
    name,
    start_date,
    end_date,
    id
  );

  if (duplicate) {
    return error(
      res,
      "Another academic year with same name already exists",
      400
    );
  }

  try {
    updateAcademicYearById(id, {
      name,
      start_date,
      end_date,
    });

    return success(res, "Academic year updated successfully");
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * POST /api/academic-years/select
 */
export function selectAcademicYear(req, res) {
  const { academicYearId } = req.body;

  if (!academicYearId) {
    return error(res, "academicYearId is required", 400);
  }

  const year = getAcademicYearById(academicYearId);
  if (!year) {
    return error(res, "Academic year not found", 404);
  }

  try {
    deactivateAllAcademicYears();
    activateAcademicYearById(academicYearId);

    return success(res, "Academic year activated successfully");
  } catch (err) {
    return error(res, err.message);
  }
}

/**
 * GET /api/academic-years/current
 */
export function getCurrentAcademicYear(req, res) {
  const year = getActiveAcademicYear();

  if (!year) {
    return error(res, "No active academic year found", 404);
  }

  return success(res, year);
}
