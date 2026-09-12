import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import { ROUTES } from "@/config/routes";

// Lazy-loaded pages — Step 3 will implement these
const LazyPage = (displayName: string) => {
  const Component = () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">{displayName}</p>
      </div>
    </div>
  );
  Component.displayName = displayName;
  return Component;
};

const NotFoundPage = LazyPage("404");

// R1a pages (Step 3)
const LandingPage = lazy(() =>
  import("@/modules/marketing/pages/LandingPage").catch(() => ({
    default: LazyPage("Landing"),
  })),
);
const SignupPage = lazy(() =>
  import("@/modules/auth/pages/SignupPage").catch(() => ({
    default: LazyPage("Signup"),
  })),
);
const LoginPage = lazy(() =>
  import("@/modules/auth/pages/LoginPage").catch(() => ({
    default: LazyPage("Login"),
  })),
);
const DashboardPage = lazy(() =>
  import("@/modules/dashboard/pages/DashboardPage").catch(() => ({
    default: LazyPage("Dashboard"),
  })),
);
const ResumeUploadPage = lazy(() =>
  import("@/modules/resume/pages/ResumeUploadPage").catch(() => ({
    default: LazyPage("Resume Upload"),
  })),
);
const CareerScorePage = lazy(() =>
  import("@/modules/career-score/pages/CareerScorePage").catch(() => ({
    default: LazyPage("Career Score"),
  })),
);
const PublicProfilePage = lazy(() =>
  import("@/modules/profile/pages/PublicProfilePage").catch(() => ({
    default: LazyPage("Public Profile"),
  })),
);

// R1b placeholders
const BillingPage = LazyPage("Billing (coming soon)");
const OptimizationPage = LazyPage("Optimization (coming soon)");

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: ROUTES.HOME,
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.SIGNUP,
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignupPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: ROUTES.PUBLIC_PROFILE_PATTERN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicProfilePage />
      </Suspense>
    ),
  },

  // Protected routes
  {
    element: <Outlet />, // will wrap with AuthGuard in Step 3
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.RESUME_UPLOAD,
        element: (
          <Suspense fallback={<PageLoader />}>
            <ResumeUploadPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CAREER_SCORE,
        element: (
          <Suspense fallback={<PageLoader />}>
            <CareerScorePage />
          </Suspense>
        ),
      },
      // R1b placeholders
      { path: ROUTES.BILLING, element: <BillingPage /> },
      { path: ROUTES.OPTIMIZATION, element: <OptimizationPage /> },
    ],
  },

  // 404
  { path: "*", element: <NotFoundPage /> },
]);
