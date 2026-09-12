import { delay, http, HttpResponse } from "msw";

import { mockCareerScore } from "../fixtures";

const BASE = "/api/v1";

export const scoreHandlers = [
  http.post(`${BASE}/scores`, async () => {
    await delay(1500); // Simulate AI processing
    return HttpResponse.json({ success: true, data: mockCareerScore });
  }),

  http.get(`${BASE}/scores/:id`, async () => {
    await delay(400);
    return HttpResponse.json({ success: true, data: mockCareerScore });
  }),

  http.get(`${BASE}/scores`, async () => {
    await delay(400);
    return HttpResponse.json({ success: true, data: [mockCareerScore] });
  }),

  http.get(`${BASE}/scores/public/:token`, async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: {
        overallScore: mockCareerScore.overallScore,
        percentile: mockCareerScore.percentile,
        grade: mockCareerScore.grade,
        marketReadiness: mockCareerScore.marketReadiness,
        topStrengths: mockCareerScore.strengths.slice(0, 3).map((s) => ({
          title: s.title,
          marketValue: s.marketValue,
        })),
        generatedAt: mockCareerScore.generatedAt,
        ownerDisplayName: "Alex Chen",
        ownerAvatarUrl: "https://i.pravatar.cc/150?u=alex.chen",
      },
    });
  }),
];
