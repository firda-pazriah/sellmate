import { TeamMember } from "./types";

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "user_owner_1",
    name: "Firda",
    email: "firda@example.com",
    role: "owner",
    status: "active",
    permissions: [],
    invitedAt: "2023-01-01",
  },
  {
    id: "user_employee_1",
    name: "Rina",
    email: "rina@example.com",
    role: "employee",
    status: "active",
    permissions: ["instant-orders", "packing-video", "bulk-print-orders"],
    invitedAt: "2023-06-12",
  },
  {
    id: "user_employee_2",
    name: "Budi",
    email: "budi@example.com",
    role: "employee",
    status: "invited",
    permissions: ["whatsapp-orders", "reviews"],
    invitedAt: "2026-07-18",
  },
];
