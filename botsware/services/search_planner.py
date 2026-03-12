"""Search query planner for iterative venue discovery via geo-waves.

The SearchPlanner generates progressive query batches based on the band's
search_strategy, avoiding duplicates and managing broad→deep→lateral progression.
"""

from __future__ import annotations

import hashlib
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from botsware.schemas import BandProfile, SearchQuery, SearchQueryDepth


class SearchPlanner:
    """Generates and manages search queries for venue discovery.

    Reads band profile search_strategy and database history to generate
    the next batch of queries in wave progression.
    """

    def __init__(self, band_profile: BandProfile, session: AsyncSession):
        """Initialize planner with band profile and database session.

        Args:
            band_profile: Band profile containing search_strategy configuration
            session: AsyncSession for database queries
        """
        self.band_profile = band_profile
        self.session = session
        self.search_strategy = band_profile.search_strategy or {}

    async def get_next_wave(self) -> list[SearchQuery]:
        """Get unexecuted queries for the next geo_wave.

        Determines current wave number by checking database, then generates
        up to 10 new queries for that zone.

        Returns:
            List of SearchQuery objects ready for execution
        """
        # Find current wave number
        from botsware.db.models import SearchQuery as SearchQueryModel

        stmt = select(func.max(SearchQueryModel.wave_number)).select_from(SearchQueryModel)
        result = await self.session.execute(stmt)
        current_wave = (result.scalar() or -1) + 1

        # Check if we've exhausted all waves
        geo_waves = self.search_strategy.get("geo_waves", [])
        if current_wave >= len(geo_waves):
            return []

        zone = geo_waves[current_wave]
        return await self.generate_queries_for_zone(zone, current_wave)

    async def generate_queries_for_zone(self, zone: str, wave_number: int) -> list[SearchQuery]:
        """Expand seed templates into 4 query types for a zone.

        Query types:
        (1) direct: 'jazz club Nantes programmation 2025'
        (2) directory: 'site:fedelima.org Loire-Atlantique'
        (3) similar act trace: 'Tigran Hamasyan concert Loire-Atlantique'
        (4) festival: 'festival jazz Vendée 2025 2026'

        Args:
            zone: Geo_wave zone name (e.g., 'Loire-Atlantique')
            wave_number: Wave index (0-8)

        Returns:
            List of deduplicated SearchQuery objects
        """
        from botsware.db.models import SearchQuery as SearchQueryModel

        # Get existing query hashes to avoid duplicates
        stmt = select(SearchQueryModel.query_hash)
        result = await self.session.execute(stmt)
        existing_hashes = {row[0] for row in result.fetchall()}

        queries: list[SearchQuery] = []
        seed_queries = self.search_strategy.get("seed_queries", [])
        similar_acts = self.search_strategy.get("similar_acts", [])
        source_priority = self.search_strategy.get("source_priority", [])

        # Type 1: Direct venue searches
        for template in seed_queries[:6]:  # First 6 seeds for direct
            text = template.replace("{city}", zone).replace(
                "{region}", self.band_profile.base_region
            )
            query = self._create_query(
                text,
                source_priority[0] if source_priority else "duckduckgo",
                zone,
                wave_number,
                SearchQueryDepth.broad,
                existing_hashes,
            )
            if query:
                queries.append(query)

        # Type 2: Directory searches (site-restricted)
        for source in source_priority[1:3]:  # e.g., fedelima, sma-syndicat
            text = f"site:{source} {zone}"
            query = self._create_query(
                text, source, zone, wave_number, SearchQueryDepth.broad, existing_hashes
            )
            if query:
                queries.append(query)

        # Type 3: Similar act trace
        for act in similar_acts[:3]:
            text = f"{act} concert {zone}"
            query = self._create_query(
                text,
                source_priority[0] if source_priority else "duckduckgo",
                zone,
                wave_number,
                SearchQueryDepth.deep,
                existing_hashes,
            )
            if query:
                queries.append(query)

        # Type 4: Festival searches
        for year in [2025, 2026]:
            text = f"festival jazz {zone} {year}"
            query = self._create_query(
                text,
                source_priority[0] if source_priority else "duckduckgo",
                zone,
                wave_number,
                SearchQueryDepth.broad,
                existing_hashes,
            )
            if query:
                queries.append(query)

        return queries[:10]  # Cap at 10 queries per wave

    async def mark_executed(
        self, query_id: int, results_count: int = 0, status: str = "completed"
    ) -> None:
        """Mark a query as executed and update results count.

        Args:
            query_id: ID of the SearchQuery in database
            results_count: Number of results found
            status: Query status ('completed' or 'failed')
        """
        from botsware.db.models import SearchQuery as SearchQueryModel

        stmt = select(SearchQueryModel).where(SearchQueryModel.id == query_id)
        result = await self.session.execute(stmt)
        query = result.scalar_one_or_none()

        if query:
            query.executed_at = datetime.now(tz=datetime.UTC)
            query.results_count = results_count
            query.status = status
            await self.session.commit()

    async def get_lateral_queries(self, venue_name: str, zone: str) -> list[SearchQuery]:
        """Generate deeper follow-up queries for a known venue.

        Query types:
        - Website search: '[venue_name] site'
        - Social media: 'Instagram [venue_name]'
        - Programming info: 'programmation [venue_name] jazz'

        Args:
            venue_name: Name of the venue to deepen search on
            zone: Geo_wave zone

        Returns:
            List of lateral SearchQuery objects
        """
        from botsware.db.models import SearchQuery as SearchQueryModel

        stmt = select(SearchQueryModel.query_hash)
        result = await self.session.execute(stmt)
        existing_hashes = {row[0] for row in result.fetchall()}

        queries: list[SearchQuery] = []
        source_priority = self.search_strategy.get("source_priority", [])

        # Website search
        text = f"{venue_name} site"
        query = self._create_query(
            text,
            source_priority[0] if source_priority else "duckduckgo",
            zone,
            99,
            SearchQueryDepth.lateral,
            existing_hashes,
        )
        if query:
            queries.append(query)

        # Social media
        text = f"Instagram {venue_name}"
        query = self._create_query(
            text, "instagram", zone, 99, SearchQueryDepth.lateral, existing_hashes
        )
        if query:
            queries.append(query)

        # Programming info
        text = f"programmation {venue_name} jazz"
        query = self._create_query(
            text,
            source_priority[0] if source_priority else "duckduckgo",
            zone,
            99,
            SearchQueryDepth.lateral,
            existing_hashes,
        )
        if query:
            queries.append(query)

        return queries

    def _create_query(
        self,
        text: str,
        source: str,
        zone: str,
        wave_number: int,
        depth: SearchQueryDepth,
        existing_hashes: set[str],
    ) -> SearchQuery | None:
        """Create a SearchQuery if it doesn't already exist (hash check).

        Args:
            text: Query text
            source: Source (search engine or directory)
            zone: Geo_wave zone
            wave_number: Wave index
            depth: Query depth classification
            existing_hashes: Set of existing query hashes to avoid duplicates

        Returns:
            SearchQuery if new, None if already exists
        """
        query_hash = self._hash_query(text, source)

        if query_hash in existing_hashes:
            return None

        return SearchQuery(
            text=text,
            source=source,
            zone=zone,
            wave_number=wave_number,
            depth=depth,
            query_hash=query_hash,
            status="pending",
        )

    @staticmethod
    def _hash_query(text: str, source: str) -> str:
        """Generate SHA256 hash of query for deduplication.

        Args:
            text: Query text
            source: Source identifier

        Returns:
            SHA256 hash hex string
        """
        combined = f"{text}:{source}"
        return hashlib.sha256(combined.encode()).hexdigest()
