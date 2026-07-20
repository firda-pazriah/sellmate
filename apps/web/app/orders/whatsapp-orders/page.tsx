import { Container } from "@/components/ui/container";
import { WhatsappOrderCard } from "@/components/whatsapp-orders/whatsapp-card";

import { WhatsappOrderTable } from "../../../components/whatsapp-order-table/table";
import data from "@/data/whatsapp-orders.json";
import { WhatsappOrder } from "@/components/whatsapp-order-table/types";

export default function WhatsappOrders() {
  const whatsappOrder = data as WhatsappOrder[];
  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Whatsapp Order</h1>
        </div>
        {whatsappOrder.map((order) => (
          <WhatsappOrderCard
            key={order.order_sn}
            whatsappNumber={order.customer_number}
            orderId={order.order_sn}
            paymentInfo={`${order.payment.currency} ${order.payment.amount} – ${order.payment.payment_date}`}
            productItems={order.products}
            statusVariant={order.order_status}
            shippingAddress={order.shipping_address}
          />
        ))}
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">History Orders</h1>
          <span className="text-sm text-muted-foreground">
            Recent whatsapp orders
          </span>
        </div>
        <WhatsappOrderTable data={data as WhatsappOrder[]} />
      </Container>
    </Container>
  );
}
