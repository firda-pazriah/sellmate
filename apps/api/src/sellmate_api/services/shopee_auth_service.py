import httpx
import time

from sellmate_api.core.config import settings
from sellmate_api.core.signing import generate_sign


def get_authorization_url(redirect_url: str) -> str:
    """
    Get the Shopee authorization URL for user login.

    Args:
        redirect_url (str): The URL to redirect to after authorization.

    Returns:
        str: The Shopee authorization URL.
    """
    path = "/api/v2/shop/auth_partner"
    timestamp = int(time.time())

    sign = generate_sign(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        path=path,
        timestamp=timestamp
    )

    return (
        f"{settings.SHOPEE_BASE_URL}{path}"
        f"?partner_id={settings.SHOPEE_PARTNER_ID}"
        f"&auth_type={settings.SHOPEE_AUTH_TYPE}"
        f"&redirect={redirect_url}"
        f"&timestamp={timestamp}"
        f"&sign={sign}"
        "&response_type=code"

    )

async def exchange_code_for_token(code: str, shop_id: int) -> dict:
    """
    Exchange the authorization code for access and refresh tokens.

    Args:
        code (str): The authorization code received from Shopee.

    Returns:
        dict: A dictionary containing the access token, refresh token, and shop ID.
    """
    path = "/api/v2/auth/token/get"
    timestamp = int(time.time())
    sign = generate_sign(
        partner_id=settings.SHOPEE_PARTNER_ID,
        partner_key=settings.SHOPEE_PARTNER_KEY,
        path=path,
        timestamp=timestamp
    )

    body = {
        "code": code,
        "partner_id": settings.SHOPEE_PARTNER_ID,
        "shop_id": shop_id,
        "timestamp": timestamp,
        "sign": sign,
    }
    params = {
        "partner_id": settings.SHOPEE_PARTNER_ID,
        "timestamp": timestamp,
        "sign": sign,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{settings.SHOPEE_BASE_URL}{path}", json=body, params=params)
        resp.raise_for_status()
        return resp.json()