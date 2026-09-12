import { ACCEPTED_RESUME_TYPES, MAX_RESUME_SIZE_BYTES } from "./constants";

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidResumeFile(file: File): { valid: boolean; reason?: string } {
  if (!ACCEPTED_RESUME_TYPES.includes(file.type as (typeof ACCEPTED_RESUME_TYPES)[number])) {
    return { valid: false, reason: "Only PDF, DOCX, and DOC files are accepted." };
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return { valid: false, reason: "File must be smaller than 10 MB." };
  }
  return { valid: true };
}

export function getPasswordStrength(password: string): "weak" | "fair" | "strong" {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 3) return "fair";
  return "strong";
}
