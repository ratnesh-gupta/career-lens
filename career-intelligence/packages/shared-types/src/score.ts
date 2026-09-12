import type { UUID, Timestamp } from "./common.js";

export type ScoreCategory =
  | "skills_relevance"
  | "experience_depth"
  | "education_fit"
  | "ats_optimization"
  | "market_demand"
  | "career_trajectory"
  | "network_signals"
  | "compensation_alignment";

export type RecommendationPriority = "critical" | "high" | "medium" | "low";
export type RecommendationCategory =
  | "resume"
  | "skills"
  | "experience"
  | "networking"
  | "education"
  | "compensation";

export interface ScoreBreakdown {
  category: ScoreCategory;
  label: string;
  score: number;
  maxScore: number;
  percentile: number;
  description: string;
  contributingFactors: string[];
}

export interface Strength {
  id: UUID;
  title: string;
  description: string;
  marketValue: "high" | "medium" | "low";
  relatedSkills: string[];
  supportingEvidence: string;
}

export interface Weakness {
  id: UUID;
  title: string;
  description: string;
  impactOnScore: number;
  relatedSkills: string[];
  improvementPath: string;
}

export interface Recommendation {
  id: UUID;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  estimatedImpact: number;
  timeToImplement: string;
  resources: Array<{ label: string; url: string }>;
  isCompleted: boolean;
}

export interface CareerScore {
  id: UUID;
  userId: UUID;
  resumeId: UUID;
  overallScore: number;
  percentile: number;
  grade: "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F";
  breakdown: ScoreBreakdown[];
  strengths: Strength[];
  weaknesses: Weakness[];
  recommendations: Recommendation[];
  industryBenchmark: number;
  roleMatch: number;
  marketReadiness: "ready" | "almost-ready" | "needs-work" | "significant-gaps";
  shareToken: string;
  isPublic: boolean;
  generatedAt: Timestamp;
  expiresAt: Timestamp;
}

export interface PublicScoreView {
  overallScore: number;
  percentile: number;
  grade: CareerScore["grade"];
  marketReadiness: CareerScore["marketReadiness"];
  topStrengths: Pick<Strength, "title" | "marketValue">[];
  generatedAt: Timestamp;
  ownerDisplayName: string;
  ownerAvatarUrl: string | null;
}
