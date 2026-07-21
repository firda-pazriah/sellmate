// columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { COGS } from "./types";

const numberFormatter = new Intl.NumberFormat("id-ID");

export const columns: ColumnDef<COGS>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "product_name",
    header: "Product",
  },
  {
    accessorKey: "cogs_price",
    header: "COGS",
    cell: ({ getValue }) => numberFormatter.format(getValue<number>()),
  },
  {
    accessorKey: "recommendation_price",
    header: "Recommendation",
    cell: ({ getValue }) => numberFormatter.format(getValue<number>()),
  },
];
