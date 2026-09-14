import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:8000/api/v1"),
  VITE_API_TIMEOUT_MS: z.coerce.number().default(30000),
  VITE_AUTH_TOKEN_KEY: z.string().default("careerlens_access_token"),
  // Default false — real Laravel API. Enable only for offline/mock FE work.
  VITE_ENABLE_MSW: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1")
    .pipe(z.boolean())
    .default(false),
  VITE_ENABLE_DEVTOOLS: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1")
    .pipe(z.boolean())
    .default(false),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_SENTRY_ENVIRONMENT: z.string().default("development"),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_POSTHOG_HOST: z.string().url().default("https://app.posthog.com"),
  VITE_APP_URL: z.string().url().default("http://localhost:5173"),
  VITE_APP_NAME: z.string().default("CareerLens"),
});

function parseEnv() {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration. Check your .env.local file.");
  }
  return result.data;
}

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
