type Properties = Record<string, unknown>;

export function captureEvent(event: string, properties?: Properties): void {
  if (typeof window === "undefined") return;
  try {
    const posthog = (window as unknown as {
      posthog?: { capture?: (e: string, p?: Properties) => void };
    }).posthog;
    posthog?.capture?.(event, properties);
  } catch {
    // Analytics must never throw
  }
}

export function identifyUser(userId: string, traits?: Properties): void {
  if (typeof window === "undefined") return;
  try {
    const posthog = (window as unknown as {
      posthog?: { identify?: (id: string, t?: Properties) => void };
    }).posthog;
    posthog?.identify?.(userId, traits);
  } catch {
    // noop
  }
}

export function resetAnalytics(): void {
  try {
    const posthog = (window as unknown as { posthog?: { reset?: () => void } }).posthog;
    posthog?.reset?.();
  } catch {
    // noop
  }
}

export const EVENTS = {
  LANDING_VIEWED: "landing_viewed",
  CTA_CLICKED: "cta_clicked",
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "user_registered",
  LOGIN: "login",
  LOGOUT: "logout",
  RESUME_UPLOAD_STARTED: "resume_upload_started",
  RESUME_UPLOAD_COMPLETED: "resume_uploaded",
  RESUME_PROCESSING_COMPLETED: "resume_processing_completed",
  RESUME_ANALYSIS_VIEWED: "resume_analysis_viewed",
  CAREER_SCORE_GENERATED: "career_score_generated",
  CAREER_SCORE_VIEWED: "career_score_viewed",
  SCORE_SHARED: "career_score_shared",
  SHARE_LINK_OPENED: "share_link_opened",
  REFERRAL_SIGNUP: "referral_signup",
  PRIMARY_CTA_CLICKED: "primary_cta_clicked",
  UPGRADE_CTA_CLICKED: "upgrade_cta_clicked",
} as const;
