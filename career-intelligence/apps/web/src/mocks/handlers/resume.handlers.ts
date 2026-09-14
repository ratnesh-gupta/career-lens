import { delay, http } from "msw";

import type { ResumeStatus } from "@careerlens/shared-types";

import { fail, ok } from "../envelope";
import { mockResume, mockResumes } from "../fixtures";

const BASE = "*/api/v1";

const statusById = new Map<string, ResumeStatus>();
const statusStartedAt = new Map<string, number>();

function resolveStatus(id: string): ResumeStatus {
  const started = statusStartedAt.get(id);
  if (!started) return statusById.get(id) ?? "analyzed";

  const elapsed = Date.now() - started;
  if (elapsed < 2000) return "pending";
  if (elapsed < 6000) return "processing";
  statusById.set(id, "analyzed");
  statusStartedAt.delete(id);
  return "analyzed";
}

export const resumeHandlers = [
  http.get(`${BASE}/resumes`, async () => {
    await delay(400);
    return ok(mockResumes);
  }),

  http.post(`${BASE}/resumes/upload-url`, async () => {
    await delay(300);
    const resumeId = `rsm_${Date.now()}`;
    statusById.set(resumeId, "pending");
    statusStartedAt.set(resumeId, Date.now());
    return ok({
      uploadUrl: "https://storage.example.com/upload?token=mock_token",
      resumeId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  }),

  http.post(`${BASE}/resumes/:id/confirm`, async ({ params }) => {
    await delay(200);
    const id = String(params.id);
    statusById.set(id, "processing");
    statusStartedAt.set(id, Date.now());
    return ok({ ...mockResume, id, status: "processing" as const, analysis: null, processedAt: null });
  }),

  http.get(`${BASE}/resumes/:id`, async ({ params }) => {
    await delay(300);
    const id = String(params.id);
    const status = resolveStatus(id);
    return ok({
      ...mockResume,
      id,
      status,
      analysis: status === "analyzed" ? mockResume.analysis : null,
      processedAt: status === "analyzed" ? mockResume.processedAt : null,
    });
  }),

  http.get(`${BASE}/resumes/:id/status`, async ({ params }) => {
    await delay(150);
    const id = String(params.id);
    const status = resolveStatus(id);
    const progress = status === "analyzed" ? 100 : status === "processing" ? 55 : 15;
    return ok({ id, status, progress });
  }),

  http.get(`${BASE}/resumes/:id/analysis`, async ({ params }) => {
    await delay(800);
    const id = String(params.id);
    const status = resolveStatus(id);
    if (status !== "analyzed") {
      return fail("NOT_READY", "Analysis not ready yet", { status: 409 });
    }
    return ok(mockResume.analysis);
  }),

  http.delete(`${BASE}/resumes/:id`, async () => {
    await delay(250);
    return ok(null);
  }),

  http.post(`${BASE}/resumes/:id/primary`, async ({ params }) => {
    await delay(200);
    return ok({ ...mockResume, id: String(params.id), isPrimary: true });
  }),
];
