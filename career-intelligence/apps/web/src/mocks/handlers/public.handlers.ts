import { delay, http, HttpResponse } from "msw";

import { mockCareerProfile, mockCareerScore, mockUser } from "../fixtures";

const BASE = "*/api/v1";

export const publicHandlers = [
  http.get(`${BASE}/profiles/:slug`, async ({ params }) => {
    await delay(400);
    const slug = String(params.slug);
    if (slug !== mockCareerProfile.publicSlug) {
      return HttpResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Profile not found", status: 404 },
        },
        { status: 404 },
      );
    }
    return HttpResponse.json({
      success: true,
      data: {
        displayName: mockUser.displayName,
        avatarUrl: mockUser.avatarUrl,
        headline: mockCareerProfile.headline,
        summary: mockCareerProfile.summary,
        location: mockCareerProfile.location,
        publicSlug: mockCareerProfile.publicSlug,
        overallScore: mockCareerScore.overallScore,
        grade: mockCareerScore.grade,
        topStrengths: mockCareerScore.strengths.slice(0, 3).map((s) => s.title),
      },
    });
  }),
];
