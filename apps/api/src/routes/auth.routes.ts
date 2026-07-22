import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { loginRateLimiter, refreshRateLimiter, registerRateLimiter } from "../middleware/rateLimit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/register", registerRateLimiter, asyncHandler(authController.register));
authRouter.post("/login", loginRateLimiter, asyncHandler(authController.login));
authRouter.post("/refresh", refreshRateLimiter, asyncHandler(authController.refresh));
authRouter.post("/logout", asyncHandler(authController.logout));
authRouter.post("/logout-all", requireAuth, asyncHandler(authController.logoutAll));
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
