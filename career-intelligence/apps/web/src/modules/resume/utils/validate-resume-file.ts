/** R1a upload rules: PDF only, max 5 MB, reject empty/non-PDF. */

export const R1A_MAX_RESUME_BYTES = 5 * 1024 * 1024;

export interface ResumeFileValidation {
  valid: boolean;
  reason?: string;
}

export function validateResumeFile(file: File): ResumeFileValidation {
  const name = file.name.toLowerCase();
  const isPdfExt = name.endsWith(".pdf");
  const isPdfMime =
    file.type === "application/pdf" || file.type === "application/x-pdf" || file.type === "";

  if (!isPdfExt) {
    return { valid: false, reason: "Only PDF files are supported in this release." };
  }

  if (file.type && !isPdfMime) {
    return { valid: false, reason: "File must be a valid PDF (MIME type mismatch)." };
  }

  if (file.size === 0) {
    return { valid: false, reason: "This file appears empty. Choose another PDF." };
  }

  if (file.size > R1A_MAX_RESUME_BYTES) {
    return { valid: false, reason: "PDF must be 5 MB or smaller." };
  }

  // Heuristic: extremely small PDFs are often image-only scans without text layer
  if (file.size < 8_000) {
    return {
      valid: false,
      reason:
        "This PDF looks like a scanned image without selectable text. Export a text-based PDF and try again.",
    };
  }

  return { valid: true };
}
