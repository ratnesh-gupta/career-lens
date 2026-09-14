import type { CareerProfile } from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export interface PublicProfilePayload {
  publicSlug: string;
  displayName: string | null;
  headline: string | null;
  summary: string | null;
  location: string | null;
  country: string | null;
  currentJobTitle: string | null;
  yearsOfExperience: number | null;
  careerLevel: string | null;
  industry: string | null;
  profilePhoto: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  isOpenToWork: boolean;
  latestPublicScore: {
    overallScore: number;
    grade: string;
    percentile: number | null;
    marketReadiness: string | null;
    shareToken: string | null;
    generatedAt: string | null;
  } | null;
}

export const profileApi = {
  get: () => http.get<CareerProfile>(EP.PROFILE_GET),
  update: (body: Partial<CareerProfile>) => http.patch<CareerProfile>(EP.PROFILE_UPDATE, body),
  getPublic: (slug: string) => http.get<PublicProfilePayload>(EP.PROFILE_PUBLIC(slug)),
};
