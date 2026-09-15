import { lazy, Suspense, type ComponentType, type ReactElement } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { RequireAdmin, RequireAuth, RequireGuest, RequireEntitlement } from "@/components/auth";
import { ComingSoonPage } from "@/components/feedback/coming-soon-page";
import { PlaceholderPage } from "@/components/feedback/placeholder-page";
import { AppShell } from "@/components/layout/app-shell";
import { ROUTES } from "@/config/routes";

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

function lazyElement(
  importFn: () => Promise<{ default: ComponentType }>,
  fallbackTitle: string,
): ReactElement {
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

function GuestLayout() {
  return (
    <RequireGuest>
      <Outlet />
    </RequireGuest>
  );
}

function ProtectedLayout() {
  return (
    <RequireAuth>
      <AppShell />
    </RequireAuth>
  );
}

function AdminLayout() {
  return (
    <RequireAuth>
      <RequireAdmin>
        <AppShell />
      </RequireAdmin>
    </RequireAuth>
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: lazyElement(() => import("@/modules/marketing/pages/LandingPage"), "Landing"),
  },
  {
    path: ROUTES.PRICING,
    element: lazyElement(() => import("@/modules/marketing/pages/PricingPage"), "Pricing"),
  },
  {
    path: ROUTES.ABOUT,
    element: lazyElement(() => import("@/modules/marketing/pages/AboutPage"), "About"),
  },
  {
    path: ROUTES.PRIVACY,
    element: lazyElement(() => import("@/modules/marketing/pages/PrivacyPage"), "Privacy"),
  },
  {
    path: ROUTES.TERMS,
    element: lazyElement(() => import("@/modules/marketing/pages/TermsPage"), "Terms"),
  },
  {
    path: ROUTES.COOKIES,
    element: lazyElement(() => import("@/modules/marketing/pages/CookiesPage"), "Cookies"),
  },
  {
    path: ROUTES.REFUND,
    element: lazyElement(() => import("@/modules/marketing/pages/RefundPage"), "Refund"),
  },
  {
    path: ROUTES.CONTACT,
    element: lazyElement(() => import("@/modules/marketing/pages/ContactPage"), "Contact"),
  },

  {
    path: ROUTES.PUBLIC_SCORE_PATTERN,
    element: lazyElement(() => import("@/modules/career-score/pages/PublicScorePage"), "Public score"),
  },
  {
    path: ROUTES.PUBLIC_PROFILE_PATTERN,
    element: lazyElement(() => import("@/modules/profile/pages/PublicProfilePage"), "Public profile"),
  },

  {
    element: <GuestLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: lazyElement(() => import("@/modules/auth/pages/LoginPage"), "Login"),
      },
      {
        path: ROUTES.REGISTER,
        element: lazyElement(() => import("@/modules/auth/pages/SignupPage"), "Register"),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: lazyElement(
          () => import("@/modules/auth/pages/ForgotPasswordPage"),
          "Forgot password",
        ),
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: lazyElement(
          () => import("@/modules/auth/pages/ResetPasswordPage"),
          "Reset password",
        ),
      },
      {
        path: ROUTES.VERIFY_EMAIL,
        element: lazyElement(() => import("@/modules/auth/pages/VerifyEmailPage"), "Verify email"),
      },
    ],
  },

  {
    element: <ProtectedLayout />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: lazyElement(() => import("@/modules/dashboard/pages/DashboardPage"), "Dashboard"),
      },
      {
        path: ROUTES.PROFILE,
        element: lazyElement(() => import("@/modules/profile/pages/ProfilePage"), "Profile"),
      },
      {
        path: ROUTES.PROFILE_EDIT,
        element: lazyElement(() => import("@/modules/profile/pages/ProfileEditPage"), "Edit profile"),
      },

      {
        path: ROUTES.RESUMES,
        element: lazyElement(() => import("@/modules/resume/pages/ResumeListPage"), "Resumes"),
      },
      {
        path: ROUTES.RESUME_UPLOAD,
        element: lazyElement(() => import("@/modules/resume/pages/ResumeUploadPage"), "Upload resume"),
      },
      {
        path: ROUTES.RESUME_PROCESSING_PATTERN,
        element: lazyElement(
          () => import("@/modules/resume/pages/ResumeProcessingPage"),
          "Processing",
        ),
      },
      {
        path: ROUTES.RESUME_ANALYSIS_PATTERN,
        element: lazyElement(
          () => import("@/modules/resume/pages/ResumeAnalysisPage"),
          "Resume analysis",
        ),
      },
      {
        path: ROUTES.RESUME_DETAIL_PATTERN,
        element: lazyElement(() => import("@/modules/resume/pages/ResumeDetailPage"), "Resume detail"),
      },

      {
        path: ROUTES.SCORE_BREAKDOWN,
        element: lazyElement(
          () => import("@/modules/career-score/pages/ScoreBreakdownPage"),
          "Score breakdown",
        ),
      },
      {
        path: ROUTES.SCORE,
        element: lazyElement(
          () => import("@/modules/career-score/pages/CareerScorePage"),
          "Career Score",
        ),
      },

      {
        path: ROUTES.SETTINGS,
        element: lazyElement(() => import("@/modules/settings/pages/SettingsPage"), "Settings"),
        children: [
          { index: true, element: <Navigate to={ROUTES.SETTINGS_ACCOUNT} replace /> },
          {
            path: "account",
            element: lazyElement(
              () => import("@/modules/settings/pages/AccountSettingsPage"),
              "Account settings",
            ),
          },
          {
            path: "privacy",
            element: lazyElement(
              () => import("@/modules/settings/pages/PrivacySettingsPage"),
              "Privacy settings",
            ),
          },
        ],
      },

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

  {
    element: <AdminLayout />,
    children: [
      {
        path: ROUTES.ADMIN,
        element: lazyElement(() => import("@/modules/admin/pages/AdminOverviewPage"), "Admin"),
      },
      {
        path: ROUTES.ADMIN_RESUMES,
        element: lazyElement(() => import("@/modules/admin/pages/AdminResumesPage"), "Admin resumes"),
      },
      {
        path: ROUTES.ADMIN_USERS,
        element: lazyElement(() => import("@/modules/admin/pages/AdminUsersPage"), "Admin users"),
      },
    ],
  },

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
