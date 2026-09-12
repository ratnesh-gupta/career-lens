import { delay, http, HttpResponse } from "msw";

import { mockCareerProfile } from "../fixtures";

const BASE = "*/api/v1";

export const profileHandlers = [
  http.get(`${BASE}/profile`, async () => {
    await delay(350);
    return HttpResponse.json({ success: true, data: mockCareerProfile });
  }),

  http.put(`${BASE}/profile`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: { ...mockCareerProfile, ...body, updatedAt: new Date().toISOString() },
    });
  }),

  http.patch(`${BASE}/profile`, async ({ request }) => {
    await delay(350);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: { ...mockCareerProfile, ...body, updatedAt: new Date().toISOString() },
    });
  }),
];
