from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from pathlib import Path
from typing import Any, Literal

import yaml
from pydantic import BaseModel, Field, field_validator

# ------------------------------------------------------------
# core domain models
# ------------------------------------------------------------


class BandProfile(BaseModel):
    name: str
    genre: list[str]
    draw_size: int
    target_cities: list[str]
    fee_range: tuple[float, float]
    description: str
    languages: list[str]

    @field_validator("fee_range", mode="before")
    @classmethod
    def _validate_fee_range(cls, v: Any) -> tuple[float, float]:
        # accept dicts with min/max or 2-tuple
        if isinstance(v, dict):
            return (float(v.get("min", 0)), float(v.get("max", 0)))
        if isinstance(v, (list, tuple)) and len(v) == 2:
            return (float(v[0]), float(v[1]))
        raise ValueError("fee_range must be a tuple or dict")


class VenueResult(BaseModel):
    id: int | None
    name: str
    city: str | None
    capacity: int | None
    genre_tags: list[str] = []
    contact_email: str | None
    booker_name: str | None
    relevance_score: float
    score_rationale: str
    embedding: list[float] | None
    source_url: str | None
    created_at: datetime | None


class TaskType(StrEnum):
    send_email = "send_email"
    send_message = "send_message"  # generic contact (email/whatsapp/phone)
    review_venue = "review_venue"
    follow_up = "follow_up"
    acknowledge = "acknowledge"


class TaskStatus(StrEnum):
    pending = "pending"
    awaiting_human = "awaiting_human"
    approved = "approved"
    edited = "edited"
    manual = "manual"
    cancelled = "cancelled"
    expired = "expired"
    done = "done"


class BaseTask(BaseModel):
    id: int | None
    type: TaskType
    status: TaskStatus = TaskStatus.pending
    venue_id: int | None
    payload: dict[str, Any] = {}
    reminder_count: int = 0
    expires_at: datetime | None
    created_at: datetime | None
    resolved_at: datetime | None


class SendEmailPayload(BaseModel):
    subject: str
    body: str


class SendEmailTask(BaseTask):
    type: Literal[TaskType.send_email] = TaskType.send_email
    payload: SendEmailPayload


class ReviewVenuePayload(BaseModel):
    reason: str | None


class ReviewVenueTask(BaseTask):
    type: Literal[TaskType.review_venue] = TaskType.review_venue
    payload: ReviewVenuePayload


class FollowUpPayload(BaseModel):
    original_message: str | None


class FollowUpTask(BaseTask):
    type: Literal[TaskType.follow_up] = TaskType.follow_up
    payload: FollowUpPayload


class AcknowledgePayload(BaseModel):
    note: str | None


class AcknowledgeTask(BaseTask):
    type: Literal[TaskType.acknowledge] = TaskType.acknowledge
    payload: AcknowledgePayload


class ConversationStateEnum(StrEnum):
    idle = "idle"
    searching = "searching"
    reviewing = "reviewing"
    emailing = "emailing"


class ConversationState(BaseModel):
    state: ConversationStateEnum = ConversationStateEnum.idle
    pending_venues: list[VenueResult] = []
    pending_task_id: int | None
    message_history: list[str] = []
    last_activity: datetime | None


class SearchRun(BaseModel):
    id: int | None
    query: str
    region: str | None
    status: str | None
    band_profile_snapshot: dict[str, Any] | None
    results_count: int | None
    created_at: datetime | None
    finished_at: datetime | None


class SearchQueryDepth(StrEnum):
    """Depth classification for search queries."""

    broad = "broad"  # General category searches
    deep = "deep"  # Specific venue/artist searches
    lateral = "lateral"  # Cross-referenced or follow-up searches


class SearchQuery(BaseModel):
    """Search query for wave-based venue discovery."""

    id: int | None = None
    text: str
    source: str  # duckduckgo, fedelima.org, sma-syndicat.org, etc.
    zone: str  # geo_wave: Nantes centre, Loire-Atlantique, etc.
    wave_number: int  # 0-8 for 9 zones
    depth: SearchQueryDepth = SearchQueryDepth.broad
    query_hash: str = ""  # SHA256 hash for deduplication
    executed_at: datetime | None = None
    results_count: int = 0
    status: str = "pending"  # pending, completed, failed
    created_at: datetime | None = None


class RawResult(BaseModel):
    """Raw search result from any source."""

    title: str
    url: str
    snippet: str
    source: str  # duckduckgo, fedelima, instagram, etc.
    zone: str
    raw_text: str = ""  # Full HTML or text for later parsing


class VenuePageData(BaseModel):
    """Extracted venue information from a website."""

    url: str
    title: str | None = None
    email: str | None = None
    phone: str | None = None
    contact_link: str | None = None
    social_links: list[str] = []  # Instagram, Facebook, etc.
    programmation_mentions: list[str] = []  # References to events/jazz
    capacity: int | None = None
    raw_html: str = ""


class InstagramData(BaseModel):
    """Instagram information for a venue."""

    handle: str | None = None
    url: str | None = None
    found: bool = False
    source_query: str


class VenueCandidate(BaseModel):
    """Extracted venue candidate for scoring.

    Created by VenueExtractor from RawResult list using LLM extraction.
    """

    name: str
    city: str
    website: str | None = None
    capacity_hint: int | None = None
    venue_type: str  # club, theatre, salle, festival, etc.
    contact_raw: str | None = None  # Unparsed contact info
    programming_evidence: str | None = None  # Quotes mentioning jazz/concerts
    confidence: float = Field(..., ge=0.0, le=1.0)  # Extraction confidence 0-1


class SearchWaveReport(BaseModel):
    """Report from a single search wave execution.

    Summarizes results of running one batch of queries across a region.
    """

    wave_number: int
    zone: str
    queries_run: int
    candidates_found: int
    new_venues_saved: int
    tasks_created: int
    top_venues: list[str]  # Names of top 5 venues found
    next_wave_ready: bool  # Whether lateral queries scheduled for next wave


class OutreachDraft(BaseModel):
    """Draft outreach message for venue contact."""

    venue_id: int
    channel: Literal["email", "whatsapp", "phone"]
    subject: str | None
    body: str
    personalisation_notes: str


# ------------------------------------------------------------
# helpers
# ------------------------------------------------------------


def load_band_profile(path: Path | str = "band_profile.yaml") -> BandProfile:
    """Load a BandProfile from a YAML file."""
    p = Path(path)
    data = yaml.safe_load(p.read_text())
    return BandProfile(**data)
