"""FastAPI application entry point with dependency injection setup."""

from fastapi import FastAPI

from botsware.api import router as api_router
from botsware.config import Settings
from botsware.container import init_container
from botsware.services.scheduler import load_scheduled_searches, scheduler

app = FastAPI(title="Botsware", version="0.1.0")

# Include API routers
app.include_router(api_router)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize application on startup.

    - Load configuration
    - Initialize dependency container
    - Start scheduler
    - Load scheduled searches from database
    """
    settings = Settings()
    init_container(settings)

    scheduler.start()
    await load_scheduled_searches()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Cleanup on shutdown.

    - Stop scheduler
    - Close all service connections
    """
    await scheduler.shutdown()


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "service": "botsware"}
