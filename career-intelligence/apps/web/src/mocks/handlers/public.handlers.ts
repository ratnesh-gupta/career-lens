import { delay, http } from "msw";

import { fail, ok } from "../envelope";
import { mockProfile } from "../fixtures";

const BASE = "*/api/v1";

export const publicHandlers = [
  http.get(`${BASE}/public/profiles/:slug`, async ({ params }) => {
    await delay(300);
    const slug = String(params.slug);
    if (!slug) {
      return fail("NOT_FOUND", "Profile not found.", { status: 404 });
    }
    return ok({
      ...mockProfile,
      slug,
      isPublic: true,
    });
  }),
];
