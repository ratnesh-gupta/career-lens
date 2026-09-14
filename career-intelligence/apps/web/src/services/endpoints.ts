/** All API endpoint paths in one place.
 *  Never hardcode /api/v1/... strings outside this file. */

export const EP = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",

  // Profile (authenticated)
  PROFILE_GET: "/profile",
  PROFILE_UPDATE: "/profile",

  // Resume
  RESUME_LIST: "/resumes",
  RESUME_UPLOAD_URL: "/resumes/upload-url",
  RESUME_CONFIRM: (id: string) => `/resumes/${id}/confirm`,
  RESUME_GET: (id: string) => `/resumes/${id}`,
  RESUME_STATUS: (id: string) => `/resumes/${id}/status`,
  RESUME_DELETE: (id: string) => `/resumes/${id}`,
  RESUME_ANALYSIS: (id: string) => `/resumes/${id}/analysis`,
  RESUME_SET_PRIMARY: (id: string) => `/resumes/${id}/primary`,

  // Career Score (authenticated)
  SCORE_GENERATE: "/scores/generate",
  SCORE_GET: (id: string) => `/scores/${id}`,
  SCORE_LIST: "/scores",
  SCORE_SHARE: (id: string) => `/scores/${id}/share`,

  // Public (no auth)
  SCORE_PUBLIC: (token: string) => `/public/scores/${token}`,
  PROFILE_PUBLIC: (slug: string) => `/public/profiles/${slug}`,

  // Admin (super_admin)
  ADMIN_OVERVIEW: "/admin/overview",
  ADMIN_RESUMES: "/admin/resumes",
  ADMIN_RESUME_REPROCESS: (id: string) => `/admin/resumes/${id}/reprocess`,
  ADMIN_USERS: "/admin/users",
} as const;
