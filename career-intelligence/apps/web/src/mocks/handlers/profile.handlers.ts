import { delay, http } from "msw";

import { ok } from "../envelope";
import { mockProfile } from "../fixtures";

const BASE = "*/api/v1";

export const profileHandlers = [
  http.get(`${BASE}/profile`, async () => {
    await delay(300);
    return ok(mockProfile);
  }),

  http.patch(`${BASE}/profile`, async () => {
    await delay(400);
    return ok(mockProfile);
  }),
];
