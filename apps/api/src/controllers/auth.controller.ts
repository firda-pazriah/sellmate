import type { Request, Response } from "express";
import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";
import { clearRefreshCookie, setRefreshCookie } from "../utils/cookies.js";
import { HttpError } from "../utils/httpError.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";

function getRequestContext(req: Request) {
  return {
    ipAddress: req.ip ?? null,
    userAgent: req.get("user-agent") ?? null,
  };
}

function getRefreshTokenFromCookie(req: Request): string {
  const token = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (!token || typeof token !== "string") {
    throw HttpError.unauthorized("No refresh token provided");
  }
  return token;
}

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);
  const user = await authService.registerUser(input);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const context = getRequestContext(req);

  const user = await authService.authenticateUser(input);
  const tokens = await authService.issueTokenPair(user.id, user.role, context);

  setRefreshCookie(res, tokens.refreshToken, tokens.refreshTokenExpiresAt);
  res.status(200).json({
    user,
    accessToken: tokens.accessToken,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export async function refresh(req: Request, res: Response) {
  const rawToken = getRefreshTokenFromCookie(req);
  const context = getRequestContext(req);

  try {
    const { tokens, user } = await authService.rotateRefreshToken(rawToken, context);
    setRefreshCookie(res, tokens.refreshToken, tokens.refreshTokenExpiresAt);
    res.status(200).json({
      user,
      accessToken: tokens.accessToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
  } catch (err) {
    // Any failure to refresh means the cookie is no longer good for anything —
    // clear it so the client doesn't keep retrying with a dead token.
    clearRefreshCookie(res);
    throw err;
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (token && typeof token === "string") {
    await authService.revokeRefreshToken(token);
  }
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function logoutAll(req: Request, res: Response) {
  if (!req.auth) {
    throw HttpError.unauthorized();
  }
  await authService.revokeAllSessions(req.auth.userId);
  clearRefreshCookie(res);
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  if (!req.auth) {
    throw HttpError.unauthorized();
  }
  const user = await authService.getUserProfile(req.auth.userId);
  if (!user) {
    throw HttpError.unauthorized("Account no longer exists");
  }
  res.status(200).json({ user });
}
