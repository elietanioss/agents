# GSD Planner KB 02 — Task Breakdown & Dependency Graph

Load this chunk for: how to write an individual task (anatomy, sizing, specificity), and how to build the dependency graph / wave structure across tasks.

<task_breakdown>

## Task Anatomy

Every task has four required fields:

**<files>:** Exact file paths created or modified.
- Good: `src/app/api/auth/login/route.ts`, `prisma/schema.prisma`
- Bad: "the auth files", "relevant components"

**<action>:** Specific implementation instructions, including what to avoid and WHY.
- Good: "Create POST endpoint accepting {email, password}, validates using bcrypt against User table, returns JWT in httpOnly cookie with 15-min expiry. Use jose library (not jsonwebtoken - CommonJS issues with Edge runtime)."
- Bad: "Add authentication", "Make login work"

**<verify>:** How to prove the task is complete.
- Good: `npm test` passes, `curl -X POST /api/auth/login` returns 200 with Set-Cookie header
- Bad: "It works", "Looks good"

**<done>:** Acceptance criteria - measurable state of completion.
- Good: "Valid credentials return 200 + JWT cookie, invalid credentials return 401"
- Bad: "Authentication is complete"

## Task Types

| Type | Use For | Autonomy |
|------|---------|----------|
| `auto` | Everything Claude can do independently | Fully autonomous |
| `checkpoint:human-verify` | Visual/functional verification | Pauses for user |
| `checkpoint:decision` | Implementation choices | Pauses for user |
| `checkpoint:human-action` | Truly unavoidable manual steps (rare) | Pauses for user |

**Automation-first rule:** If Claude CAN do it via CLI/API, Claude MUST do it. Checkpoints are for verification AFTER automation, not for manual work.

## Task Sizing

Each task should take Claude **15-60 minutes** to execute. This calibrates granularity:

| Duration | Action |
|----------|--------|
| < 15 min | Too small — combine with related task |
| 15-60 min | Right size — single focused unit of work |
| > 60 min | Too large — split into smaller tasks |

**Signals a task is too large:**
- Touches more than 3-5 files
- Has multiple distinct "chunks" of work
- You'd naturally take a break partway through
- The <action> section is more than a paragraph

**Signals tasks should be combined:**
- One task just sets up for the next
- Separate tasks touch the same file
- Neither task is meaningful alone

## Specificity Examples

Tasks must be specific enough for clean execution. Compare:

| TOO VAGUE | JUST RIGHT |
|-----------|------------|
| "Add authentication" | "Add JWT auth with refresh rotation using jose library, store in httpOnly cookie, 15min access / 7day refresh" |
| "Create the API" | "Create POST /api/projects endpoint accepting {name, description}, validates name length 3-50 chars, returns 201 with project object" |
| "Style the dashboard" | "Add Tailwind classes to Dashboard.tsx: grid layout (3 cols on lg, 1 on mobile), card shadows, hover states on action buttons" |
| "Handle errors" | "Wrap API calls in try/catch, return {error: string} on 4xx/5xx, show toast via sonner on client" |
| "Set up the database" | "Add User and Project models to schema.prisma with UUID ids, email unique constraint, createdAt/updatedAt timestamps, run prisma db push" |

**The test:** Could a different Claude instance execute this task without asking clarifying questions? If not, add specificity.

## TDD Detection Heuristic

For each potential task, evaluate TDD fit:

**Heuristic:** Can you write `expect(fn(input)).toBe(output)` before writing `fn`?
- Yes: Create a dedicated TDD plan for this feature
- No: Standard task in standard plan

**TDD candidates (create dedicated TDD plans):**
- Business logic with defined inputs/outputs
- API endpoints with request/response contracts
- Data transformations, parsing, formatting
- Validation rules and constraints
- Algorithms with testable behavior
- State machines and workflows

**Standard tasks (remain in standard plans):**
- UI layout, styling, visual components
- Configuration changes
- Glue code connecting existing components
- One-off scripts and migrations
- Simple CRUD with no business logic

**Why TDD gets its own plan:** TDD requires 2-3 execution cycles (RED -> GREEN -> REFACTOR), consuming 40-50% context for a single feature. Embedding in multi-task plans degrades quality.

## User Setup Detection

For tasks involving external services, identify human-required configuration:

External service indicators:
- New SDK: `stripe`, `@sendgrid/mail`, `twilio`, `openai`, `@supabase/supabase-js`
- Webhook handlers: Files in `**/webhooks/**`
- OAuth integration: Social login, third-party auth
- API keys: Code referencing `process.env.SERVICE_*` patterns

For each external service, determine:
1. **Env vars needed** - What secrets must be retrieved from dashboards?
2. **Account setup** - Does user need to create an account?
3. **Dashboard config** - What must be configured in external UI?

Record in `user_setup` frontmatter. Only include what Claude literally cannot do (account creation, secret retrieval, dashboard config).

**Important:** User setup info goes in frontmatter ONLY. Do NOT surface it in your planning output or show setup tables to users. The execute-plan workflow handles presenting this at the right time (after automation completes).

</task_breakdown>

<dependency_graph>

## Building the Dependency Graph

**For each task identified, record:**
- `needs`: What must exist before this task runs (files, types, prior task outputs)
- `creates`: What this task produces (files, types, exports)
- `has_checkpoint`: Does this task require user interaction?

**Dependency graph construction:**

```
Example with 6 tasks:

Task A (User model): needs nothing, creates src/models/user.ts
Task B (Product model): needs nothing, creates src/models/product.ts
Task C (User API): needs Task A, creates src/api/users.ts
Task D (Product API): needs Task B, creates src/api/products.ts
Task E (Dashboard): needs Task C + D, creates src/components/Dashboard.tsx
Task F (Verify UI): checkpoint:human-verify, needs Task E

Graph:
  A --> C --\
              --> E --> F
  B --> D --/

Wave analysis:
  Wave 1: A, B (independent roots)
  Wave 2: C, D (depend only on Wave 1)
  Wave 3: E (depends on Wave 2)
  Wave 4: F (checkpoint, depends on Wave 3)
```

## Vertical Slices vs Horizontal Layers

**Vertical slices (PREFER):**
```
Plan 01: User feature (model + API + UI)
Plan 02: Product feature (model + API + UI)
Plan 03: Order feature (model + API + UI)
```
Result: All three can run in parallel (Wave 1)

**Horizontal layers (AVOID):**
```
Plan 01: Create User model, Product model, Order model
Plan 02: Create User API, Product API, Order API
Plan 03: Create User UI, Product UI, Order UI
```
Result: Fully sequential (02 needs 01, 03 needs 02)

**When vertical slices work:**
- Features are independent (no shared types/data)
- Each slice is self-contained
- No cross-feature dependencies

**When horizontal layers are necessary:**
- Shared foundation required (auth before protected features)
- Genuine type dependencies (Order needs User type)
- Infrastructure setup (database before all features)

## File Ownership for Parallel Execution

Exclusive file ownership prevents conflicts:

```yaml
# Plan 01 frontmatter
files_modified: [src/models/user.ts, src/api/users.ts]

# Plan 02 frontmatter (no overlap = parallel)
files_modified: [src/models/product.ts, src/api/products.ts]
```

No overlap -> can run parallel.

If file appears in multiple plans: Later plan depends on earlier (by plan number).

</dependency_graph>
