import db from "../../../database/db.js";

/* =========================
   ACCOUNT SUMMARY
========================= */
export function getStudentFeeAccount(student_id, academic_year_id) {
  return db.prepare(`
    SELECT *
    FROM student_fee_accounts
    WHERE student_id = ? AND academic_year_id = ?
  `).get(student_id, academic_year_id);
}

/* =========================
   DUES BREAKDOWN
========================= */
export function getStudentFeeDues(student_id, academic_year_id) {
  return db.prepare(`
    SELECT
      d.id,
      c.name AS component,
      d.month,
      d.due_amount,
      d.paid_amount,
      d.status
    FROM student_fee_dues d
    JOIN fee_components c ON c.id = d.component_id
    WHERE d.student_id = ?
      AND d.academic_year_id = ?
    ORDER BY d.month ASC
  `).all(student_id, academic_year_id);
}

/* =========================
   PAYMENT HISTORY
========================= */
export function getPaymentHistory(student_id, academic_year_id) {
  return db.prepare(`
    SELECT
      amount,
      mode,
      receipt_no,
      created_at
    FROM fee_payments
    WHERE student_id = ? AND academic_year_id = ?
    ORDER BY created_at DESC
  `).all(student_id, academic_year_id);
}

export function getMonthlyFeeStatus(student_id, academic_year_id) {
  return db.prepare(`
    SELECT
      month,
      SUM(due_amount) AS total_due,
      SUM(paid_amount) AS total_paid,
      CASE
        WHEN SUM(paid_amount) = 0 THEN 'unpaid'
        WHEN SUM(paid_amount) < SUM(due_amount) THEN 'partial'
        ELSE 'paid'
      END AS status
    FROM student_fee_dues
    WHERE student_id = ?
      AND academic_year_id = ?
      AND month IS NOT NULL
    GROUP BY month
    ORDER BY month
  `).all(student_id, academic_year_id);
}

export function getMonthlyComponentDues(student_id, academic_year_id) {
  return db.prepare(`
    SELECT
      d.id,
      d.month,
      c.name AS component,
      d.due_amount,
      d.paid_amount,
      d.status
    FROM student_fee_dues d
    JOIN fee_components c ON c.id = d.component_id
    WHERE d.student_id = ?
      AND d.academic_year_id = ?
      AND d.month IS NOT NULL
    ORDER BY d.month, c.name
  `).all(student_id, academic_year_id);
}