/** Baseline error body (HTTP status is on the response, not inside error). */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** Canonical API envelope — matches Laravel ApiResponse + MSW. */
export type ApiResponse<T> =
  | { success: true; data: T; meta?: Record<string, unknown> }
  | { success: false; error: ApiError };

export type Timestamp = string; // ISO 8601
export type UUID = string;
