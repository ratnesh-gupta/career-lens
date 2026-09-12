import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

import { env } from "@/config/env";
import type { ApiResponse } from "@careerlens/shared-types";

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

// Typed convenience wrappers
async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await apiClient.get(url, config);
  if (!res.data.success) throw res.data.error;
  return res.data.data;
}

async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await apiClient.post(url, data, config);
  if (!res.data.success) throw res.data.error;
  return res.data.data;
}

async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await apiClient.put(url, data, config);
  if (!res.data.success) throw res.data.error;
  return res.data.data;
}

async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await apiClient.patch(url, data, config);
  if (!res.data.success) throw res.data.error;
  return res.data.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res: AxiosResponse<ApiResponse<T>> = await apiClient.delete(url, config);
  if (!res.data.success) throw res.data.error;
  return res.data.data;
}

export const http = { get, post, put, patch, delete: del };
