"""Database session management and async engine setup."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from botsqware.config import Settings


class Database:
    """Database helper class.

    Provides a FastAPI dependency and manages the async engine/session.
    """

    _engine = None
    _session_factory = None

    @classmethod
    def get_engine(cls):
        """Get or create the async engine."""
        if cls._engine is None:
            settings = Settings()
            cls._engine = create_async_engine(
                settings.postgres_url,
                echo=False,  # Set to True for SQL logging in development
                future=True,
            )
        return cls._engine

    @classmethod
    def get_session_factory(cls):
        """Get or create the async session factory."""
        if cls._session_factory is None:
            engine = cls.get_engine()
            cls._session_factory = async_sessionmaker(
                engine,
                class_=AsyncSession,
                expire_on_commit=False,
            )
        return cls._session_factory

    @classmethod
    async def get_db_session(cls) -> AsyncGenerator[AsyncSession, None]:
        """FastAPI dependency for database session.

        Usage in routes:
            @app.get("/endpoint")
            async def endpoint(session: AsyncSession = Depends(Database.get_db_session)):
                ...
        """
        async_session = cls.get_session_factory()
        async with async_session() as session:
            yield session
