---
applyTo: "botsware/**/*.py"
---

# Standards: Architecture & OOP (Domain-Driven Design)

> Generated code under `botsware/` must comply with these standards.
> Formatting, naming, imports, and type hints are enforced by **Ruff** (linter/formatter) — see `ruff.toml` or `pyproject.toml`.

---

## 1. Folder Structure (Domain-Driven Design)

| Folder | Purpose |
|--------|---------|
| **`botsware/`** | Root package. |
| **`botsware/api/`** | HTTP endpoints (webhooks, health checks). Routes delegate to services. Import from `botsware.api`. |
| **`botsware/agents/`** | Orchestration agents (stateless command executors). Contain tool definitions. Import from `botsware.agents`. |
| **`botsware/container.py`** | Dependency injection container. All singletons and service factories. |
| **`botsware/db/`** | Data persistence layer. Models (ORM), repositories, session management. Import from `botsware.db`. |
| **`botsware/db/models.py`** | SQLAlchemy ORM entities. One logical entity per class. |
| **`botsware/db/repositories.py`** | Repository classes (one per entity). Data access abstraction. |
| **`botsware/db/session.py`** | Async session and engine setup. Dependency for routes. |
| **`botsware/jobs.py`** | Background job classes for scheduler (Strategy pattern). |
| **`botsware/schemas.py`** | Pydantic models for validation and serialization. |
| **`botsware/services/`** | Service abstractions and implementations (Twilio, Redis, etc.). Import from `botsware.services`. |
| **`botsware/services/base_services.py`** | Abstract base classes (ABC) for external services. |
| **`botsware/services/scheduler.py`** | APScheduler setup. Job registration. |
| **`botsware/config.py`** | Pydantic Settings for environment variables. |
| **`botsware/main.py`** | FastAPI application, startup/shutdown events, middleware. |

**Dependency Direction:**
```
API Route
  ↓
Agent / Service
  ↓
Repository / Base Service
  ↓
ORM Model / External Client
```

- Never skip a layer (API should not directly import models).
- Never import upward (models do not import agents).
- Always use domain barrel exports (`from botsware.services import NotificationService`).

---

## 2. Class Structure (CRITICAL)

### 2.1 One Class Per File

- **Filename must match class name exactly** (e.g., `VenueRepository` → `venue_repository.py`).
- **Exception:** Constants, enums, and type aliases may live in the same file as the main class.
- **Exception for packages:** `__init__.py` may export classes from submodules (barrel pattern).

### 2.2 No "Utils" Modules

- **NO:** `utils.py`, `helpers.py`, `common.py`, or standalone functions.
- **YES:** Logic belongs to a class (Service, Repository, Agent, etc.).
- **Pattern:** If you have a utility function, ask: "What is the responsibility?" Create a class for it.

### 2.3 Class Naming

- **Services:** Capability names (e.g., `NotificationService`, `VenueRepository`).
  - Do NOT append `Service` or `Repo` suffix to nouns; it should be part of the class name.
  - Example: `NotificationService` (good), `Twilio` (bad for this context).
- **Repositories:** `EntityRepository` (e.g., `VenueRepository`, `TaskRepository`).
- **Abstract Base Classes:** `AbstractClass` or `ClassName` with `@abstractmethod`.
  - Example: `NotificationService`, `StateService` (both abstract if they define interface).
- **Enums:** `EntityStatus`, `EntityType` (PascalCase, same as classes).

### 2.4 Dependency Injection

- **Constructor Injection:** All external dependencies via `__init__`.
  ```python
  class VenueRepository:
      def __init__(self, session: AsyncSession):
          self.session = session
  ```
- **Container Only at Boundaries:** Only FastAPI route handlers, job executors, and app startup use the container directly.
  ```python
  @app.on_event("startup")
  async def startup():
      container = init_container(settings)
      # ...
  ```
- **No Direct Imports of Singletons:** Do not `from botsware.services import notification_service`. Use container instead.
- **Testability:** Mock by injecting a test double at boundaries.

### 2.5 No Object Literals as Class State

- **NO:** Module-level dicts, lists, or config objects.
- **YES:** Use Pydantic models (`BandProfile`, `Settings`) or classes with properties.

---

## 3. Member Ordering (PEP 8 + Type Hints)

**Order within class:**

1. **Class variables** (with type hints).
   ```python
   class MyClass:
       class_var: str = "default"
   ```

2. **`__init__` and other special methods** (`__str__`, `__repr__`, etc.).
   ```python
   def __init__(self, name: str) -> None:
       self.name = name
   ```

3. **Public properties and methods** (alphabetically).
   ```python
   @property
   def full_name(self) -> str:
       return f"{self.first} {self.last}"
   
   async def do_something(self) -> None:
       pass
   ```

4. **Protected methods** (prefix `_`, alphabetically).
   ```python
   async def _internal_process(self) -> None:
       pass
   ```

5. **Private methods** (prefix `__`, alphabetically; Python name-mangles, use sparingly).

**One statement per line for multi-assignment is discouraged:**
```python
# NO
x, y = 1, 2

# YES
x = 1
y = 2
```

---

## 4. Type Hints (PEP 484)

**All functions and methods must have type hints:**

```python
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession

async def save_venue(
    self,
    venue: VenueResult,
    session: AsyncSession,
) -> VenueResult:
    """Save a venue and return it with assigned ID."""
    pass

def calculate_score(ratings: List[float]) -> float:
    """Calculate average score from a list of ratings."""
    return sum(ratings) / len(ratings) if ratings else 0.0
```

**Return type for async functions:**
```python
async def my_async_func(x: int) -> Dict[str, Any]:
    return {"result": x * 2}
```

**Use `Optional[T]` for nullable values:**
```python
def find_by_id(self, id: int) -> Optional[VenueResult]:
    """Return venue or None if not found."""
    pass
```

**Use `|` syntax (Python 3.10+) or `Union` for multiple types:**
```python
# Python 3.10+
def process(value: str | int) -> None:
    pass

# Python 3.9 and earlier
from typing import Union
def process(value: Union[str, int]) -> None:
    pass
```

---

## 5. Naming Conventions (Non-Automatable)

> **PEP 8–compliant naming. Enforced by Ruff where marked with (auto).**

| Target | Convention | Example |
|--------|-----------|---------|
| Modules | `snake_case` | `venue_repository.py`, `notification_service.py` |
| Classes | `PascalCase` (auto) | `VenueRepository`, `NotificationService` |
| Functions | `snake_case` (auto) | `get_venue_by_id()`, `send_notification()` |
| Constants | `SCREAMING_SNAKE_CASE` (auto) | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| Variables | `snake_case` (auto) | `venue_id`, `is_active` |
| Private/Protected | `_snake_case` (auto) | `_internal_cache`, `__private_var` |
| Type Variables | `T`, `U`, `K`, `V` | `from typing import TypeVar; T = TypeVar("T")` |
| Enums | `PascalCase.member_name` (auto) | `TaskStatus.pending`, `TaskType.send_email` |

**No abbreviations** (except common ones: `id`, `db`, `api`):
- ❌ `num_venues` → ✅ `venue_count`
- ❌ `calc_avg` → ✅ `calculate_average`
- ❌ `pk`, `fk` → ✅ `primary_key`, `foreign_key`

**Domain-relevant naming:**
- Do NOT repeat the folder name in the class (e.g., in `repository.py`, use `VenueRepository`, not `VenueRepositoryRepository`).
- Use full words that convey intent.

---

## 6. Docstrings (PEP 257 + Google Style)

**Module docstring:**
```python
"""Module for managing venue data access.

This module provides repository classes for CRUD operations on venues,
including deduplication via pgvector similarity.
"""
```

**Class docstring:**
```python
class VenueRepository(BaseRepository):
    """Repository for venue entity CRUD operations.
    
    Handles saving, retrieving, and deduplicating venues using
    pgvector cosine similarity.
    """
```

**Method/function docstring (only if non-obvious):**
```python
async def find_by_similarity(
    self,
    embedding: List[float],
    threshold: float = 0.9,
) -> Optional[VenueResult]:
    """Find a venue by embedding similarity.
    
    Uses pgvector's cosine distance to detect duplicates.
    
    Args:
        embedding: 1536-dimensional vector from embedding model.
        threshold: Similarity threshold for match (default 0.9).
    
    Returns:
        VenueResult if match found, None otherwise.
    """
    pass
```

**Simple methods: No docstring needed if the signature is self-documenting.**
```python
def is_expired(self) -> bool:
    return datetime.utcnow() > self.expires_at
```

---

## 7. Dependencies & Imports

**Standard library first, then third-party, then local (PEP 8):**
```python
from typing import Optional, List
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from botsware.db.repositories import VenueRepository
from botsware.schemas import VenueResult
```

**Never:**
- Relative imports (use absolute: `from botsware.db import ...`).
- Circular imports (reorganize to break cycles).
- Star imports (`from module import *`).

---

## 8. Async/Await (PEP 492)

**All I/O must be async:**
```python
# Database access
async with AsyncSessionLocal() as session:
    venue = await session.execute(query)

# External service calls
await notification_service.send_whatsapp(to, body)

# Background jobs
async def execute(self) -> None:
    await self._do_work()
```

**Never block the event loop:**
```python
# NO
import time
time.sleep(5)  # Blocks event loop!

# YES
import asyncio
await asyncio.sleep(5)
```

---

## 9. Service Container (Dependency Injection)

**All singletons and factories in `container.py`:**

```python
class Container:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._notification_service: Optional[NotificationService] = None

    @property
    def notification_service(self) -> NotificationService:
        if self._notification_service is None:
            self._notification_service = TwilioNotificationService(...)
        return self._notification_service
    
    def get_venue_repository(self, session: AsyncSession) -> VenueRepository:
        return VenueRepository(session)

# Global instance
_container: Optional[Container] = None

def get_container() -> Container:
    if _container is None:
        raise RuntimeError("Container not initialized")
    return _container

def init_container(settings: Settings) -> Container:
    global _container
    _container = Container(settings)
    return _container
```

**Usage in routes:**
```python
@app.get("/something")
async def route(session: AsyncSession = Depends(get_db_session)) -> dict:
    container = get_container()
    venue_repo = container.get_venue_repository(session)
    # ... use repo
```

---

## 10. Logging (Python Logging Module)

**Use `logging`, not print():**

```python
import logging

logger = logging.getLogger(__name__)

class VenueRepository:
    async def save_venue(self, venue: VenueResult) -> VenueResult:
        try:
            # ...
            logger.info(f"Saved venue: {venue.id}")
        except Exception as e:
            logger.error(f"Failed to save venue: {str(e)}", exc_info=True)
            raise
```

**Levels:**
- `logger.debug()` — Dev tracing.
- `logger.info()` — Significant events.
- `logger.warning()` — Recoverable issues.
- `logger.error()` — Errors (with context).
- `logger.critical()` — System failures.

**No timestamps in log messages** — the logging framework handles it.

---

## 11. Abstract Base Classes (ABC)

**Use `abc` module for service interfaces:**

```python
from abc import ABC, abstractmethod

class NotificationService(ABC):
    """Abstract notification service."""
    
    @abstractmethod
    async def send_whatsapp(self, to: str, body: str) -> None:
        """Send WhatsApp message."""
        pass

class TwilioNotificationService(NotificationService):
    """Concrete Twilio implementation."""
    
    async def send_whatsapp(self, to: str, body: str) -> None:
        # Real implementation
        pass
```

---

## 12. Repository Pattern

**Every repository extends `BaseRepository`:**

```python
class BaseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def commit(self) -> None:
        await self.session.commit()

class VenueRepository(BaseRepository):
    async def save_venue(self, venue: VenueResult) -> VenueResult:
        """Persist venue and return with ID."""
        pass
    
    async def find_by_name_and_city(
        self,
        name: str,
        city: str,
    ) -> Optional[VenueResult]:
        """Query venue by name and city."""
        pass
```

---

## 13. Validation (Pydantic v2)

**All data models use Pydantic:**

```python
from pydantic import BaseModel, Field, field_validator

class VenueResult(BaseModel):
    id: Optional[int] = None
    name: str
    city: Optional[str] = None
    relevance_score: float = Field(..., ge=0.0, le=1.0)
    
    @field_validator("relevance_score", mode="before")
    def _validate_score(cls, v: Any) -> float:
        return float(v)
```

---

## 14. Testing Strategy

**All classes must be testable via DI:**

```python
# test_venue_repository.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

@pytest.fixture
async def test_session():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
    
    await engine.dispose()

@pytest.mark.asyncio
async def test_save_venue(test_session):
    repo = VenueRepository(test_session)
    venue = VenueResult(name="Club", city="Paris", relevance_score=0.85, score_rationale="Great")
    saved = await repo.save_venue(venue)
    assert saved.id is not None
```

---

## 15. Background Jobs (APScheduler)

**All jobs are classes with `async def execute()`:**

```python
class ExpirationJob:
    """Check and expire old tasks."""
    
    async def execute(self) -> None:
        container = get_container()
        # Use container to get services/repos
        pass

# Registered in scheduler
scheduler.add_job(ExpirationJob().execute, "cron", hour=0)
```

---

## 16. Environment & Configuration

**Use Pydantic Settings with `.env` file:**

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = Field(..., description="PostgreSQL URL")
    redis_url: str = Field(..., description="Redis URL")
    
    class Config:
        env_file = ".env"
        case_sensitive = False
```

**Load settings only once at startup:**
```python
@app.on_event("startup")
async def startup():
    settings = Settings()
    init_container(settings)
```

---

## 17. Error Handling

**Create custom exception classes in `botsware/exceptions.py` (or domain-specific modules):**

```python
class BotException(Exception):
    """Base exception for botsware."""
    pass

class VenueNotFound(BotException):
    """Raised when a venue cannot be found."""
    pass

class DuplicateVenueError(BotException):
    """Raised when attempting to save a duplicate venue."""
    pass
```

**Use them:**
```python
try:
    await repo.save_venue(venue)
except DuplicateVenueError as e:
    logger.warning(f"Duplicate venue skipped: {e}")
```

---

## 18. AI Assistant Workflow & Validation (CRITICAL)

### 18.1 Linting & Formatting

**Before finalizing code changes:**

1. **Ruff format:**
   ```bash
   ruff format botsware/
   ```

2. **Ruff check (linting):**
   ```bash
   ruff check botsware/ --fix
   ```

3. **Type checking (mypy):**
   ```bash
   mypy botsware/
   ```

4. **Run tests:**
   ```bash
   pytest tests/
   ```

### 18.2 Mandatory Validation After Edits

**After EVERY code edit, run:**

```bash
# Format and lint specific file
ruff format botsware/your_file.py
ruff check botsware/your_file.py --fix

# Check types
mypy botsware/your_file.py
```

**If errors appear, fix them immediately.** Do NOT leave broken code.

### 18.3 Import Organization

Run before committing:
```bash
isort botsware/  # Organizes imports
```

Or configure in `pyproject.toml`:
```toml
[tool.isort]
profile = "black"
line_length = 100
```

### 18.4 Code Quality Thresholds

- **Code coverage:** Aim for >80% on critical paths (repositories, services).
- **Cyclomatic complexity:** Keep methods <10 (split large methods).
- **Type coverage:** 100% of public APIs must have type hints.

---

## 19. Git Workflow & Commits

**Commit message format (conventional commits):**

```
feat(agents): add venue deduplication logic
fix(services): handle Twilio rate limits
refactor(db): simplify repository interface
docs(readme): update setup instructions
test(repositories): add venue equality tests
```

**Branch naming:**
```
feature/add-webhook-handler
fix/duplicate-venue-check
docs/update-architecture
```

---

## 20. Documentation

**README sections:**
- Overview & quickstart
- Folder structure & architecture
- Running locally (Docker, uv, dependencies)
- Testing
- Deployment
- Contributing guidelines

**Docstrings only for:**
- Module purpose
- Non-obvious class behavior
- Complex algorithms
- Public API boundaries

**Self-documenting code preferred:**
```python
# NO
def calc(x, y):  # calculates sum
    return x + y

# YES
def sum_ratings(base_score: float, bonus_score: float) -> float:
    return base_score + bonus_score
```

---

## Summary

This standard enforces:
✅ **SOLID principles** via abstractions, DI, single responsibility  
✅ **Python best practices** (PEP 8, 257, 484, 492)  
✅ **Testability** via constructor injection  
✅ **Maintainability** via clear architecture and naming  
✅ **Type safety** via full type hints  
✅ **Clean code** via linting and formatting  

**When in doubt, optimize for readability and testability.**
