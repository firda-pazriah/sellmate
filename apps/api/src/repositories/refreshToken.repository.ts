import { supabaseAdmin } from "../lib/supabase.js";
import type { RefreshTokenRow } from "../types/db.js";

const TABLE = "refresh_tokens";

export async function insertRefreshToken(input: {
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<RefreshTokenRow> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      user_id: input.userId,
      family_id: input.familyId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt.toISOString(),
      user_agent: input.userAgent ?? null,
      ip_address: input.ipAddress ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as RefreshTokenRow;
}

export async function findRefreshTokenByHash(
  tokenHash: string,
): Promise<RefreshTokenRow | null> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error) throw error;
  return data as RefreshTokenRow | null;
}

export async function markRotated(id: string, replacedById: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ revoked_at: new Date().toISOString(), replaced_by_id: replacedById })
    .eq("id", id);

  if (error) throw error;
}

export async function revokeById(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .is("revoked_at", null);

  if (error) throw error;
}

/** Revokes every still-active token in a rotation family — used when reuse of an already-rotated token is detected (a strong signal of theft). */
export async function revokeFamily(familyId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ revoked_at: new Date().toISOString() })
    .eq("family_id", familyId)
    .is("revoked_at", null);

  if (error) throw error;
}

/** Revokes every active session for a user — used for logout-all / "sign out everywhere". */
export async function revokeAllForUser(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("revoked_at", null);

  if (error) throw error;
}
