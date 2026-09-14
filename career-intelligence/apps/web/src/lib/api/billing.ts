import type { EntitlementsSnapshot, PlansResponse } from "@careerlens/shared-types";

import { apiClient } from "@/lib/api/client";

export async function fetchPlans(): Promise<PlansResponse> {
  const res = await apiClient.get<PlansResponse>("/billing/plans");
  return res.data;
}

export async function fetchEntitlements(): Promise<EntitlementsSnapshot> {
  const res = await apiClient.get<EntitlementsSnapshot>("/billing/entitlements");
  return res.data;
}
