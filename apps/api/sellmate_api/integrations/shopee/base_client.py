import time

import httpx

from sellmate_api.integrations.shopee.signing import generate_sign


class ShopeeBaseClient:
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
        self.access_token = access_token
        self.shop_id = shop_id
        self.base_url = base_url.rstrip("/")

    async def _get(
        self,
        path: str,
        params: dict | None = None,
    ) -> dict:
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

        url = f"{self.base_url}{full_path}"

        async with httpx.AsyncClient(
            timeout=30.0,
        ) as client:
            response = await client.get(
                url,
                params=query,
            )

        response.raise_for_status()

        data = response.json()

        if data.get("error"):
            raise RuntimeError(
                f"Shopee API error: "
                f"{data.get('error')} - "
                f"{data.get('message', '')}"
            )

        return data