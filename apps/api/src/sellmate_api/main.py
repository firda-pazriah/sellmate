from fastapi import FastAPI

from sellmate_api.routers import shopee_auth
from sellmate_api.routers.shopee_shop import router as shopee_shop_router

app = FastAPI(
    title="Sellmate API",
    version="0.1.0"
)

app.include_router(shopee_auth.router)
app.include_router(shopee_shop_router)
    
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "sellmate-api",
    }