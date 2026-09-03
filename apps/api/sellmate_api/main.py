from fastapi import FastAPI

from sellmate_api.integrations.shopee.auth.router import (
    router as shopee_auth_router,
)
from sellmate_api.integrations.shopee.shop.router import (
    router as shopee_shop_router,
)
from sellmate_api.integrations.shopee.orders.router import (
    router as shopee_order_router,
)
from sellmate_api.modules.instant_orders.router import (
    router as instant_orders_router,
)


app = FastAPI(
    title="Sellmate API",
    version="0.1.0",
)


app.include_router(shopee_auth_router)
app.include_router(shopee_shop_router)
app.include_router(shopee_order_router)
app.include_router(instant_orders_router)


@app.get("/health", tags=["health"])
async def health():
    return {
        "status": "ok",
        "service": "sellmate-api",
    }