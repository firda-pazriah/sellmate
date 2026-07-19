import { Container } from "@/components/ui/container";
import { WhatsappOrderCard } from "@/components/whatsapp-card";

export default function Whatsapp() {
  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Instant Order</h1>
        </div>
        <WhatsappOrderCard
          whatsappNumber="+627789xx88"
          orderId="2312829388HJJK2P"
          paymentInfo="IDR 289.000 - BCA - 25 Jul,04:00"
          productItems={[
            "Hava Sweater Black –– size M",
            "Hava Sweater Black –– size M",
          ]}
          statusVariant="ready_to_pickup"
        />
        <WhatsappOrderCard
          whatsappNumber="+627789xx88"
          orderId="2312829388HJJK2P"
          paymentInfo="IDR 289.000 - BCA - 25 Jul,04:00"
          productItems={[
            "Hava Sweater Black –– size M",
            "Hava Sweater Black –– size M",
          ]}
          statusVariant="pending_packaging"
        />
        <WhatsappOrderCard
          whatsappNumber="+627789xx88"
          orderId="2312829388HJJK2P"
          paymentInfo="IDR 289.000 - BCA - 25 Jul,04:00"
          productItems={[
            "Hava Sweater Black –– size M",
            "Hava Sweater Black –– size M",
          ]}
          statusVariant="pending_acceptance"
        />
        <WhatsappOrderCard
          whatsappNumber="+627789xx88"
          orderId="2312829388HJJK2P"
          paymentInfo="IDR 289.000 - BCA - 25 Jul,04:00"
          productItems={[
            "Hava Sweater Black –– size M",
            "Hava Sweater Black –– size M",
          ]}
          statusVariant="already_pickup"
        />
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">History Orders</h1>
          <span className="text-sm text-muted-foreground">
            Recent instant orders
          </span>
        </div>
        {/* <HistoryOrderTable data={data as HistoryOrder[]} /> */}
      </Container>
    </Container>
  );
}
