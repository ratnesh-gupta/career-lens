import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { LoginInput, RegisterInput, User } from "@careerlens/shared-types";

import { authApi } from "@/modules/auth/services/auth-api";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils/constants";
import { captureEvent, identifyUser, resetAnalytics, EVENTS } from "@/utils/analytics";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";

  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  login: (credentials: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      status: "idle",

      setUser: (user) =>
        set({ user, isAuthenticated: true, status: "authenticated", isLoading: false }),

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      },

      setLoading: (isLoading) => set({ isLoading }),

      login: async (credentials) => {
        set({ status: "loading", isLoading: true });
        try {
          const data = await authApi.login(credentials);
          get().setTokens(data.accessToken, data.refreshToken);
          set({
            user: data.user,
            isAuthenticated: true,
            status: "authenticated",
            isLoading: false,
          });
          identifyUser(data.user.id, { email: data.user.email, name: data.user.displayName });
          captureEvent(EVENTS.LOGIN);
        } catch (error) {
          set({ status: "unauthenticated", isLoading: false });
          throw error;
        }
      },

      register: async (input) => {
        set({ status: "loading", isLoading: true });
        captureEvent(EVENTS.SIGNUP_STARTED);
        try {
          const data = await authApi.register(input);
          get().setTokens(data.accessToken, data.refreshToken);
          set({
            user: data.user,
            isAuthenticated: true,
            status: "authenticated",
            isLoading: false,
          });
          identifyUser(data.user.id, { email: data.user.email, name: data.user.displayName });
          captureEvent(EVENTS.SIGNUP_COMPLETED);
        } catch (error) {
          set({ status: "unauthenticated", isLoading: false });
          throw error;
        }
      },

      logout: () => {
        void authApi.logout().catch(() => undefined);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        resetAnalytics();
        captureEvent(EVENTS.LOGOUT);
        set({
          user: null,
          isAuthenticated: false,
          status: "unauthenticated",
          isLoading: false,
        });
      },

      hydrate: async () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
          set({ isLoading: false, status: "unauthenticated" });
          return;
        }
        set({ status: "loading", isLoading: true });
        try {
          const user = await authApi.me();
          set({
            user,
            isAuthenticated: true,
            status: "authenticated",
            isLoading: false,
          });
          identifyUser(user.id, { email: user.email, name: user.displayName });
        } catch {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          set({
            user: null,
            isAuthenticated: false,
            status: "unauthenticated",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "careerlens-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
