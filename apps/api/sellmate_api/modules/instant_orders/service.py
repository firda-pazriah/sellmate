from datetime import date

from sellmate_api.integrations.shopee.orders.client import ShopeeOrderClient
from sellmate_api.integrations.shopee.orders.service import (
    OrderPeriod,
    ShopeeOrderService,
)


def is_instant_order(order: dict) -> bool:
    carriers: list[str] = []

    # Top-level carrier
    shipping_carrier = order.get("shipping_carrier")

    if shipping_carrier:
        carriers.append(shipping_carrier)

    # Some orders may expose carrier information inside packages
    for package in order.get("package_list", []):
        package_carrier = package.get("shipping_carrier")

        if package_carrier:
            carriers.append(package_carrier)

    return any(
        "instant" in carrier.lower()
        for carrier in carriers
    )


class InstantOrderService:
    def __init__(
        self,
        client: ShopeeOrderClient,
    ):
        self.client = client
        self.order_service = ShopeeOrderService(client)

    async def get_instant_orders(
        self,
        period: OrderPeriod,
        year: int | None = None,
        month: int | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[dict]:
        # This already handles:
        # - all order statuses
        # - Shopee 15-day limit
        # - pagination
        # - deduplication
        orders = await self.order_service.get_orders_by_period(
            period=period,
            year=year,
            month=month,
            start_date=start_date,
            end_date=end_date,
        )

        if not orders:
            return []

        order_sn_list = [
            order["order_sn"]
            for order in orders
            if order.get("order_sn")
        ]

        detailed_orders: list[dict] = []

        # Shopee get_order_detail supports max 50 order SNs
        batch_size = 50

        for index in range(0, len(order_sn_list), batch_size):
            batch = order_sn_list[
                index:index + batch_size
            ]

            detail_response = await self.client.get_order_detail(
                order_sn_list=batch,
                response_optional_fields=(
                    "item_list,"
                    "shipping_carrier,"
                    "package_list,"
                    "payment_method,"
                    "total_amount"
                ),
            )

            details = (
                detail_response
                .get("response", {})
                .get("order_list", [])
            )

            detailed_orders.extend(details)

        return [
            order
            for order in detailed_orders
            if is_instant_order(order)
        ]