export function validatePassword(password) {
  if (typeof password !== "string") return "Password must be a string";

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Za-z]/.test(password)) {
    return "Password must contain at least one letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  return null; // valid
}
