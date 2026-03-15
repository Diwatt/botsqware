FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies
RUN uv sync --frozen --no-editable

# Copy application
COPY botsqware ./botsqware
COPY migrations ./migrations
COPY alembic.ini ./

# Expose port
EXPOSE 8000

# Run FastAPI
CMD ["uv", "run", "uvicorn", "botsqware.main:app", "--host", "0.0.0.0", "--port", "8000"]
