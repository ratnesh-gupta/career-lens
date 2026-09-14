import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  isAxiosError,
} from "axios";

import { env } from "@/config/env";
import type { ApiError, ApiResponse } from "@careerlens/shared-types";

import { applyInterceptors } from "./interceptors";

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: env.VITE_API_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  applyInterceptors(client);
  return client;
}

export const apiClient = createApiClient();

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const body = error.response?.data as ApiResponse<unknown> | undefined;
    if (body && body.success === false && body.error) {
      return {
        code: body.error.code,
        message: body.error.message,
        details: body.error.details,
      };
    }
    return {
      code: "HTTP_ERROR",
      message: error.message || "Request failed",
    };
  }
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    return error as ApiError;
  }
  return {
    code: "UNKNOWN_ERROR",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

async function unwrap<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  try {
    const res = await promise;
    if (!res.data.success) {
      throw res.data.error;
    }
    return res.data.data;
  } catch (error) {
    throw toApiError(error);
  }
}

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.get(url, config));
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.post(url, data, config));
}

async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.put(url, data, config));
}

async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.patch(url, data, config));
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.delete(url, config));
}

export const http = { get, post, put, patch, delete: del };
