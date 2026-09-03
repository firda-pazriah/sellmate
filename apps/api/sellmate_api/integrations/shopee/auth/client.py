import time
from urllib.parse import urlencode

import httpx

from sellmate_api.core.config import settings
from sellmate_api.integrations.shopee.signing import generate_sign


def get_authorization_url(redirect_url: str) -> str:
    path = "/api/v2/shop/auth_partner"
    timestamp = int(time.time())

    sign = generate_sign(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        path=path,
        timestamp=timestamp,
    )

    params = {
        "partner_id": settings.SHOPEE_PARTNER_ID,
        "auth_type": settings.SHOPEE_AUTH_TYPE,
        "redirect": redirect_url,
        "timestamp": timestamp,
        "sign": sign,
        "response_type": "code",
    }

    return (
        f"{settings.SHOPEE_BASE_URL}{path}"
        f"?{urlencode(params)}"
    )


async def exchange_code_for_token(
    code: str,
    shop_id: int,
) -> dict:
    path = "/api/v2/auth/token/get"
    timestamp = int(time.time())

    sign = generate_sign(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        path=path,
        timestamp=timestamp,
    )

    params = {
        "partner_id": settings.SHOPEE_PARTNER_ID,
        "timestamp": timestamp,
        "sign": sign,
    }

    body = {
        "code": code,
        "partner_id": settings.SHOPEE_PARTNER_ID,
        "shop_id": shop_id,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.SHOPEE_BASE_URL}{path}",
            params=params,
            json=body,
        )

        response.raise_for_status()

        data = response.json()

        if data.get("error"):
            raise RuntimeError(
                f"Shopee token exchange failed: "
                f"{data.get('error')} - {data.get('message', '')}"
            )

        return data