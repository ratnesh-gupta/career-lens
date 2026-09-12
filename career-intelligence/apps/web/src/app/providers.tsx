import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";

import { flags } from "@/config/feature-flags";
import { queryClient } from "@/services/query-client";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      {flags.DEVTOOLS_ENABLED && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
