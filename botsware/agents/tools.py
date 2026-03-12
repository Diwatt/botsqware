from __future__ import annotations

from typing import Any

from pydantic import BaseModel

# ------------------------------------------------------------
# data models
# ------------------------------------------------------------


class VenueCandidate(BaseModel):
    name: str
    city: str
    capacity: int | None = None
    genre_tags: list[str] = []
    contact_email: str | None = None
    booker_name: str | None = None
    source_url: str | None = None
    embedding: list[float] | None = None  # 1536-dim vector


class VenueResult(VenueCandidate):
    relevance_score: float
    score_rationale: str


class EmailDraft(BaseModel):
    subject: str
    body: str


# ------------------------------------------------------------
# tool implementations (stubs)
# ------------------------------------------------------------

# NOTE: the actual @tool decorator is part of pydantic_ai and will
# expose the function to the agent.  These implementations are empty
# placeholders; real logic should query search engines, the database,
# etc.

try:
    from pydantic_ai import tool
except ImportError:  # fallback if library not installed yet

    def tool(func=None, **kwargs):  # type: ignore
        return func


@tool
async def search_venues(query: str, city: str, max_capacity: int) -> list[VenueCandidate]:
    """Perform a web search and return raw venue candidates.

    Parameters:
    - query: free-text search string
    - city: filter by city name
    - max_capacity: upper bound on venue size
    """
    # TODO: implement crawling / search engine interaction
    return []


@tool
async def score_venue(venue_data: VenueCandidate, band_profile: dict[str, Any]) -> VenueResult:
    """Ask the LLM to score a venue and provide rationale.

    Returns a VenueResult with `relevance_score` in [0.0, 1.0].
    """
    # placeholder; real implementation should call the language model
    return VenueResult(**venue_data.dict(), relevance_score=0.0, score_rationale="")


@tool
async def check_duplicate(venue_name: str, city: str, embedding: list[float]) -> bool:
    """Check pgvector for an existing venue within a cosine similarity threshold."""
    # TODO: query database using pgvector extension
    return False


@tool
async def save_venue(venue_result: VenueResult) -> dict[str, Any]:
    """Insert scored venue into the database, returning the saved record.

    If a duplicate is detected the function can raise or return the existing row.
    """
    # TODO: perform DB insert; return {"id": ..., ...}
    return venue_result.dict()


@tool
async def create_task(task_type: str, venue_id: int, payload: dict[str, Any]) -> dict[str, Any]:
    """Create a new task row and return it.

    - expires_at is automatically set to now + 7 days
    - initial status is 'awaiting_human'
    """
    # TODO: insert into tasks table
    return {"id": 0, "type": task_type, "venue_id": venue_id, **payload}


@tool
async def draft_email(venue: dict[str, Any], band_profile: dict[str, Any], tone: str) -> EmailDraft:
    """Produce a booking inquiry email given a venue and band profile."""
    # TODO: prompt LLM for subject/body
    return EmailDraft(subject="", body="")
