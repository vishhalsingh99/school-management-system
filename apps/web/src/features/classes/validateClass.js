export function validateClass(form) {
  if (!form.name.trim()) {
    return "Class name is required";
  }

  if (!form.order_no || isNaN(form.order_no)) {
    return "Order number is required";
  }

  return null;
}
