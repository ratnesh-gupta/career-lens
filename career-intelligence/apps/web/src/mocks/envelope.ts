import { HttpResponse } from "msw";

/** Success envelope aligned with Laravel App\\Support\\ApiResponse. */
export function ok<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  return HttpResponse.json(
    {
      success: true as const,
      data,
      meta: init?.meta ?? {},
    },
    { status: init?.status ?? 200 },
  );
}

/** Error envelope — HTTP status is on the response only. */
export function fail(
  code: string,
  message: string,
  options?: { status?: number; details?: Record<string, unknown> },
) {
  return HttpResponse.json(
    {
      success: false as const,
      error: {
        code,
        message,
        details: options?.details ?? {},
      },
    },
    { status: options?.status ?? 400 },
  );
}
