import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge";
import { WhatsappOrderStatus } from "./whatsapp-order";

type OrderStatusConfig = {
  label: string;
  badge: ComponentProps<typeof Badge>["variant"];
  buttonLabel: string | null;
};

export const ORDER_STATUS = {
  ready_to_pickup: {
    label: "Ready to pickup",
    badge: "success",
    buttonLabel: null,
  },
  pending_packaging: {
    label: "Need to be packaged",
    badge: "warning",
    buttonLabel: "Print Resi",
  },
  pending_acceptance: {
    label: "Need to confirm",
    badge: "info",
    buttonLabel: "Confirm Order",
  },
  already_pickup: {
    label: "Need receipt number",
    badge: "secondary",
    buttonLabel: "Save",
  },
  fullfilled: {
    label: "Fulfilled",
    badge: "outline",
    buttonLabel: null,
  },
} as const satisfies Record<WhatsappOrderStatus, OrderStatusConfig>;
