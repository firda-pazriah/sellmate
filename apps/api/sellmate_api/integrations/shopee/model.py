from datetime import datetime

from sqlalchemy import DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column

from sellmate_api.database.base import Base


class ShopeeShop(Base):
    __tablename__ = "shopee_shops"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    shop_id: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    access_token: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    refresh_token: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    token_expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )