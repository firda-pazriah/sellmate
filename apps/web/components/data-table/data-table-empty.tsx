import { TableCell, TableRow } from "@/components/ui/table";

type Props = {
  colSpan: number;
  message?: string;
};

export function DataTableEmpty({
  colSpan,
  message = "No data found.",
}: Props) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-40 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}