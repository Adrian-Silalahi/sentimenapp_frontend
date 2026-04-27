export const validateUsername = (value) => {
  // ... (kode yang sudah ada)
  if (!value) {
    return "Username is required.";
  }
  if (value.length < 8) {
    return "Username must be at least 8 characters long.";
  }
  return ""; // No error
};

export const validateEmail = (value) => {
  // ... (kode yang sudah ada)
  if (!value) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "Invalid email format.";
  }
  return ""; // No error
};

export const validatePassword = (value) => {
  // ... (kode yang sudah ada)
  if (!value) {
    return "Password is required.";
  }
  const errors = [];
  if (value.length < 8) {
    errors.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(value)) {
    errors.push("one uppercase letter");
  }
  if (!/[a-z]/.test(value)) {
    errors.push("one lowercase letter");
  }
  if (!/[0-9]/.test(value)) {
    errors.push("one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    errors.push("one special character");
  }

  if (errors.length > 0) {
    return `Password must contain ${errors.join(", ")}.`;
  }
  return ""; // No error
};

// Fungsi baru untuk validasi konfirmasi password
export const validateConfirmPassword = (
  confirmPasswordValue,
  passwordValue
) => {
  if (!confirmPasswordValue) {
    return "Confirm password is required.";
  }
  if (confirmPasswordValue !== passwordValue) {
    return "Passwords do not match.";
  }
  return ""; // No error
};
