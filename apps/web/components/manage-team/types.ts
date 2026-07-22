import { z } from "zod";

import { PERMISSION_MODULE_IDS } from "@/constants/permission-modules";

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  role: z.enum(["owner", "employee"]),
  status: z.enum(["active", "invited"]),
  permissions: z.enum(PERMISSION_MODULE_IDS).array(),
  invitedAt: z.string(),
});

export const teamMemberListSchema = teamMemberSchema.array();

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const inviteEmployeeSchema = z.object({
  email: z.email("Enter a valid email address"),
  permissions: z.enum(PERMISSION_MODULE_IDS).array(),
});

export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;

export const updatePermissionsSchema = z.object({
  permissions: z.enum(PERMISSION_MODULE_IDS).array(),
});

export type UpdatePermissionsInput = z.infer<typeof updatePermissionsSchema>;
