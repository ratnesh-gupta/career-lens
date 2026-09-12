import { delay, http, HttpResponse } from "msw";

import { mockAuthResponse, mockUser } from "../fixtures";

const BASE = "/api/v1";

export const authHandlers = [
  http.post(`${BASE}/auth/register`, async () => {
    await delay(600);
    return HttpResponse.json({ success: true, data: mockAuthResponse });
  }),

  http.post(`${BASE}/auth/login`, async () => {
    await delay(500);
    return HttpResponse.json({ success: true, data: mockAuthResponse });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({ success: true, data: null });
  }),

  http.get(`${BASE}/auth/me`, async () => {
    await delay(300);
    return HttpResponse.json({ success: true, data: mockUser });
  }),

  http.post(`${BASE}/auth/forgot-password`, async () => {
    await delay(500);
    return HttpResponse.json({ success: true, data: { message: "Reset email sent." } });
  }),
];
