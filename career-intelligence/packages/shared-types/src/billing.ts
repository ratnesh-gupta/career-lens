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

export type BillingInterval = "month" | "year";

export interface PlanEntitlement {
  featureCode: FeatureCode;
  limit: number | null;
  unlimited: boolean;
}

export interface PlanPrice {
  countryCode: string;
  currency: string;
  amountMinor: number;
  interval: BillingInterval | string;
}

export interface Plan {
  id: UUID;
  code: PlanCode;
  name: string;
  description: string | null;
  entitlements: PlanEntitlement[];
  price?: PlanPrice | null;
}

export interface PlansResponse {
  items: Plan[];
  country?: string;
  interval?: string;
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

export interface CheckoutRequest {
  planCode: PlanCode;
  interval: BillingInterval;
  countryCode?: string | null;
}

export interface CheckoutPayload {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  planCode: PlanCode;
  interval: string;
  countryCode: string;
  paymentId: UUID;
  name: string;
  description: string;
}

export interface SubscriptionSummary {
  status: string;
  planCode: PlanCode;
  provider: string;
  expiresAt: string | null;
  startedAt?: string | null;
}
