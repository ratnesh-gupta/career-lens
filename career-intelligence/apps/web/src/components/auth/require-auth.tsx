import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

import { ROUTES } from "@/config/routes";
import { useAuthStore } from "@/stores/auth.store";

interface RequireAuthProps {
  children: ReactNode;
}

/** Redirect unauthenticated users to /login, preserving intended destination. */
export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
