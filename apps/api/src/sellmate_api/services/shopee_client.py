import time

import httpx

from sellmate_api.core.signing import generate_sign

class ShopeeClient:
    def __init__(
        self,
        partner_id: int,
        partner_key: str,
        access_token: str,
        shop_id: int,
        base_url: str,
    ):
        self.partner_id = partner_id
        self.partner_key = partner_key
        self.base_url = base_url.rstrip("/")
        self.access_token = access_token
        self.shop_id = shop_id

        self.host = self.base_url

    async def get(
        self,
        path: str,
        params: dict | None = None,
    ) -> dict:

        # IMPORTANT:
        # Shopee signature must use the FULL API path.
        full_path = f"/api/v2{path}"

        timestamp = int(time.time())

        sign = generate_sign(
            partner_id=self.partner_id,
            partner_key=self.partner_key,
            path=full_path,
            timestamp=timestamp,
            access_token=self.access_token,
            shop_id=self.shop_id,
        )

        query = {
            "partner_id": self.partner_id,
            "sign": sign,
            "timestamp": timestamp,
            "shop_id": self.shop_id,
            "access_token": self.access_token,
        }

        if params:
            query.update(params)

        url = f"{self.host}{full_path}"

        print("=== SHOPEE REQUEST ===")
        print("URL:", url)
        print("SIGN PATH:", full_path)
        print("PARTNER ID:", self.partner_id)
        print("SHOP ID:", self.shop_id)
        print("TIMESTAMP:", timestamp)
        print("SIGN:", sign)
        print("======================")

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                params=query,
            )

        print("STATUS:", response.status_code)
        print("RESPONSE:", response.text)

        # response.raise_for_status()

        return response.json()

    async def get_order_list(
        self,
        time_from: int,
        time_to: int,
        cursor: str = "",
        page_size: int = 20,
        order_status: str = "READY_TO_SHIP",
        response_optional_fields: str = "order_status",
    ) -> dict:
        params = {
            "cursor": cursor,
            "order_status": order_status,
            "page_size": page_size,
            "response_optional_fields": response_optional_fields,
            "time_from": time_from,
            "time_range_field": "create_time",
            "time_to": time_to,
        }

        return await self.get(
            "/order/get_order_list",
            params=params,
        )