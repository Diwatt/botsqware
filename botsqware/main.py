"""FastAPI application entry point."""

import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor

from alembic import command
from alembic.config import Config
from fastapi import FastAPI

from botsqware.api import router as api_router

logger = logging.getLogger(__name__)

app = FastAPI(title="Botsware", version="0.1.0")

# Include API routers
app.include_router(api_router)


def run_migrations() -> None:
    """Run Alembic migrations to head."""
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")


@app.on_event("startup")
async def startup_event() -> None:
    """Run migrations on startup (non-blocking)."""
    loop = asyncio.get_event_loop()
    executor = ThreadPoolExecutor(max_workers=1)
    await loop.run_in_executor(executor, run_migrations)


@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "service": "botsware"}
