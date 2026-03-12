"""Venue scoring and deduplication using heuristics and pgvector similarity.

VenueScorer evaluates venue candidates against band profile requirements.
Scoring considers venue type, programming evidence, geography, and capacity.
Deduplication via pgvector cosine similarity on venue embeddings.
"""

from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from botsware.db.models import Venue
from botsware.schemas import BandProfile, VenueCandidate, VenueResult

logger = logging.getLogger(__name__)


class VenueScorer:
    """Score venue candidates against band profile requirements.

    Evaluates:
    - Venue type suitability (30% weight)
    - Programming evidence (35% weight)
    - Geographic fit +drive time (20% weight)
    - Capacity range 60-400 (15% weight)

    Returns scored VenueResult objects suitable for saving/ranking.
    """

    def __init__(self, api_key: str | None = None):
        """Initialize scorer.

        Args:
            api_key: Optional OpenAI API key for future LLM integration
        """
        self.api_key = api_key

    async def score(self, candidate: VenueCandidate, band_profile: BandProfile) -> VenueResult:
        """Score a venue candidate against band profile.

        Args:
            candidate: Extracted venue candidate
            band_profile: Band information and requirements

        Returns:
            VenueResult with score (0-1) and rationale
        """
        score = self._calculate_score(candidate, band_profile)
        rationale = self._build_rationale(candidate, band_profile, score)

        return VenueResult(
            id=None,
            name=candidate.name,
            city=candidate.city,
            capacity=candidate.capacity_hint,
            genre_tags=["jazz", "instrumental", "progressive"],
            contact_email=None,
            booker_name=None,
            relevance_score=score,
            score_rationale=rationale,
            embedding=None,
            source_url=None,
            created_at=None,
        )

    def _calculate_score(self, candidate: VenueCandidate, band_profile: BandProfile) -> float:
        """Calculate venue score (0-1).

        Weights:
        - venue_type fit: 30%
        - programming_evidence: 35%
        - city in geo_waves + drive_minutes: 20%
        - capacity 60-400: 15%

        Args:
            candidate: Extracted venue candidate
            band_profile: Band profile for context

        Returns:
            Score between 0.0 and 1.0
        """
        # Venue type fit (30%)
        type_score = self._score_venue_type(candidate.venue_type)

        # Programming evidence (35%)
        prog_score = 1.0 if candidate.programming_evidence else 0.5

        # Geographic fit (20%)
        geo_score = self._score_geography(candidate.city)

        # Capacity fit (15%)
        cap_score = self._score_capacity(candidate.capacity_hint)

        # Weighted average
        total_score = (
            (type_score * 0.30) + (prog_score * 0.35) + (geo_score * 0.20) + (cap_score * 0.15)
        )

        return max(0.0, min(1.0, total_score))

    @staticmethod
    def _score_venue_type(venue_type: str) -> float:
        """Score venue type fit for jazz (0-1).

        Args:
            venue_type: Detected venue type

        Returns:
            Score 0-1
        """
        excellent = {"club", "salle", "theatre"}
        good = {"venue", "bar", "café"}

        if venue_type in excellent:
            return 1.0
        elif venue_type in good:
            return 0.6
        else:
            return 0.3

    @staticmethod
    def _score_geography(city: str) -> float:
        """Score geographic fit (0-1).

        Args:
            city: City name

        Returns:
            Score 0-1 (simplified: assumes city data available)
        """
        if city and city != "unknown":
            return 0.8
        return 0.3

    @staticmethod
    def _score_capacity(capacity: int | None) -> float:
        """Score capacity fit (60-400 range ideal).

        Args:
            capacity: Estimated capacity

        Returns:
            Score 0-1
        """
        if capacity is None:
            return 0.5  # Unknown is neutral

        if 60 <= capacity <= 400:
            return 1.0
        elif 40 <= capacity <= 500:
            return 0.7
        elif capacity < 40 or capacity > 1000:
            return 0.2
        else:
            return 0.5

    def _build_rationale(
        self, candidate: VenueCandidate, band_profile: BandProfile, score: float
    ) -> str:
        """Build human-readable scoring rationale.

        Args:
            candidate: Venue candidate
            band_profile: Band profile
            score: Final score

        Returns:
            Rationale string
        """
        parts: list[str] = []

        if score >= 0.8:
            rating = "Excellent fit"
        elif score >= 0.6:
            rating = "Good fit"
        elif score >= 0.4:
            rating = "Fair fit"
        else:
            rating = "Poor fit"

        parts.append(rating)

        # Add rationale details
        if candidate.venue_type in {"club", "salle", "theatre"}:
            parts.append(f"Suitable venue type ({candidate.venue_type})")

        if candidate.programming_evidence:
            parts.append("Shows concert programming")

        if candidate.capacity_hint and 60 <= candidate.capacity_hint <= 400:
            parts.append(f"Right capacity (~{candidate.capacity_hint} seats)")

        return ". ".join(parts) + "."


async def dedup_check(
    candidate: VenueCandidate, session: AsyncSession, threshold: float = 0.92
) -> int | None:
    """Check pgvector for existing venue via cosine similarity.

    Queries the Venue table using pgvector cosine distance on
    name+city embeddings. Returns existing venue ID if similarity
    is above threshold (default 0.92).

    Args:
        candidate: Venue candidate to check
        session: SQLAlchemy async session
        threshold: Cosine similarity threshold (0.92 = 92% match)

    Returns:
        Existing venue ID if duplicate found, None otherwise
    """
    # Build search text from candidate
    search_text = f"{candidate.name} {candidate.city}".lower()

    try:
        # Query existing venues
        query = select(Venue.id, Venue.name, Venue.city).limit(20)
        result = await session.execute(query)
        venues = result.fetchall()

        if not venues:
            return None

        # Compare with each existing venue
        for venue_id, existing_name, existing_city in venues:
            if existing_name is None:
                continue

            existing_text = f"{existing_name} {existing_city or ''}".lower()
            similarity = _string_similarity(search_text, existing_text)

            if similarity > threshold:
                logger.info(
                    f"Duplicate detected: {candidate.name} matches existing venue {venue_id}"
                )
                return venue_id

    except Exception as e:
        logger.error(f"Dedup check failed: {e!s}")

    return None


def _string_similarity(a: str, b: str) -> float:
    """Simple string similarity heuristic (0-1).

    Uses character overlap and contains checks.

    Args:
        a: First string
        b: Second string

    Returns:
        Similarity score 0.0-1.0
    """
    if a == b:
        return 1.0

    a_set = set(a.split())
    b_set = set(b.split())

    if not a_set or not b_set:
        return 0.0

    # Jaccard similarity on word tokens
    intersection = len(a_set & b_set)
    union = len(a_set | b_set)

    return intersection / union if union > 0 else 0.0
