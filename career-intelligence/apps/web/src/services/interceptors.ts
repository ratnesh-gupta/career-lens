import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { AUTH_TOKEN_KEY } from "@/utils/constants";

const tokenKey = env.VITE_AUTH_TOKEN_KEY || AUTH_TOKEN_KEY;

export function applyInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(tokenKey);
        // Avoid redirect loop on public auth routes
        const path = window.location.pathname;
        if (!path.startsWith("/login") && !path.startsWith("/register")) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    },
  );
}
