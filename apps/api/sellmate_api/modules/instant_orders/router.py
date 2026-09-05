from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query

from sellmate_api.integrations.shopee.dependencies import (
    get_shopee_order_client,
)
from sellmate_api.integrations.shopee.orders.client import (
    ShopeeOrderClient,
)
from sellmate_api.integrations.shopee.orders.service import (
    OrderPeriod,
)
from sellmate_api.modules.instant_orders.service import (
    InstantOrderService,
)


router = APIRouter(
    prefix="/api/v1/instant-orders",
    tags=["instant-orders"],
)


@router.get("")
async def get_instant_orders(
    period: OrderPeriod = Query(
        default=OrderPeriod.LAST_7_DAYS,
    ),
    year: int | None = Query(
        default=None,
    ),
    month: int | None = Query(
        default=None,
        ge=1,
        le=12,
    ),
    start_date: date | None = Query(
        default=None,
    ),
    end_date: date | None = Query(
        default=None,
    ),
    client: ShopeeOrderClient = Depends(
        get_shopee_order_client
    ),
):
    service = InstantOrderService(client)

    try:
        orders = await service.get_instant_orders(
            period=period,
            year=year,
            month=month,
            start_date=start_date,
            end_date=end_date,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    return {
        "period": period,
        "count": len(orders),
        "orders": orders,
    }