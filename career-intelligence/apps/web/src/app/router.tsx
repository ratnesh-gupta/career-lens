import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { RequireAuth, RequireGuest, RequireEntitlement } from "@/components/auth";
import { ComingSoonPage } from "@/components/feedback/coming-soon-page";
import { PlaceholderPage } from "@/components/feedback/placeholder-page";
import { ROUTES } from "@/config/routes";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

function Lazy(
  importFn: () => Promise<{ default: React.ComponentType }>,
  fallbackTitle: string,
) {
  const Component = lazy(() =>
    importFn().catch(() => ({
      default: () => <PlaceholderPage title={fallbackTitle} />,
    })),
  );
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// Marketing
const LandingPage = () =>
  Lazy(() => import("@/modules/marketing/pages/LandingPage"), "Landing");
const PricingPage = () =>
  Lazy(() => import("@/modules/marketing/pages/PricingPage"), "Pricing");
const AboutPage = () =>
  Lazy(() => import("@/modules/marketing/pages/AboutPage"), "About");
const PrivacyPage = () =>
  Lazy(() => import("@/modules/marketing/pages/PrivacyPage"), "Privacy");
const TermsPage = () =>
  Lazy(() => import("@/modules/marketing/pages/TermsPage"), "Terms");

// Auth
const LoginPage = () =>
  Lazy(() => import("@/modules/auth/pages/LoginPage"), "Login");
const SignupPage = () =>
  Lazy(() => import("@/modules/auth/pages/SignupPage"), "Register");
const ForgotPasswordPage = () =>
  Lazy(() => import("@/modules/auth/pages/ForgotPasswordPage"), "Forgot password");
const ResetPasswordPage = () =>
  Lazy(() => import("@/modules/auth/pages/ResetPasswordPage"), "Reset password");
const VerifyEmailPage = () =>
  Lazy(() => import("@/modules/auth/pages/VerifyEmailPage"), "Verify email");

// App
const DashboardPage = () =>
  Lazy(() => import("@/modules/dashboard/pages/DashboardPage"), "Dashboard");
const ProfilePage = () =>
  Lazy(() => import("@/modules/profile/pages/ProfilePage"), "Profile");
const ProfileEditPage = () =>
  Lazy(() => import("@/modules/profile/pages/ProfileEditPage"), "Edit profile");
const PublicProfilePage = () =>
  Lazy(() => import("@/modules/profile/pages/PublicProfilePage"), "Public profile");

const ResumeListPage = () =>
  Lazy(() => import("@/modules/resume/pages/ResumeListPage"), "Resumes");
const ResumeUploadPage = () =>
  Lazy(() => import("@/modules/resume/pages/ResumeUploadPage"), "Upload resume");
const ResumeDetailPage = () =>
  Lazy(() => import("@/modules/resume/pages/ResumeDetailPage"), "Resume detail");
const ResumeAnalysisPage = () =>
  Lazy(() => import("@/modules/resume/pages/ResumeAnalysisPage"), "Resume analysis");

const CareerScorePage = () =>
  Lazy(() => import("@/modules/career-score/pages/CareerScorePage"), "Career Score");
const ScoreBreakdownPage = () =>
  Lazy(() => import("@/modules/career-score/pages/ScoreBreakdownPage"), "Score breakdown");
const PublicScorePage = () =>
  Lazy(() => import("@/modules/career-score/pages/PublicScorePage"), "Public score");

const SettingsPage = () =>
  Lazy(() => import("@/modules/settings/pages/SettingsPage"), "Settings");
const PrivacySettingsPage = () =>
  Lazy(() => import("@/modules/settings/pages/PrivacySettingsPage"), "Privacy settings");
const AccountSettingsPage = () =>
  Lazy(() => import("@/modules/settings/pages/AccountSettingsPage"), "Account settings");

function GuestLayout() {
  return (
    <RequireGuest>
      <Outlet />
    </RequireGuest>
  );
}

function AuthLayout() {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
}

export const router = createBrowserRouter([
  // —— Public marketing ——
  { path: ROUTES.HOME, element: LandingPage() },
  { path: ROUTES.PRICING, element: PricingPage() },
  { path: ROUTES.ABOUT, element: AboutPage() },
  { path: ROUTES.PRIVACY, element: PrivacyPage() },
  { path: ROUTES.TERMS, element: TermsPage() },

  // Public score & profile (no auth required)
  { path: ROUTES.PUBLIC_SCORE_PATTERN, element: PublicScorePage() },
  { path: ROUTES.PUBLIC_PROFILE_PATTERN, element: PublicProfilePage() },

  // —— Guest-only auth ——
  {
    element: <GuestLayout />,
    children: [
      { path: ROUTES.LOGIN, element: LoginPage() },
      { path: ROUTES.REGISTER, element: SignupPage() },
      { path: ROUTES.FORGOT_PASSWORD, element: ForgotPasswordPage() },
      { path: ROUTES.RESET_PASSWORD, element: ResetPasswordPage() },
      { path: ROUTES.VERIFY_EMAIL, element: VerifyEmailPage() },
    ],
  },

  // —— Authenticated app ——
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.DASHBOARD, element: DashboardPage() },
      { path: ROUTES.PROFILE, element: ProfilePage() },
      { path: ROUTES.PROFILE_EDIT, element: ProfileEditPage() },

      { path: ROUTES.RESUMES, element: ResumeListPage() },
      { path: ROUTES.RESUME_UPLOAD, element: ResumeUploadPage() },
      { path: ROUTES.RESUME_DETAIL_PATTERN, element: ResumeDetailPage() },
      { path: ROUTES.RESUME_ANALYSIS_PATTERN, element: ResumeAnalysisPage() },

      // Authenticated score routes (exact paths before public :slug)
      { path: ROUTES.SCORE_BREAKDOWN, element: ScoreBreakdownPage() },
      {
        path: ROUTES.SCORE,
        element: CareerScorePage(),
        // Note: /score is authenticated "my score"; /score/:slug is public
      },

      { path: ROUTES.SETTINGS, element: SettingsPage() },
      { path: ROUTES.SETTINGS_PRIVACY, element: PrivacySettingsPage() },
      { path: ROUTES.SETTINGS_ACCOUNT, element: AccountSettingsPage() },

      // R1b placeholders behind entitlement gate
      {
        path: ROUTES.TARGET_ROLE,
        element: (
          <RequireEntitlement flag="OPTIMIZATION" title="Target role">
            <ComingSoonPage title="Target role" />
          </RequireEntitlement>
        ),
      },
      {
        path: ROUTES.OPTIMIZATION,
        element: (
          <RequireEntitlement flag="OPTIMIZATION" title="Resume optimization">
            <ComingSoonPage title="Resume optimization" />
          </RequireEntitlement>
        ),
      },
      {
        path: ROUTES.OPTIMIZATION_DETAIL_PATTERN,
        element: (
          <RequireEntitlement flag="OPTIMIZATION" title="Optimization detail">
            <ComingSoonPage title="Optimization detail" />
          </RequireEntitlement>
        ),
      },
      {
        path: ROUTES.VERSIONS,
        element: (
          <RequireEntitlement flag="OPTIMIZATION" title="Resume versions">
            <ComingSoonPage title="Resume versions" />
          </RequireEntitlement>
        ),
      },
      {
        path: ROUTES.EXPORT,
        element: (
          <RequireEntitlement flag="OPTIMIZATION" title="Export">
            <ComingSoonPage title="Export" />
          </RequireEntitlement>
        ),
      },
      {
        path: ROUTES.BILLING,
        element: (
          <RequireEntitlement flag="BILLING" title="Billing">
            <ComingSoonPage title="Billing" />
          </RequireEntitlement>
        ),
      },
    ],
  },

  // 404
  {
    path: "*",
    element: (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">404</h1>
        <p className="text-sm text-muted-foreground">Page not found</p>
        <a href={ROUTES.HOME} className="text-sm text-primary underline">
          Go home
        </a>
      </div>
    ),
  },
]);

// Silence unused Navigate import warning if tree-shaken differently
void Navigate;
