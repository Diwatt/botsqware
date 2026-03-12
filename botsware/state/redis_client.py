"""Redis client and helpers."""

import aioredis

from botsware.config import Settings

settings = Settings()

redis = aioredis.from_url(settings.redis_url)

# TODO: add state management functions
