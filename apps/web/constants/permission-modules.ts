import {
  MessageCircleMore,
  MessageSquareMore,
  Printer,
  Video,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PermissionModuleId =
  | "instant-orders"
  | "whatsapp-orders"
  | "bulk-print-orders"
  | "packing-video"
  | "reviews";

export type PermissionModule = {
  id: PermissionModuleId;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  mobileOnly?: boolean;
};

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    id: "instant-orders",
    label: "Instant Order Alerts",
    description: "See and act on incoming instant orders.",
    icon: Zap,
    href: "/orders/instant-orders",
  },
  {
    id: "whatsapp-orders",
    label: "WhatsApp Order Capture",
    description: "Capture and manage orders coming in over WhatsApp.",
    icon: MessageCircleMore,
    href: "/orders/whatsapp-orders",
  },
  {
    id: "bulk-print-orders",
    label: "Bulk Print Orders",
    description: "Print shipping labels/resi for multiple orders at once.",
    icon: Printer,
    href: "/orders/bulk-print-orders",
  },
  {
    id: "packing-video",
    label: "Packing Video + Resi Capture",
    description: "Record packing videos and capture resi. Mobile app only.",
    icon: Video,
    mobileOnly: true,
  },
  {
    id: "reviews",
    label: "Review Analysis + Priority Reply",
    description: "Read customer reviews and send priority replies.",
    icon: MessageSquareMore,
    href: "/customer/reviews",
  },
];

export const PERMISSION_MODULE_IDS = PERMISSION_MODULES.map((m) => m.id) as [
  PermissionModuleId,
  ...PermissionModuleId[],
];
