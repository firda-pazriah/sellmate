import { InstantOrderCard } from "@/components/instant-orders/instant-card";
import { Container } from "@/components/ui/container";
import data from "@/data/orders.json";
import { OrderTable } from "@/components/order-table/table";
import { Order } from "@/components/order-table/types";


export default function InstantOrders() {
  const instantOrder = data as Order[];

  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-4 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">Instant Order</h1>
        </div>
        {instantOrder.map((order) => (
          <InstantOrderCard
            key={order.order_sn}
            pickupWithin="22 minutes"
            cutoff={new Date(order.ship_by_date).getHours().toString()}
            orderId={order.order_sn}
            productItems={order.item_list}
            status={order.order_status}
            variant="danger"
          />
        ))}
      </Container>
      <Container className="space-y-4 col-span-8">
        <div className="gap-0">
          <h1 className="text-3xl font-semibold">History Orders</h1>
          <span className="text-sm text-muted-foreground">
            Recent instant orders
          </span>
        </div>
        <OrderTable data={data as Order[]} />
      </Container>
    </Container>
  );
}
