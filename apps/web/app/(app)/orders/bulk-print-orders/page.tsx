import { OrderTable } from "@/components/order-table/table";
import { Order } from "@/components/order-table/types";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsappOrderTable } from "@/components/whatsapp-order-table/table";
import { WhatsappOrder } from "@/components/whatsapp-order-table/types";

import data from "@/data/orders.json";
import whatsappOrderData from "@/data/whatsapp-orders.json";

export default function BulkPrintOrders() {
  return (
    <Container>
      <div className="gap-0">
        <h1 className="text-3xl font-semibold">Bulk Print Order</h1>
      </div>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="regular">Regular & Instant Orders</TabsTrigger>
          <TabsTrigger value="whatsapp">Whatsapp Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="regular">
          <Container className="bg-muted/50 rounded-md">
            <OrderTable data={data as Order[]} />
          </Container>
        </TabsContent>
        <TabsContent value="whatsapp">
          <Container className="bg-muted/50 rounded-md">
            <WhatsappOrderTable data={whatsappOrderData as WhatsappOrder[]} />
          </Container>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
