import { InstantOrderCard } from "@/components/instant-orders/instant-card";
import { Container } from "@/components/ui/container";
import data from "./data.json";
import { HistoryOrderTable } from "@/components/history-order-table/history-order-table";
import { HistoryOrder } from "@/components/history-order-table/types";

export default function InstantOrders() {
  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Instant Order</h1>
        </div>
        <InstantOrderCard
          pickupWithin="22 minutes"
          cutoff="14:00"
          orderId="2312829388HJJK2P"
          productName="Hava Sweater Black –– size M"
          customerName="Dewi Lestari"
          status="Ready to pickup"
          statusVariant="ready_to_pickup"
          variant="danger"
        />
        <InstantOrderCard
          pickupWithin="1 Hour 40 minutes"
          cutoff="14:40"
          orderId="12397898JSAKL"
          productName="Hava Sweater Dark Misty–– size M"
          customerName="Dewi Lestari"
          status="Need to be packaged"
          statusVariant="pending_packaging"
          variant="danger"
        />
        <InstantOrderCard
          pickupWithin="3 Hours 05 minutes"
          cutoff="17:00"
          orderId="123123LPJKS"
          productName="Rumi Kaos Burgundy"
          customerName="Dewi Lestari"
          status="Need Confirmation"
          statusVariant="pending_acceptance"
        />
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">History Orders</h1>
          <span className="text-sm text-muted-foreground">
            Recent instant orders
          </span>
        </div>
        <HistoryOrderTable data={data as HistoryOrder[]} />
      </Container>
    </Container>
  );
}
