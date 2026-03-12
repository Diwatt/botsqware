"""Service abstractions for external integrations.

Services provide clean interfaces for external dependencies (Twilio, Redis, etc.)
making them mockable and testable.
"""

from abc import ABC, abstractmethod
from typing import Any


class NotificationService(ABC):
    """Abstract notification service."""

    @abstractmethod
    async def send_whatsapp(self, to: str, body: str) -> None:
        """Send a WhatsApp message."""
        pass


class TwilioNotificationService(NotificationService):
    """Twilio-based WhatsApp notification service."""

    def __init__(self, account_sid: str, auth_token: str, whatsapp_number: str):
        from twilio.rest import Client

        self.account_sid = account_sid
        self.auth_token = auth_token
        self.whatsapp_number = whatsapp_number
        self.client = Client(account_sid, auth_token)

    async def send_whatsapp(self, to: str, body: str) -> None:
        """Send WhatsApp message via Twilio."""
        import asyncio

        loop = asyncio.get_running_loop()

        def _send():
            self.client.messages.create(
                from_=self.whatsapp_number,
                to=to,
                body=body,
            )

        await loop.run_in_executor(None, _send)


class StateService(ABC):
    """Abstract state/conversation management service."""

    @abstractmethod
    async def get_state(self, key: str) -> dict[str, Any] | None:
        """Retrieve conversation state."""
        pass

    @abstractmethod
    async def set_state(self, key: str, value: dict[str, Any]) -> None:
        """Store conversation state."""
        pass

    @abstractmethod
    async def delete_state(self, key: str) -> None:
        """Delete conversation state."""
        pass


class RedisStateService(StateService):
    """Redis-backed state service."""

    def __init__(self, redis_url: str):

        self.redis_url = redis_url
        self._redis = None

    async def _get_redis(self):
        if self._redis is None:
            import aioredis

            self._redis = await aioredis.from_url(self.redis_url)
        return self._redis

    async def get_state(self, key: str) -> dict[str, Any] | None:
        redis = await self._get_redis()
        import json

        data = await redis.get(key)
        return json.loads(data) if data else None

    async def set_state(self, key: str, value: dict[str, Any]) -> None:
        redis = await self._get_redis()
        import json

        await redis.set(key, json.dumps(value))

    async def delete_state(self, key: str) -> None:
        redis = await self._get_redis()
        await redis.delete(key)

    async def close(self) -> None:
        if self._redis:
            await self._redis.aclose()
