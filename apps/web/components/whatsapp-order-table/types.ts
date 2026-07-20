import { z } from "zod";

import { WhatsappOrderStatus } from "@/constants/whatsapp-order";

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
    payment_date: z.string().optional(),
  }),
  products: z.string().array().min(1),
});

export const historyWhatsappOrderListSchema =
  historyWhatsappOrderSchema.array();

export type WhatsappOrder = z.infer<typeof historyWhatsappOrderSchema>;
