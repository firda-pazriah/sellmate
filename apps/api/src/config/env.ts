import "dotenv/config";
import { z } from "zod";

const boolFromString = z
  .string()
  .optional()
  .transform((v) => v === "true")
  .default("false");

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  CORS_ORIGINS: z
    .string()
    .default("http://localhost:3000")
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),

  TRUST_PROXY: boolFromString,

  SUPABASE_URL: z.string().url({ message: "SUPABASE_URL must be a valid URL" }),
  // The SECRET key (sb_secret_..., successor to the legacy service_role key)
  // — NOT the publishable key. Publishable keys are RLS-respecting and safe
  // for clients; our users/refresh_tokens tables have RLS enabled with no
  // policies, so a publishable key would be denied on every query and auth
  // would silently break. This key bypasses RLS and must stay server-only.
  SUPABASE_SECRET_KEY: z
    .string()
    .min(20, "SUPABASE_SECRET_KEY looks too short to be valid"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_ISSUER: z.string().default("sellmate-api"),
  JWT_AUDIENCE: z.string().default("sellmate-app"),

  REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, "REFRESH_TOKEN_SECRET must be at least 32 characters"),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(30),
  REFRESH_COOKIE_NAME: z.string().default("sm_refresh_token"),

  MAX_FAILED_LOGIN_ATTEMPTS: z.coerce.number().int().positive().default(5),
  LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),

  ALLOW_PUBLIC_REGISTRATION: boolFromString,
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    // Fail fast and loudly at boot — never start the server with a broken
    // or insecure configuration (e.g. a missing/short JWT secret).
    // eslint-disable-next-line no-console
    console.error(`Invalid environment configuration:\n${issues}`);
    process.exit(1);
  }

  if (parsed.data.JWT_ACCESS_SECRET === parsed.data.REFRESH_TOKEN_SECRET) {
    // eslint-disable-next-line no-console
    console.error(
      "Invalid environment configuration:\n  - JWT_ACCESS_SECRET and REFRESH_TOKEN_SECRET must be different values",
    );
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
export type Env = typeof env;
