import { useQuery } from "@tanstack/react-query";
import type { EntitlementsSnapshot, FeatureCode } from "@careerlens/shared-types";

import { fetchEntitlements } from "@/lib/api/billing";
import { useAuth } from "@/hooks/use-auth";

export function useEntitlements() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["billing", "entitlements"],
    queryFn: fetchEntitlements,
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function featureFromSnapshot(
  snapshot: EntitlementsSnapshot | undefined,
  code: FeatureCode,
) {
  return snapshot?.features.find((f) => f.code === code);
}

export function canUseFeature(
  snapshot: EntitlementsSnapshot | undefined,
  code: FeatureCode,
): boolean {
  const feature = featureFromSnapshot(snapshot, code);
  if (!feature) return false;
  return feature.allowed;
}
