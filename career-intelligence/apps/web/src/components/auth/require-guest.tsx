import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";

interface RequireGuestProps {
  children: ReactNode;
}

/** Redirect authenticated users away from guest-only pages (login/register). */
export function RequireGuest({ children }: RequireGuestProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
