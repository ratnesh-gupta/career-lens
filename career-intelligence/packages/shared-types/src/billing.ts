import type { UUID } from "./common.js";

export type PlanCode = "free" | "pro" | string;

export type FeatureCode =
  | "target_roles_max"
  | "optimization_sessions_per_month"
  | "ai_rewrites_per_month"
  | "jd_analysis"
  | "pdf_exports_per_month"
  | "resume_versions_max"
  | string;

export interface PlanEntitlement {
  featureCode: FeatureCode;
  limit: number | null;
  unlimited: boolean;
}

export interface Plan {
  id: UUID;
  code: PlanCode;
  name: string;
  description: string | null;
  entitlements: PlanEntitlement[];
}

export interface PlansResponse {
  items: Plan[];
}

export interface FeatureSnapshot {
  code: FeatureCode;
  limit: number | null;
  unlimited: boolean;
  used: number | null;
  remaining: number | null;
  allowed: boolean;
}

export interface EntitlementsSnapshot {
  plan: {
    id: UUID;
    code: PlanCode;
    name: string;
    description: string | null;
  };
  periodKey: string;
  features: FeatureSnapshot[];
}
