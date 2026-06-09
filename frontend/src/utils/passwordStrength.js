export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", className: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", className: "weak" };
  if (score <= 3) return { score, label: "Fair", className: "fair" };
  if (score <= 4) return { score, label: "Good", className: "good" };
  return { score, label: "Strong", className: "strong" };
}
