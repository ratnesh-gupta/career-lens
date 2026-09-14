import { delay, http } from "msw";

import { fail, ok } from "../envelope";
import { mockCareerScore, mockCareerScores } from "../fixtures";

const BASE = "*/api/v1";

export const scoreHandlers = [
  http.get(`${BASE}/scores`, async () => {
    await delay(400);
    return ok(mockCareerScores);
  }),

  http.get(`${BASE}/scores/:id`, async ({ params }) => {
    await delay(300);
    return ok({ ...mockCareerScore, id: String(params.id) });
  }),

  http.post(`${BASE}/scores/generate`, async () => {
    await delay(900);
    return ok(mockCareerScore);
  }),

  http.get(`${BASE}/public/scores/:token`, async ({ params }) => {
    await delay(350);
    const token = String(params.token);
    if (!token) {
      return fail("NOT_FOUND", "Score not found.", { status: 404 });
    }
    return ok({
      overallScore: mockCareerScore.overallScore,
      percentile: mockCareerScore.percentile,
      grade: mockCareerScore.grade,
      marketReadiness: mockCareerScore.marketReadiness,
      breakdown: mockCareerScore.breakdown?.map((b) => ({
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
      ownerAvatarUrl: null,
    });
  }),
];
