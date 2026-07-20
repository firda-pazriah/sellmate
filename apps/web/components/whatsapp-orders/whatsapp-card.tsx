"use client";

import { memo, useState } from "react";
import { cva } from "class-variance-authority";
import { Check, ChevronDown, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ORDER_STATUS } from "@/constants/order-status";
import { WhatsappOrderStatus } from "@/constants/whatsapp-order";
import WhatsappOrderCardActions from "./whatsapp-card-actions";

const whatsappCardVariants = cva("p-4 gap-2", {
  variants: {
    statusVariant: {
      already_pickup: "bg-background text-primary",
      pending_acceptance: "bg-green-500/10",
      pending_packaging: "bg-yellow-500/10",
      ready_to_pickup: "bg-blue-500/10",
      fullfilled: "bg-muted/10",
    },
  },
  defaultVariants: {
    statusVariant: "already_pickup",
  },
});

type WhatsappOrderCardProps = {
  whatsappNumber: string;
  orderId: string;
  paymentInfo?: string;
  productItems: string[];
  shippingAddress: string;
  statusVariant: WhatsappOrderStatus;
};

function WhatsappOrderCardImpl({
  whatsappNumber,
  orderId,
  paymentInfo,
  productItems,
  shippingAddress,
  statusVariant,
}: WhatsappOrderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = ORDER_STATUS[statusVariant];

  return (
    <Card className={whatsappCardVariants({ statusVariant })}>
      <CardContent className="p-0 space-y-2">
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <MessageCircle className="size-5" />
            <span className="font-medium">{whatsappNumber}</span>
          </div>
          <Badge variant={config.badge}>{config.label}</Badge>
        </div>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col"
        >
          <h3 className="font-semibold">{orderId}</h3>

          <div className="flex">
            <Check /> {paymentInfo}
          </div>
          <CollapsibleTrigger
            render={
              <Button variant="link" size="sm">
                <span>Lihat detail order</span> <ChevronDown />
              </Button>
            }
            className="justify-start"
          />
          <CollapsibleContent className="flex flex-col gap-2">
            <div className="rounded-md border px-4 py-2 text-sm">
              <p className="font-medium">Shipping address</p>
              <p className="text-muted-foreground">{shippingAddress}</p>
            </div>
            <div className="rounded-md border px-4 py-2 text-sm">
              <p className="font-medium">Items</p>
              {productItems.map((product, index) => (
                <p
                  key={`${index}-${product}`}
                  className="text-muted-foreground"
                >
                  {product}
                </p>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      <WhatsappOrderCardActions statusVariant={statusVariant} />
    </Card>
  );
}

export const WhatsappOrderCard = memo(WhatsappOrderCardImpl);
