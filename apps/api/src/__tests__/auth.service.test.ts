import { beforeEach, describe, expect, it, vi } from "vitest";

// --- env must be mocked before any module under test imports it ---
vi.mock("../config/env.js", () => ({
  env: {
    NODE_ENV: "test",
    PORT: 4000,
    CORS_ORIGINS: ["http://localhost:3000"],
    TRUST_PROXY: false,
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEY: "secret-key-placeholder-value",
    JWT_ACCESS_SECRET: "a".repeat(40),
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_ISSUER: "sellmate-api",
    JWT_AUDIENCE: "sellmate-app",
    REFRESH_TOKEN_SECRET: "b".repeat(40),
    REFRESH_TOKEN_EXPIRES_IN_DAYS: 30,
    REFRESH_COOKIE_NAME: "sm_refresh_token",
    MAX_FAILED_LOGIN_ATTEMPTS: 5,
    LOCKOUT_MINUTES: 15,
    ALLOW_PUBLIC_REGISTRATION: true,
  },
}));

vi.mock("../repositories/user.repository.js", () => ({
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  countUsers: vi.fn(),
  createUser: vi.fn(),
  recordFailedLogin: vi.fn(),
  resetFailedLogins: vi.fn(),
}));

vi.mock("../repositories/refreshToken.repository.js", () => ({
  insertRefreshToken: vi.fn(),
  findRefreshTokenByHash: vi.fn(),
  markRotated: vi.fn(),
  revokeById: vi.fn(),
  revokeFamily: vi.fn(),
  revokeAllForUser: vi.fn(),
}));

const userRepo = await import("../repositories/user.repository.js");
const refreshTokenRepo =
  await import("../repositories/refreshToken.repository.js");
const authService = await import("../services/auth.service.js");
const { hashPassword } = await import("../utils/password.js");
const { hashRefreshToken } = await import("../utils/tokens.js");

const baseUser = {
  id: "user-1",
  email: "seller@example.com",
  full_name: "Seller One",
  role: "owner" as const,
  failed_login_attempts: 0,
  locked_until: null as string | null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("authenticateUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an unknown email without revealing that the account doesn't exist", async () => {
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue(null);

    await expect(
      authService.authenticateUser({
        email: "nobody@example.com",
        password: "whatever",
      }),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });

  it("rejects a wrong password and increments the failed-attempt counter", async () => {
    const passwordHash = await hashPassword("Correct-Horse-1!");
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({
      ...baseUser,
      password_hash: passwordHash,
    });

    await expect(
      authService.authenticateUser({
        email: baseUser.email,
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    expect(userRepo.recordFailedLogin).toHaveBeenCalledWith(
      baseUser.id,
      1,
      null,
    );
  });

  it("locks the account once the failed-attempt threshold is reached", async () => {
    const passwordHash = await hashPassword("Correct-Horse-1!");
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({
      ...baseUser,
      password_hash: passwordHash,
      failed_login_attempts: 4, // one more failure hits MAX_FAILED_LOGIN_ATTEMPTS = 5
    });

    await expect(
      authService.authenticateUser({
        email: baseUser.email,
        password: "wrong-password",
      }),
    ).rejects.toMatchObject({ statusCode: 401 });

    const [, attempts, lockedUntil] = vi.mocked(userRepo.recordFailedLogin).mock
      .calls[0]!;
    expect(attempts).toBe(5);
    expect(lockedUntil).not.toBeNull();
  });

  it("rejects login while the account is locked, even with the correct password", async () => {
    const passwordHash = await hashPassword("Correct-Horse-1!");
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({
      ...baseUser,
      password_hash: passwordHash,
      locked_until: new Date(Date.now() + 60_000).toISOString(),
    });

    await expect(
      authService.authenticateUser({
        email: baseUser.email,
        password: "Correct-Horse-1!",
      }),
    ).rejects.toMatchObject({ statusCode: 423 });
  });

  it("succeeds with correct credentials and resets any failed-attempt counter", async () => {
    const passwordHash = await hashPassword("Correct-Horse-1!");
    vi.mocked(userRepo.findUserByEmail).mockResolvedValue({
      ...baseUser,
      password_hash: passwordHash,
      failed_login_attempts: 2,
    });

    const result = await authService.authenticateUser({
      email: baseUser.email,
      password: "Correct-Horse-1!",
    });

    expect(result.id).toBe(baseUser.id);
    expect(userRepo.resetFailedLogins).toHaveBeenCalledWith(baseUser.id);
  });
});

describe("rotateRefreshToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("issues a new token pair and retires the presented one", async () => {
    const rawToken = "raw-refresh-token-value";
    const tokenHash = hashRefreshToken(rawToken);
    const familyId = "family-1";

    vi.mocked(refreshTokenRepo.findRefreshTokenByHash).mockResolvedValue({
      id: "rt-1",
      user_id: baseUser.id,
      family_id: familyId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      revoked_at: null,
      replaced_by_id: null,
      user_agent: null,
      ip_address: null,
      created_at: new Date().toISOString(),
    });
    vi.mocked(userRepo.findUserById).mockResolvedValue(baseUser);
    vi.mocked(refreshTokenRepo.insertRefreshToken).mockResolvedValue({
      id: "rt-2",
      user_id: baseUser.id,
      family_id: familyId,
      token_hash: "new-hash",
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      revoked_at: null,
      replaced_by_id: null,
      user_agent: null,
      ip_address: null,
      created_at: new Date().toISOString(),
    });

    const result = await authService.rotateRefreshToken(rawToken, {});

    expect(result.tokens.accessToken).toBeTruthy();
    expect(result.tokens.refreshToken).not.toBe(rawToken);
    expect(refreshTokenRepo.markRotated).toHaveBeenCalledWith("rt-1", "rt-2");
  });

  it("revokes the whole token family when a retired token is reused", async () => {
    const rawToken = "already-used-token";
    const tokenHash = hashRefreshToken(rawToken);
    const familyId = "family-2";

    vi.mocked(refreshTokenRepo.findRefreshTokenByHash).mockResolvedValue({
      id: "rt-3",
      user_id: baseUser.id,
      family_id: familyId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
      revoked_at: new Date().toISOString(), // already rotated once
      replaced_by_id: "rt-4",
      user_agent: null,
      ip_address: null,
      created_at: new Date().toISOString(),
    });

    await expect(
      authService.rotateRefreshToken(rawToken, {}),
    ).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(refreshTokenRepo.revokeFamily).toHaveBeenCalledWith(familyId);
  });

  it("rejects an expired refresh token", async () => {
    const rawToken = "expired-token";
    const tokenHash = hashRefreshToken(rawToken);

    vi.mocked(refreshTokenRepo.findRefreshTokenByHash).mockResolvedValue({
      id: "rt-5",
      user_id: baseUser.id,
      family_id: "family-3",
      token_hash: tokenHash,
      expires_at: new Date(Date.now() - 60_000).toISOString(),
      revoked_at: null,
      replaced_by_id: null,
      user_agent: null,
      ip_address: null,
      created_at: new Date().toISOString(),
    });

    await expect(
      authService.rotateRefreshToken(rawToken, {}),
    ).rejects.toMatchObject({
      statusCode: 401,
    });
  });

  it("rejects an unknown refresh token", async () => {
    vi.mocked(refreshTokenRepo.findRefreshTokenByHash).mockResolvedValue(null);

    await expect(
      authService.rotateRefreshToken("nonexistent", {}),
    ).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
