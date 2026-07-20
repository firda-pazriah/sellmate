"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HistoryInstantOrder } from "./types";
import { Badge } from "../ui/badge";
import { ORDER_STATUS } from "@/constants/order-status";

export const columns: ColumnDef<HistoryInstantOrder>[] = [
  {
    accessorKey: "order_sn",
    header: "Order No",
  },
  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const item = row.original.item_list[0];

      return (
        <div>
          <p className="font-medium">{item.item_name}</p>
          <p className="text-sm text-muted-foreground">{item.model_name}</p>
        </div>
      );
    },
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
        {row.original.currency} {row.original.total_amount.toLocaleString()}
      </>
    ),
  },
];
