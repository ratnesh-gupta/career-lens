import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { AUTH_TOKEN_KEY } from "@/utils/constants";

export function applyInterceptors(client: AxiosInstance): void {
  // Request: attach Bearer token
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  // Response: handle 401 → redirect to login
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );
}
