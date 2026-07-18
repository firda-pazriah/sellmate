import { Printer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

import { ORDER_STATUS } from "@/constants/order-status";

type InstantOrderCardProps = {
  pickupWithin: string;
  cutoff: string;
  orderId: string;
  productName: string;
  customerName: string;
  status: string;
  statusVariant: "ready_to_pickup" | "pending_packaging" | "pending_acceptance";
  variant?: "danger" | "default";
};

export function InstantOrderCard({
  pickupWithin,
  cutoff,
  orderId,
  productName,
  customerName,
  statusVariant,
  variant = "default",
}: InstantOrderCardProps) {
  const isDanger = variant === "danger";

  const config = ORDER_STATUS[statusVariant];

  return (
    <Card
      className={
        variant === "danger" ? "bg-red-50 ring-destructive/20" : "bg-background"
      }
    >
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Zap className={cn("size-5", isDanger && "text-red-500")} />
          <span className="font-medium">Pickup within {pickupWithin}</span>
        </div>

        <div className="space-y-1">
          <p className="font-medium">{orderId}</p>
          <p className="text-sm text-muted-foreground">
            {productName} • {customerName}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={config.badge}>{config.label}</Badge>
          <span
            className={cn("text-sm font-medium", isDanger && "text-red-500")}
          >
            Cutoff {cutoff}
          </span>
        </div>
      </CardContent>

      {config.buttonLabel && (
        <CardFooter>
          <Button className="w-full">
            <Printer />
            {config.buttonLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
