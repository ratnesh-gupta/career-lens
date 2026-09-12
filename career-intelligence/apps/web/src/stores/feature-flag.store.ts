import { create } from "zustand";

import { flags, type FeatureFlag } from "@/config/feature-flags";

interface FeatureFlagState {
  flags: Record<FeatureFlag, boolean>;
  setFlag: (key: FeatureFlag, value: boolean) => void;
  toggleFlag: (key: FeatureFlag) => void;
  isEnabled: (key: FeatureFlag) => boolean;
}

export const useFeatureFlagStore = create<FeatureFlagState>((set, get) => ({
  flags: { ...flags },

  setFlag: (key, value) =>
    set((state) => ({
      flags: { ...state.flags, [key]: value },
    })),

  toggleFlag: (key) =>
    set((state) => ({
      flags: { ...state.flags, [key]: !state.flags[key] },
    })),

  isEnabled: (key) => get().flags[key] === true,
}));
