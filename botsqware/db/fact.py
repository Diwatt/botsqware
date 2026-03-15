"""Fact/memory entity definition."""

from datetime import datetime

from sqlalchemy import BigInteger, Column, DateTime, Integer, String, Text

from botsqware.db.base import Base


class Fact(Base):
    """Persistent fact/memory entity extracted from conversations."""

    __tablename__ = "facts"

    id = Column(BigInteger, primary_key=True)
    category = Column(String, nullable=False, index=True)
    subject = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    source_message = Column(String)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    active = Column(Integer, default=1, nullable=False, index=True)
