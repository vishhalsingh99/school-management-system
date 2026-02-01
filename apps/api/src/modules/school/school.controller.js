import db from "../../database/db.js";
import { success } from "../../utils/response.js";

export function getSchoolInfo(req, res) {
  const info = db.prepare(
    "SELECT * FROM school_info WHERE id = 1"
  ).get();

  return success(res, info || {});
}
