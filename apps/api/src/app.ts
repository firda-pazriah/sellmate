import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { globalRateLimiter } from "./middleware/rateLimit.js";
import { apiRouter } from "./routes/index.js";

export function createApp(): Express {
  const app = express();

  // Required for correct client IPs (rate limiting, audit logs) when
  // deployed behind a reverse proxy / load balancer. Left off by default so
  // a misconfigured deployment can't be tricked by a spoofed X-Forwarded-For.
  if (env.TRUST_PROXY) {
    app.set("trust proxy", 1);
  }

  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === "production" ? undefined : false,
    }),
  );

  app.use(
    cors({
      origin(origin, callback) {
        // Allow same-origin/non-browser requests (no Origin header) and anything on the allowlist.
        if (!origin || env.CORS_ORIGINS.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      },
      credentials: true, // required so the refresh-token cookie is sent/received cross-origin (web app on another port/domain)
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  );

  app.use(express.json({ limit: "100kb" })); // small limit — this API only ever accepts small auth payloads
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));
  app.use(globalRateLimiter);

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
