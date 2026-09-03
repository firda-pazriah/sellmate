from sellmate_api.integrations.shopee.base_client import ShopeeBaseClient


class ShopeeShopClient(ShopeeBaseClient):
    async def get_shop_info(self) -> dict:
        return await self._get(
            "/shop/get_shop_info",
        )