from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.integrations.shopee.auth.client import (
    exchange_code_for_token,
)
from sellmate_api.integrations.shopee.shop.service import (
    save_shopee_shop,
)


async def connect_shop(
    db: AsyncSession,
    code: str,
    shop_id: int,
) -> None:
    token_data = await exchange_code_for_token(
        code=code,
        shop_id=shop_id,
    )

    await save_shopee_shop(
        db=db,
        shop_id=str(shop_id),
        token_data=token_data,
    )