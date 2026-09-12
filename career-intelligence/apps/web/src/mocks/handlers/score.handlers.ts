import { delay, http, HttpResponse } from "msw";

import { mockCareerScore, mockCareerScores } from "../fixtures";

const BASE = "*/api/v1";

export const scoreHandlers = [
  http.post(`${BASE}/scores`, async () => {
    await delay(1500);
    return HttpResponse.json({ success: true, data: mockCareerScore });
  }),

  http.get(`${BASE}/scores/:id`, async ({ params }) => {
    await delay(400);
    const id = String(params.id);
    const found = mockCareerScores.find((s) => s.id === id) ?? mockCareerScore;
    return HttpResponse.json({ success: true, data: { ...found, id } });
  }),

  http.get(`${BASE}/scores`, async () => {
    await delay(400);
    return HttpResponse.json({ success: true, data: mockCareerScores });
  }),

  http.get(`${BASE}/scores/public/:token`, async ({ params }) => {
    await delay(400);
    const token = String(params.token);
    if (token !== mockCareerScore.shareToken && token !== "demo") {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Score not found", status: 404 },
        },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        overallScore: mockCareerScore.overallScore,
        percentile: mockCareerScore.percentile,
        grade: mockCareerScore.grade,
        marketReadiness: mockCareerScore.marketReadiness,
        breakdown: mockCareerScore.breakdown.map((b) => ({
          category: b.category,
          label: b.label,
          score: b.score,
        })),
        topStrengths: mockCareerScore.strengths.slice(0, 3).map((s) => ({
          title: s.title,
          marketValue: s.marketValue,
        })),
        improvementArea: mockCareerScore.weaknesses[0]?.title ?? null,
        generatedAt: mockCareerScore.generatedAt,
        ownerDisplayName: "Alex Chen",
        ownerAvatarUrl: "https://i.pravatar.cc/150?u=alex.chen",
      },
    });
  }),
];
