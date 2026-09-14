/* Feature flags — evaluate at module load time. */

import { env } from "./env";

export const flags = {
  /** MSW only when explicitly enabled and running Vite dev server */
  MSW_ENABLED: Boolean(env.VITE_ENABLE_MSW) && Boolean(import.meta.env.DEV),
  DEVTOOLS_ENABLED: env.VITE_ENABLE_DEVTOOLS,
  DARK_MODE: false,
  BILLING: false,
  OPTIMIZATION: false,
  REFERRAL_PROGRAM: false,
} as const;

export type FeatureFlag = keyof typeof flags;
