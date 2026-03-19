---
applyTo: "*.ts"
---

# Standards: Architecture & OOP (Backend AI Agent)

> Generated code under `src/*/generated/` and BAML client output under `baml_client/` are exempt. All wrapper/application code must comply.
> Formatting, naming, imports, and visibility are enforced by **Biome** — see `biome.json`.

---

> 🔴 **CRITICAL RULE FOR IMPORTS (BUN ENVIRONMENT):**
> Do NOT explain Node.js ESM rules to me. This project runs on **Bun** with `"moduleResolution": "bundler"` and `"noEmit": true` in `tsconfig.json`. There is no `dist/` folder.
> **NEVER add `.js` or `.ts` extensions to relative imports.**
> ✅ **Correct:** `import { AppConfig } from '../Core/AppConfig';`
> ❌ **Wrong:** `import { AppConfig } from '../Core/AppConfig.js';`

---

## 1. Folder Structure (Domain-Driven Backend)

| Folder | Purpose |
|--------|---------|
| **Api/** | Hono routes and HTTP transport. Import from `@/Api`. |
| **Agent/** | Mastra AI Agent instances and configurations. One agent per file. |
| **Tools/** | Mastra Tools — strict OOP classes encapsulating agent actions. Import from `@/Tools`. |
| **Database/** | Postgres connection, pgvector setup, Prisma ORM schemas and migrations. |
| **Entity/** | Domain entities (pure data + getters/setters; no I/O). |
| **Exception/** | Custom error types. |
| **Prompt/** | BAML files (`.baml`) for prompt templates and typed LLM extraction contracts. No TS prompt strings here. |
| **Service/** | Business logic capabilities. No `*Service` suffix. |

- No top-level `utils`. Logic lives in classes.
- Dependency direction: `Api → Agent/Service → Tools → Entity → Exception`.
- Never import from a file directly if a domain barrel exists (`@/Service`, `@/Entity`, `@/Tools`, etc.).

---

## 2. OOP vs. Functional — The Critical Split (CRITICAL)

This codebase applies **different paradigms in different layers**. Mixing them is a violation.

### Domain & Services → Strict OOP

Business logic, Mastra Tools, and core service capabilities **MUST** be strict OOP:

- **One Class Per File:** Filename must match class name exactly.
  - Constants, enums, and module-level type exports are ALLOWED in the same file as their owning class.
  - DO NOT move constants/exports to separate files unless they are themselves classes.
- **No Standalone Functions:** Logic belongs to a class (`Service`, `Tool`, or `Entity`). Never define a free-standing exported function for business logic.
- **Service Naming:** Use capability names (e.g. `LeadExtraction`, `WebhookProcessor`). NEVER append `*Service`.
- **Dependency Injection:** Inject via constructor. Never instantiate a dependency inside a class body.
- **No standalone `const` object literals as module-level exports.**
  Use `export class X` with `public static readonly` members instead.
  NEVER write `export const Config = { ... } as const`.
  ALWAYS write `export class Config { public static readonly ... }`.

### Routing & Webhooks → Idiomatic Hono (Functional)

DO NOT use classes for HTTP route definitions or plugin files:

- Define routes by registering them on a single `Hono` app instance using `app.get()`, `app.post()`, etc.
- Register routes in small focused modules and wire them together at the application entrypoint.
- Prefer lightweight middleware for shared dependencies (e.g., `c.set()/c.get()`), or resolve services from `Container` in handlers.
- Validate request bodies using Zod schemas and infer types via `z.infer<>` — see Rule 3.

---

## 3. Type Inference — Zero Manual I/O Interfaces (CRITICAL)

**Never write manual `interface` or `type` definitions for API request/response payloads.**

Always define a **Zod schema** (or another runtime schema) and infer the TypeScript type from it:

```ts
// CORRECT
import { z } from 'zod';

const CreateLeadSchema = z.object({
  phoneNumber: z.string(),
  fullName: z.string(),
});

type CreateLeadPayload = z.infer<typeof CreateLeadSchema>;

// WRONG — never do this
interface CreateLeadPayload {
  phoneNumber: string;
  fullName: string;
}
```

- Validate request bodies and responses using Zod schemas (or another runtime schema) and wire validation into Hono middleware or handler logic.
- For ORM schemas (Drizzle), infer insert/select types from the table definition using `$inferInsert` / `$inferSelect`.
- For Prisma, use the generated types directly. Do not re-declare them manually.

---

## 4. Member Ordering

> Visibility keywords (`public`, `private`, `protected`) are enforced by Biome (`useConsistentMemberAccessibility`).

- **Ordering:**
  1. Properties: Static first, then Instance. Within each: `public → protected → private`, then alphabetically.
  2. Constructor / Initializers.
  3. Methods: `public → protected → private`, then alphabetically. Getters/Setters are methods.
- **One property per statement.**

---

## 5. Naming — Non-Automatable Conventions

> PascalCase for types/classes, camelCase for members, CONSTANT_CASE for global consts, and `TName` for generics are all enforced by Biome.

The following conventions require human judgment:

| Target | Convention | Example |
|--------|-----------|---------|
| Classes, Interfaces, Types | PascalCase | `AppLogger`, `LeadExtractionTool` |
| Methods, Variables, Params | camelCase | `processWebhook`, `phoneNumber` |
| Primitive constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_TIMEOUT_MS` |
| Singleton instances | `Container.camelCase` | `Container.logger`, `Container.leadExtraction` |
| Enum members | PascalCase | `MessageStatus.Delivered` |
| Abstract Classes | `Abstract` prefix | `AbstractTool` |
| Exceptions | `Exception` suffix | `WebhookValidationException` |
| Private backing fields | `_camelCase` | `_client` (behind `get client()`) |
| Hono routes | camelCase variable, exported | `export function registerWhatsAppWebhookRoutes(app: Hono) { ... }` |

- No abbreviations (`msg`, `cfg`, `req`, `res`). Use full words. Exceptions: `id`, `uid`.
- Do not repeat the folder name in identifiers (e.g. in `Tools/`, use `execute` not `toolExecute`).

---

## 6. Logging

- Use `AppLogger` instance via DI.
- No timestamps. The logger handles `dateFormat: 'time'`. Never add `new Date()`.
- No PII in logs. Log only relevant identifiers/state (e.g. `messageId`, `agentId`).

---

## 7. Backwards Compatibility & Deprecations (WIP Policy)

**Do not implement backward-compatibility layers until the code is ready for release.** During development you are free to rename APIs and refactor callers without leaving aliases or guard clauses behind.

---

## 8. Service Container

All runtime singleton instances live in `src/Core/Container.ts` as static properties of the `Container` class.

- **Access**: `Container.logger`, `Container.leadExtraction`, etc.
- **No `export const` singletons**: Never export a singleton as a module-level `const`. Use Container.
- **Primitive constants stay in domain files**: `MAX_RETRIES`, `DEFAULT_TIMEOUT_MS`, etc. remain as `CONSTANT_CASE` in their own files.
- **Constructor injection preferred**: For testability, classes receive dependencies via constructor params. `Container` is used at the edges (Hono app entry, agent bootstrapping) to wire things together.
- **No methods on Container**: It is a passive holder. No `init()`, no `dispose()`, no factories.
- **Property naming**: camelCase, no prefixes. `logger` not `appLogger`.

---

## 9. Documentation — Symfony Style

- **No JSDoc** for self-explanatory methods, constructors, or properties.
- Use JSDoc **only** for: class-level purpose, complex business logic, `@throws`, public API boundaries.
- Prefer **self-documenting code** over comments.
- Exception messages should be clear and descriptive.

---

## 10. AI Assistant Workflow & Validation (CRITICAL)

- **Linter Handling:** Do not ignore errors flagged by Biome or ESLint. Read the active file's diagnostics (the red/yellow squiggles) and preemptively fix any styling, import, or typing issues before finalizing your code response.
- **NO Terminal Formatting:** DO NOT attempt to run `bunx biome` or `bunx eslint` in the terminal after your edits. The user handles formatting locally via a dedicated macro (`Shift+Alt+S`). Your job is to provide clean code upfront, not to run formatting scripts.

---

## 11. MCP Tools (Zero-Hallucination Policy)

You have access to MCP servers. Use them proactively:
- **Context7:** ALWAYS use this tool to read the latest official documentation for `hono`, `mastra`, `drizzle-orm`, `@baml/client`, and `pgvector` before using their APIs to prevent hallucinations.
- **Sequential Thinking:** Use this tool to break down complex architectural changes, agent design decisions, or multi-step refactoring before writing the code.