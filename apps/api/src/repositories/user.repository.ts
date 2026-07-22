import { supabaseAdmin } from "../lib/supabase.js";
import type { UserRow, UserRole } from "../types/db.js";

const TABLE = "users";

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data as UserRow | null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as UserRow | null;
}

export async function countUsers(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from(TABLE)
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  fullName?: string | null;
  role: UserRole;
}): Promise<UserRow> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .insert({
      email: input.email,
      password_hash: input.passwordHash,
      full_name: input.fullName ?? null,
      role: input.role,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as UserRow;
}

export async function recordFailedLogin(
  id: string,
  attempts: number,
  lockedUntil: string | null,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ failed_login_attempts: attempts, locked_until: lockedUntil })
    .eq("id", id);

  if (error) throw error;
}

export async function resetFailedLogins(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from(TABLE)
    .update({ failed_login_attempts: 0, locked_until: null })
    .eq("id", id);

  if (error) throw error;
}
