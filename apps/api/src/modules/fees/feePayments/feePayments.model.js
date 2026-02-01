import db from "../../../database/db.js";

/* =====================================================
   1️⃣ CREATE PAYMENT (master entry)
===================================================== */
export function createPayment({
  student_id,
  academic_year_id,
  amount,
  mode,
  receipt_no,
  reference_no = null,
  remarks = null,
}) {
  const result = db.prepare(`
    INSERT INTO fee_payments
      (student_id, academic_year_id, amount,
       mode, receipt_no, reference_no, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    student_id,
    academic_year_id,
    amount,
    mode,
    receipt_no,
    reference_no,
    remarks
  );

  return result.lastInsertRowid; // 🔑 important
}

/* =====================================================
   2️⃣ READ UNPAID / PARTIAL DUES
===================================================== */
export function getStudentPendingDues(student_id, academic_year_id) {
  return db.prepare(`
    SELECT *
    FROM student_fee_dues
    WHERE student_id = ?
      AND academic_year_id = ?
      AND status IN ('unpaid','partial')
    ORDER BY
      CASE
        WHEN month IS NULL THEN 99
        ELSE month
      END ASC
  `).all(student_id, academic_year_id);
}

/* =====================================================
   3️⃣ APPLY PAYMENT → AUTO ADJUST DUES
===================================================== */
export function applyPaymentToDues(
  payment_id,
  student_id,
  academic_year_id,
  amount
) {
  const dues = getStudentPendingDues(
    student_id,
    academic_year_id
  );

  let remaining = amount;
  let appliedTotal = 0;

  for (const due of dues) {
    if (remaining <= 0) break;

    const pending = due.due_amount - due.paid_amount;
    const pay = Math.min(pending, remaining);

    const newPaid = due.paid_amount + pay;
    const newStatus =
      newPaid === due.due_amount ? "paid" : "partial";

    /* Update due */
    db.prepare(`
      UPDATE student_fee_dues
      SET paid_amount = ?, status = ?
      WHERE id = ?
    `).run(newPaid, newStatus, due.id);

    /* 🔗 Link payment → due (AUDIT SAFE) */
    db.prepare(`
      INSERT INTO fee_payment_items
        (payment_id, fee_due_id, amount)
      VALUES (?, ?, ?)
    `).run(payment_id, due.id, pay);

    remaining -= pay;
    appliedTotal += pay;
  }

  return appliedTotal; // actually adjusted
}

/* =====================================================
   4️⃣ UPDATE STUDENT FEE ACCOUNT (SUMMARY)
===================================================== */
export function updateStudentFeeAccount(
  student_id,
  academic_year_id,
  paidAmount
) {
  db.prepare(`
    UPDATE student_fee_accounts
    SET
      total_paid = total_paid + ?,
      total_due  = total_fee - (total_paid + ?),
      last_updated = CURRENT_TIMESTAMP
    WHERE student_id = ? AND academic_year_id = ?
  `).run(
    paidAmount,
    paidAmount,
    student_id,
    academic_year_id
  );
}

/* =====================================================
   5️⃣ MAIN TRANSACTION WRAPPER (USE THIS)
===================================================== */
export function collectFeeTransaction({
  student_id,
  academic_year_id,
  amount,
  mode,
  receipt_no,
  reference_no,
  remarks,
}) {
  const tx = db.transaction(() => {
    /* 1️⃣ Create payment */
    const paymentId = createPayment({
      student_id,
      academic_year_id,
      amount,
      mode,
      receipt_no,
      reference_no,
      remarks,
    });

    /* 2️⃣ Apply to dues */
    const applied = applyPaymentToDues(
      paymentId,
      student_id,
      academic_year_id,
      amount
    );

    /* 3️⃣ Update account summary */
    updateStudentFeeAccount(
      student_id,
      academic_year_id,
      applied
    );

    return paymentId;
  });

  return tx.immediate();
}

export function getPaymentReceipt(payment_id) {
  return db.prepare(`
    SELECT
      p.id,
      p.amount,
      p.mode,
      p.receipt_no,
      p.created_at,

      s.first_name || ' ' || s.last_name AS student_name,
      s.reg_no,

      c.name AS class_name,
      sec.name AS section_name,

      ay.name AS academic_year,

      GROUP_CONCAT(fc.name, ', ') AS components
    FROM fee_payments p
    JOIN students s ON s.id = p.student_id

    JOIN student_academic_records sar
      ON sar.student_id = s.id
     AND sar.is_current = 1

    JOIN classes c ON c.id = sar.class_id
    JOIN sections sec ON sec.id = sar.section_id
    JOIN academic_years ay ON ay.id = p.academic_year_id

    LEFT JOIN fee_payment_items fpi ON fpi.payment_id = p.id
    LEFT JOIN student_fee_dues d ON d.id = fpi.fee_due_id
    LEFT JOIN fee_components fc ON fc.id = d.component_id

    WHERE p.id = ?
    GROUP BY p.id
  `).get(payment_id);
}
