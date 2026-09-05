import time
from datetime import date, datetime, time as datetime_time, timezone
from enum import Enum

from sellmate_api.integrations.shopee.orders.client import ShopeeOrderClient


SHOPEE_ORDER_STATUSES = [
    "UNPAID",
    "READY_TO_SHIP",
    "PROCESSED",
    "SHIPPED",
    "COMPLETED",
    "IN_CANCEL",
    "CANCELLED",
]


class OrderPeriod(str, Enum):
    LAST_30_DAYS = "last_30_days"
    LAST_7_DAYS = "last_7_days"
    MONTH = "month"
    CURRENT = "current"
    CUSTOM = "custom"


class ShopeeOrderService:
    def __init__(self, client: ShopeeOrderClient):
        self.client = client

    async def get_orders_by_status(
        self,
        time_from: int,
        time_to: int,
        order_status: str,
    ) -> list[dict]:
        orders: list[dict] = []
        cursor = ""

        while True:
            result = await self.client.get_order_list(
                time_from=time_from,
                time_to=time_to,
                cursor=cursor,
                page_size=100,
                order_status=order_status,
                time_range_field="create_time",
            )

            response = result.get("response", {})

            orders.extend(
                response.get("order_list", [])
            )

            if not response.get("more"):
                break

            cursor = response.get("next_cursor", "")

            if not cursor:
                break

        return orders

    async def get_all_orders(
        self,
        time_from: int,
        time_to: int,
    ) -> list[dict]:
        orders_by_sn: dict[str, dict] = {}

        # Shopee maximum time range = 15 days
        max_range_seconds = 15 * 24 * 60 * 60

        current_from = time_from

        while current_from < time_to:
            current_to = min(
                current_from + max_range_seconds,
                time_to,
            )

            for status in SHOPEE_ORDER_STATUSES:
                orders = await self.get_orders_by_status(
                    time_from=current_from,
                    time_to=current_to,
                    order_status=status,
                )

                for order in orders:
                    order_sn = order.get("order_sn")

                    if order_sn:
                        orders_by_sn[order_sn] = order

            current_from = current_to

        return list(orders_by_sn.values())

    async def get_orders_by_period(
        self,
        period: OrderPeriod,
        year: int | None = None,
        month: int | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[dict]:
        time_from, time_to = self._get_time_range(
            period=period,
            year=year,
            month=month,
            start_date=start_date,
            end_date=end_date,
        )

        return await self.get_all_orders(
            time_from=time_from,
            time_to=time_to,
        )

    def _get_time_range(
        self,
        period: OrderPeriod,
        year: int | None = None,
        month: int | None = None,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> tuple[int, int]:
        now = datetime.now(timezone.utc)

        if period == OrderPeriod.LAST_7_DAYS:
            return (
                int(now.timestamp()) - (7 * 24 * 60 * 60),
                int(now.timestamp()),
            )

        if period == OrderPeriod.LAST_30_DAYS:
            return (
                int(now.timestamp()) - (30 * 24 * 60 * 60),
                int(now.timestamp()),
            )

        if period == OrderPeriod.CURRENT:
            start = datetime.combine(
                now.date(),
                datetime_time.min,
                tzinfo=timezone.utc,
            )

            return (
                int(start.timestamp()),
                int(now.timestamp()),
            )

        if period == OrderPeriod.MONTH:
            if year is None or month is None:
                raise ValueError(
                    "year and month are required for month filter"
                )

            if month < 1 or month > 12:
                raise ValueError(
                    "month must be between 1 and 12"
                )

            start = datetime(
                year=year,
                month=month,
                day=1,
                tzinfo=timezone.utc,
            )

            if month == 12:
                end = datetime(
                    year=year + 1,
                    month=1,
                    day=1,
                    tzinfo=timezone.utc,
                )
            else:
                end = datetime(
                    year=year,
                    month=month + 1,
                    day=1,
                    tzinfo=timezone.utc,
                )

            return (
                int(start.timestamp()),
                int(end.timestamp()),
            )

        if period == OrderPeriod.CUSTOM:
            if start_date is None or end_date is None:
                raise ValueError(
                    "start_date and end_date are required "
                    "for custom filter"
                )

            if start_date > end_date:
                raise ValueError(
                    "start_date cannot be after end_date"
                )

            start = datetime.combine(
                start_date,
                datetime_time.min,
                tzinfo=timezone.utc,
            )

            end = datetime.combine(
                end_date,
                datetime_time.max,
                tzinfo=timezone.utc,
            )

            return (
                int(start.timestamp()),
                int(end.timestamp()),
            )

        raise ValueError(
            f"Unsupported period: {period}"
        )