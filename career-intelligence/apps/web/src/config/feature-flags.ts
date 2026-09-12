/* Feature flags — evaluate at module load time.
   Replace with a PostHog or LaunchDarkly integration in production. */

import { env } from "./env";

export const flags = {
  MSW_ENABLED: env.VITE_ENABLE_MSW && (import.meta.env.DEV ?? false),
  DEVTOOLS_ENABLED: env.VITE_ENABLE_DEVTOOLS,
  DARK_MODE: false,          // R1b
  BILLING: false,            // R1b
  OPTIMIZATION: false,       // R1b
  REFERRAL_PROGRAM: false,   // R1b
} as const;

export type FeatureFlag = keyof typeof flags;
