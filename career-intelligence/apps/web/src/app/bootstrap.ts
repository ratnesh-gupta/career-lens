import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

import { env } from "@/config/env";
import { flags } from "@/config/feature-flags";

/**
 * App bootstrap — runs once before React render.
 * Sentry / PostHog are no-ops when keys are missing so local dev works without them.
 */
export async function bootstrap(): Promise<void> {
  // --- Sentry ---
  if (env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      environment: env.VITE_SENTRY_ENVIRONMENT,
      tracesSampleRate: env.VITE_SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,
      integrations: [Sentry.browserTracingIntegration()],
    });
  }

  // --- PostHog ---
  if (env.VITE_POSTHOG_KEY) {
    posthog.init(env.VITE_POSTHOG_KEY, {
      api_host: env.VITE_POSTHOG_HOST,
      capture_pageview: true,
      persistence: "localStorage",
      loaded: () => {
        if (import.meta.env.DEV) {
          console.info("[PostHog] initialized");
        }
      },
    });
  }

  // --- MSW (dev only) ---
  if (flags.MSW_ENABLED) {
    const { worker } = await import("../mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
    console.warn("[MSW] Mock API enabled — using local fixtures");
  }
}
