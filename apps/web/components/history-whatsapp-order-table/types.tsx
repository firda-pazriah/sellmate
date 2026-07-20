import { z } from "zod";

import { WhatsappOrderStatus } from "@/constants/whatsapp-order";

// Keep this in sync with WhatsappOrderStatus in @/constants/whatsapp-order
// (the canonical list, also used by the card/actions components). Zod
// needs its own literal tuple, so we assert against that type here —
// if a status is ever added/removed there, TS will flag this line.
const WHATSAPP_ORDER_STATUS_VALUES: [
  WhatsappOrderStatus,
  ...WhatsappOrderStatus[],
] = [
  "ready_to_pickup",
  "pending_packaging",
  "pending_acceptance",
  "already_pickup",
  "fullfilled",
];

export const historyWhatsappOrderSchema = z.object({
  order_sn: z.string(),
  customer_name: z.string(),
  customer_number: z.string(),
  order_status: z.enum(WHATSAPP_ORDER_STATUS_VALUES),
  order_date: z.string(),
  shipping_number: z.string(),
  shipping_address: z.string(),
  payment: z.object({
    currency: z.string(),
    amount: z.number(),
    payment_status: z.enum(["paid", "unpaid"]),
    // Not every order has been paid yet, so this is genuinely optional.
    payment_date: z.string().optional(),
  }),
  products: z.string().array().min(1),
});

export const historyWhatsappOrderListSchema =
  historyWhatsappOrderSchema.array();

export type HistoryWhatsappOrder = z.infer<typeof historyWhatsappOrderSchema>;
