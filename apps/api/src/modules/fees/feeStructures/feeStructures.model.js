import db from "../../../database/db.js";

export function createFeeStructure({ class_id, academic_year_id }) {
  const res = db.prepare(`
    INSERT INTO fee_structures (class_id, academic_year_id)
    VALUES (?, ?)
  `).run(class_id, academic_year_id);

  return { id: res.lastInsertRowid };
}

export function addFeeComponent({
  fee_structure_id,
  name,
  frequency,
  amount,
  is_optional = 0,
}) {
  return db.prepare(`
    INSERT INTO fee_components
      (fee_structure_id, name, frequency, amount, is_optional)
    VALUES (?, ?, ?, ?, ?)
  `).run(fee_structure_id, name, frequency, amount, is_optional);
}

export function getFeeStructure(class_id, academic_year_id) {
  const structure = db.prepare(`
    SELECT * FROM fee_structures
    WHERE class_id = ? AND academic_year_id = ?
  `).get(class_id, academic_year_id);

  if (!structure) return null;

  const components = db.prepare(`
    SELECT * FROM fee_components
    WHERE fee_structure_id = ?
  `).all(structure.id);

  return { ...structure, components };
}
