/** Typed route path constants.
 *  Import ROUTES rather than string literals throughout the app.
 */

export const ROUTES = {
  // Public / marketing
  HOME: "/",
  PRICING: "/pricing",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  COOKIES: "/cookies",

  // Auth (guest)
  LOGIN: "/login",
  REGISTER: "/register",
  /** @deprecated Prefer ROUTES.REGISTER */
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
  RESUME_PROCESSING: (id: string) => `/resumes/${id}/processing` as const,
  RESUME_PROCESSING_PATTERN: "/resumes/:id/processing",

  // Career score (authenticated)
  SCORE: "/score",
  SCORE_BREAKDOWN: "/score/breakdown",

  // Settings
  SETTINGS: "/settings",
  SETTINGS_PRIVACY: "/settings/privacy",
  SETTINGS_ACCOUNT: "/settings/account",

  // Admin (super_admin)
  ADMIN: "/admin",
  ADMIN_RESUMES: "/admin/resumes",
  ADMIN_USERS: "/admin/users",

  // R1b placeholders
  TARGET_ROLE: "/target-role",
  OPTIMIZATION: "/optimization",
  OPTIMIZATION_DETAIL: (id: string) => `/optimization/${id}` as const,
  OPTIMIZATION_DETAIL_PATTERN: "/optimization/:id",
  VERSIONS: "/versions",
  EXPORT: "/export",
  BILLING: "/billing",
} as const;
