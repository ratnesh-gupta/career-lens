export const APP_NAME = "CareerLens";
export const APP_TAGLINE = "Personal Career Intelligence Platform";
export const APP_PRIMARY_QUESTION = "How does the job market see you?";
export const APP_PRIMARY_CTA = "Get My Career Score — Free";

export const MAX_RESUME_SIZE_MB = 10;
export const MAX_RESUME_SIZE_BYTES = MAX_RESUME_SIZE_MB * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;
export const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx", ".doc"] as const;

export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 70,
  FAIR: 50,
  POOR: 0,
} as const;

export const SCORE_LABELS = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Needs Work",
} as const;

export const AUTH_TOKEN_KEY = "careerlens_access_token";
export const REFRESH_TOKEN_KEY = "careerlens_refresh_token";

export const QUERY_STALE_TIME = {
  SHORT: 30 * 1000,         // 30 seconds
  MEDIUM: 5 * 60 * 1000,   // 5 minutes
  LONG: 30 * 60 * 1000,    // 30 minutes
} as const;

export const PAGINATION_PAGE_SIZE = 20;

export const SOCIAL_SHARE_URL = (slug: string) =>
  `${window.location.origin}/profile/${slug}`;

export const ROUTES = {
  HOME: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  RESUME_UPLOAD: "/resume/upload",
  RESUME_ANALYSIS: "/resume/:id/analysis",
  CAREER_SCORE: "/score",
  SCORE_DETAIL: "/score/:id",
  SCORE_SHARE: "/score/:id/share",
  PUBLIC_PROFILE: "/profile/:slug",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  BILLING: "/billing",
  OPTIMIZATION: "/optimization",
} as const;
