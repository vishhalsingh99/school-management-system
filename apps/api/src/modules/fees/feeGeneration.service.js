import db from "../../database/db.js";

/**
 * Generate fee dues for a student (academic year wise)
 * Call this on admission / promotion
 */
export function generateStudentFees({
  student_id,
  class_id,
  academic_year_id,
}) {
  const tx = db.transaction(() => {
    /* 1️⃣ Get fee structure */
    const feeStructure = db
      .prepare(
        `
      SELECT id
      FROM fee_structures
      WHERE class_id = ? AND academic_year_id = ?
        AND status = 'active'
    `,
      )
      .get(class_id, academic_year_id);

    if (!feeStructure) {
      throw new Error("Fee structure not found for class/year");
    }

    /* 2️⃣ Get fee components */
    const components = db
      .prepare(
        `
      SELECT *
      FROM fee_components
      WHERE fee_structure_id = ?
    `,
      )
      .all(feeStructure.id);

    if (!components.length) {
      throw new Error("No fee components found");
    }

    let totalFee = 0;

    /* 3️⃣ Generate dues */
    for (const comp of components) {
      if (comp.frequency === "monthly") {
        for (let month = 1; month <= 12; month++) {
          db.prepare(
            `
        INSERT INTO student_fee_dues
          (student_id, academic_year_id, component_id, month, due_amount)
        VALUES (?, ?, ?, ?, ?)
      `,
          ).run(student_id, academic_year_id, comp.id, month, comp.amount);

          totalFee += comp.amount;
        }
      }

      if (comp.frequency === "yearly" || comp.frequency === "one_time") {
        db.prepare(
          `
      INSERT INTO student_fee_dues
        (student_id, academic_year_id, component_id, month, due_amount)
      VALUES (?, ?, ?, NULL, ?)
    `,
        ).run(student_id, academic_year_id, comp.id, comp.amount);

        totalFee += comp.amount;
      }
    }

    /* 4️⃣ Create student fee account (summary) */
    db.prepare(
      `
      INSERT INTO student_fee_accounts
        (student_id, academic_year_id,
         total_fee, total_due)
      VALUES (?, ?, ?, ?)
    `,
    ).run(student_id, academic_year_id, totalFee, totalFee);
  });

  tx.immediate();
}
