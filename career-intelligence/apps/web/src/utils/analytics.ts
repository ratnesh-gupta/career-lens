/* Analytics helpers — thin wrappers over PostHog and Sentry.
   Import capture/identify from here, never from posthog-js directly,
   so the implementation can be swapped without touching call sites. */

type Properties = Record<string, unknown>;

export function captureEvent(event: string, properties?: Properties): void {
  if (typeof window === "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posthog = (window as any).posthog as { capture?: (e: string, p?: Properties) => void } | undefined;
    posthog?.capture?.(event, properties);
  } catch {
    // Analytics must never throw
  }
}

export function identifyUser(userId: string, traits?: Properties): void {
  if (typeof window === "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posthog = (window as any).posthog as { identify?: (id: string, t?: Properties) => void } | undefined;
    posthog?.identify?.(userId, traits);
  } catch {
    // noop
  }
}

export function resetAnalytics(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posthog = (window as any).posthog as { reset?: () => void } | undefined;
    posthog?.reset?.();
  } catch {
    // noop
  }
}

// Predefined event names — keep these as typed constants to avoid typos
export const EVENTS = {
  // Auth
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  LOGIN: "login",
  LOGOUT: "logout",

  // Resume
  RESUME_UPLOAD_STARTED: "resume_upload_started",
  RESUME_UPLOAD_COMPLETED: "resume_upload_completed",
  RESUME_ANALYSIS_VIEWED: "resume_analysis_viewed",

  // Score
  CAREER_SCORE_VIEWED: "career_score_viewed",
  SCORE_SHARED: "score_shared",

  // CTA
  PRIMARY_CTA_CLICKED: "primary_cta_clicked",
  UPGRADE_CTA_CLICKED: "upgrade_cta_clicked",
} as const;
