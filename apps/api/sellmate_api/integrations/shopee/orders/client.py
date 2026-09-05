from sellmate_api.integrations.shopee.base_client import ShopeeBaseClient


class ShopeeOrderClient(ShopeeBaseClient):
    async def get_order_list(
        self,
        time_from: int,
        time_to: int,
        cursor: str = "",
        page_size: int = 100,
        order_status: str = "READY_TO_SHIP",
        response_optional_fields: str = "order_status",
        time_range_field: str = "update_time",
    ) -> dict:
        params = {
            "cursor": cursor,
            "order_status": order_status,
            "page_size": page_size,
            "response_optional_fields": response_optional_fields,
            "time_from": time_from,
            "time_range_field": time_range_field,
            "time_to": time_to,
        }

        return await self._get(
            "/order/get_order_list",
            params=params,
        )

    async def get_order_detail(
        self,
        order_sn_list: list[str],
        response_optional_fields: str | None = None,
    ) -> dict:
        params = {
            "order_sn_list": ",".join(order_sn_list),
        }

        if response_optional_fields:
            params["response_optional_fields"] = response_optional_fields

        return await self._get(
            "/order/get_order_detail",
            params=params,
        )