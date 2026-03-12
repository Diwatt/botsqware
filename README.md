# Botsware

This repository contains the skeleton for the **botsware** Python project. It provides the basic folder structure and configuration needed to start building an agent that uses:

- **FastAPI** for the webhook server
- **Pydantic AI** for agent orchestration
- **PostgreSQL with pgvector** for vector storage
- **Redis** for conversation state
- **APScheduler** for scheduling tasks
- **Twilio** for WhatsApp integration


## 📁 Structure

The package itself lives under `botsware/` with subpackages for `db`, `api`, `services`, `agents`, `storage`, `state`, and `tasks`. All modules are initialized but contain no business logic yet.

## 🚀 Getting Started

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Run `docker-compose up` to start PostgreSQL, Redis, and pgvector.
3. Install dependencies using your chosen package manager (uv). Example:
   ```bash
   uv install
   ```
4. Start the development server:
   ```bash
   uv run botsware.main:app --reload
   ```

Further implementation details can be added as the project grows.

## ⏱️ Scheduler & Expiry Worker

The application uses ``APScheduler`` to run background jobs during the
FastAPI lifespan.  Two important recurring tasks are provided out of the
box:

* **Hourly expiry checker** – scans ``tasks`` for items awaiting human
  review, sends WhatsApp reminders when three days remain, and marks
  tasks expired when the deadline passes.
* **Scheduled searches** – reads the ``search_schedules`` table and
  triggers the gig agent according to cron expressions (new schedules can
  be parsed from natural-language prompts).

Supporting modules are located in ``botsware/services/`` (``scheduler.py``,
``expiry_worker.py`` and ``schedule_parser.py``).
