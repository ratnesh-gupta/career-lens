/** Typed route path constants.
 *  Import ROUTES rather than string literals throughout the app.
 *  Matches the React Router definitions in app/router.tsx (Step 3).
 */

export const ROUTES = {
  // Public / marketing
  HOME: "/",
  PRICING: "/pricing",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  // Auth (guest)
  LOGIN: "/login",
  REGISTER: "/register",
  /** @deprecated Prefer ROUTES.REGISTER — kept for older links */
  SIGNUP: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  // Public score / profile
  PUBLIC_SCORE: (slug: string) => `/score/${slug}` as const,
  PUBLIC_SCORE_PATTERN: "/score/:slug",
  PUBLIC_PROFILE: (slug: string) => `/p/${slug}` as const,
  PUBLIC_PROFILE_PATTERN: "/p/:slug",

  // Authenticated app
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",

  // Resumes
  RESUMES: "/resumes",
  RESUME_UPLOAD: "/resumes/upload",
  RESUME_DETAIL: (id: string) => `/resumes/${id}` as const,
  RESUME_DETAIL_PATTERN: "/resumes/:id",
  RESUME_ANALYSIS: (id: string) => `/resumes/${id}/analysis` as const,
  RESUME_ANALYSIS_PATTERN: "/resumes/:id/analysis",

  // Career score (authenticated)
  SCORE: "/score",
  SCORE_BREAKDOWN: "/score/breakdown",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_PRIVACY: "/settings/privacy",
  SETTINGS_ACCOUNT: "/settings/account",

  // R1b placeholders
  TARGET_ROLE: "/target-role",
  OPTIMIZATION: "/optimization",
  OPTIMIZATION_DETAIL: (id: string) => `/optimization/${id}` as const,
  OPTIMIZATION_DETAIL_PATTERN: "/optimization/:id",
  VERSIONS: "/versions",
  EXPORT: "/export",
  BILLING: "/billing",
} as const;
