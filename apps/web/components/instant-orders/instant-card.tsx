"use client";
import { Printer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

import { ORDER_STATUS } from "@/constants/order-status";
import { OrderStatus } from "@/constants/whatsapp-order";

type InstantOrderCardProps = {
  pickupWithin: string;
  cutoff: string;
  orderId: string;
  productItems: {
    item_name: string;
    model_name: string;
    model_quantity_purchased: number;
  }[];
  status: OrderStatus;
  variant?: "danger" | "default";
};

export function InstantOrderCard({
  pickupWithin,
  cutoff,
  orderId,
  productItems,
  status,
  variant = "default",
}: InstantOrderCardProps) {
  const isDanger = variant === "danger";

  const config = ORDER_STATUS[status];

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
            {productItems.map((product, index) => (
              <span
                key={`${index}-${product}`}
                className="text-muted-foreground"
              >
                {product.item_name}
              </span>
            ))}
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
