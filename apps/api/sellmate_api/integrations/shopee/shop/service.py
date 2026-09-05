from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.integrations.shopee.model import ShopeeShop
from sellmate_api.integrations.shopee.shop.repository import (
    ShopeeShopRepository,
)


async def save_shopee_shop(
    db: AsyncSession,
    shop_id: str,
    token_data: dict,
) -> ShopeeShop:
    repository = ShopeeShopRepository(db)

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    expire_in = token_data.get("expire_in")

    if not access_token:
        raise ValueError("Shopee access_token is missing")

    if not refresh_token:
        raise ValueError("Shopee refresh_token is missing")

    if expire_in is None:
        raise ValueError("Shopee expire_in is missing")

    token_expires_at = (
        datetime.now(timezone.utc)
        + timedelta(seconds=int(expire_in))
    )

    shop = await repository.get_by_shop_id(shop_id)

    if shop:
        shop.access_token = access_token
        shop.refresh_token = refresh_token
        shop.token_expires_at = token_expires_at
    else:
        shop = ShopeeShop(
            shop_id=shop_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_expires_at=token_expires_at,
        )

    return await repository.save(shop)