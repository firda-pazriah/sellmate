from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from sellmate_api.core.config import settings
from sellmate_api.database import get_db
from sellmate_api.integrations.shopee.auth.client import (
    exchange_code_for_token,
    get_authorization_url,
)
from sellmate_api.integrations.shopee.shop.service import (
    save_shopee_shop,
)


router = APIRouter(
    prefix="/api/v1/integrations/shopee/auth",
    tags=["shopee-auth"],
)


@router.get("/login")
def login():
    return {
        "authorization_url": get_authorization_url(
            settings.SHOPEE_PUSH_CALLBACK_URL
        )
    }


@router.get("/callback")
async def callback(
    code: str = Query(...),
    shop_id: int = Query(...),
    db: AsyncSession = Depends(get_db),
):
    token_data = await exchange_code_for_token(
        code=code,
        shop_id=shop_id,
    )

    await save_shopee_shop(
        db=db,
        shop_id=str(shop_id),
        token_data=token_data,
    )

    return {
        "message": "Shopee shop connected successfully",
        "shop_id": shop_id,
    }