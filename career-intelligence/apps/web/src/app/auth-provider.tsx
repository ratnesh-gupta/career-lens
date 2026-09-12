import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/stores/auth.store";

interface AuthProviderProps {
  children: ReactNode;
}

/** Hydrates auth state on boot via store.hydrate(). */
export function AuthProvider({ children }: AuthProviderProps) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
