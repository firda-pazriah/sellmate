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
    ShopeeOrderService,
)


router = APIRouter(
    prefix="/api/v1/integrations/shopee/orders",
    tags=["shopee-orders"],
)


@router.get("")
async def get_order_list(
    period: OrderPeriod = Query(
        default=OrderPeriod.CURRENT,
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
    service = ShopeeOrderService(client)

    try:
        orders = await service.get_orders_by_period(
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