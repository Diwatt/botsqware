"""Iterative search wave runner orchestrating full venue discovery pipeline.

Main orchestrator that coordinates query execution, venue extraction,
scoring, deduplication, saving, task creation, and reporting.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from botsware.db.models import SearchQuery as SearchQueryModel
from botsware.schemas import (
    BandProfile,
    RawResult,
    SearchWaveReport,
    VenueResult,
)
from botsware.services.search_planner import SearchPlanner
from botsware.services.search_tools import (
    duckduckgo_search,
    search_fedelima,
    web_fetch_venue,
)
from botsware.services.venue_extractor import VenueExtractor
from botsware.services.venue_scorer import VenueScorer, dedup_check

if TYPE_CHECKING:
    from botsware.db.repositories import (
        SearchScheduleRepository,
        TaskRepository,
        VenueRepository,
    )
    from botsware.services.base_services import NotificationService

logger = logging.getLogger(__name__)


class IterativeSearchRunner:
    """Orchestrates iterative venue discovery across search waves.

    Coordinates all steps: query generation, execution, venue extraction,
    scoring, deduplication, saving, task creation, and reporting.
    """

    def __init__(
        self,
        session: AsyncSession,
        venue_repo: VenueRepository,
        task_repo: TaskRepository,
        search_schedule_repo: SearchScheduleRepository,
        notification_service: NotificationService,
    ):
        """Initialize runner with dependencies.

        Args:
            session: SQLAlchemy async session
            venue_repo: Repository for venue operations
            task_repo: Repository for task creation
            search_schedule_repo: Repository for search tracking
            notification_service: Twilio/WhatsApp notification service
        """
        self.session = session
        self.venue_repo = venue_repo
        self.task_repo = task_repo
        self.search_schedule_repo = search_schedule_repo
        self.notification_service = notification_service

    async def run_search_wave(
        self,
        band_profile: BandProfile,
        whatsapp_number: str | None = None,
    ) -> SearchWaveReport:
        """Execute one complete search wave across a geo-zone.

        Runs queries, extracts venues, scores, deduplicates, saves, creates
        tasks, and sends WhatsApp summary.

        Args:
            band_profile: Band profile with search strategy
            whatsapp_number: Optional WhatsApp number for summary notification

        Returns:
            SearchWaveReport with wave execution summary
        """
        planner = SearchPlanner(band_profile, self.session)
        extractor = VenueExtractor()
        scorer = VenueScorer()

        # Step 1: Get next wave queries
        queries = await planner.get_next_wave()
        if not queries:
            logger.warning("No queries available for next wave")
            return SearchWaveReport(
                wave_number=0,
                zone="unknown",
                queries_run=0,
                candidates_found=0,
                new_venues_saved=0,
                tasks_created=0,
                top_venues=[],
                next_wave_ready=False,
            )

        wave_number = queries[0].wave_number if queries else 0
        zone = queries[0].zone if queries else "unknown"

        logger.info(f"Starting wave {wave_number} for zone {zone} with {len(queries)} queries")

        # Step 2: Execute queries and collect results
        raw_results: list[RawResult] = []
        for query in queries:
            try:
                results = await self._execute_query(query)
                raw_results.extend(results)
            except Exception as e:
                logger.error(f"Query execution failed for '{query.text}': {e!s}")
                # Continue with next query (one failure doesn't stop wave)

        logger.info(f"Collected {len(raw_results)} raw results")

        # Step 3: Extract venue candidates
        candidates = await extractor.extract_refined(raw_results, min_confidence=0.4)
        logger.info(f"Extracted {len(candidates)} venue candidates")

        # Step 4-8: Dedup, score, save, schedule lateral queries
        new_venues_saved = 0
        scored_results: list[tuple[VenueResult, float]] = []

        for candidate in candidates:
            # Step 4: Check for duplicate
            existing_id = await dedup_check(candidate, self.session)
            if existing_id:
                logger.debug(f"Skipping duplicate: {candidate.name} (existing ID: {existing_id})")
                continue

            # Step 5: Score venue
            venue_result = await scorer.score(candidate, band_profile)
            scored_results.append((venue_result, candidate.confidence))

            # Step 6-7: Save venues with score >= 0.5
            if venue_result.relevance_score >= 0.5:
                await self.venue_repo.save_venue(venue_result)
                new_venues_saved += 1
                logger.info(
                    f"Saved venue: {venue_result.name} (score: {venue_result.relevance_score})"
                )

                # Step 8: Schedule lateral queries for score >= 0.65
                if venue_result.relevance_score >= 0.65:
                    lateral_queries = await planner.get_lateral_queries(
                        candidate.name, zone
                    )
                    if lateral_queries:
                        logger.debug(
                            f"Scheduled {len(lateral_queries)} lateral queries for {candidate.name}"
                        )

        # Step 9: Create review_venue tasks for top 5 venues
        top_venues_by_score = sorted(
            scored_results, key=lambda x: x[0].relevance_score, reverse=True
        )[:5]
        top_venue_names: list[str] = []
        tasks_created = 0

        for venue_result, _ in top_venues_by_score:
            top_venue_names.append(venue_result.name)

            # Create task if venue was saved
            if venue_result.id:
                try:
                    task_payload = {
                        "venue_name": venue_result.name,
                        "score": venue_result.relevance_score,
                        "rationale": venue_result.score_rationale,
                    }
                    await self.task_repo.create_task(
                        task_type="review_venue",
                        venue_id=venue_result.id,
                        payload=task_payload,
                    )
                    tasks_created += 1
                    logger.info(f"Created review_venue task for {venue_result.name}")
                except Exception as e:
                    logger.error(f"Failed to create task for {venue_result.name}: {e!s}")

        # Step 10: Mark all queries executed
        for query in queries:
            try:
                stmt = (
                    update(SearchQueryModel)
                    .where(SearchQueryModel.id == query.id)
                    .values(
                        status="completed",
                        executed_at=datetime.now(tz=datetime.UTC),
                        results_count=len([r for r in raw_results if r.zone == query.zone]),
                    )
                )
                await self.session.execute(stmt)
            except Exception as e:
                logger.error(f"Failed to mark query {query.id} as executed: {e!s}")

        await self.session.commit()

        # Step 11: Send WhatsApp summary
        report = SearchWaveReport(
            wave_number=wave_number,
            zone=zone,
            queries_run=len(queries),
            candidates_found=len(candidates),
            new_venues_saved=new_venues_saved,
            tasks_created=tasks_created,
            top_venues=top_venue_names,
            next_wave_ready=any(
                s >= 0.65 for _, s in scored_results
            ),  # True if any venue hit lateral threshold
        )

        if whatsapp_number:
            try:
                summary_message = self._build_whatsapp_summary(report, band_profile)
                await self.notification_service.send_whatsapp(whatsapp_number, summary_message)
            except Exception as e:
                logger.error(f"Failed to send WhatsApp summary: {e!s}")

        logger.info(f"Wave {wave_number} complete: {report.model_dump()}")
        return report

    async def _execute_query(self, query) -> list[RawResult]:
        """Execute a single search query via appropriate tool.

        Args:
            query: SearchQuery object with text, source, zone

        Returns:
            List of RawResult objects

        Raises:
            Exception: On query execution failure
        """
        source = query.source.lower()

        if source == "duckduckgo":
            return await duckduckgo_search(query.text, query.zone, max_results=10)
        elif source == "fedelima.org":
            return await search_fedelima(query.zone)
        elif source in {"website", "venue_website"}:
            try:
                venue_page = await web_fetch_venue(query.text)
                # Convert VenuePageData to RawResult for consistency
                if venue_page.url:
                    return [
                        RawResult(
                            title=venue_page.title or query.text,
                            url=venue_page.url,
                            snippet="\n".join(venue_page.programmation_mentions or []),
                            source="venue_scrape",
                            zone=query.zone,
                            raw_text=venue_page.raw_html,
                        )
                    ]
            except Exception as e:
                logger.error(f"Web fetch failed for {query.text}: {e!s}")
        else:
            logger.warning(f"Unknown source for query: {source}")

        return []

    @staticmethod
    def _build_whatsapp_summary(report: SearchWaveReport, band: BandProfile) -> str:
        """Build human-readable WhatsApp summary message.

        Args:
            report: SearchWaveReport from wave execution
            band: Band profile for context

        Returns:
            Formatted message string
        """
        lines = [
            f"🎵 *{band.name}* Gig Search Report",
            "",
            f"📍 Wave {report.wave_number}: {report.zone}",
            "",
            "📊 Results:",
            f"  • Queries executed: {report.queries_run}",
            f"  • Candidates found: {report.candidates_found}",
            f"  • New venues saved: {report.new_venues_saved}",
            f"  • Tasks created: {report.tasks_created}",
        ]

        if report.top_venues:
            lines.extend(
                [
                    "",
                    "⭐ Top venues:",
                    *[f"  • {v}" for v in report.top_venues[:3]],
                ]
            )

        if report.next_wave_ready:
            lines.append("")
            lines.append("🔄 Next wave ready to schedule!")

        return "\n".join(lines)
