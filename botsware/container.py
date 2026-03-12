"""Dependency container for managing application dependencies.

The container holds all application services and provides them to other parts
of the application. This centralizes dependency management and makes testing
easier via injection.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from botsware.config import Settings
from botsware.db.repositories import (
    SearchScheduleRepository,
    TaskRepository,
    VenueRepository,
)
from botsware.services.base_services import (
    NotificationService,
    RedisStateService,
    StateService,
    TwilioNotificationService,
)


class Container:
    """Dependency injection container.

    Manages all application services and provides singleton instances.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self._notification_service: NotificationService | None = None
        self._state_service: StateService | None = None

    @property
    def notification_service(self) -> NotificationService:
        """Get or create the notification service."""
        if self._notification_service is None:
            self._notification_service = TwilioNotificationService(
                account_sid=self.settings.twilio_account_sid,
                auth_token=self.settings.twilio_auth_token,
                whatsapp_number=self.settings.twilio_whatsapp_number,
            )
        return self._notification_service

    @property
    def state_service(self) -> StateService:
        """Get or create the state service."""
        if self._state_service is None:
            self._state_service = RedisStateService(self.settings.redis_url)
        return self._state_service

    def get_venue_repository(self, session: AsyncSession) -> VenueRepository:
        """Create a venue repository with the given session."""
        return VenueRepository(session)

    def get_task_repository(self, session: AsyncSession) -> TaskRepository:
        """Create a task repository with the given session."""
        return TaskRepository(session)

    def get_search_schedule_repository(self, session: AsyncSession) -> SearchScheduleRepository:
        """Create a search schedule repository with the given session."""
        return SearchScheduleRepository(session)

    async def close(self) -> None:
        """Close all service connections."""
        if isinstance(self._state_service, RedisStateService):
            await self._state_service.close()


# Global container instance (initialized on app startup)
_container: Container | None = None


def get_container() -> Container:
    """Get the global container instance."""
    if _container is None:
        raise RuntimeError("Container not initialized. Call init_container() during app startup.")
    return _container


def init_container(settings: Settings) -> Container:
    """Initialize the global container."""
    global _container
    _container = Container(settings)
    return _container
