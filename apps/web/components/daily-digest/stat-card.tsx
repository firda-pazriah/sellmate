import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  previousLabel?: string;
  change?: number;
};

export function StatCard({
  title,
  value,
  previousLabel,
  change,
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>

        <CardTitle className="mt-2 text-3xl font-bold tabular-nums">
          {value}
        </CardTitle>

        {change !== undefined && (
          <CardAction>
            <Badge
              variant="outline"
              className={cn(
                "gap-1",
                isPositive
                  ? "text-emerald-600"
                  : "text-red-600"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}

              {Math.abs(change)}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      {previousLabel && (
        <CardFooter className="text-sm text-muted-foreground">
          {previousLabel}
        </CardFooter>
      )}
    </Card>
  );
}