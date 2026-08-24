from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.core.config import settings
from sellmate_api.database import get_db
from sellmate_api.models import ShopeeShop
from sellmate_api.services.shopee_client import ShopeeClient

router = APIRouter(
    prefix="/api/shopee/shop",
    tags=["shopee-shop"],
)


@router.get("/info")
async def get_info(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ShopeeShop).limit(1)
    )

    shop = result.scalar_one_or_none()

    if not shop:
        return {
            "error": "No Shopee shop connected"
        }

    client = ShopeeClient(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        access_token=shop.access_token,
        shop_id=int(shop.shop_id),
        base_url=settings.SHOPEE_BASE_URL,
    )

    return await client.get(
        "/shop/get_shop_info"
    )