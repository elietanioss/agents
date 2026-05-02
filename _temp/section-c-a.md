# Section C-A: Infrastructure Design Analysis
**Generated:** 2026-04-07
**Source:** part-b-1.md (repos 1-5: gws, ECC, ACE, Aegis, apify) + part-b-2.md (repos 6-10: autoresearch, claude-mem, gsd-2, gstack, last30days)

---

## C1: Google Workspace (gws) Integration Design

### Exact Windows Setup Steps

**Step 1 — Install Rust toolchain (required to build from source)**
```bash
winget install Rustlang.Rustup
# OR download from https://rustup.rs and run rustup-init.exe
rustup install stable
```

**Step 2 — Build the gws binary**
```bash
cd "C:\Users\User\Downloads\new repos\cli-main\cli-main"
cargo build --release
# Binary produced at: target\release\gws.exe
```

**Step 3 — Place binary on PATH**
```bash
# Copy to a directory already on PATH
copy target\release\gws.exe C:\Users\User\.local\bin\gws.exe
# OR add release dir to PATH (PowerShell, permanent)
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\User\Downloads\new repos\cli-main\cli-main\target\release", "User")
```

**Step 4 — Create Google Cloud OAuth2 credentials**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create project (or use existing)
3. Create OAuth 2.0 Client ID → Desktop Application
4. Download JSON → save as `client_secret.json`
5. Enable APIs under APIs & Services → Library: Gmail API, Drive API, Calendar API, Sheets API, etc.

**Step 5 — Run auth setup**
```bash
gws auth setup
# Interactive wizard prompts for: client_secret.json path, scopes to request
# Credentials stored encrypted (AES-256-GCM) at default config dir

gws auth login
# Opens browser for OAuth consent flow
# Tokens stored at: %USERPROFILE%\.config\gws\ (default)
# Override: set GOOGLE_WORKSPACE_CLI_CONFIG_DIR=C:\Users\User\.gws-config
```

**Step 6 — Test authentication**
```bash
gws drive files list
# Returns JSON list of Drive files — confirms auth works
```

**Environment Variables (set in System Properties or .env)**
```
GOOGLE_WORKSPACE_CLI_CONFIG_DIR=C:\Users\User\.gws-config
GOOGLE_WORKSPACE_CLI_LOG_LEVEL=info
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\User\.gws-config\service_account.json
```

**Alternative: Install via npm (no Rust required, uses pre-built binary)**
```bash
# Requires Node.js 18+
npm install -g @google-workspace/cli
# npm wrapper auto-detects Windows platform and downloads binary from GitHub Releases
gws --version
```

---

### gws SKILL.md Files → Agent Mappings

The 95 skills in `skills/` are structured SKILL.md files with YAML frontmatter and method documentation. Direct mappings to the 27-agent system:

| gws Skill | → Agent | Use Case |
|-----------|---------|----------|
| `gws-gmail/SKILL.md` | n8n-specialist | Email automation triggers for n8n workflows |
| `gws-gmail-send/SKILL.md` | n8n-specialist | Outbound notification actions in workflows |
| `gws-gmail-watch/SKILL.md` | n8n-specialist | Email webhook triggers (streaming new mail events) |
| `gws-gmail-triage/SKILL.md` | project-manager | Inbox triage for PM coordination tasks |
| `gws-calendar/SKILL.md` | project-manager | Meeting scheduling and availability queries |
| `gws-calendar-insert/SKILL.md` | project-manager | Auto-scheduling milestones and reviews |
| `gws-drive/SKILL.md` | documentation-writer | Doc organization, file listing for doc management |
| `gws-drive-upload/SKILL.md` | documentation-writer | Uploading generated docs/reports to Drive |
| `gws-docs/SKILL.md` | documentation-writer | Reading/writing Google Docs for doc generation |
| `gws-sheets/SKILL.md` | database-architect | Spreadsheet as lightweight data store |
| `gws-sheets-append/SKILL.md` | backend-specialist | Logging API responses to sheets |
| `gws-sheets-read/SKILL.md` | research-specialist | Reading datasets/research data from sheets |
| `gws-forms/SKILL.md` | ux-specialist | Form creation for user research |
| `gws-people/SKILL.md` | n8n-specialist | Contact sync workflows |
| `gws-chat/SKILL.md` | devops-engineer | Sending alerts to Google Chat spaces |
| `gws-meet/SKILL.md` | project-manager | Meeting space creation for reviews |
| `gws-modelarmor/SKILL.md` | security-auditor | LLM prompt injection detection |
| `gws-modelarmor-sanitize-prompt/SKILL.md` | security-auditor | Input sanitization before agent LLM calls |
| `recipe-generate-report-from-sheet/SKILL.md` | research-specialist | Auto-generate research reports from data |
| `recipe-post-mortem-setup/SKILL.md` | gsd-verifier | Structured post-mortem after phase completion |
| `persona-researcher/SKILL.md` | research-specialist | Full research persona workflow |
| `persona-project-manager/SKILL.md` | project-manager | PM persona for task orchestration |

---

### Exact Bash Command Patterns for Agents

gws uses two-phase parsing: extract service name, fetch Discovery Doc at runtime, rebuild command tree. Commands follow this pattern:

```bash
# Pattern: gws <service> <resource> <method> [--flags] [--body '{}']

# Gmail operations
gws gmail users messages send --userId me --body '{"raw":"base64encoded"}'
gws gmail users messages list --userId me --q "is:unread" --maxResults 10
gws gmail users messages get --userId me --id MESSAGE_ID
gws gmail users labels list --userId me
gws gmail users watch --userId me --body '{"topicName":"projects/PROJECT/topics/TOPIC"}'

# Calendar operations
gws calendar events list --calendarId primary --timeMin 2026-04-07T00:00:00Z
gws calendar events insert --calendarId primary --body '{"summary":"Review","start":{"dateTime":"2026-04-08T10:00:00Z"},"end":{"dateTime":"2026-04-08T11:00:00Z"}}'
gws calendar freebusy query --body '{"timeMin":"...","timeMax":"...","items":[{"id":"primary"}]}'

# Drive operations
gws drive files list --q "mimeType='application/vnd.google-apps.folder'"
gws drive files create --body '{"name":"Report.md","parents":["FOLDER_ID"]}'

# Sheets operations
gws sheets spreadsheets values get --spreadsheetId SHEET_ID --range "Sheet1!A1:Z100"
gws sheets spreadsheets values append --spreadsheetId SHEET_ID --range "Sheet1!A1" --valueInputOption RAW --body '{"values":[["row","data"]]}'

# Schema introspection (discover any API method before calling)
gws schema gmail.users.messages.send

# Dry run preview
gws --dry-run gmail users messages send --userId me --body '{...}'
```

---

### Top 10 Most Valuable gws Commands for the Agent System

1. `gws gmail users messages send` — Send notifications from any agent (build alerts, reports, summaries)
2. `gws gmail users messages list --q "..."` — Search inbox for project-related emails, client requests
3. `gws gmail users watch` — Streaming email events → trigger agent actions on new mail (n8n trigger)
4. `gws calendar events list --calendarId primary` — Check availability before scheduling reviews
5. `gws calendar events insert` — Auto-schedule sprint reviews and milestone checkpoints from gsd-executor
6. `gws drive files list --q "..."` — Locate project files, deliverables, context docs in Drive
7. `gws sheets spreadsheets values append` — Log agent output (metrics, decisions, errors) to persistent sheet
8. `gws sheets spreadsheets values get` — Read project data, config, or research data into agent context
9. `gws chat spaces messages create` — Send rich-text alerts to team Google Chat spaces
10. `gws schema <service>.<resource>.<method>` — Introspect any API method before calling (prevents errors)

---

### n8n Workflows That Become Simpler with gws

With gws available locally, n8n-specialist generates simpler workflows because the CLI handles auth/retry/discovery natively:

- **Email → Sheet logging:** Replace n8n Gmail node + Sheets node with `gws gmail` + `gws sheets` call in Bash node
- **Calendar availability checking:** Replace OAuth2 credential mgmt in n8n with `gws calendar freebusy query` in Execute Command node
- **Drive file monitoring:** `gws drive changes list` gives incremental change tokens — simpler than n8n Drive trigger (no webhook setup)
- **Contact sync pipelines:** `gws people connections list` → transform → `gws sheets values append` eliminates 3-node n8n chain
- **Report distribution:** `gws sheets values get` → process → `gws gmail messages send` replaces complex multi-credential n8n flow
- **Chat notifications:** `gws chat messages create` in Bash node replaces Google Chat webhook node + manual webhook setup
- **Form response collection:** `gws forms responses list` provides structured JSON — simpler than n8n Forms polling

### Full Google APIs Covered by gws

| API | gws Service Name | Most Valuable For |
|-----|-----------------|-------------------|
| Admin SDK Reports | `admin` | Audit logs, user activity monitoring |
| Google Calendar | `calendar` | ★★★ Scheduling, availability, event management |
| Google Chat | `chat` | Team notifications, alerts |
| Google Classroom | `classroom` | Course/assignment management |
| Google Docs | `docs` | ★★ Document creation and editing |
| Google Drive | `drive` | ★★★ File storage, organization, sharing |
| Google Forms | `forms` | User research, data collection |
| Gmail | `gmail` | ★★★ Email automation (highest value) |
| Google Keep | `keep` | Notes and quick capture |
| Google Meet | `meet` | ★ Meeting management |
| Model Armor | `modelarmor` | ★★ LLM prompt/response safety |
| Google People | `people` | Contact management, sync |
| Apps Script | `script` | Custom automation, scripting |
| Google Sheets | `sheets` | ★★★ Data storage, logging, reporting |
| Google Slides | `slides` | Presentation generation |
| Google Tasks | `tasks` | Task tracking integration |

**Most valuable for 27-agent system (ranked):** Gmail > Drive > Sheets > Calendar > ModelArmor > Docs

---

## C2: claude-mem Integration Design

### node_modules Status

Repository at `C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main\` has NO node_modules. The analysis confirmed: "Repository downloaded, not installed. No `node_modules/` (would exist if installed)." Installation required before use.

### Exact Startup Commands (from package.json)

```bash
cd "C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main"

# Install dependencies (Node 18+ or Bun 1.0+ required)
npm install
# OR with Bun (faster): bun install

# Build (compiles TypeScript to dist/)
npm run build
# Expands to: node scripts/build-hooks.js

# Start worker daemon (persistent background service)
npm run worker:restart
# Expands to: bun plugin/scripts/worker-service.cjs restart

# Full dev flow (build + sync + restart worker):
npm run dev
# Expands to: npm run build && npm run sync-marketplace && npm run worker:restart
```

### Configuration (.env Values)

claude-mem reads from `C:\Users\User\.claude-mem\.env` on Windows. From source analysis of `src/shared/paths.ts` and `src/services/`:

```env
# Required: None — claude-mem works offline with no API keys

# Optional: Vector database (semantic similarity search)
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Optional: MCP server port
CLAUDE_MEM_MCP_PORT=3456

# Optional: Logging level
CLAUDE_MEM_LOG_LEVEL=info

# Optional: Max observation age before pruning (days)
CLAUDE_MEM_RETENTION_DAYS=365

# Optional: SQLite database location override
CLAUDE_MEM_DB_PATH=C:\Users\User\.claude-mem\db.sqlite

# Optional: Disable automatic worker restart on crash
CLAUDE_MEM_WORKER_AUTORESTART=true
```

### Where CC Transcripts Are Stored on Windows

From `src/services/transcripts/` and `src/shared/paths.ts` (uses `os.homedir()`):

- **Claude Code transcripts:** `C:\Users\User\.claude\` — session XML/JSON files Claude Code writes during conversations
- **claude-mem database:** `C:\Users\User\.claude-mem\db.sqlite`
- **claude-mem logs:** `C:\Users\User\.claude-mem\logs\worker-YYYY-MM-DD.log`
- **claude-mem cache:** `C:\Users\User\.claude-mem\cache\`
- **claude-mem observations:** `C:\Users\User\.claude-mem\observations\`

The transcript parser watches `C:\Users\User\.claude\` for new XML/JSON transcript files, parses tool calls and completions, and converts them to observations stored in SQLite.

### Memory Injection Mechanism

**Automatic via hooks — not manual.** The hooks system:

1. **Pre-prompt hook** (fires at session start): injects context block with relevant observations/summaries into system prompt automatically
2. **Post-tool-use hook** (fires after each tool call): captures tool invocation + result as an observation, queues for async processing
3. **Session init hook**: writes session metadata (session_id, project_id, timestamp) to SQLite
4. **Session shutdown hook**: triggers final synthesis and summary generation

The worker daemon (`plugin/scripts/worker-service.cjs`) runs persistently, processes the observation queue, generates semantic summaries, and optionally syncs to Chroma for vector search. Memory injection is fully automatic once installed and worker is running — no agent needs to explicitly call it.

### Exact Activation Steps

```bash
# 1. Install dependencies
cd "C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main"
npm install

# 2. Build
npm run build

# 3. Copy plugin directory to Claude Code config
xcopy /E /I plugin "C:\Users\User\.claude\plugins\claude-mem"

# 4. Register hooks in C:\Users\User\.claude\settings.json
# (copy hook structure from plugin/hooks/hooks.json into settings.json hooks section)

# 5. Start the worker daemon
bun plugin/scripts/worker-service.cjs start

# 6. Verify worker is running
bun plugin/scripts/worker-service.cjs status
# Expected: "worker is running, PID: XXXXX"

# 7. Verify database was created
# C:\Users\User\.claude-mem\db.sqlite should now exist

# 8. Start Claude Code — memory capture is now automatic
```

### Recommended Persistent Memory Database Path

Store at: `C:\Users\User\.claude-mem\db.sqlite` (the default from `src/shared/paths.ts`).

Do NOT move to a project-local path. The database must be global to enable cross-project and cross-agent memory sharing. All 27 agents write to and read from the same SQLite instance. Estimated growth: ~1MB per 100 sessions. Prune after 365 days via `CLAUDE_MEM_RETENTION_DAYS=365`.

### Top 5 Agents That Benefit Most From Session Memory

1. **gsd-executor** — Most critical. Remembers which commands failed, which file patterns exist, which tools worked in prior phases. Prevents repeating failed approaches within and across projects.
2. **research-specialist** — Remembers prior research findings. Avoids re-querying last30days or web search for topics already covered. Injects prior research context into new queries.
3. **gsd-debugger** — Remembers prior bug patterns, error messages, fixes that worked or failed. Builds a project-specific debugging knowledge base automatically.
4. **backend-specialist** — Remembers project's API patterns, database schema details, auth patterns, environment quirks. Reduces context-rebuilding overhead at session start.
5. **code-archaeologist (refactor)** — Cross-session memory of codebase structure, dead code locations, prior refactoring attempts. Essential for multi-session refactoring work.

### Specific Risks and Mitigations

**Memory pollution scenarios:**
- **Stale context injection:** Observation from 6 months ago about a deprecated API pattern gets injected, causing agent to use deprecated approach. *Mitigation:* Set `CLAUDE_MEM_RETENTION_DAYS=180`; tag observations with project version hash.
- **Cross-project contamination:** Agent on Project A sees observations from Project B because both use React. *Mitigation:* claude-mem uses `project_id` field in SQLite — verify session init hook correctly identifies project root via `.git` or `CLAUDE.md` presence.
- **False error propagation:** Tool call that failed due to transient issue (network timeout) gets captured and informs future sessions that tool "doesn't work." *Mitigation:* Filter observation capture by error type — don't synthesize transient failures into persistent knowledge.

**False context injection patterns:**
- **Overfitting to prior solutions:** Agent shown prior solution for similar (but not identical) problem and applies it incorrectly. *Mitigation:* Keep semantic similarity threshold high (>0.85 cosine) before injecting matches.
- **Hallucination amplification:** LLM summarization of observations introduces errors; those errors injected into future sessions as "facts." *Mitigation:* Store raw observations as-is; use LLM summaries as secondary context only, not primary truth.
- **Worker lag causing missed captures:** If worker daemon was down, observations not captured, restarts with partial history. *Mitigation:* Add health check that warns at session start if worker was down; log gaps in observation timeline.

---

## C3: Agentic Context Engine (ACE) Design

### Is ACE Runnable as a Windows Service?

**Python import only — not a background service.** ACE is a Python library (`ace-framework` package) with a CLI (`ace setup`, `ace status`). It is invoked synchronously during agent task execution — the agent calls `agent.learn_from_feedback()` and ACE processes the trace, updates the Skillbook, and returns. There is no persistent daemon mode. The Recursive Reflector runs as in-process sandboxed Python execution, not a separate service. ACE cannot run as a Windows background service without a custom wrapper.

### Requirements to Run ACE on Windows

```bash
# Python 3.12+ required (pyproject.toml specifies >=3.12 — NOT 3.10 or 3.11)
python --version   # verify 3.12+

# Install uv package manager
pip install uv

# Install ACE in project virtual environment
cd your-project
uv add ace-framework
# Installs: litellm>=1.83.0, pydantic>=2.0.0, pydantic-ai-slim[litellm]>=0.0.36, tenacity>=9.1.4

# Interactive setup
uv run ace setup

# Required environment variables
# ANTHROPIC_API_KEY=sk-ant-...   (for Claude provider)
# OPENAI_API_KEY=sk-...          (optional, for GPT provider)
# ACE_LOG_LEVEL=info             (optional)
```

**Windows note:** The Recursive Reflector runs generated Python in a sandboxed subprocess. Subprocess spawning on Windows is 2-5x slower than Linux. The `tau2` benchmark dependency requires internet access for initial download.

---

### The Skillbook Pattern as Pure Design (No Python Required)

ACE's core innovation: a persistent collection of learned strategies updated after every task execution. Three roles: Agent (executes with Skillbook context), Reflector (analyzes traces to extract lessons), SkillManager (curates Skillbook — adds, refines, removes). This pattern can be implemented natively in STATE.md without Python.

**Add this section to every gsd-executor STATE.md:**

```markdown
## SKILLBOOK

### Active Strategies
<!-- Format: [CONFIDENCE: HIGH|MED|LOW] Strategy text -->
<!-- Add after successful task completion. Remove after 3 failures. -->

- [HIGH] When editing TypeScript files, check tsconfig.json strict mode first — strict:true requires explicit null checks
- [HIGH] This project uses Prettier printWidth:100 — run prettier before committing or pre-commit hook fails
- [MED] Test suite requires `npm run db:seed` before `npm test` — empty DB causes 40+ failures
- [LOW] Docker build takes 8+ min on first run; subsequent builds use layer cache (~2 min)

### Reflection Log
<!-- Format: TASK | OUTCOME | LESSON | DATE -->

| Task | Outcome | Lesson | Date |
|------|---------|--------|------|
| Add auth middleware | SUCCESS | Express middleware order matters — auth must precede route handlers | 2026-04-07 |
| Run integration tests | FAIL×2 then SUCCESS | Must start Redis before tests: `docker compose up redis -d` | 2026-04-07 |

### Discard Log
<!-- Strategies tried and failed — prevents re-attempting failed approaches -->

- [DISCARDED 2026-04-07] `npm run test:watch` in CI — hangs indefinitely; use `npm test` instead
```

**How gsd-executor uses this:**
1. At task start: read Skillbook → inject Active Strategies into prompt context
2. After task success: add new strategy if non-obvious approach was required
3. After task failure: log to Reflection Log; if same failure twice, move to Discard Log
4. Before phase completion: gsd-verifier reads Reflection Log to identify patterns for system improvement

### Simple Manual Equivalent: 5-Step Process Achieving 80% of ACE's Value

No installation required. Pure markdown discipline.

**Step 1 — Define the success metric before starting**
At top of PLAN.md task: write one measurable success condition. "Tests pass" is weak. "All 47 tests pass with 0 errors in `npm test` output" is strong. This enforces the rigor ACE's evaluation harness requires.

**Step 2 — Capture the trace manually during execution**
After each tool call that matters, append one line to STATE.md Reflection Log in real time: `[TOOL] → [RESULT] → [INSIGHT]`. Not retrospectively.

**Step 3 — Extract the lesson (reflector equivalent)**
After task completion (success or failure), write one sentence: "What would I tell future-me before starting this task?" Add it to Skillbook Active Strategies.

**Step 4 — Discard failed strategies explicitly**
If a strategy failed twice, move it to Discard Log with date. Never retry a discarded strategy without understanding why it failed. This is ACE's "SkillManager removes strategies" behavior.

**Step 5 — Inject strategies at session start**
Every gsd-executor session: read the Skillbook section of STATE.md before writing any code. Include Active Strategies block verbatim in context. This is ACE's "agent enhanced with Skillbook strategies" behavior.

**Expected value:** ACE achieves 2x consistency and 49% token reduction on benchmarks. This manual process, applied consistently, delivers ~60-70% of that improvement by eliminating the main failure modes (repeating failed approaches, missing project-specific setup steps) without any automation overhead.

---

## C4: Aegis .context/ Design

### Side-by-Side Comparison: Aegis .context/ vs GSD .planning/

| Dimension | Aegis `.context/` | GSD `.planning/` |
|-----------|------------------|-----------------|
| **State file** | `.context/current_state.md` | `STATE.md` (project root) |
| **Planning** | `.context/plan/` (milestones, deps, resources) | `PLAN.md` (tasks, acceptance criteria) |
| **Roadmap** | `.context/roadmap.md` (vision, priorities) | `ROADMAP.md` (phases, goals) |
| **Decision log** | `.context/decisions/` (per-decision files) | Not formalized |
| **Session history** | `.context/sessions/` (per-session logs) | STATE.md task completion entries |
| **Task tracking** | `.context/tasks/` (active tasks, blockers) | PLAN.md checklist + STATE.md status |
| **Knowledge/specs** | `.context/docs/` (architecture, API specs) | Not formalized — README or wiki |
| **AI instructions** | `.context/AI_INSTRUCTIONS.md` | CLAUDE.md (project-level) |
| **Memory model** | 4-tier cognitive (semantic/episodic/procedural/prospective) | Linear (roadmap → plan → state → verify) |
| **Versioning** | Git-tracked (entire .context/) | Git-tracked (PLAN.md, STATE.md in repo) |
| **Dependencies** | Zero | Zero |
| **AI commands** | `/aegis plan`, `/aegis start`, `/aegis check` | `/gsd-plan`, `/gsd-execute`, `/gsd-verify` |
| **Session scope** | Project-level | Phase-level (one PLAN.md per phase) |

### Overlaps (Both Do the Same Thing)

1. State tracking — both track what's done, what's blocked, current phase
2. Planning documents — both maintain a plan with tasks and milestones
3. Roadmap — both have a high-level vision/goals document
4. Session continuity — both help agents resume work across session boundaries
5. Git versioning — both designed to be version-controlled alongside code

### Complements (Different Value Added)

| Aegis Adds | GSD Adds |
|-----------|---------|
| Decision log — architectural choices with rationale | Phase-gated execution with quality verification |
| Episodic session logs — what happened each dev session | Acceptance criteria per task (binary pass/fail) |
| Semantic memory — persistent architecture/API knowledge base | Deviation rules — when unexpected work appears |
| 4-tier cognitive memory model | Context budget management (50% rule) |
| `/aegis check` — instant project state summary | `/gsd-verify` — structured goal achievement verification |

---

### Unified Project Directory Structure (Combining Both)

```
project-root/
├── .context/                         # Aegis layer — persistent project knowledge
│   ├── AI_INSTRUCTIONS.md            # Project-specific AI behavior rules
│   ├── current_state.md              # Live: what phase, blockers, recent decisions
│   ├── decisions/                    # Architecture decision records (ADRs)
│   │   ├── 001-framework-choice.md
│   │   ├── 002-database-schema.md
│   │   └── template.md
│   ├── docs/                         # Semantic memory: specs, architecture, API docs
│   │   ├── architecture.md
│   │   ├── api-reference.md
│   │   └── data-models.md
│   ├── sessions/                     # Episodic memory: per-session logs
│   │   ├── 2026-04-07-session-001.md
│   │   └── template.md
│   └── skillbook.md                  # ACE-pattern: learned strategies (see C3)
│
├── .planning/                        # GSD layer — execution framework
│   ├── ROADMAP.md                    # Strategic phases and goals
│   ├── PLAN.md                       # Current phase tasks (2-3 tasks max)
│   ├── STATE.md                      # Execution state, skillbook, reflection log
│   └── archive/                      # Completed phase plans
│       ├── phase-1-PLAN.md
│       └── phase-2-PLAN.md
│
├── PREFERENCES.md                    # Agent config: cost budgets, model, parallelism
├── CLAUDE.md                         # Project-level AI instructions (top-level)
└── [source code]
```

**Usage convention:**
- `.context/` — updated by any agent; persistent knowledge that survives phases
- `.planning/` — managed by gsd pipeline agents; phase-scoped execution state
- `.context/current_state.md` → gsd-verifier reads this to understand current phase
- `.planning/STATE.md` → gsd-executor writes task outcomes here
- Both directories committed to git — full audit trail

---

### .context/AI_INSTRUCTIONS.md Template for This System

```markdown
# AI Instructions — [PROJECT NAME]
**Version:** 1.0 | **Updated:** [DATE] | **Owner:** [OWNER]

---

## Identity & Role

You are a specialist AI agent working on [PROJECT NAME]. When invoked, you operate
as one of the 27 specialist agents defined in `C:\Users\User\.claude\agents\`.
The specific agent role is determined by which slash command invoked you.

---

## Project Context

**What this project is:** [1-2 sentences: what it does, for whom]
**Tech stack:** [e.g., Next.js 15, Supabase, Tailwind v4, TypeScript]
**Current phase:** See `.planning/STATE.md` → Current Phase section
**Architectural decisions already made:** See `.context/decisions/` — do NOT
re-litigate these without explicit user instruction

---

## Behavior Rules

### Always Do
- Read `.context/current_state.md` at the start of any multi-step task
- Read `.context/skillbook.md` before writing code — apply active strategies
- Append to `.context/sessions/[DATE]-session-[N].md` when completing significant work
- Record architectural decisions in `.context/decisions/` (use template.md format)
- Check `.planning/STATE.md` for the current task scope before acting

### Never Do
- Do not modify `.context/decisions/` entries marked FINAL without user confirmation
- Do not skip the skillbook — if a strategy applies, use it
- Do not create architecture patterns that contradict `.context/docs/architecture.md`
- Do not mark a task complete in STATE.md unless the acceptance criterion in PLAN.md is met

---

## Project-Specific Knowledge

### Key File Locations
- Entry point: [e.g., `src/app/page.tsx`]
- Database schema: [e.g., `supabase/migrations/`]
- Environment config: [e.g., `.env.local` — never commit]
- Test command: [e.g., `npm test`]
- Build command: [e.g., `npm run build`]

### Known Gotchas (from skillbook.md)
<!-- Copy active strategies from .context/skillbook.md here for quick access -->
- [Update this section when skillbook.md changes]

### APIs & Credentials
- [List API services used, where keys are stored, rate limits]
- Never log or echo API keys

---

## Memory & Continuity

Read in this order when starting a new session:
1. `.context/current_state.md` (where are we)
2. `.context/skillbook.md` (what works here)
3. `.planning/PLAN.md` (what is the current task)
4. `.planning/STATE.md` (what is done, what is blocked)

---

## Quality Gates

Before marking any task complete:
- [ ] Acceptance criterion from PLAN.md is met (binary)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Tests pass (`npm test`)
- [ ] Decision recorded if architectural choice was made
- [ ] Session log updated if session took >30 minutes
```

---

## C6: Everything-Claude-Code (ECC) + gstack Design

### ECC Skills NOT Covered by Existing shared-ref (Gaps)

The existing `C:\Users\User\.claude\agents\_shared-ref\` contains: antigravity, core, data, gsd, other, repos, sherlock, ui-ux. The `repos/` subdirectory has: claude-cookbooks-main, n8n-workflows-main, sherlock-ai-plugin-main, superpowers-main, system-prompts-and-models-of-ai-tools-main, system_prompts_leaks-main.

ECC provides skills missing from all of these:

| Gap Category | ECC Skills | Missing From shared-ref |
|-------------|-----------|------------------------|
| Agentic engineering | `agent-eval`, `agent-harness-construction`, `autonomous-agent-harness`, `eval-harness` | No eval/harness methodology |
| Token optimization | `context-budget`, `cost-aware-llm-pipeline`, `memory-persistence` | No token/cost management |
| Learning loops | `continuous-learning`, `continuous-learning-v2`, `iterative-retrieval` | No continuous improvement pattern |
| Domain-specific | `healthcare-cdss-patterns`, `healthcare-phi-compliance`, `customs-trade-compliance` | No domain patterns |
| Security | `the-security-guide.md`, AgentShield integration | security-auditor has OWASP but no AgentShield |
| Framework-specific | `django-*`, `laravel-*`, `kotlin-*`, `dotnet-*` | Only TypeScript/React covered in ui-ux |
| Data engineering | `clickhouse-io`, `database-migrations`, `data-scraper-agent` | No migration patterns |
| Evaluation | `agent-eval`, `eval-harness`, `benchmark` | No evaluation methodology |
| Content/marketing | `article-writing`, `brand-voice`, `content-engine`, `investor-materials` | No content creation |

---

### Top 10 Most Valuable ECC Skills to Extract

1. **`context-budget/SKILL.md`** — Token optimization, context window budgeting, system prompt slimming. Every agent in the 27-agent system needs this. Highest operational value.

2. **`the-longform-guide.md`** (ECC root) — Deep dive on token optimization, memory persistence, evals, parallelization. Best-in-class reference for multi-agent system design. Extract to `_shared-ref/core/ecc-longform-guide.md`.

3. **`autonomous-agent-harness/SKILL.md`** — Self-driving agent patterns, continuous loop design. Directly applicable to gsd-executor autonomous mode.

4. **`continuous-learning-v2/SKILL.md`** — Auto-extract patterns from sessions into reusable skills. Complements the manual Skillbook approach with structured automation.

5. **`the-security-guide.md`** (ECC root) — AgentShield, CVE scanning, prompt injection prevention, sandboxing. Extract to `_shared-ref/other/ecc-security-guide.md` for security-auditor.

6. **`eval-harness/SKILL.md`** — Checkpoint-based verification, pass@k metrics, grader types. Directly applicable to improving gsd-verifier.

7. **`deep-research/SKILL.md`** — Extended research methodology with citation tracking, multi-source synthesis. Enhances research-specialist beyond current capability.

8. **`memory-persistence/SKILL.md`** — Hook-based state management, context extraction, cross-session persistence. Complements claude-mem integration design.

9. **`cost-aware-llm-pipeline/SKILL.md`** — Budget enforcement, provider fallback, token tracking. Critical for managing 27-agent operational cost.

10. **`agentic-engineering/SKILL.md`** — Core patterns for building agent systems: context problem, iterative retrieval, subagent orchestration. Foundation-level reference for all agents.

---

### Top 5 Most Valuable gstack Workflow Skills for This User

1. **`/review` (review/SKILL.md)** — Code review engine: reads git diff, checks bugs/style/performance/security/architecture with multi-axis checklist. Garry Tan's battle-tested workflow. Maps to code-archaeologist and security-auditor — enhances both with proven structured checklist.

2. **`/cso` (cso/SKILL.md)** — Chief Security Officer role: OWASP Top 10 scan + STRIDE threat modeling + input validation + API security + data protection audit. More comprehensive than security-auditor's current implementation.

3. **`/plan-ceo-review` (plan-ceo-review/SKILL.md)** — Strategic planning: what problem, why now, success metrics, MVP scope, risks, resource plan. Enhances gsd-roadmapper with structured strategic questions used when shipping 10K+ lines/day.

4. **`/investigate` (investigate/SKILL.md)** — Incident root cause analysis workflow. Directly maps to gsd-debugger and enhances it with structured investigation protocol.

5. **`/retro` (retro/SKILL.md)** — Retrospective: what went well, what didn't, learnings captured. Maps to gsd-verifier post-phase review with structured format that feeds back into next phase planning.

---

### Exact Extraction Plan: SOURCE → DESTINATION

```
# ECC extractions — copy file content, do not symlink
SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\context-budget\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-context-budget.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\the-longform-guide.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-longform-guide.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\the-security-guide.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-security-guide.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\autonomous-agent-harness\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-autonomous-agent-harness.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\continuous-learning-v2\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-continuous-learning.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\eval-harness\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\ecc-eval-harness.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\deep-research\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-deep-research.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\memory-persistence\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-memory-persistence.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\cost-aware-llm-pipeline\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-cost-aware-pipeline.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\agentic-engineering\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-agentic-engineering.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\google-workspace-ops\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-google-workspace-ops.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\.claude\settings.json
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-settings-reference.json

# gstack extractions
SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\gstack-review.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\cso\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\gstack-cso.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\plan-ceo-review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-plan-ceo-review.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\investigate\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-investigate.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\retro\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-retro.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\gstack-skill-template.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\office-hours\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-office-hours.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\plan-eng-review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-plan-eng-review.md
```

---

## C8: Supporting Repos Design

### autoresearch: Extractable Patterns → Target Files

autoresearch is GPU-only (H100 tested). Not runnable on this Windows system. Extract patterns only — do not attempt installation.

**Pattern 1: Autonomous loop protocol**
- Source: `C:\Users\User\Downloads\new repos\autoresearch-master\autoresearch-master\program.md`
- Destination: `C:\Users\User\.claude\agents\_shared-ref\core\autoresearch-loop-protocol.md`
- What it adds: Time-bounded experimentation (5-min wall clock per experiment), keep/discard logic based on metric delta, git-based experiment tracking with TSV audit trail.
- Agent to update: `gsd-executor` — add to instructions: "For autonomous improvement loops, time-box experiments, use git commits as checkpoints, keep only if the defined metric improves."

**Pattern 2: Simplicity criterion**
- The rule "prefer deleting code over adding complexity" is directly applicable to code-archaeologist.
- Add to `C:\Users\User\.claude\agents\code-archaeologist\`: "When refactoring, prefer deletion over addition. A passing test with less code always beats a passing test with more code."

**Pattern 3: Fixed budget constraint model**
- Any evaluation task should have an explicit time budget. autoresearch enforces 5-minute wall-clock per experiment with hard kill at 10 minutes.
- Add to `gsd-planner` agent: "Every task in PLAN.md must include an explicit time estimate. If a task exceeds 2× estimate, treat it as a blocker — surface immediately, do not silently continue."

**NOT extractable from autoresearch:** `train.py` (GPU-specific ML code), `prepare.py` (NLP pipeline), benchmark tooling (ML-specific). These have zero applicability to the 27-agent system.

---

### last30days-skill: Extractable Patterns → Target Agent Files

last30days is immediately useful as a research skill. Not installed yet (no Python venv). Activating research-specialist integration:

**Step 1 — Minimal installation (free sources only)**
```bash
cd "C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt   # or: uv sync
python scripts/last30days.py --setup
# First-run wizard: skip ScrapeCreators, use Reddit+HN+web only (free)
# Test: python scripts/last30days.py "Claude Code vs Cursor 2026"
```

**Step 2 — Add to research-specialist agent**
- File: `C:\Users\User\.claude\agents\research-specialist\`
- Add instruction: "For current events, recent tool comparisons, or trending analysis covering last 30 days, invoke: `python scripts/last30days.py '<topic>'` from `C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main\`. Minimum viable: Reddit + HN + web (no API keys). Add `BRAVE_API_KEY` for Brave Search, `SCRAPECREATORS_API_KEY` for Reddit comments + TikTok."

**Extractable Pattern 1: Multi-source aggregation with graceful degradation**
- Source: `scripts/lib/source.py` — abstract `Source` base class
- Destination: `C:\Users\User\.claude\agents\_shared-ref\other\last30days-source-pattern.md`
- Design: each source is independent; if one fails, research continues. `Source.search()` returns `List[Result]`; `Source.enrich()` adds metadata. Add new sources by subclassing. Applicable to any agent aggregating from multiple APIs.

**Extractable Pattern 2: Query type → source routing**
- Classify query before selecting sources: product review, news, trends, comparison, person, event.
- "AI tools" → TikTok/YouTube. "Market news" → Reddit/X/HN. "Prediction" → Polymarket.
- Add to research-specialist: "Classify research queries by type before selecting sources — different query types have different optimal source sets."

**Extractable Pattern 3: Synthesis quality evaluation**
- `scripts/evaluate-synthesis.py` checks whether LLM synthesis is grounded vs. hallucinated.
- Add to gsd-verifier: "When verifying research-based decisions, check that decision rationale is traceable to cited sources — flag any claims not present in the source material."

---

### gsd-2: What's New vs What's Already in the System

gsd-2 is a full agent framework (Pi SDK, ~50K lines). It is NOT a drop-in upgrade of the existing gsd-planner/gsd-executor/gsd-verifier agents. Do not replace the existing GSD pipeline. Extract specific innovations only.

**Already in the system (from `D:\prompts\data\get-shit-done-main\`):**
- Goal-backward planning methodology
- PLAN.md format (2-3 tasks per phase)
- Deviation rules (4 rules for unexpected work)
- Verification protocol (3-level artifact verification)
- Context budget (50% rule)

**New additions worth extracting from gsd-2:**

**Addition 1: 8-question quality gate**
gsd-2 uses 8 questions before milestone completion: requirements met, testing coverage, security reviewed, performance acceptable, maintainability adequate, documentation updated, scope respected, design reviewed. More rigorous than current 3-level artifact verification.
- Add to: `C:\Users\User\.claude\agents\gsd-verifier\` — incorporate 8-question gate as structured checklist before any phase sign-off
- Create: `C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-quality-gate.md`

**Addition 2: Parallel milestone slices**
gsd-2 allows parallel execution of milestone slices via SQLite state machine. Current GSD pipeline is sequential.
- Add to `gsd-planner` agent: "For large phases, consider splitting into parallel slices. Each slice must be fully independent (no shared files, no shared state, separate git worktrees)."

**Addition 3: Worktree isolation per task**
gsd-2 creates git worktrees per task for full isolation.
- Add to `gsd-executor` agent: "For risky refactoring tasks, create a git worktree: `git worktree add ../project-task-branch task-branch`. Execute task in worktree. Merge only if tests pass. Clean up: `git worktree remove ../project-task-branch`."

**Addition 4: RTK shell output compression**
gsd-2 uses RTK binary (Rust, 247K GitHub stars) to compress shell output before injecting into context.
- Create: `C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-rtk-compression.md` — document the pattern; implement when token costs become significant

**Addition 5: PREFERENCES.md system**
gsd-2 uses project-level PREFERENCES.md for agent config (cost budgets, provider, parallelism, code style).
- Add to unified project structure as `PREFERENCES.md` alongside `.planning/` and `.context/`
- Template contents: `cost_budget_usd`, `preferred_model`, `max_parallel_tasks`, `code_style_guide_path`, `test_command`, `build_command`

**Source files to extract:**
```
SOURCE: C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\docs\parallel-orchestration.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-parallel-orchestration.md

SOURCE: C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\docs\token-optimization.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-token-optimization.md
```

**Do NOT add from gsd-2:** Pi SDK framework (separate Node.js runtime), VSCode extension, web UI, multi-provider routing (Claude-only system for now).

---

### apify-cli: Standalone Utility Value for research-specialist

Apify CLI provides access to 1000+ pre-built web scrapers ("Actors") on the Apify cloud. For research-specialist, this complements last30days for web scraping beyond social media.

**Where Apify adds value over last30days:**
- last30days = curated social sources (Reddit, X, YouTube, TikTok, HN) with 30-day filter
- Apify = arbitrary web scraping (any website, any structure, no time filter) via pre-built Actors

**Specific research-specialist use cases:**
1. Competitor product/pricing pages — `apify/web-scraper` on any URL (last30days cannot do this)
2. G2/Capterra review aggregation — product review data from review sites
3. GitHub trending repos in a technology area — community signal for tech evaluation
4. LinkedIn company/people data — market research for competitive analysis (where Actor available)
5. Any custom web data extraction where social media APIs don't reach

**Setup for research-specialist:**
```bash
# Install (Node.js 22+ required)
npm install -g apify-cli

# Authenticate (free tier: ~$5/month compute units)
apify auth login
# Prompts for APIFY_TOKEN from https://console.apify.com/account/integrations

# Find relevant pre-built Actor
apify actors ls --search "linkedin"
apify actors ls --search "google search"
apify actors ls --search "product reviews"

# Run example — scrape a web page
apify call apify/rag-web-browser --input '{"startUrls":[{"url":"https://competitor.com/pricing"}]}'
```

**Add to research-specialist agent instructions:**
"For web scraping needs beyond social media (competitor sites, review aggregators, custom data extraction), use Apify CLI. Install: `npm install -g apify-cli`. Auth: `apify auth login`. Find Actor: `apify actors ls --search '<domain>'`. Run: `apify call <actor-id> --input '{...}'`. Apify handles proxies, rate limiting, and anti-bot measures automatically. Free tier (~$5 compute/month) sufficient for research use."

**NOT useful for:** Anything last30days already covers (social media, HN, Reddit), real-time streaming data (Apify is batch), internal/authenticated business systems (requires custom Actor development).

---

---

## Quick Reference: All Extraction Actions

| Priority | Action | Source | Destination |
|----------|--------|--------|-------------|
| HIGH | Install claude-mem worker daemon | `Downloads/new repos/claude-mem-main/` | System-wide (npm install + hooks) |
| HIGH | Extract ECC context-budget skill | `ecc/skills/context-budget/SKILL.md` | `_shared-ref/core/ecc-context-budget.md` |
| HIGH | Extract ECC longform guide | `ecc/the-longform-guide.md` | `_shared-ref/core/ecc-longform-guide.md` |
| HIGH | Extract gstack /review skill | `gstack/review/SKILL.md` | `_shared-ref/other/gstack-review.md` |
| HIGH | Extract gstack /cso skill | `gstack/cso/SKILL.md` | `_shared-ref/other/gstack-cso.md` |
| HIGH | Extract autoresearch loop protocol | `autoresearch-master/program.md` | `_shared-ref/core/autoresearch-loop-protocol.md` |
| HIGH | Add Skillbook section to STATE.md template | ACE pattern (no file needed) | Update gsd-executor agent instructions |
| HIGH | Add 8-question quality gate | gsd-2 pattern | Update gsd-verifier agent instructions |
| MED | Build gws binary | `cli-main/` → `cargo build --release` | System PATH |
| MED | Setup last30days Python env | `last30days-skill-main/` | Python venv + pip install |
| MED | Install Apify CLI | npm install -g apify-cli | System PATH |
| MED | Create .context/ project template | Aegis pattern | New template in `_shared-ref/other/aegis-context-template/` |
| MED | Extract ECC agentic-engineering | `ecc/skills/agentic-engineering/SKILL.md` | `_shared-ref/core/ecc-agentic-engineering.md` |
| MED | Extract ECC autonomous-agent-harness | `ecc/skills/autonomous-agent-harness/SKILL.md` | `_shared-ref/core/ecc-autonomous-agent-harness.md` |
| MED | Extract gstack /plan-ceo-review | `gstack/plan-ceo-review/SKILL.md` | `_shared-ref/gsd/gstack-plan-ceo-review.md` |
| MED | Extract gstack /investigate | `gstack/investigate/SKILL.md` | `_shared-ref/gsd/gstack-investigate.md` |
| MED | Extract gstack /retro | `gstack/retro/SKILL.md` | `_shared-ref/gsd/gstack-retro.md` |
| LOW | Extract ECC security guide | `ecc/the-security-guide.md` | `_shared-ref/other/ecc-security-guide.md` |
| LOW | Extract ECC eval-harness | `ecc/skills/eval-harness/SKILL.md` | `_shared-ref/gsd/ecc-eval-harness.md` |
| LOW | Extract ECC cost-aware-pipeline | `ecc/skills/cost-aware-llm-pipeline/SKILL.md` | `_shared-ref/core/ecc-cost-aware-pipeline.md` |
| LOW | Extract gsd-2 token-optimization | `gsd-2/docs/token-optimization.md` | `_shared-ref/gsd/gsd2-token-optimization.md` |
| LOW | Extract gsd-2 parallel-orchestration | `gsd-2/docs/parallel-orchestration.md` | `_shared-ref/gsd/gsd2-parallel-orchestration.md` |
| LOW | Extract gstack skill template | `gstack/SKILL.md` | `_shared-ref/core/gstack-skill-template.md` |

---

*End of Section C-A*
