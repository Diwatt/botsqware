"""Database session management and async engine setup."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from botsware.config import Settings

# Lazy initialization (Settings loaded at startup)
_engine = None
AsyncSessionLocal = None


def get_engine():
    """Get or create the async engine."""
    global _engine
    if _engine is None:
        settings = Settings()
        _engine = create_async_engine(
            settings.database_url,
            echo=False,  # Set to True for SQL logging in development
            future=True,
        )
    return _engine


def get_session_factory():
    """Get or create the async session factory."""
    global AsyncSessionLocal
    if AsyncSessionLocal is None:
        engine = get_engine()
        AsyncSessionLocal = async_sessionmaker(
            engine,
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return AsyncSessionLocal


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for database session.

    Usage in routes:
        @app.get("/endpoint")
        async def endpoint(session: AsyncSession = Depends(get_db_session)):
            ...
    """
    async_session = get_session_factory()
    async with async_session() as session:
        yield session


# For direct usage in non-FastAPI contexts
AsyncSessionLocal = async_sessionmaker(
    get_engine(),
    class_=AsyncSession,
    expire_on_commit=False,
)
