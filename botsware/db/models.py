"""SQLAlchemy ORM models for botsware."""

import enum
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import ARRAY, BigInteger, Column, DateTime, Integer, Numeric, String, Text
from sqlalchemy import Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class TaskType(enum.StrEnum):
    """Task type enumeration."""

    send_email = "send_email"
    send_message = "send_message"  # generic for email/whatsapp/phone
    review_venue = "review_venue"
    follow_up = "follow_up"
    acknowledge = "acknowledge"


class TaskStatus(enum.StrEnum):
    """Task status enumeration."""

    pending = "pending"
    awaiting_human = "awaiting_human"
    approved = "approved"
    edited = "edited"
    manual = "manual"
    cancelled = "cancelled"
    expired = "expired"
    done = "done"


class Venue(Base):
    """Venue entity representing a potential booking location."""

    __tablename__ = "venues"

    id = Column(BigInteger, primary_key=True)
    name = Column(String, nullable=False, index=True)
    city = Column(String, index=True)
    capacity = Column(Integer)
    genre_tags = Column(ARRAY(String))
    contact_email = Column(String)
    booker_name = Column(String)
    relevance_score = Column(Numeric(3, 2))
    score_rationale = Column(Text)
    embedding = Column(Vector(1536), index=True)
    source_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Task(Base):
    """Task entity for human action items."""

    __tablename__ = "tasks"

    id = Column(BigInteger, primary_key=True)
    type = Column(SQLEnum(TaskType), nullable=False)
    status = Column(SQLEnum(TaskStatus), nullable=False, index=True)
    venue_id = Column(BigInteger)
    payload = Column(JSONB)
    reminder_count = Column(Integer, default=0)
    expires_at = Column(DateTime, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    resolved_at = Column(DateTime)


class SearchSchedule(Base):
    """Search schedule entity for automated searches."""

    __tablename__ = "search_schedules"

    id = Column(BigInteger, primary_key=True)
    cron_expr = Column(String, nullable=False, index=True)
    query = Column(String, nullable=False)
    region = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class SearchRun(Base):
    """Search run entity tracking executed searches."""

    __tablename__ = "search_runs"

    id = Column(BigInteger, primary_key=True)
    query = Column(String, nullable=False)
    region = Column(String)
    status = Column(String)
    band_profile_snapshot = Column(JSONB)
    results_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    finished_at = Column(DateTime)


class Outreach(Base):
    """Outreach record entity for tracking contact attempts."""

    __tablename__ = "outreach"

    id = Column(BigInteger, primary_key=True)
    venue_id = Column(BigInteger)
    task_id = Column(BigInteger)
    channel = Column(String)  # email, whatsapp, phone
    subject = Column(String)
    body = Column(Text)
    sent_at = Column(DateTime)
    reply_status = Column(String)  # replied, bounced, unopened
    notes = Column(Text)


class SearchQuery(Base):
    """Search query entity for wave-based venue discovery."""

    __tablename__ = "search_queries"

    id = Column(BigInteger, primary_key=True)
    query_text = Column(String, nullable=False)
    source = Column(String, nullable=False, index=True)
    zone = Column(String, nullable=False, index=True)
    wave_number = Column(Integer, nullable=False, index=True)
    executed_at = Column(DateTime)
    results_count = Column(Integer, default=0)
    status = Column(String, default="pending", index=True)
    query_hash = Column(String, unique=True, index=True)
    depth = Column(String, default="broad")  # broad, deep, lateral
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
