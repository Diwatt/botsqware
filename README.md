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

## TypeScript Duplicate (Hono + Bun)

TypeScript duplicate of the current webhook bot using:

- Hono
- Vercel AI SDK
- Bun for dependency management and runtime

## Prerequisites

 - Bun runtime

Install Bun on macOS/Linux:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Setup

```bash
bun install
cp .env.example .env
```

## Environment Variables

- `PORT` (default: `8000`)
- `LOG_LEVEL` (default: `info`)
- `LLM_BASE_URL` (default: `http://192.168.7.115:8001/v1`)
- `LLM_MODEL` (default: `qwen3.5-9b`)
- `LLM_API_KEY` (default: `not-needed`)
- `WAHA_BASE_URL` (default: `http://localhost:3000`)
- `WAHA_SESSION` (default: `default`)
- `GROUP_ID` (default: empty, no group filter)

## Run

Development (watch mode):

```bash
bun run dev
```

Production-like run:

```bash
bun run start
```

Type check:

```bash
bun run typecheck
```

Build:

```bash
bun run build
```

## API

- `GET /health`
- `POST /webhooks/whatsapp`

The webhook mirrors Python behavior:

- ignores non-`message` events
- ignores `fromMe = true`
- optionally filters by `GROUP_ID`
- calls WAHA `sendSeen`
- queries LLM using Vercel AI SDK
- simulates typing and sends reply via WAHA
