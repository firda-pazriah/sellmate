export type HistoryInstantOrder = {
  order_sn: string;
  customer_name: string;
  order_status: "ready_to_pickup" | "pending_packaging" | "pending_acceptance";
  total_amount: number;
  currency: string;
  item_list: {
    item_name: string;
    model_name: string;
    model_quantity_purchased: number;
    model_discounted_price: number;
  }[];
  pickup_done_time: number;
  ship_by_date: number;
  shipping_carrier: string;
  package_list: {
    shipping_carrier: string;
    package_number: string;
    logistics_status: string;
  }[];
};
