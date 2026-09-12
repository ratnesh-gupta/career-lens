import type { ReactNode } from "react";

import { ComingSoonPage } from "@/components/feedback/coming-soon-page";
import { flags } from "@/config/feature-flags";

interface RequireEntitlementProps {
  children: ReactNode;
  /** Feature flag key that must be true to allow access. */
  flag?: keyof typeof flags;
  title?: string;
}

/** R1b stub: gate paid features. When flag is off, show Coming Soon. */
export function RequireEntitlement({
  children,
  flag = "BILLING",
  title = "Coming soon",
}: RequireEntitlementProps) {
  if (!flags[flag]) {
    return <ComingSoonPage title={title} />;
  }
  return <>{children}</>;
}
