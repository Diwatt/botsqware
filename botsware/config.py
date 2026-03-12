"""Application configuration using Pydantic v2."""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    database_url: str = Field(..., description="PostgreSQL async connection string")
    redis_url: str = Field(..., description="Redis connection URL")
    twilio_account_sid: str = Field(..., description="Twilio account SID")
    twilio_auth_token: str = Field(..., description="Twilio auth token")
    twilio_whatsapp_number: str = Field(..., description="Twilio WhatsApp sender number")
    openai_api_key: str = Field(..., description="OpenAI API key for LLM-based extraction/scoring")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
