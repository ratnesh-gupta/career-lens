import { useAuthStore } from "@/stores/auth.store";

/** Convenience selector for common auth fields. */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);

  return { user, isAuthenticated, isLoading, status, logout };
}
