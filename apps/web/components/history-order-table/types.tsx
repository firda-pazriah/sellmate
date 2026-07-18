export type HistoryOrder = {
  order_sn: string;
  customer_name: string;
  total_amount: number;
  currency: string;
  order_status: "ready_to_pickup" | "pending_packaging" | "pending_acceptance";
  item_list: {
    item_name: string;
    model_name: string;
    model_quantity_purchased: number;
    model_discounted_price: number;
  }[];

  package_list: {
    shipping_carrier: string;
    package_number: string;
    logistics_status: string;
  }[];
};
