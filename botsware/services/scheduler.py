"""Scheduler setup and management using APScheduler.

Scheduler is initialized during application startup and manages recurring
background jobs for task expiration checks and scheduled venue searches.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from botsware.container import get_container
from botsware.db.session import AsyncSessionLocal
from botsware.jobs import ExpirationJob, ScheduledSearchJob

scheduler = AsyncIOScheduler()


async def load_scheduled_searches() -> None:
    """Load search schedules from database and register as cron jobs.

    Called during application startup. If a schedule is already registered,
    it will be skipped (idempotent).
    """
    container = get_container()

    async with AsyncSessionLocal() as session:
        schedule_repo = container.get_search_schedule_repository(session)
        schedules = await schedule_repo.find_all_active()

    for schedule in schedules:
        job_id = f"search_{schedule['id']}"
        if scheduler.get_job(job_id) is not None:
            continue

        try:
            trigger = CronTrigger.from_crontab(schedule["cron_expr"])
        except ValueError:
            continue

        search_job = ScheduledSearchJob()
        scheduler.add_job(
            search_job.execute,
            trigger=trigger,
            id=job_id,
            name=f"search {schedule['query']} in {schedule['region']}",
        )


# Register core recurring jobs
expiry_job = ExpirationJob()
scheduler.add_job(
    expiry_job.execute, "cron", minute=0, id="expiry_checker", name="Check expired tasks"
)

search_job = ScheduledSearchJob()
scheduler.add_job(
    search_job.execute,
    "interval",
    minutes=1,
    id="scheduled_search_runner",
    name="Run scheduled searches",
)
