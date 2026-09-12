import { createContext, useContext, type ReactNode } from "react";

import { flags, type FeatureFlag } from "@/config/feature-flags";
import { useFeatureFlagStore } from "@/stores/feature-flag.store";

interface FeatureFlagContextValue {
  isEnabled: (key: FeatureFlag) => boolean;
  flags: Record<FeatureFlag, boolean>;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue>({
  isEnabled: (key) => flags[key] === true,
  flags: { ...flags },
});

interface FeatureFlagProviderProps {
  children: ReactNode;
}

export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const storeFlags = useFeatureFlagStore((s) => s.flags);
  const isEnabled = useFeatureFlagStore((s) => s.isEnabled);

  return (
    <FeatureFlagContext.Provider value={{ isEnabled, flags: storeFlags }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagContextValue {
  return useContext(FeatureFlagContext);
}
