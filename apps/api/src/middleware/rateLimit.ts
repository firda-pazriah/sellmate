import rateLimit from "express-rate-limit";

/** Brute-force / credential-stuffing guard for the login endpoint. Keyed by IP. */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many login attempts. Please try again later." } },
});

/** Slightly looser limit for refresh — legitimate clients call this often (e.g. on app foreground). */
export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many refresh attempts. Please try again later." } },
});

/** Registration abuse guard. */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "TOO_MANY_REQUESTS", message: "Too many accounts created from this address. Please try again later." } },
});

/** Baseline limiter applied to the whole API as defense in depth. */
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
