import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { flags } from "@/config/feature-flags";
import { queryClient } from "@/services/query-client";

import { AuthProvider } from "./auth-provider";
import { FeatureFlagProvider } from "./feature-flag-provider";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Provider stack (outer → inner):
 * 1. QueryClientProvider
 * 2. ThemeProvider (light only for R1a)
 * 3. AuthProvider (hydrates session)
 * 4. FeatureFlagProvider
 * 5. children (Router lives in App)
 * 6. Toaster + optional ReactQueryDevtools
 *
 * ErrorBoundary wraps Providers in App.tsx.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <FeatureFlagProvider>
            {children}
            <Toaster />
            {flags.DEVTOOLS_ENABLED && <ReactQueryDevtools initialIsOpen={false} />}
          </FeatureFlagProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
