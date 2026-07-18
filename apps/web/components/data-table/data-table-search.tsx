"use client";

import { Table } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props<TData> = {
  table: Table<TData>;
};

export function DataTablePagination<TData>({
  table,
}: Props<TData>) {
  return (
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            className={
              table.getCanPreviousPage()
                ? "cursor-pointer"
                : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            className={
              table.getCanNextPage()
                ? "cursor-pointer"
                : "pointer-events-none opacity-50"
            }
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}