import { delay, http, HttpResponse } from "msw";

import { mockResume } from "../fixtures";

const BASE = "/api/v1";

export const resumeHandlers = [
  http.get(`${BASE}/resumes`, async () => {
    await delay(400);
    return HttpResponse.json({ success: true, data: [mockResume] });
  }),

  http.post(`${BASE}/resumes/upload-url`, async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: {
        uploadUrl: "https://storage.example.com/upload?token=mock_token",
        resumeId: mockResume.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    });
  }),

  http.post(`${BASE}/resumes/:id/confirm`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: { ...mockResume, status: "processing" } });
  }),

  http.get(`${BASE}/resumes/:id`, async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: mockResume });
  }),

  http.get(`${BASE}/resumes/:id/analysis`, async () => {
    await delay(800);
    return HttpResponse.json({ success: true, data: mockResume.analysis });
  }),
];
