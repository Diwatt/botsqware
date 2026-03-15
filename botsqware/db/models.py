"""Database models and declarative base.

This module re-exports model classes from their dedicated modules to keep
one class per file while preserving the old import path.
"""

from botsqware.db.base import Base
from botsqware.db.fact import Fact
from botsqware.db.message import Message

__all__ = ["Base", "Message", "Fact"]
