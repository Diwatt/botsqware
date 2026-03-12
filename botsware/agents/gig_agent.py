"""GigAgent: orchestrates venue search, scoring, and outreach pipeline.

The agent follows the Command pattern, accepting inputs and producing outputs
without maintaining state. It delegates to tool functions which can be mocked
for testing.
"""

from __future__ import annotations

from typing import Any

from botsware.agents.base_agent import Agent
from botsware.agents.tools import (
    VenueCandidate,
    VenueResult,
    check_duplicate,
    create_task,
    draft_email,
    save_venue,
    score_venue,
    search_venues,
)


class GigAgent(Agent):
    """Stateless agent orchestrating venue search and outreach pipeline."""

    async def run(
        self,
        query: str,
        city: str,
        max_capacity: int,
        band_profile: dict[str, Any],
        tone: str = "professional",
    ) -> dict[str, Any]:
        """Execute the full venue search and scoring pipeline.

        Args:
            query: Search query for venue discovery
            city: Target city for filtering
            max_capacity: Maximum venue capacity
            band_profile: Band information dict
            tone: Email tone preference

        Returns:
            Summary dict with processed venues and created tasks.
        """
        # Step 1: Search for venue candidates
        candidates: list[VenueCandidate] = await search_venues(query, city, max_capacity)

        summary: list[dict[str, Any]] = []

        # Step 2-6: Process each candidate through scoring pipeline
        for candidate in candidates:
            processed = await self._process_candidate(candidate, band_profile, tone)
            if processed:
                summary.append(processed)

        return {"summary": summary, "total_processed": len(candidates)}

    async def _process_candidate(
        self,
        candidate: VenueCandidate,
        band_profile: dict[str, Any],
        tone: str,
    ) -> dict[str, Any] | None:
        """Process a single venue candidate through the pipeline.

        Returns None if candidate is skipped (duplicate, low score, etc.)
        """
        # Score the venue
        scored: VenueResult = await score_venue(candidate, band_profile)

        # Check for duplicates using embedding similarity
        if scored.embedding is not None:
            is_duplicate = await check_duplicate(scored.name, scored.city, scored.embedding)
            if is_duplicate:
                return None

        # Save to database
        saved = await save_venue(scored)
        venue_id = saved.get("id")

        if not venue_id:
            return None

        # Only create tasks for high-scoring venues
        if scored.relevance_score < 0.7:
            return None

        # Draft email and create task
        email = await draft_email(saved, band_profile, tone)
        task = await create_task(
            "send_email",
            venue_id,
            {"subject": email.subject, "body": email.body},
        )

        return {
            "venue": saved.get("name"),
            "city": saved.get("city"),
            "score": scored.relevance_score,
            "task_id": task.get("id"),
        }
