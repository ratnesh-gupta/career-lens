import { delay, http } from "msw";

import { fail, ok } from "../envelope";
import { mockAuthResponse, mockUser } from "../fixtures";

const BASE = "*/api/v1";

export const authHandlers = [
  http.post(`${BASE}/auth/register`, async () => {
    await delay(600);
    return ok(mockAuthResponse);
  }),

  http.post(`${BASE}/auth/login`, async () => {
    await delay(500);
    return ok(mockAuthResponse);
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await delay(200);
    return ok(null);
  }),

  http.get(`${BASE}/auth/me`, async ({ request }) => {
    await delay(300);
    const auth = request.headers.get("Authorization");
    if (!auth?.startsWith("Bearer ")) {
      return fail("UNAUTHENTICATED", "Unauthenticated.", { status: 401 });
    }
    return ok(mockUser);
  }),

  http.post(`${BASE}/auth/refresh`, async () => {
    await delay(200);
    return ok({
      accessToken: mockAuthResponse.accessToken,
      refreshToken: mockAuthResponse.refreshToken,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  }),

  http.post(`${BASE}/auth/forgot-password`, async () => {
    await delay(500);
    return ok({ message: "Reset email sent." });
  }),

  http.post(`${BASE}/auth/reset-password`, async () => {
    await delay(500);
    return ok({ message: "Password updated." });
  }),

  http.post(`${BASE}/auth/verify-email`, async () => {
    await delay(400);
    return ok({ message: "Email verified." });
  }),
];
