import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

/**
 * Server-only Supabase client using the SECRET key (successor to the legacy
 * service_role key — NOT the publishable key, which respects RLS and won't
 * work here).
 *
 * This key bypasses Row Level Security, so it must NEVER be sent to a
 * browser or mobile client, logged, or committed to source control — it
 * only ever lives in this process's environment. All auth tables (users,
 * refresh_tokens) have RLS enabled with no policies, so this is the only
 * key that can read/write them.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
