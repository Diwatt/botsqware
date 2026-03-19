---
applyTo: "botsqware/**/*.py"
title: "MCP-Enhanced Development Standards"
description: "Standards for using Model Context Protocol (MCP) tools to verify architecture and database integrity before refactoring or database operations."
---

# MCP Standards: Real-time Environment Awareness

> This standard extends the base architecture standards in `standard.instructions.md` by integrating Model Context Protocol (MCP) tools to eliminate hallucinations and ensure real-time consistency with the actual codebase and database state.

---

## 1. MANDATORY PRE-REFACTOR VERIFICATION RULE

**Before proposing ANY refactor, database query, or architectural change:**

1. **Database Schema Verification** (Always execute first)
   - Use the `postgres-database` MCP server to inspect current schema
   - Execute: `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name;`
   - Verify against [botsqware/db/models.py](../../botsqware/db/models.py) to detect drift
   - Check for pending migrations in [migrations/versions/](../../migrations/versions/)

2. **File Structure Verification**
   - Use the `filesystem-workspace` MCP server
   - Verify directory structure matches Domain-Driven Design pattern (see: `standard.instructions.md` Section 1)
   - Scan for violations: catch-all modules (`utils.py`, `helpers.py`, `common.py`)
   - Confirm one-class-per-file principle in all Python files

3. **Dependency Validation**
   - Use the `fetch-documentation` MCP server
   - Verify current versions of core dependencies from `pyproject.toml`:
     - FastAPI (current: >=0.95.0)
     - SQLAlchemy (current: >=2.0.0)
     - Pydantic (current: >=2.6.0)
     - asyncpg (current: >=0.27.0)
   - Check for breaking changes in minor version upgrades
   - Verify async/await compatibility with all external library calls

4. **Git History Context**
   - Use the `git-repository` MCP server
   - Query recent commits affecting the code area being refactored
   - Review past decisions and related PRs using `git log --oneline --grep="keyword"`

---

## 2. MCP SERVER CONFIGURATION

Add to `.vscode/settings.json` under `mcpServers` block:

```json
{
  "mcpServers": {
    "postgres-database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://botsware:password@localhost:5432/botsware"]
    },
    "fetch-documentation": {
      "command": "uvx",
      "args": ["mcp-server-fetch"]
    },
    "filesystem-workspace": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/florian/www/botsqware"]
    },
    "git-repository": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/Users/florian/www/botsqware"]
    }
  }
}
```

---

## 3. DATABASE SCHEMA INSPECTION QUERIES

### Quick Schema Check
```sql
-- View all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View table structure (example for 'message' table)
SELECT column_name, data_type, is_nullable FROM information_schema.columns 
WHERE table_name = 'message' ORDER BY ordinal_position;

-- View relationships (foreign keys)
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';
```

### Pre-Query Verification
Before executing ANY query modifier (INSERT, UPDATE, DELETE):
1. Fetch schema with `postgres-database` MCP
2. Verify column names and types match model in [botsqware/db/models.py](../../botsqware/db/models.py)
3. Check for NOT NULL constraints
4. Inspect foreign key relationships
5. Confirm async context compatibility

---

## 4. REFACTORING CHECKLIST

Before proposing code changes:

- [ ] **Database**: Ran schema verification query and confirmed no drift from models
- [ ] **Files**: Verified no catch-all modules (utils, helpers) exist in affected area
- [ ] **Classes**: Confirmed one-class-per-file rule in all modified files
- [ ] **Imports**: Checked dependency direction (no upward imports from models)
- [ ] **Docs**: Fetched latest docs for any external library changes
- [ ] **Git**: Reviewed git history for context on similar refactors
- [ ] **Tests**: Confirmed test patterns in [pyproject.toml](../../pyproject.toml) pytest section

---

## 5. COMMON VERIFICATION PATTERNS

### Pattern: Adding a new database column
```
1. Use postgres-database MCP: Fetch current table structure
2. Check if migration exists in migrations/versions/
3. Use filesystem-workspace MCP: Verify models.py doesn't already define the field
4. Use fetch-documentation MCP: Check SQLAlchemy docs for type requirements
5. Propose migration + model update with evidence
```

### Pattern: Refactoring an existing service
```
1. Use filesystem-workspace MCP: List all files in affected module
2. Use git-repository MCP: Get git blame for functions being changed
3. Use fetch-documentation MCP: Verify FastAPI versions for any decorator changes
4. Use postgres-database MCP: Check for any DB-dependent code paths
5. Propose refactor with file-by-file diff
```

### Pattern: Query optimization
```
1. Use postgres-database MCP: EXPLAIN ANALYZE the current query
2. Use fetch-documentation MCP: Check asyncpg connection pooling best practices
3. Use filesystem-workspace MCP: Find where query is called
4. Propose optimized query with performance metrics
```

---

## 6. ERROR PREVENTION

### Hallucination Prevention
- **Never assume** file/table names — always verify via MCP first
- **Never propose** database changes without schema inspection
- **Never modify** imports without checking dependency graph

### Breaking Changes
- Always fetch latest docs before suggesting library upgrades
- Run git history check before major refactors
- Cross-reference models.py with actual database schema

---

## 7. ENVIRONMENT DETAILS

**Project**: botsqware (WhatsApp bot with FastAPI, PostgreSQL, LLM integration)
**Python**: 3.11+
**Database**: PostgreSQL (asyncpg driver)
**Key Dependencies**:
- FastAPI >=0.95.0
- SQLAlchemy >=2.0.0
- Pydantic >=2.6.0
- asyncpg >=0.27.0
- litellm >=1.0.0
- pgvector >=0.2.0

**Database URL**: `postgresql://botsware:password@localhost:5432/botsware`
**Workspace Root**: `/Users/florian/www/botsqware`

---

## 8. FEEDBACK LOOP

After each MCP-assisted refactor:
1. Document what MCP tools caught that human review missed
2. Update this standard if new patterns emerge
3. Add new verification queries if database schema evolves
