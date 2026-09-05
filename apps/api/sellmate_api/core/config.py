from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    SHOPEE_AUTH_TYPE: str
    SHOPEE_PARTNER_ID: int
    SHOPEE_PARTNER_KEY: str

    SHOPEE_BASE_URL: str

    SHOPEE_SHOP_ID: int | None = None
    SHOPEE_ACCESS_TOKEN: str | None = None
    SHOPEE_REFRESH_TOKEN: str | None = None

    @field_validator("SHOPEE_SHOP_ID", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        return None if v == "" else v

    DATABASE_URL: str
    SHOPEE_PUSH_CALLBACK_URL: str | None = None

settings = Settings()


    