import { useEffect, type ReactNode } from "react";

import { http } from "@/services/api-client";
import { EP } from "@/services/endpoints";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@careerlens/shared-types";
import { AUTH_TOKEN_KEY } from "@/utils/constants";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Hydrates auth state on boot.
 * If a token exists in localStorage, fetches /auth/me and populates the store.
 * Always clears isLoading so guards can resolve.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const user = await http.get<User>(EP.AUTH_ME);
        if (!cancelled) {
          setUser(user);
        }
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
