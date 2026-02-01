export function calcTotalDue(dues = []) {
  return dues.reduce(
    (sum, d) => sum + Math.max(0, d.due_amount - d.paid_amount),
    0
  );
}
