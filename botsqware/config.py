"""Application configuration using Pydantic v2."""

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    postgres_url: str = Field(..., description="PostgreSQL async connection string")
    group_name: str = Field("", description="WhatsApp group name to listen to (empty = all groups)")
    group_id: str = Field("", description="WhatsApp group JID (from WAHA) to listen to (empty = all groups)")
    llm_model: str = Field("ai/qwen2.5:7B-Q4_K_M", description="Model identifier for LLM calls")
    llm_base_url: str = Field(
        "http://model-runner.docker.internal:12434",
        description="Docker Model Runner base URL (OpenAI-compatible)",
    )
    llm_api_key: str = Field("not-needed", description="LLM API key (not-needed for DMR)")
    waha_base_url: str = Field(
        "http://localhost:3000", description="WAHA API base URL"
    )
    waha_session: str = Field("default", description="WAHA session name")
    band_profile_path: str = Field(
        "./band_profile.yaml", description="Path to band profile YAML file"
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


_settings: Settings | None = None


def get_settings() -> Settings:
    """Return a cached settings instance (FastAPI dependency helper)."""

    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
