import { delay, http } from "msw";

import { fail, ok } from "../envelope";
import { mockCareerProfile, mockCareerScore } from "../fixtures";

const BASE = "*/api/v1";

export const publicHandlers = [
  http.get(`${BASE}/public/profiles/:slug`, async ({ params }) => {
    await delay(300);
    const slug = String(params.slug);
    if (!slug || slug === "private") {
      return fail("NOT_FOUND", "Public profile not found.", { status: 404 });
    }
    return ok({
      publicSlug: slug,
      displayName: mockCareerProfile.displayName ?? "Alex Chen",
      headline: mockCareerProfile.headline,
      summary: mockCareerProfile.summary,
      location: mockCareerProfile.location,
      country: null,
      currentJobTitle: null,
      yearsOfExperience: mockCareerProfile.yearsOfExperience,
      careerLevel: null,
      industry: null,
      profilePhoto: null,
      linkedinUrl: mockCareerProfile.linkedinUrl,
      githubUrl: mockCareerProfile.githubUrl,
      portfolioUrl: mockCareerProfile.portfolioUrl,
      isOpenToWork: mockCareerProfile.isOpenToWork,
      latestPublicScore: {
        overallScore: mockCareerScore.overallScore,
        grade: mockCareerScore.grade,
        percentile: mockCareerScore.percentile,
        marketReadiness: mockCareerScore.marketReadiness,
        shareToken: mockCareerScore.shareToken,
        generatedAt: mockCareerScore.generatedAt,
      },
    });
  }),

  http.get(`${BASE}/public/scores/:token`, async ({ params }) => {
    await delay(300);
    const token = String(params.token);
    if (!token) {
      return fail("NOT_FOUND", "Score not found.", { status: 404 });
    }
    return ok({
      overallScore: mockCareerScore.overallScore,
      percentile: mockCareerScore.percentile,
      grade: mockCareerScore.grade,
      marketReadiness: mockCareerScore.marketReadiness,
      topStrengths: mockCareerScore.strengths.slice(0, 3).map((s) => ({
        title: s.title,
        marketValue: s.marketValue,
      })),
      improvementArea: mockCareerScore.weaknesses[0]?.title ?? null,
      ownerDisplayName: "Alex Chen",
      ownerAvatarUrl: null,
      ownerPublicSlug: "alex-chen",
      generatedAt: mockCareerScore.generatedAt,
    });
  }),
];
