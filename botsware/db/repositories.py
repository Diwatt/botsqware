"""Repository pattern implementations for data access.

Repositories abstract database operations and provide a clean interface
to business logic. Each repository handles a single entity type.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from botsware.schemas import TaskStatus, VenueResult


class BaseRepository:
    """Base repository with common async session management."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def commit(self) -> None:
        """Commit the current transaction."""
        await self.session.commit()

    async def rollback(self) -> None:
        """Rollback the current transaction."""
        await self.session.rollback()


class VenueRepository(BaseRepository):
    """Repository for venue data operations."""

    async def save_venue(self, venue: VenueResult) -> VenueResult:
        """Save a venue to the database.

        Returns the saved venue with its assigned ID.
        """
        from botsware.db.models import Venue

        venue_model = Venue(
            name=venue.name,
            city=venue.city,
            capacity=venue.capacity,
            genre_tags=venue.genre_tags,
            contact_email=venue.contact_email,
            booker_name=venue.booker_name,
            relevance_score=venue.relevance_score,
            score_rationale=venue.score_rationale,
            embedding=venue.embedding,
            source_url=venue.source_url,
        )
        self.session.add(venue_model)
        await self.commit()

        return VenueResult(
            id=venue_model.id,
            **venue.model_dump(exclude={"id"}),
        )

    async def find_by_name_and_city(self, name: str, city: str) -> VenueResult | None:
        """Find a venue by name and city."""
        from botsware.db.models import Venue

        stmt = select(Venue).where((Venue.name == name) & (Venue.city == city))
        result = await self.session.execute(stmt)
        venue_model = result.scalar_one_or_none()

        if not venue_model:
            return None

        return VenueResult(
            id=venue_model.id,
            name=venue_model.name,
            city=venue_model.city,
            capacity=venue_model.capacity,
            genre_tags=venue_model.genre_tags,
            contact_email=venue_model.contact_email,
            booker_name=venue_model.booker_name,
            relevance_score=venue_model.relevance_score,
            score_rationale=venue_model.score_rationale,
            embedding=venue_model.embedding,
            source_url=venue_model.source_url,
            created_at=venue_model.created_at,
        )

    async def get_ready_to_contact(
        self, min_score: float = 0.6, limit: int = 20
    ) -> list[VenueResult]:
        """Get venues ready for outreach contact.

        Fetches venues with status='found', score >= min_score,
        sorted by relevance_score descending.

        Args:
            min_score: Minimum relevance score threshold (default 0.6)
            limit: Maximum number of venues to return (default 20)

        Returns:
            List of VenueResult sorted by score (highest first)
        """
        from botsware.db.models import Venue

        stmt = (
            select(Venue)
            .where(Venue.relevance_score >= min_score)
            .order_by(Venue.relevance_score.desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        venue_models = result.scalars().all()

        return [
            VenueResult(
                id=v.id,
                name=v.name,
                city=v.city,
                capacity=v.capacity,
                genre_tags=v.genre_tags,
                contact_email=v.contact_email,
                booker_name=v.booker_name,
                relevance_score=v.relevance_score,
                score_rationale=v.score_rationale,
                embedding=v.embedding,
                source_url=v.source_url,
                created_at=v.created_at,
            )
            for v in venue_models
        ]

    async def get_venue_count_by_city(self) -> dict[str, int]:
        """Get count of venues by city.

        Returns:
            Dictionary mapping city names to venue counts
        """
        from sqlalchemy import func

        from botsware.db.models import Venue

        stmt = select(Venue.city, func.count(Venue.id)).group_by(Venue.city)
        result = await self.session.execute(stmt)
        rows = result.all()

        return {city: count for city, count in rows if city}


class TaskRepository(BaseRepository):
    """Repository for task operations."""

    async def create_task(
        self, task_type: str, venue_id: int, payload: dict, expires_in_days: int = 7
    ) -> dict:
        """Create a new task with auto-expiration.

        Args:
            task_type: Task type (send_email, review_venue, etc.)
            venue_id: Associated venue ID
            payload: Task-specific payload
            expires_in_days: Days until task expires (default 7)

        Returns:
            Dictionary with created task data including ID.
        """
        from botsware.db.models import Task

        task = Task(
            type=task_type,
            status=TaskStatus.awaiting_human.value,
            venue_id=venue_id,
            payload=payload,
            expires_at=datetime.now(tz=datetime.UTC) + timedelta(days=expires_in_days),
        )
        self.session.add(task)
        await self.commit()

        return {
            "id": task.id,
            "type": task.type,
            "venue_id": task.venue_id,
            "status": task.status,
            "expires_at": task.expires_at,
        }

    async def find_awaiting_human(self) -> list[dict]:
        """Find all tasks awaiting human review."""
        from botsware.db.models import Task

        stmt = select(Task).where(Task.status == TaskStatus.awaiting_human.value)
        result = await self.session.execute(stmt)
        tasks = result.scalars().all()

        return [
            {
                "id": t.id,
                "type": t.type,
                "venue_id": t.venue_id,
                "expires_at": t.expires_at,
                "reminder_count": t.reminder_count,
            }
            for t in tasks
        ]

    async def update_task_status(self, task_id: int, status: TaskStatus) -> None:
        """Update a task's status."""
        from botsware.db.models import Task

        stmt = update(Task).where(Task.id == task_id).values(status=status.value)
        await self.session.execute(stmt)
        await self.commit()

    async def increment_reminder_count(self, task_id: int) -> None:
        """Increment task reminder count."""
        from botsware.db.models import Task

        stmt = update(Task).where(Task.id == task_id).values(reminder_count=Task.reminder_count + 1)
        await self.session.execute(stmt)
        await self.commit()


class SearchScheduleRepository(BaseRepository):
    """Repository for search schedules."""

    async def find_all_active(self) -> list[dict]:
        """Find all active search schedules."""
        from botsware.db.models import SearchSchedule

        stmt = select(SearchSchedule)
        result = await self.session.execute(stmt)
        schedules = result.scalars().all()

        return [
            {
                "id": s.id,
                "cron_expr": s.cron_expr,
                "query": s.query,
                "region": s.region,
            }
            for s in schedules
        ]
