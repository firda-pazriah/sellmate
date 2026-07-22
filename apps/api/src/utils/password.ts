import bcrypt from "bcryptjs";

// Cost factor 12 is a reasonable balance of security vs. login latency in
// 2026 hardware terms; bump this over time as hardware gets faster.
const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Password policy enforced at the schema-validation layer too (see
 * validators/auth.schema.ts) — kept here as the single source of truth for
 * the rule set so both places can't drift.
 */
export const PASSWORD_RULES = {
  minLength: 10,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
  description:
    "Password must be at least 10 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.",
};
