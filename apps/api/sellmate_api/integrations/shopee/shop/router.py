from fastapi import APIRouter, Depends

from sellmate_api.integrations.shopee.dependencies import (
    get_shopee_shop_client,
)
from sellmate_api.integrations.shopee.shop.client import (
    ShopeeShopClient,
)


router = APIRouter(
    prefix="/api/v1/integrations/shopee/shop",
    tags=["shopee-shop"],
)


@router.get("/info")
async def get_shop_info(
    client: ShopeeShopClient = Depends(get_shopee_shop_client),
):
    return await client.get_shop_info()