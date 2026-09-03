from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.integrations.shopee.model import ShopeeShop


class ShopeeShopRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_shop_id(
        self,
        shop_id: str,
    ) -> ShopeeShop | None:
        result = await self.db.execute(
            select(ShopeeShop).where(
                ShopeeShop.shop_id == shop_id
            )
        )

        return result.scalar_one_or_none()

    async def save(
        self,
        shop: ShopeeShop,
    ) -> ShopeeShop:
        self.db.add(shop)

        await self.db.commit()
        await self.db.refresh(shop)

        return shop