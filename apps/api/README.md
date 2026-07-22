# Sellmate API — Auth

A small, secure login API: Express + TypeScript, Supabase as the database, JWT access tokens, and rotating opaque refresh tokens.

## How it works

- **Access token** — short-lived JWT (15 min default), returned in the JSON response body and sent by the client as `Authorization: Bearer <token>`. Never stored in a cookie, so it isn't a CSRF vector.
- **Refresh token** — a random 384-bit opaque string (not a JWT), stored **only as an HMAC hash** in Supabase. The raw value lives in an `httpOnly`, `Secure`, `SameSite=Strict` cookie scoped to `/api/v1/auth`, so client-side JS can never read it.
- **Rotation** — every `/auth/refresh` call retires the presented refresh token and issues a new one in the same "family". If a retired token is ever presented again (a strong signal it was stolen and replayed), the entire family is revoked, forcing re-login on every device.
- **Supabase** is accessed only with the service role key, from the server. `users` and `refresh_tokens` have Row Level Security enabled with **no policies**, so only the service role (which bypasses RLS) can touch them — anon/authenticated client keys get nothing.

## Setup

1. Create a Supabase project, then run `src/db/schema.sql` in the SQL editor.
2. `cp .env.example .env` and fill in:
   - `SUPABASE_URL` / `SUPABASE_SECRET_KEY` — Project Settings → API → "Secret keys". **Secret key (successor to service_role), not the publishable key** — the publishable key respects RLS and can't read/write these tables.
   - `JWT_ACCESS_SECRET` / `REFRESH_TOKEN_SECRET` — two _different_ long random values, e.g. `openssl rand -base64 64`.
3. `npm install` (or `pnpm install` from the repo root).
4. `npm run dev`.

## Endpoints

All under `/api/v1/auth`.

| Method | Path          | Auth                | Notes                                                                                                                                                                                                                                                            |
| ------ | ------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/register`   | none, rate-limited  | First registered account becomes `owner`, everyone after is `employee`. Gate with `ALLOW_PUBLIC_REGISTRATION=false` once your owner account exists — production employee creation should go through an owner-only invite flow (Module 7), not open registration. |
| POST   | `/login`      | none, rate-limited  | Body: `{ email, password }`. Returns `{ user, accessToken, expiresIn }`, sets the refresh cookie. Locks the account for `LOCKOUT_MINUTES` after `MAX_FAILED_LOGIN_ATTEMPTS` bad passwords.                                                                       |
| POST   | `/refresh`    | refresh cookie      | Rotates the refresh token, returns a new access token.                                                                                                                                                                                                           |
| POST   | `/logout`     | refresh cookie      | Revokes the current refresh token, clears the cookie.                                                                                                                                                                                                            |
| POST   | `/logout-all` | Bearer access token | Revokes every active session for the user (sign out everywhere).                                                                                                                                                                                                 |
| GET    | `/me`         | Bearer access token | Returns the current user profile.                                                                                                                                                                                                                                |

## Security checklist

- Passwords hashed with bcrypt (cost 12); minimum 10 chars, upper/lower/digit/symbol required.
- Refresh tokens: opaque, HMAC-hashed at rest, rotated on every use, reuse triggers family-wide revocation.
- Generic `"Invalid email or password"` on both bad-email and bad-password paths, plus a dummy bcrypt compare on unknown emails, to blunt user-enumeration timing attacks.
- Account lockout after repeated failed logins.
- `helmet` security headers, strict CORS allowlist (`CORS_ORIGINS`), `express-rate-limit` on `/login`, `/register`, `/refresh`, and globally.
- Zod-validated request bodies with `.strict()` — unknown fields are rejected outright.
- `env.ts` fails the process at boot if secrets are missing, too short, or `JWT_ACCESS_SECRET === REFRESH_TOKEN_SECRET`.
- Error handler never leaks stack traces in production; logger redacts passwords/tokens/cookies.
- `pnpm test` (or `npm test`) runs a mocked unit suite covering lockout, reuse-detection, and expiry — no live Supabase project needed.

## What's intentionally left out (v1 scope)

- Employee invite flow / "Manage Team" screen (Module 7 in the project doc) — registration currently just makes the first user `owner`.
- Password reset / email verification.
- MFA.
