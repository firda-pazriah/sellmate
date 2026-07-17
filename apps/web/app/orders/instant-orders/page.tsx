import { InstantOrderCard } from "@/components/instant-card";
import { Container } from "@/components/layout/container";

export default function InstantOrders() {
  return (
    <Container className="flex gap-4 p-0 h-full">
      <Container className="rounded-sm gap-4 flex flex-col border border-muted  w-4/12">
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
      <Container className="bg-gray-50 h-full gap-4 flex flex-col w-8/12">
        History Orders
      </Container>
    </Container>
  );
}
