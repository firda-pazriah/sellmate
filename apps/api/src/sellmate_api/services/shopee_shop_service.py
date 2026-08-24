from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.models import ShopeeShop

async def save_shopee_shop(
        db:AsyncSession,
        shop_id:str,
        token_data:dict
) -> ShopeeShop:
    """
    Save Shopee shop information to the database.

    Args:
        db (AsyncSession): The database session.
        shop_id (int): The shop ID.
        token_data (dict): A dictionary containing access token, refresh token, and expiration time.

    Returns:
        ShopeeShop: The saved ShopeeShop instance.
    """
    # Calculate the token expiration datetime
    expire_in = token_data.get("expire_in")
    token_expires_at = datetime.now(timezone.utc) + timedelta(seconds=expire_in)

    print("SHOP ID VALUE:", shop_id)
    print("SHOP ID PYTHON TYPE:", type(shop_id))
    print("SQLALCHEMY COLUMN TYPE:", ShopeeShop.shop_id.type)

    result = await db.execute(
        select(ShopeeShop).where(
            ShopeeShop.shop_id == shop_id
        )
    )

    shop = result.scalar_one_or_none()

    if shop:
        shop.access_token = token_data.get("access_token")
        shop.refresh_token = token_data.get("refresh_token")
        shop.token_expires_at = token_expires_at
    else:
        shop = ShopeeShop(
            shop_id=shop_id,
            access_token=token_data.get("access_token"),
            refresh_token=token_data.get("refresh_token"),
            token_expires_at=token_expires_at
        )
        db.add(shop)

    await db.commit()
    await db.refresh(shop)

    return shop