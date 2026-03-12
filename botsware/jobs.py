"""Background job definitions for the scheduler.

Jobs are organized as classes following the Strategy pattern, making them
easy to test and extend.
"""

from datetime import datetime, timedelta

from botsware.container import get_container
from botsware.db.session import AsyncSessionLocal


class ExpirationJob:
    """Background job for checking and handling task expirations."""

    async def execute(self) -> None:
        """Check expired tasks and send reminders via notification service."""
        container = get_container()
        notification = container.notification_service

        async with AsyncSessionLocal() as session:
            task_repo = container.get_task_repository(session)
            tasks = await task_repo.find_awaiting_human()

        now = datetime.now(tz=datetime.UTC)
        for task in tasks:
            expires_at = task["expires_at"]
            if expires_at is None:
                continue

            delta = expires_at - now
            recipient = "whatsapp:+0000000000"

            if delta <= timedelta(0):
                # Mark as expired
                async with AsyncSessionLocal() as session:
                    task_repo = container.get_task_repository(session)
                    from botsware.schemas import TaskStatus

                    await task_repo.update_task_status(task["id"], TaskStatus.expired)

                await notification.send_whatsapp(
                    to=recipient,
                    body="Your task has expired. Reply 'reopen' to reactivate it.",
                )
            elif delta <= timedelta(days=3) and task["reminder_count"] < 3:
                # Send reminder
                async with AsyncSessionLocal() as session:
                    task_repo = container.get_task_repository(session)
                    await task_repo.increment_reminder_count(task["id"])

                await notification.send_whatsapp(
                    to=recipient,
                    body=(
                        f"Reminder: you have {delta.days} day(s) left to take action on "
                        "your task. Reply 'reopen' if you need more time."
                    ),
                )


class ScheduledSearchJob:
    """Background job for executing scheduled searches."""

    async def execute(self) -> None:
        """Load schedules and trigger agent if cron matches."""
        from croniter import croniter

        from botsware.agents.gig_agent import GigAgent
        from botsware.schemas import load_band_profile

        container = get_container()
        now = datetime.now(tz=datetime.UTC)

        async with AsyncSessionLocal() as session:
            schedule_repo = container.get_search_schedule_repository(session)
            schedules = await schedule_repo.find_all_active()

        band_profile = load_band_profile()

        for schedule in schedules:
            try:
                if croniter.match(schedule["cron_expr"], now):
                    agent = GigAgent()
                    await agent.run(
                        query=schedule["query"],
                        city=schedule["region"] or "",
                        max_capacity=0,
                        band_profile=band_profile.model_dump(),
                    )
            except Exception:
                # Log and continue
                pass
