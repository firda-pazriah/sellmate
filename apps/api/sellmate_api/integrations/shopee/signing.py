import hashlib
import hmac


def generate_sign(
    partner_id: int,
    partner_key: str,
    path: str,
    timestamp: int,
    access_token: str = "",
    shop_id: int | None = None,
) -> str:
    base_string = f"{partner_id}{path}{timestamp}"

    if access_token:
        base_string += access_token

    if shop_id is not None:
        base_string += str(shop_id)

    return hmac.new(
        partner_key.encode("utf-8"),
        base_string.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()