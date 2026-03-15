.PHONY: setup start dev stop logs db-shell migrate migration health test-webhook clean

# ──── First-time setup ────────────────────────────────────────────────────────
setup:
	uv sync
	docker compose up -d postgres
	@sleep 5
	uv run alembic upgrade head

# ──── Development (FastAPI local, Docker services) ────────────────────────────
# Starts Postgres + FastAPI (hot reload). If you want LLM + WAHA, use dev-full.
dev:
	docker compose up -d postgres
	@sleep 2
	uv run uvicorn botsqware.main:app --reload --port 8000

model-run:
	docker model run -d ai/qwen2.5:7B-Q4_K_M

model-stop:
	@docker ps -q --filter "ancestor=ai/qwen2.5:7B-Q4_K_M" | xargs -r docker rm -f

dev-full:
	docker compose down --remove-orphans
	docker compose up -d postgres waha
	@sleep 5
	$(MAKE) model-run
	@pkill -f uvicorn || true
	uv run uvicorn botsqware.main:app --reload --port 8000

# ──── Production (everything in Docker) ───────────────────────────────────────
start:
	docker compose up -d

# ──── Stop services ──────────────────────────────────────────────────────────
stop:
	docker compose down

# ──── Database utilities ─────────────────────────────────────────────────────
db-shell:
	docker compose exec postgres psql -U botsware -d botsware

migrate:
	uv run alembic upgrade head

migration:
	uv run alembic revision --autogenerate -m "$(name)"

# ──── WAHA utilities ──────────────────────────────────────────────────────────
waha-dashboard:
	open http://localhost:3000/dashboard

waha-get-chats:
	curl -s 'http://localhost:3000/api/chats?session=default' | python3 -m json.tool

# ──── Health checks and debugging ─────────────────────────────────────────────
health:
	curl -s http://localhost:8000/health | python3 -m json.tool

test-webhook:
	curl -s -X POST http://localhost:8000/webhooks/whatsapp \
	  -H 'Content-Type: application/json' \
	  -d '{"event":"message","session":"default","payload":{"id":"test_001","timestamp":1234567890,"from":"120363000000000@g.us","fromMe":false,"body":"bonjour","_data":{"notifyName":"Thomas"}}}' \
	  | python3 -m json.tool

logs:
	docker compose logs -f

# ──── Cleanup ─────────────────────────────────────────────────────────────────
clean:
	docker compose down -v
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
