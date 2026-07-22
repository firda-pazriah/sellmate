import type { CookieOptions, Response } from "express";
import { env } from "../config/env.js";

const REFRESH_COOKIE_PATH = "/api/v1/auth";

function baseCookieOptions(): CookieOptions {
  return {
    httpOnly: true, // never readable from JS — mitigates XSS token theft
    secure: env.NODE_ENV === "production", // HTTPS only in prod; allow http on localhost dev
    sameSite: "strict", // browser won't attach this cookie to cross-site requests
    path: REFRESH_COOKIE_PATH, // scope the cookie to only the auth endpoints that need it
  };
}

export function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(env.REFRESH_COOKIE_NAME, token, {
    ...baseCookieOptions(),
    expires: expiresAt,
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, baseCookieOptions());
}
