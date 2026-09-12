import { describe, expect, it } from "vitest";

import { validateResumeFile } from "../utils/validate-resume-file";

function makeFile(name: string, size: number, type = "application/pdf") {
  const blob = new Blob([new Uint8Array(Math.min(size, 100))], { type });
  Object.defineProperty(blob, "size", { value: size });
  return new File([blob], name, { type });
}

describe("validateResumeFile", () => {
  it("accepts a reasonable PDF", () => {
    const file = makeFile("resume.pdf", 50_000);
    expect(validateResumeFile(file).valid).toBe(true);
  });

  it("rejects non-PDF extension", () => {
    const file = makeFile("resume.docx", 50_000, "application/msword");
    expect(validateResumeFile(file).valid).toBe(false);
  });

  it("rejects oversized files", () => {
    const file = makeFile("big.pdf", 6 * 1024 * 1024);
    expect(validateResumeFile(file).valid).toBe(false);
  });

  it("rejects tiny scan-like PDFs", () => {
    const file = makeFile("scan.pdf", 2000);
    expect(validateResumeFile(file).valid).toBe(false);
  });
});
