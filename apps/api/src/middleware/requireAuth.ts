import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken, type UserRole } from "../utils/tokens.js";
import { HttpError } from "../utils/httpError.js";

function extractBearerToken(req: Request): string | null {
  const header = req.get("authorization");
  if (!header) return null;
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

/** Verifies the access token from the Authorization header and attaches req.auth. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return next(HttpError.unauthorized("Missing or malformed Authorization header"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(HttpError.unauthorized("Access token expired"));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(HttpError.unauthorized("Invalid access token"));
    }
    next(err);
  }
}

/** Restricts a route to one or more roles. Use after requireAuth. */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(HttpError.unauthorized());
    }
    if (!roles.includes(req.auth.role)) {
      return next(HttpError.forbidden("You don't have permission to perform this action"));
    }
    next();
  };
}
