import { z } from "zod";
import { PASSWORD_RULES } from "../utils/password.js";

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254)
  .email("Must be a valid email address")
  .transform((v) => v.toLowerCase());

const password = z
  .string()
  .min(PASSWORD_RULES.minLength, PASSWORD_RULES.description)
  .max(128, "Password is too long")
  .regex(PASSWORD_RULES.pattern, PASSWORD_RULES.description);

export const registerSchema = z
  .object({
    email,
    password,
    fullName: z.string().trim().min(1).max(120).optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email,
    password: z.string().min(1, "Password is required").max(128),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
