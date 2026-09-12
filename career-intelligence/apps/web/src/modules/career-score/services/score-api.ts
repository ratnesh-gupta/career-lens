import type { CareerScore } from "@careerlens/shared-types";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";

export interface PublicScorePayload {
  overallScore: number;
  percentile: number;
  grade: string;
  marketReadiness: string;
  breakdown?: Array<{ category: string; label: string; score: number }>;
  topStrengths: Array<{ title: string; marketValue: string }>;
  improvementArea?: string | null;
  generatedAt: string;
  ownerDisplayName: string;
  ownerAvatarUrl: string | null;
}

export const scoreApi = {
  list: () => http.get<CareerScore[]>(EP.SCORE_LIST),
  get: (id: string) => http.get<CareerScore>(EP.SCORE_GET(id)),
  generate: () => http.post<CareerScore>(EP.SCORE_GENERATE),
  getPublic: (token: string) => http.get<PublicScorePayload>(EP.SCORE_PUBLIC(token)),
};
