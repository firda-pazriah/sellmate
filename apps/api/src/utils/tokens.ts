import crypto from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export type UserRole = "owner" | "employee";

export interface AccessTokenPayload extends JwtPayload {
  sub: string; // user id
  role: UserRole;
}

/**
 * Short-lived JWT access token. Sent back in the JSON body (not a cookie)
 * and used by the client as `Authorization: Bearer <token>` — that keeps it
 * out of cookies entirely, so it's immune to CSRF and never auto-attaches to
 * unrelated requests.
 */
export function signAccessToken(userId: string, role: UserRole): string {
  return jwt.sign({ sub: userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithm: "HS256",
    jwtid: crypto.randomUUID(),
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithms: ["HS256"],
  });

  if (typeof payload === "string" || !payload.sub || !payload.role) {
    throw new jwt.JsonWebTokenError("Malformed access token payload");
  }

  return payload as AccessTokenPayload;
}

/**
 * Refresh tokens are opaque random values, NOT JWTs. There's nothing useful
 * to decode client-side, so an opaque high-entropy string avoids exposing
 * any structure and keeps validity fully server-controlled (a JWT can't be
 * revoked before it expires; a DB-backed opaque token can be, instantly).
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

/**
 * Only this HMAC digest is stored in Supabase — the raw token is returned
 * to the client once (in the httpOnly cookie) and never persisted. Using an
 * HMAC keyed by a server-side secret (rather than a plain hash) means a
 * stolen database dump alone isn't enough to forge a valid-looking token.
 */
export function hashRefreshToken(rawToken: string): string {
  return crypto.createHmac("sha256", env.REFRESH_TOKEN_SECRET).update(rawToken).digest("hex");
}

export function refreshTokenExpiryDate(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS);
  return expiresAt;
}
