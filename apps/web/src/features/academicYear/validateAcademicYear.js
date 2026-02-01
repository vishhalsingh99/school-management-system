export function validateAcademicYear(form) {
  if (!form.name || !form.start_date || !form.end_date) {
    return "All fields are required";
  }

  if (new Date(form.start_date) >= new Date(form.end_date)) {
    return "End date must be after start date";
  }

  return null;
}
