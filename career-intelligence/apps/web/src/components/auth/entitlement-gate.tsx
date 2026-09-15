import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { FeatureCode } from "@careerlens/shared-types";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/feedback/loading-state";
import { ROUTES } from "@/config/routes";
import { canUseFeature, useEntitlements } from "@/hooks/use-entitlements";

interface EntitlementGateProps {
  feature: FeatureCode;
  children: ReactNode;
  /** Shown when the feature is not allowed on the current plan. */
  fallback?: ReactNode;
}

/**
 * Server-backed gate (R1b #1). Prefer this over feature-flag RequireEntitlement
 * for paid product limits.
 */
export function EntitlementGate({ feature, children, fallback }: EntitlementGateProps) {
  const { data, isLoading, isError } = useEntitlements();

  if (isLoading) {
    return <LoadingState label="Checking plan…" />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Unable to load plan entitlements. Please refresh.
      </div>
    );
  }

  if (!canUseFeature(data, feature)) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-6">
        <p className="text-sm font-medium text-foreground">Upgrade required</p>
        <p className="text-sm text-muted-foreground">
          Your current plan does not include this feature. Upgrade to Pro to unlock higher limits.
        </p>
        <Button asChild size="sm">
          <Link to={ROUTES.BILLING}>View plans</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
