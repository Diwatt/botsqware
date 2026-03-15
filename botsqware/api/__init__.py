"""API module containing all HTTP endpoints."""

from .webhook import router

__all__ = ["router"]
