from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.core.config import settings
from sellmate_api.database import get_db
from sellmate_api.integrations.shopee.model import ShopeeShop
from sellmate_api.integrations.shopee.orders.client import ShopeeOrderClient
from sellmate_api.integrations.shopee.shop.client import ShopeeShopClient


async def get_connected_shopee_shop(
    db: AsyncSession = Depends(get_db),
) -> ShopeeShop:
    result = await db.execute(
        select(ShopeeShop).limit(1)
    )

    shop = result.scalar_one_or_none()

    if not shop:
        raise HTTPException(
            status_code=404,
            detail="No Shopee shop connected",
        )

    return shop


async def get_shopee_shop_client(
    shop: ShopeeShop = Depends(get_connected_shopee_shop),
) -> ShopeeShopClient:
    return ShopeeShopClient(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        access_token=shop.access_token,
        shop_id=int(shop.shop_id),
        base_url=settings.SHOPEE_BASE_URL,
    )


async def get_shopee_order_client(
    shop: ShopeeShop = Depends(get_connected_shopee_shop),
) -> ShopeeOrderClient:
    return ShopeeOrderClient(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        access_token=shop.access_token,
        shop_id=int(shop.shop_id),
        base_url=settings.SHOPEE_BASE_URL,
    )