import type { UserRole } from "../utils/tokens.js";

export type { UserRole } from "../utils/tokens.js";

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: UserRole;
  failed_login_attempts: number;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  family_id: string;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  replaced_by_id: string | null;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface PublicUser {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string;
}

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at,
  };
}
