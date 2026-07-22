import crypto from "node:crypto";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiryDate,
  signAccessToken,
} from "../utils/tokens.js";
import { toPublicUser, type PublicUser } from "../types/db.js";
import * as userRepo from "../repositories/user.repository.js";
import * as refreshTokenRepo from "../repositories/refreshToken.repository.js";
import type { RegisterInput, LoginInput } from "../validators/auth.schema.js";

export interface RequestContext {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  /** internal DB id of the refresh token row, used to link rotation chains */
  refreshTokenId: string;
}

// A precomputed bcrypt hash compared against on "user not found" so a login
// attempt for a nonexistent email takes roughly the same time as one for a
// real email with a wrong password — this narrows (does not fully close,
// nothing does) the timing side-channel an attacker could use to enumerate
// which emails have accounts.
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) {
    dummyHashPromise = hashPassword(crypto.randomUUID());
  }
  return dummyHashPromise;
}

export async function registerUser(input: RegisterInput): Promise<PublicUser> {
  if (!env.ALLOW_PUBLIC_REGISTRATION) {
    throw HttpError.forbidden("Registration is currently disabled");
  }

  const existing = await userRepo.findUserByEmail(input.email);
  if (existing) {
    throw HttpError.conflict("An account with this email already exists");
  }

  const userCount = await userRepo.countUsers();
  const role = userCount === 0 ? "owner" : "employee";

  const passwordHash = await hashPassword(input.password);
  const row = await userRepo.createUser({
    email: input.email,
    passwordHash,
    fullName: input.fullName ?? null,
    role,
  });

  return toPublicUser(row);
}

export async function authenticateUser(input: LoginInput): Promise<PublicUser> {
  const user = await userRepo.findUserByEmail(input.email);

  if (!user) {
    // Burn roughly the same time a real bcrypt compare would take.
    await verifyPassword(input.password, await getDummyHash());
    throw HttpError.unauthorized("Invalid email or password");
  }

  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    throw HttpError.locked(
      "This account is temporarily locked due to repeated failed login attempts. Try again later.",
    );
  }

  const passwordMatches = await verifyPassword(input.password, user.password_hash);

  if (!passwordMatches) {
    const attempts = user.failed_login_attempts + 1;
    const shouldLock = attempts >= env.MAX_FAILED_LOGIN_ATTEMPTS;
    const lockedUntil = shouldLock
      ? new Date(Date.now() + env.LOCKOUT_MINUTES * 60_000).toISOString()
      : null;

    await userRepo.recordFailedLogin(user.id, attempts, lockedUntil);
    throw HttpError.unauthorized("Invalid email or password");
  }

  if (user.failed_login_attempts > 0 || user.locked_until) {
    await userRepo.resetFailedLogins(user.id);
  }

  return toPublicUser(user);
}

export async function issueTokenPair(
  userId: string,
  role: PublicUser["role"],
  context: RequestContext,
  familyId: string = crypto.randomUUID(),
): Promise<TokenPair> {
  const accessToken = signAccessToken(userId, role);
  const rawRefreshToken = generateRefreshToken();
  const expiresAt = refreshTokenExpiryDate();

  const row = await refreshTokenRepo.insertRefreshToken({
    userId,
    familyId,
    tokenHash: hashRefreshToken(rawRefreshToken),
    expiresAt,
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    refreshTokenExpiresAt: expiresAt,
    refreshTokenId: row.id,
  };
}

export interface RotateResult {
  tokens: TokenPair;
  user: PublicUser;
}

/**
 * Rotates a refresh token: the presented token is atomically retired and a
 * brand-new one (same family) is issued. If a token that was already
 * rotated/retired gets presented again, that's treated as a signal the
 * token was stolen and replayed — the entire family is revoked, forcing a
 * fresh login on every device using that session chain.
 */
export async function rotateRefreshToken(
  rawToken: string,
  context: RequestContext,
): Promise<RotateResult> {
  const tokenHash = hashRefreshToken(rawToken);
  const existing = await refreshTokenRepo.findRefreshTokenByHash(tokenHash);

  if (!existing) {
    throw HttpError.unauthorized("Invalid refresh token");
  }

  if (existing.revoked_at) {
    await refreshTokenRepo.revokeFamily(existing.family_id);
    throw HttpError.unauthorized(
      "This refresh token was already used. All sessions for this account have been signed out as a precaution.",
    );
  }

  if (new Date(existing.expires_at).getTime() <= Date.now()) {
    throw HttpError.unauthorized("Refresh token expired, please log in again");
  }

  const user = await userRepo.findUserById(existing.user_id);
  if (!user) {
    throw HttpError.unauthorized("Invalid refresh token");
  }

  const tokens = await issueTokenPair(user.id, user.role, context, existing.family_id);
  await refreshTokenRepo.markRotated(existing.id, tokens.refreshTokenId);

  return { tokens, user: toPublicUser(user) };
}

export async function revokeRefreshToken(rawToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(rawToken);
  const existing = await refreshTokenRepo.findRefreshTokenByHash(tokenHash);
  if (existing && !existing.revoked_at) {
    await refreshTokenRepo.revokeById(existing.id);
  }
}

export async function revokeAllSessions(userId: string): Promise<void> {
  await refreshTokenRepo.revokeAllForUser(userId);
}

export async function getUserProfile(userId: string): Promise<PublicUser | null> {
  const row = await userRepo.findUserById(userId);
  return row ? toPublicUser(row) : null;
}
