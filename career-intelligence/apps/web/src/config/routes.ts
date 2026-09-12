/** Typed route path constants.
 *  Import ROUTES here rather than string literals throughout the app.
 *  Matches the React Router route definitions in app/router.tsx. */

export const ROUTES = {
  // Public / marketing
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",

  // Auth
  SIGNUP: "/signup",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // Onboarding (post-signup)
  ONBOARDING: "/onboarding",

  // Core app (protected)
  DASHBOARD: "/dashboard",

  // Resume
  RESUME_UPLOAD: "/resume/upload",
  RESUME_ANALYSIS: (resumeId: string) => `/resume/${resumeId}/analysis` as const,
  RESUME_ANALYSIS_PATTERN: "/resume/:resumeId/analysis",

  // Career Score
  CAREER_SCORE: "/score",
  SCORE_DETAIL: (scoreId: string) => `/score/${scoreId}` as const,
  SCORE_DETAIL_PATTERN: "/score/:scoreId",
  SCORE_SHARE: (scoreId: string) => `/score/${scoreId}/share` as const,
  SCORE_SHARE_PATTERN: "/score/:scoreId/share",

  // Public profile
  PUBLIC_PROFILE: (slug: string) => `/p/${slug}` as const,
  PUBLIC_PROFILE_PATTERN: "/p/:slug",

  // Profile / account
  PROFILE: "/profile",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_NOTIFICATIONS: "/settings/notifications",
  SETTINGS_SECURITY: "/settings/security",

  // R1b placeholders
  BILLING: "/billing",
  OPTIMIZATION: "/optimization",
} as const;
