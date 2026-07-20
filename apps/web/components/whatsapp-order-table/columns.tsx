"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { ORDER_STATUS } from "@/constants/order-status";
import { WhatsappOrder } from "./types";
import { Printer } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<WhatsappOrder>[] = [
  {
    accessorKey: "order_sn",
    header: "Order No",
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => {
      const config = ORDER_STATUS[row.original.order_status];
      return config && <Badge variant={config.badge}>{config.label}</Badge>;
    },
  },
  {
    id: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <>
        {row.original.payment.currency}{" "}
        {row.original.payment.amount.toLocaleString("en-US")}
      </>
    ),
  },
  {
    accessorKey: "shipping_number",
    header: "Shipping Number",
  },
  {
    id: "recipt",
    cell: () => (
      <Button variant="ghost">
        <Printer /> Print
      </Button>
    ),
  },
];
