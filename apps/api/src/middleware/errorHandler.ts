import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { HttpError } from "../utils/httpError.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: `No route for ${req.method} ${req.path}` } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
    });
  }

  if (err instanceof HttpError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, "Unhandled server error");
    }
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) },
    });
  }

  logger.error({ err }, "Unexpected error");
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      // Never leak stack traces / internal details to the client in production.
      message: env.NODE_ENV === "production" ? "Something went wrong" : String((err as Error)?.message ?? err),
    },
  });
}
