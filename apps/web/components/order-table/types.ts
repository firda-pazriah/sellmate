import { z } from "zod";

import { ORDER_STATUS } from "@/constants/order-status";

const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS) as [
  keyof typeof ORDER_STATUS,
  ...(keyof typeof ORDER_STATUS)[],
];

export const orderSchema = z.object({
  order_sn: z.string(),
  customer_name: z.string(),
  order_status: z.enum(ORDER_STATUS_KEYS),
  total_amount: z.number().nonnegative(),
  currency: z.string(),
  item_list: z
    .object({
      item_name: z.string(),
      model_name: z.string(),
      model_quantity_purchased: z.number().int().positive(),
    })
    .array()
    .min(1),
  pickup_done_time: z.number().int().nonnegative(),
  ship_by_date: z.number().int().nonnegative(),
  shipping_carrier: z.string(),
  package_list: z
    .object({
      shipping_carrier: z.string(),
      package_number: z.string(),
      logistics_status: z.string(),
    })
    .array(),
});

export const orderListSchema = orderSchema.array();

export type Order = z.infer<typeof orderSchema>;
