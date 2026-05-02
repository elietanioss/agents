# DEEP TECHNICAL ANALYSIS: 5 REPOSITORY ECOSYSTEM
## Part B: Repos 6-10

**Analysis Date:** 2026-04-07  
**Analyst:** Claude Agent (File Search Specialist)  
**Scope:** Architecture, capabilities, integration opportunities, risks, verdicts

---

## REPO 6: autoresearch-master

**Path:** `C:\Users\User\Downloads\new repos\autoresearch-master\autoresearch-master\`  
**Language(s):** Python 3.10+  
**License:** MIT

### File Inventory

```
.gitignore
.python-version
analysis.ipynb
prepare.py
program.md
progress.png
pyproject.toml
README.md
train.py
uv.lock
```

### Key Files — Deep Read

#### README.md (8,039 bytes, 92 lines)
Core premise: Autonomous AI research agent that autonomously modifies and experiments with a GPT training codebase over fixed 5-minute intervals. Key points:

- **Autonomy paradigm:** AI agent edits code, trains, evaluates (val_bpb metric), decides keep/discard, repeats without human intervention
- **Fixed 5-minute wall-clock training budget** — enables ~12 experiments/hour, ~100 overnight
- **Single GPU requirement** (tested on H100) — no distributed training, self-contained
- **Three core files:** `prepare.py` (read-only, data prep), `train.py` (agent modifies only this), `program.md` (human agent instructions)
- **Metric:** val_bpb (validation bits per byte) — lower is better, vocab-independent
- **References Karpathy's nanochat** as parent project
- **Platform:** NVIDIA GPU only (MacOS/Windows forks available)
- **Setup:** `uv` package manager, one-time `prepare.py` run, then iterative `train.py` execution

#### program.md (Agent Instructions)
Defines the autonomous research loop protocol:

1. **Setup Phase:**
   - Create git branch `autoresearch/<tag>` (fresh run)
   - Read in-scope files (README.md, prepare.py, train.py)
   - Verify data exists in `~/.cache/autoresearch/`
   - Initialize `results.tsv` header
   - Confirm and proceed

2. **Experimentation Loop (NEVER STOPS):**
   - Launch `uv run train.py > run.log 2>&1` (exactly 5 min)
   - Parse results: grep val_bpb, peak_vram_mb from output
   - Record to `results.tsv` (commit, val_bpb, memory_gb, status, description)
   - Evaluate: if val_bpb improved (lower), keep commit; else `git reset`
   - Iterate with new ideas — architecture changes, hyperparameter tweaks, optimizer swaps

3. **Constraints:**
   - Cannot modify `prepare.py` (read-only)
   - Cannot install new packages
   - Cannot modify evaluation harness
   - Training MUST stop after 5 minutes (kill if >10 min = failure)
   - Simplicity criterion: prefer deleting code over adding complexity

4. **Output Format:**
   ```
   val_bpb:          0.997900
   training_seconds: 300.1
   total_seconds:    325.9
   peak_vram_mb:     45060.2
   mfu_percent:      39.80
   total_tokens_M:   499.6
   num_steps:        953
   num_params_M:     50.3
   depth:            8
   ```

5. **Critical Instruction:** `NEVER STOP` — loop runs indefinitely until manually stopped. Agent is autonomous. If stuck, think harder, try radical changes. Loop design enables ~100 experiments during 8-hour sleep.

#### pyproject.toml
Dependencies (uv managed):
```toml
[project]
name = "autoresearch"
requires-python = ">=3.10"
dependencies = [
    "kernels>=0.11.7",
    "matplotlib>=3.10.8",
    "numpy>=2.2.6",
    "pandas>=2.3.3",
    "pyarrow>=21.0.0",
    "requests>=2.32.0",
    "rustbpe>=0.1.0",
    "tiktoken>=0.11.0",
    "torch==2.9.1",
]

[tool.uv.sources]
torch = [{ index = "pytorch-cu128" }]
```

#### train.py (630 lines)
GPT pretraining implementation (agent-editable file):
- GPT model architecture with configurable depth, attention patterns (SSSL window pattern)
- CausalSelfAttention with flash-attention-3 optimizations
- RoPE embeddings, value residuals (ResFormer)
- Optimizer: Muon + AdamW (hybrid)
- Training loop with 5-minute time budget enforcement
- Evaluation harness integrating with prepare.py

Key config fields:
```python
@dataclass
class GPTConfig:
    sequence_len: int = 2048
    vocab_size: int = 32768
    n_layer: int = 12
    n_head: int = 6
    n_kv_head: int = 6
    n_embd: int = 768
    window_pattern: str = "SSSL"
```

### Capabilities Inventory

- **Autonomous experiment orchestration:** Git branch management, training launch, result parsing, keep/discard logic, loop continuation without human input
- **Model architecture exploration:** Layer depth, vocab size, attention patterns, embedding dimensions all tunable by agent
- **Optimizer experimentation:** Hybrid Muon+AdamW, learning rate sweeps, batch size optimization
- **Performance evaluation:** val_bpb metric, VRAM tracking, model flops utilization (MFU), token throughput
- **Time-bounded training:** Fixed 5-minute wall clock, platform-independent comparability
- **Crash recovery:** Agent detects OOM, syntax errors, runtimes >10 min; decides fix vs. skip
- **Git-based versioning:** Each experiment is a commit; results logged to TSV; full audit trail
- **Simplicity optimization:** Agent weights code deletion equally with metric improvement

### Installation & Runtime Requirements

- **Python 3.10+** (tested 3.10+)
- **uv package manager** (install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **NVIDIA GPU** (H100 tested; requires CUDA 12.8 via pytorch-cu128 index)
- **Storage:** ~2GB for data shards + tokenizer (`~/.cache/autoresearch/`)
- **One-time setup:** `uv run prepare.py` (~2 min, downloads data, trains BPE tokenizer)
- **No external services required:** Self-contained training, no distributed setup

### Current State on Machine

- Repository downloaded to disk (path confirmed)
- Not installed/running (no `node_modules`, no Python venv)
- No `.env` or configuration present
- Training data NOT downloaded (would be in `~/.cache/autoresearch/` if prepared)
- Not active

### Integration Opportunities

1. **Skill for autonomous model iteration:** `/autoresearch` skill directive to GSD orchestrator — provides structured protocol for agent-driven model optimization
2. **Research agent enhancement:** Pair with agent-facing research skills; autoresearch provides _executable_ R&D loop vs. just documentation
3. **Standalone research loop:** Could run as persistent background worker (orchestrated by GSD's daemon/worker system) — experiment every N hours while main Claude Code session handles other tasks
4. **Comparative benchmarking:** Integration point for evaluating architectural decisions across agent-driven tasks — "what model architecture works best for AGENT_TASK X"
5. **Template for autonomous optimization:** Pattern reusable for other domains (hyperparameter search, prompt optimization, data augmentation strategies)

Which agents benefit:
- **gsd-pi orchestrator:** Could invoke autoresearch as a sub-agent for model/code optimization phases
- **gstack CEO agent:** Automated research for product optimization cycles
- **claude-mem worker:** Could background-process memory compression improvements
- **last30days:** Could autonomously optimize search query generation and synthesis prompts

### Conflicts & Risks

- **High compute requirement:** H100 GPU; smaller hardware needs fork + major hyperparameter retuning
- **GPU-only:** No CPU/MPS fallback in base repo; forks exist but unmaintained
- **Python-heavy:** Not integrated with GSD's Node.js/TypeScript stack; separate runtime dependency
- **Long-running tasks:** 5-minute fixed intervals don't map naturally to ephemeral Claude Code sessions; needs background daemon
- **No observability into agent reasoning:** Only sees TSV results, not why agent made decisions (could add logging)
- **Experimental status:** Single-author research project; not production-hardened (no error recovery, no rollback, no alerting)

### Verdict

**AGENT ENHANCEMENT + REF EXTRACTION**

Autoresearch is scientifically rigorous methodology for _autonomous_ research iteration. Integrate as:

1. **Pattern reference:** Extract `program.md` structure for building other autonomous research loops (e.g., prompt optimization, dataset curation)
2. **Skill template:** Create `/autoresearch` skill that embeds the loop protocol so agents understand:
   - Time-bounded experimentation
   - Simplicity as first-class metric
   - Autonomous iteration without human checkpoints
3. **Standalone integration:** Pair with GSD's worker daemon — run autoresearch experiments on fixed schedule, report results to main session
4. **NOT inline:** Too specialized for 27-agent system; overkill for most tasks. But highly valuable as reference for agents building autonomous loops.

**Extractable patterns:**
- `program.md` loop protocol (reusable template)
- Fixed time budget constraint model (applicable to any evaluation)
- Keep/discard decision logic based on metric delta
- Git-based experiment tracking (audit trail pattern)

---

## REPO 7: claude-mem-main

**Path:** `C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main\`  
**Language(s):** TypeScript, JavaScript, Python  
**License:** AGPL-3.0

### File Inventory (Massive monorepo — sampling key structure)

```
[Core Plugin System]
plugin/
  ├── CLAUDE.md
  ├── hooks/
  │   ├── CLAUDE.md
  │   ├── bugfixes-2026-01-10.md
  │   └── hooks.json
  ├── modes/ (40+ language/mode files)
  ├── scripts/
  │   ├── worker-service.cjs
  │   ├── worker-cli.js
  │   ├── worker-wrapper.cjs
  │   ├── context-generator.cjs
  │   ├── mcp-server.cjs
  │   ├── statusline-counts.js
  │   └── claude-mem (CLI entry)
  ├── skills/
  │   ├── do/
  │   ├── make-plan/
  │   ├── mem-search/
  │   ├── smart-explore/
  │   └── timeline-report/
  └── ui/
      ├── viewer-bundle.js
      ├── viewer.html
      └── icons/

[Core TypeScript Implementation]
src/
  ├── bin/ (CLI entry points)
  ├── cli/ (hook command handling)
  ├── hooks/ (hook response protocol)
  ├── sdk/ (parser, prompts)
  ├── servers/ (MCP server)
  ├── services/
  │   ├── context/ (context generation)
  │   ├── domain/ (business logic)
  │   ├── infrastructure/ (database, process mgmt)
  │   ├── integrations/ (Chroma, external APIs)
  │   ├── queue/ (background job queue)
  │   ├── server/ (HTTP endpoints)
  │   ├── smart-file-read/ (file detection)
  │   ├── sqlite/ (observation store)
  │   ├── sync/ (cross-session sync)
  │   ├── transcripts/ (conversation parsing)
  │   └── worker/ (daemon process)
  ├── shared/ (EnvManager, path utils, plugin state)
  ├── supervisor/ (health checker, shutdown)
  ├── types/ (database types, transcript types)
  ├── ui/ (viewer components)
  └── utils/ (logging, parsing, project filtering)

[Tests — Massive Suite]
tests/
  ├── infrastructure/ (process mgmt, health, distribution)
  ├── integration/ (e2e hook execution, API endpoints)
  ├── services/ (queue, sqlite, sync operations)
  ├── sqlite/ (data integrity, transaction tests)
  ├── worker/ (agent resume, search, middleware)
  └── [40+ test files covering hooks, context, timestamps, workers]

[Additional Infrastructure]
openclaw/          [OpenClaw gateway plugin]
installer/         [NPM install wizard]
scripts/          [40+ utility scripts]
cursor-hooks/     [Cursor IDE integration]
docs/             [Extensive documentation + bug reports]
```

### Key Files — Deep Read

#### README.md (Excerpt)
- **Purpose:** "Persistent memory compression system built for Claude Code"
- **Version:** 10.6.3
- **Core value prop:** Automatically captures tool usage observations, generates semantic summaries, makes them available to future sessions
- **Session continuity:** Claude maintains knowledge about projects across session boundaries
- **Installation:** Via `/plugin` commands (preferred) or npm (SDK only)
- **OpenClaw support:** Installable on OpenClaw gateways via `curl -fsSL https://install.cmem.ai/openclaw.sh | bash`

#### package.json (Dependencies + Scripts)
```json
{
  "name": "claude-mem",
  "version": "10.6.3",
  "engines": { "node": ">=18.0.0", "bun": ">=1.0.0" },
  "type": "module",
  "exports": {
    ".": "./dist/index.d.ts",
    "./sdk": "./dist/sdk/index.d.ts",
    "./modes/*": "./plugin/modes/*"
  },
  "scripts": {
    "dev": "npm run build-and-sync",
    "build": "node scripts/build-hooks.js",
    "build-and-sync": "npm run build && npm run sync-marketplace && npm run worker:restart",
    "worker:logs": "tail -n 50 ~/.claude-mem/logs/worker-$(date +%Y-%m-%d).log",
    "worker:restart": "bun plugin/scripts/worker-service.cjs restart",
    "test": "bun test",
    "bug-report": "npx tsx scripts/bug-report/cli.ts",
    "translate:all": "...",
  }
}
```

Critical observations:
- **Node 18+, Bun 1.0+** runtime requirements
- **Worker service** managed via `worker-service.cjs` (persistent background daemon)
- **Logging:** `~/.claude-mem/logs/worker-YYYY-MM-DD.log`
- **SDK exports:** Can be used as library via `import { ... } from 'claude-mem/sdk'`
- **Modes system:** Language-specific hook configurations in `plugin/modes/*.json`

#### Core Architecture Files

**plugin/CLAUDE.md:**
- Directs Claude to use specific skills: `/do`, `/make-plan`, `/mem-search`, `/smart-explore`, `/timeline-report`
- Plugin provides hooks for context injection across Claude Code lifecycle
- Prioritizes "smart-explore" for codebase analysis (vs. raw file reading)

**src/services/worker/:**
- **Worker daemon:** Background process managing:
  - Observation capture (tool usage, completions, errors)
  - Vector database sync (Chroma)
  - Queue processing (SQLite-backed job queue)
  - Session management and synthesis
- Runs independently of Claude Code session; survives session restarts

**src/services/transcripts/:**
- Parser for Claude Code conversation history (XML format)
- Extracts tool calls, observations, context
- Converts structured transcript to queryable observations

**src/services/sqlite/:**
- SQLite database (`~/.claude-mem/db.sqlite`) storing:
  - Observations (tool calls, completions, metadata)
  - Sessions (session_id, project_id, timestamps)
  - Summaries (semantic compressions of observations)
  - Prompts (extracted from transcripts)
- Comprehensive transaction safety, indexes, FK constraints

**plugin/skills/:**
- `/mem-search` — query memory across sessions
- `/smart-explore` — intelligent codebase exploration (preferred over raw file reading)
- `/make-plan` — generate plans with memory context
- `/do` — execute tasks with memory injection
- `/timeline-report` — generate retrospective summaries

#### Transcript Capture Mechanism

From `src/services/transcripts/`:
- Claude Code stores conversations in `.claude/` directory (Windows: `C:\Users\User\.claude\`)
- claude-mem parses XML transcript format
- Extracts:
  - Tool invocations (name, args, results)
  - Timestamps
  - Role (user, assistant, tool)
  - Context blocks
- Synthesizes to observations (semantic units)
- Injects summaries into future session contexts via hooks

#### Windows Path Handling

From `src/shared/paths.ts`:
- Primary: `~/.claude-mem/` (Linux/macOS)
- Windows fallback: `C:\Users\[USER]\.claude-mem\` via `os.homedir()`
- Database: `~/.claude-mem/db.sqlite`
- Logs: `~/.claude-mem/logs/`
- Cache: `~/.claude-mem/cache/`
- Observation store: `~/.claude-mem/observations/`

### Capabilities Inventory

1. **Session continuity:**
   - Captures observations from prior sessions
   - Injects summaries into new session prompts
   - Cross-project memory via global KNOWLEDGE.md

2. **Memory capture & compression:**
   - Tool call tracking (what was executed, results)
   - Error/crash logging
   - Semantic summarization (LLM-generated)
   - Vector embeddings (Chroma for similarity search)

3. **Skills system:**
   - `/mem-search` — find related observations from past sessions
   - `/smart-explore` — intelligent codebase navigation with memory context
   - `/make-plan` — planning with prior knowledge
   - `/do` — task execution with memory injection
   - `/timeline-report` — retrospectives across projects

4. **Worker daemon:**
   - Persistent background service (survives session restarts)
   - Job queue for async observation processing
   - Health monitoring (process registry)
   - Graceful shutdown (prevents zombie processes)

5. **Integration hooks:**
   - Pre-prompt injection (context hook)
   - Post-tool-use hooks (observation capture)
   - Session lifecycle hooks (init, shutdown)
   - Supports Cursor IDE + OpenClaw gateways

6. **MCP server:**
   - Exposes claude-mem as MCP resource
   - Allows other agents/tools to query observations
   - API endpoint at `http://localhost:PORT/`

7. **Multilingual support:**
   - 40+ languages via mode files (`plugin/modes/code--*.json`)
   - Hooks system translatable per language

### Installation & Runtime Requirements

- **Node.js 18+** (or Bun 1.0+)
- **npm or bun** package manager
- **SQLite 3** (bundled with Node)
- **Chroma** (vector DB, optional but recommended)
- **Claude Code CLI** or compatible agent (Codex, OpenClaw)
- **Storage:** ~100MB for SQLite + Chroma index (grows with observation volume)
- **Background process:** Worker daemon runs continuously (`~/.claude-mem/worker-*.log`)
- **Environment:** No external API keys required; can work offline

### Current State on Machine

- Repository downloaded, not installed
- No `node_modules/` (would exist if installed)
- No `~/.claude-mem/` directory (would exist if running)
- Not configured; no hooks registered
- Not running

### Integration Opportunities

1. **Core memory layer for 27-agent system:**
   - Each agent session auto-captures observations
   - `/mem-search` skill for cross-agent knowledge
   - All 27 agents write to shared SQLite — cross-agent memory queries

2. **Agent coordination:**
   - orchestrator skill queries memory to route tasks to best prior-agent
   - Agents see summaries of what previous agents did
   - Prevents duplicate work, enables specialized handoff

3. **Global KNOWLEDGE.md:**
   - System-level patterns discovered by agents
   - Architecture decisions documented
   - API patterns, common errors, best practices
   - Automatically injected into all agent prompts

4. **Transcript analysis for debugging:**
   - /timeline-report across all 27 agents
   - Identify stuck loops, error patterns
   - Audit trail for compliance/review

5. **Skill enhancement:**
   - gstack integration: /review skill queries memory for prior reviews (prevent repeated issues)
   - gsd-pi: planning skill uses prior experiments
   - last30days: searches memory for past research to avoid re-querying

### Conflicts & Risks

1. **AGPL-3.0 license:** Restrictive; any derivative must also be AGPL. Verify compatibility with system license.

2. **Chroma dependency:** Vector DB adds operational complexity (network, initialization). SQLite-only mode exists but loses semantic search.

3. **Background daemon:** Long-running process requires supervision. Dead daemon = lost observation capture. Health monitoring critical.

4. **Windows support:** Heavy development effort on Windows-specific issues (path handling, process spawning, terminal popups). ~15 open issues related to Windows.

5. **Session directory coupling:** Assumes Claude Code stores transcripts in `.claude/` (verified for Windows via `os.homedir()`). Breaking change in Claude Code would require update.

6. **Performance at scale:** SQLite + Chroma may slow down with 10K+ observations. No documented scaling tests.

7. **Observation precision:** Captures tool calls but loses nuanced human intent. Synthesis relies on LLM — can hallucinate if context summarization fails.

### Verdict

**CORE INFRASTRUCTURE**

claude-mem is **essential infrastructure** for the 27-agent system. It solves:
- **Session continuity problem:** Agents don't start from scratch each session
- **Cross-agent knowledge:** Memory store enables coordination
- **Audit trail:** Full transparency into agent decisions
- **Reuse prevention:** Avoid redundant research/exploration

Integration plan:
1. **Install immediately** in the system (part of base setup, not optional)
2. **Configure worker daemon** to start automatically with Claude Code
3. **Set up shared observation database** at `~/.claude-mem/db.sqlite` (all 27 agents use same DB)
4. **Create system KNOWLEDGE.md** at `~/.gsd/agent/KNOWLEDGE.md` for cross-agent patterns
5. **Hook mem-search into orchestrator:** Route agent decisions based on prior context
6. **License review:** Confirm AGPL-3.0 compatibility with system licensing

**Extractable patterns:**
- Hook system architecture (pre/post execution)
- Worker daemon lifecycle management
- SQLite schema for observations (schema migrations pattern)
- Chroma integration example
- Transcript parser (reusable for audit/compliance)

**Risk mitigation:**
- Add health checks for worker daemon; restart if dead
- Implement observation pruning (keep only recent 1-year observations)
- Add query timeouts to prevent SQLite locks blocking agents
- Windows testing: verify path handling on actual Windows systems

---

## REPO 8: gsd-2-main

**Path:** `C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\`  
**Language(s):** TypeScript, Node.js, Rust (native bindings)  
**License:** MIT

### File Inventory (Large monorepo)

```
[Main CLI + Core Engine]
src/
  ├── cli.ts (main entry point)
  ├── headless.ts (REPL/remote mode)
  ├── web-mode.ts (browser UI)
  ├── mcp-server.ts (MCP integration)
  ├── models-resolver.ts (provider routing)
  ├── wizard.ts (onboarding)
  └── [20+ orchestration files]

[Core Agent Framework]
packages/
  ├── pi-agent-core/ (agent runtime, state machine, providers)
  ├── pi-coding-agent/ (specialized agent for coding tasks)
  ├── pi-tui/ (terminal UI, interactive modes)
  ├── pi-ai/ (model/provider abstraction)
  ├── daemon/ (background orchestration)
  ├── mcp-server/ (MCP resource server)
  └── rpc-client/ (RPC protocol)

[Native Optimizations]
native/
  ├── crates/ (Rust implementations)
  ├── Cargo.toml
  └── npm/ (compiled bindings)

[Orchestration & Skills]
gsd-orchestrator/
  ├── SKILL.md (skill template)
  ├── workflows/ (YAML workflow definitions)
  ├── templates/ (task templates)
  └── references/ (example outputs)

[Web Interface]
web/
  ├── app/ (Next.js app)
  ├── components/ (React components)
  └── [typical Next.js structure]

[VSCode Extension]
vscode-extension/
  ├── src/
  ├── package.json
  └── [extension files]

[Documentation]
docs/
  ├── architecture.md
  ├── skills.md
  ├── git-strategy.md
  ├── parallel-orchestration.md
  ├── pi-context-optimization-opportunities.md
  └── [40+ architectural docs]

[Configuration]
.plans/ (20+ feature plans as markdown)
package.json, tsconfig.json, Dockerfile, docker-compose.yaml
```

### Key Files — Deep Read

#### README.md (Excerpt)
- **GSD = "Get Shit Done"** — now a full coding agent framework (v2)
- **Author:** Garry Tan (YC President & CEO)
- **Core claim:** "One command. Walk away. Come back to a built project with clean git history."
- **Productivity claim:** "600,000+ lines production code in 60 days, 10K-20K lines/day, part-time"
- **Architecture:** Built on **Pi SDK** (agent harness with TypeScript access to agent runtime)
- **Capabilities vs v1:** Direct control over context windows, sessions, git branches, cost/tokens, crash detection, auto-advancement through milestones
- **Install:** `npm install -g gsd-pi@latest`
- **Tooling:** 23 specialist agents (CEO, eng manager, designer, QA, security, release engineer, etc.)
- **Philosophy:** Markdown-driven (SKILL.md, PLAN.md, ROADMAP.md), open source (MIT)

#### Recent Release v2.52.0 (April 2026)

Key features:
- **VS Code integration:** Status bar, file decorations, bash terminal, session tree
- **Capability-aware model routing:** Replaced pattern matching with metadata-based provider selection
- **`--bare` mode:** Minimal output for automation
- **RPC protocol v2:** Versioning, init handshake, runId generation
- **SQLite audit:** Indexes, caching, safety fixes
- **Unified error classifier:** Consolidates 3 overlapping classifiers into single pipeline
- **Auto-mode improvements:** Stops on provider errors (vs. infinite retry), transaction safety, worktree seeding, idle watchdog

#### Core Orchestration Philosophy

From `gsd-orchestrator/SKILL.md` + docs:
- **Skills define agent behavior:** Each skill is a `.md` file with:
  - Frontmatter (name, version, description, args)
  - Multi-step instructions
  - Templates for common patterns
- **Workflows:** YAML files orchestrate skill sequences
- **State machine:** Disciplined state transitions with guards
- **Git branching:** Automatic isolation; clean history
- **Milestones:** Parallel execution; quality gates at completion
- **Verification:** 8-question quality gates before milestone done
- **Offline capable:** Works with local models (Ollama, etc.)

#### Agent Architecture

From `packages/pi-agent-core/`:
- **Single-writer state engine:** Atomic SQLite transitions, TOCTOU protection
- **Capability metadata:** Models tagged with capabilities (coding, image, web, reasoning)
- **Provider abstraction:** Support Claude, Gemini, GPT-4, local models (Ollama, LLaMA)
- **Cost tracking:** Token count, per-model pricing, budget enforcement
- **Session management:** Isolated worktrees per milestone, cross-session state
- **Tool registry:** 100+ tools for bash, file ops, web, git, terminal

#### Database Schema (SQLite)

Stores:
- `milestones` — project phases with phase/status/validation
- `slices` — task units; parallel execution possible
- `journal` — atomic state transitions
- `activity_log` — user actions, tool invocations
- `conversations` — session history
- `observations` — synthesis from transcripts (integrates with claude-mem)

#### Documentation Highlights

**docs/architecture.md:**
- Three-layer architecture: CLI → RPC client → agent harness (remote)
- Supports headless (REPL), web UI (browser), VSCode extension
- MCP server integration for external tools

**docs/parallel-orchestration.md:**
- Milestone slices can execute in parallel across multiple agents
- Coordination via database state machine
- Quality gates verify all slices before advancement

**docs/token-optimization.md:**
- Context window budgeting per milestone
- Prompt compression via RTK binary (Rust, 247K GH stars)
- Smart file inclusion (only what agent needs)

**docs/git-strategy.md:**
- Worktree isolation (default: no isolation, optional per preference)
- Clean git history (no merge commits, rebased)
- Automatic branch naming

**docs/skills.md:**
- 30+ skill packs covering: frameworks (React, Vue, Rails), databases (Postgres, MongoDB), cloud (AWS, Vercel, Railway)
- Curated catalog at `~/.agents/skills/`
- Skills discoverable via `/` prefix in agent

### Capabilities Inventory

1. **Multi-agent orchestration:**
   - Dispatch different agent types (coding, design, QA, security)
   - Parallel execution via milestone slices
   - Automatic coordination via state machine

2. **Rich agent instruction model:**
   - Skill.md language (structured + templates)
   - Workflow YAML (declarative sequences)
   - Quality gates (8-question verification)
   - PREFERENCES.md (agent configuration per project)

3. **Git management:**
   - Automatic worktree creation per task
   - Clean history (no merge commits, squashing)
   - Branch automation, isolation options
   - Commit message templates with metadata

4. **Cost & token optimization:**
   - Real-time token counting (per model)
   - Budget alerts + enforcement
   - Context window management
   - RTK compression for shell output

5. **Error recovery:**
   - Automatic crash detection
   - State machine guards against invalid transitions
   - Rollback capabilities (git reset, worktree cleanup)
   - Retry logic with exponential backoff

6. **Verification & QA:**
   - Quality gates before milestone completion
   - 8-question checklist (requirements, testing, security, performance, maintainability, documentation, scope, design review)
   - Parallel evaluation via evaluating-gates phase
   - Compliance classes (injected into validation prompts)

7. **Model/provider abstraction:**
   - Dynamic routing based on capability metadata
   - Support: Claude, Gemini, GPT-4, local (Ollama)
   - External provider extensions (Claude Code CLI, etc.)
   - Fallback chains (if primary unavailable, use secondary)

8. **UI options:**
   - TUI (terminal UI) — full interactive mode
   - Web UI (Next.js) — browser-based dashboard
   - VSCode extension — IDE integration with status bar
   - Headless (REPL) — scriptable, no UI
   - MCP server — expose as MCP resource

9. **Skills marketplace:**
   - 30+ curated skills
   - Framework-specific packs (React, Vue, Rails, Django, FastAPI)
   - Database packs (Postgres, MongoDB, Redis, Supabase)
   - Cloud packs (AWS, Vercel, Railway, Azure)
   - Community extensions via marketplace

### Installation & Runtime Requirements

- **Node.js 18+** (LTS recommended; v24 on Mac via Homebrew path fix)
- **Git 2.0+**
- **Bun 1.0+** (for some scripts)
- **npm or yarn** package manager
- **Rust/Cargo** (for native modules compilation)
- **Browser** (for web UI mode)
- **VSCode** (optional, for extension)
- **Environment:** API keys for Claude, Gemini, or local model setup
- **Disk:** ~500MB for dependencies + native modules

### Current State on Machine

- Repository downloaded, structure intact
- Not installed globally (`npm install -g` not run)
- No `node_modules/` at root or packages/
- Not configured; no PREFERENCES.md
- Not running

### Integration Opportunities

1. **Master orchestrator for 27-agent system:**
   - GSD becomes the primary coordination layer
   - Each of 27 agents implemented as GSD skill
   - Quality gates enforce minimum standards
   - `/gsd auto` runs entire milestone without interruption

2. **Skill ecosystem:**
   - Extract gstack as official GSD skill pack
   - Extract autoresearch as optional research skill
   - Extract last30days as research source skill
   - Extract claude-mem as memory skill

3. **Provider abstraction:**
   - Support multiple model backends (Claude, Gemini, local)
   - Cost optimization via provider fallback
   - Capability-aware routing (use Gemini for vision, Claude for coding)

4. **Worker daemon integration:**
   - GSD daemon manages all background processes
   - claude-mem worker, gstack workers, autoresearch workers all supervised
   - Single health check dashboard

5. **Parallel execution:**
   - 27 agents across multiple worktrees
   - Quality gates prevent broken states
   - Automatic rollback on verification failure

### Conflicts & Risks

1. **Complexity:** GSD-2 is feature-rich (~50K lines). Learning curve steep for operators. Risk: misconfiguration, misuse.

2. **State machine brittleness:** Single-writer engine strong guarantee, but requires perfect transaction isolation. Bug in state transition = deadlock/data corruption.

3. **Dependency on TypeScript/Node.js:** Locks system to Node ecosystem. Python tasks require subprocess wrapping.

4. **Model provider lock-in:** Default Claude, but fallback chains complex. Cost tracking relies on accurate pricing; out-of-date pricing = budget overruns.

5. **Git worktree overhead:** Each task creates worktree; cleanup must be reliable. Orphaned worktrees waste disk space.

6. **Windows support:** Heavy testing needed. Current issues suggest fragility on Win32 (EINVAL on detached processes, terminal handling).

7. **Marketplace centralization:** 30+ skills bundled; discovering custom skills non-trivial. Skill dependency management unclear.

### Verdict

**MASTER ORCHESTRATOR**

GSD-2 is the **coordination backbone** for a 27-agent system. It provides:
- **Disciplined state machine** — prevents agents from trampling each other
- **Quality gates** — enforces standards before milestone advancement
- **Skill abstraction** — reusable task modules across agents
- **Cost control** — token budgets, provider fallback
- **Git cleanliness** — reviewable commits, clean history

Integration plan:
1. **Install as core dependency** (not optional)
2. **Define all 27 agents as GSD skills**
3. **Wire quality gates** into each milestone completion
4. **Set PREFERENCES.md** at system level (cost budgets, provider choice, parallelism)
5. **Create marketplace entry** linking gstack, autoresearch, last30days as official packs
6. **Use `/gsd auto`** for fully autonomous milestone execution (overnight runs)

**Extractable patterns:**
- Skill.md template system (canonical format for agent instructions)
- Quality gates framework (reusable verification pattern)
- State machine architecture (SQLite + atomic transitions)
- Workflow YAML syntax (declarative orchestration)
- RTK compression integration (shell output optimization)

**Risk mitigation:**
- Comprehensive state machine testing (all transition paths)
- Worktree cleanup cron job (prevent orphans)
- Windows testing on actual hardware (not just CI)
- Skill dependency resolver (prevent circular skill deps)

---

## REPO 9: gstack-main

**Path:** `C:\Users\User\Downloads\new repos\gstack-main\gstack-main\`  
**Language(s):** TypeScript, Markdown (skills)  
**License:** MIT

### File Inventory (Skill-centric monorepo)

```
[Root Skills — Directly Invocable via /]
├── office-hours/ (SKILL.md — initial project planning)
├── plan-ceo-review/ (SKILL.md — CEO-level strategy)
├── plan-eng-review/ (SKILL.md — engineering review)
├── plan-design-review/ (SKILL.md — design review)
├── review/ (SKILL.md — code review engine)
├── ship/ (SKILL.md — release/deploy)
├── design-consultation/ (SKILL.md — design advising)
├── design-shotgun/ (SKILL.md — design brainstorm)
├── design-html/ (SKILL.md — HTML design)
├── design-review/ (SKILL.md — design feedback)
├── qa/ (SKILL.md — QA testing)
├── qa-only/ (SKILL.md — QA-focused tasks)
├── canary/ (SKILL.md — canary deployment)
├── benchmark/ (SKILL.md — performance testing)
├── browse/ (SKILL.md — web browsing with Chrome)
├── connect-chrome/ (SKILL.md — browser control)
├── checkpoint/ (SKILL.md — save/restore state)
├── codex/ (SKILL.md — Codex agent integration)
├── cso/ (SKILL.md — Chief Security Officer — OWASP/STRIDE)
├── design-consultation/ (SKILL.md — designer collaboration)
├── devex-review/ (SKILL.md — developer experience review)
├── document-release/ (SKILL.md — release notes generation)
├── freeze/ (SKILL.md — code freeze/release prep)
├── guard/ (SKILL.md — safety guardrails)
├── health/ (SKILL.md — system health checks)
├── investigate/ (SKILL.md — incident investigation)
├── land-and-deploy/ (SKILL.md — merge + deploy)
├── learn/ (SKILL.md — knowledge capture)
├── retro/ (SKILL.md — retrospective analysis)
├── setup-browser-cookies/ (SKILL.md)
├── setup-deploy/ (SKILL.md)
├── gstack-upgrade/ (SKILL.md — upgrade framework)
└── [more skills...]

[Shared Infrastructure]
lib/
  └── worktree.ts (git worktree utilities)

[Binary Tools]
bin/
  ├── gstack-config (configuration)
  ├── gstack-diff-scope (scope diffing)
  ├── gstack-global-discover (global skill discovery)
  ├── gstack-learnings-log (learning history)
  ├── gstack-learnings-search (search learnings)
  ├── gstack-review-log (review history)
  ├── gstack-telemetry-log (telemetry tracking)
  ├── gstack-timeline-log (timeline history)
  └── [20+ utilities]

[Browser Extension]
extension/
  ├── manifest.json
  ├── background.js
  ├── content.js
  ├── popup.js
  ├── sidepanel.html
  └── icons/

[Scripts & Analytics]
scripts/
  ├── analytics.ts (usage analytics)
  ├── discover-skills.ts (skill discovery)
  ├── eval-*.ts (evaluation scripts)
  ├── gen-skill-docs.ts (documentation generation)
  ├── skill-check.ts (validation)
  └── [20+ utility scripts]

[Tests]
test/
  ├── skill-e2e-*.test.ts (end-to-end skill tests)
  ├── global-discover.test.ts
  ├── hook-scripts.test.ts
  ├── learnings.test.ts
  └── [50+ test files]

[Documentation]
docs/
  ├── skills.md (skill catalog)
  ├── designs/ (design specs)
  └── images/

[Configuration & Docs]
SKILL.md (master skill template)
README.md (Garry Tan's manifesto)
ARCHITECTURE.md (architecture overview)
DESIGN.md (design philosophy)
ETHOS.md (values & principles)
package.json, tsconfig.json, Dockerfile
```

### Key Files — Deep Read

#### README.md (Extensive — Garry Tan's vision)

Core narrative:
- **Author:** Garry Tan, YC President & CEO (former Palantir engineer, Posterous cofounder, Bookface builder)
- **Claim:** Shipping 600K+ lines of production code in 60 days (~10K-20K lines/day) **part-time** while running YC
- **Tooling difference:** 20 years building products; 2026 enables productivity 1.6x higher than 2013 Bookface era
- **gstack philosophy:** Turn Claude Code into virtual engineering team (CEO, eng manager, designer, QA, security, release engineer)
- **23 specialist agents + 8 power tools** — all Markdown, all Slash commands, all free (MIT)
- **Target audience:** Technical founders/CEOs, first-time Claude Code users, staff engineers
- **Quick start:** Install → `/office-hours` → `/plan-ceo-review` → `/review` → `/qa` → done (you'll know if it's for you)

#### Install Instructions
```bash
# Step 1: Clone to ~/.claude/skills/gstack
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup

# Step 2 (optional): Add to project repo
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack
cd .claude/skills/gstack && ./setup
```

Post-install: Add "gstack" section to CLAUDE.md directing to use `/browse` (not MCP tools), list 23+ skills.

#### Skill Catalog (23 Primary Skills)

1. **Planning & Strategy:**
   - `/office-hours` — Initial project discussion (get alignment on vision/scope)
   - `/plan-ceo-review` — CEO-level strategy (what to build, why, success metrics)
   - `/plan-eng-review` — Eng architecture (tech stack, database choice, deployment)
   - `/plan-design-review` — Design strategy (UX patterns, accessibility, visual language)

2. **Development & Code Review:**
   - `/review` — Code review engine (catches bugs, style issues, performance, security, design)
   - `/ship` — Release/deploy (merge PR, test, deploy, update docs, notify team)
   - `/land-and-deploy` — Merge + deploy (automated release flow)

3. **Design & UX:**
   - `/design-consultation` — Designer collaboration (reviewing designs, asking questions)
   - `/design-shotgun` — Brainstorm design options (multiple UX approaches)
   - `/design-html` — HTML/CSS design (pure HTML, no framework)
   - `/design-review` — Design feedback (catching design flaws)
   - `/devex-review` — Developer experience (API surface, setup, ergonomics)

4. **Quality Assurance:**
   - `/qa` — Full QA testing (opens real browser, runs test scenarios)
   - `/qa-only` — QA-focused (no design/eng, just testing)

5. **Infrastructure & Deployment:**
   - `/canary` — Canary deployment (gradual rollout, health checks)
   - `/benchmark` — Performance testing (load testing, profiling)
   - `/setup-deploy` — Deployment configuration (CI/CD setup)
   - `/freeze` — Release prep (code freeze, final QA)
   - `/unfreeze` — Post-release cleanup

6. **Specialized Roles:**
   - `/cso` — Chief Security Officer (OWASP, STRIDE threat modeling)
   - `/investigate` — Incident investigation (root cause analysis)
   - `/retro` — Retrospective (what went well, what didn't, learnings)
   - `/checkpoint` — Save/restore state (branching for experiments)

7. **Documentation & Communication:**
   - `/document-release` — Release notes generation
   - `/learn` — Knowledge capture (document learnings for future)

8. **Utilities:**
   - `/browse` — Web browsing (Chrome control, no MCP tools)
   - `/connect-chrome` — Browser connection setup
   - `/codex` — Codex agent integration
   - `/gstack-upgrade` — Upgrade framework itself

#### Core Skill Template

From `SKILL.md` (master template):
```markdown
---
name: skill-name
version: "1.0.0"
description: "What this skill does"
argument-hint: "skill-name project name, skill-name specific question"
allowed-tools: Bash, Read, Write, AskUserQuestion, [others]
homepage: https://github.com/garrytan/gstack
---

# Skill Name v1.0.0

## Workflow

**Step 1: [Action]**
Description and any bash/read commands

**Step 2: [Action]**
Next steps...

## Template

If a subtask, provide template output (how should result look?)

## Checklists

- [ ] Item 1
- [ ] Item 2
```

Pattern:
- Frontmatter defines metadata (name, version, allowed tools)
- Markdown body describes workflow (numbered steps)
- Templates for output format
- Checklists for verification

#### Special Skills Deep Dive

**`/review` (Code Review Engine):**
- Reads all changed files (git diff)
- Checks for: bugs, style violations, performance issues, security vulnerabilities, architecture misalignment
- Provides detailed feedback with line references
- Checklists: logic, edge cases, tests, documentation, performance, security
- Output: PR comments, approval/request changes

**`/qa` (Full QA Testing):**
- Connects to real Chrome browser (via `/browse`)
- Opens staging URL
- Runs test scenarios (happy path, edge cases, error states)
- Checks: functionality, UI/UX, performance, accessibility
- Documents bugs/issues
- Decision: ship or rework

**`/cso` (Chief Security Officer):**
- OWASP Top 10 scan (injection, XSS, auth, crypto, etc.)
- STRIDE threat model (spoofing, tampering, repudiation, info disclosure, denial of service, elevation of privilege)
- Input validation checks
- API security review
- Data protection audit
- Compliance considerations

**`/plan-ceo-review`:**
- Asks: What problem are we solving?
- Why now? (market opportunity)
- Success metrics (how do we know it works?)
- Scope (MVP vs full product)
- Risks & mitigations
- Resource plan (time, cost, people)

#### Browser Extension

From `extension/`:
- Chrome extension for gstack skills
- Provides browser context (current URL, visible DOM, cookies)
- Enables `/browse` skill to interact with pages
- Sidepanel for skill output
- No data collection (privacy-first)

#### Analytics & Telemetry

From `scripts/analytics.ts` and `bin/gstack-telemetry-*`:
- Optional usage tracking (opt-in)
- Metrics: skill invocation counts, execution time, success/failure
- Aggregated (no PII)
- Helps prioritize skill improvements

### Capabilities Inventory

1. **Planning & Discovery:**
   - CEO-level strategy alignment (vision, scope, metrics)
   - Engineering architecture decisions (tech stack, database)
   - Design UX patterns (accessibility, visual language)
   - Security threat modeling (OWASP, STRIDE)
   - Risk & mitigation planning

2. **Code Quality:**
   - Automated code review (bugs, style, performance, security)
   - Architectural alignment checking
   - Dependency vulnerability scanning
   - Test coverage analysis

3. **User Testing & QA:**
   - Real browser testing (Selenium/puppeteer equivalent)
   - Scenario testing (happy path, edge cases, error states)
   - Accessibility audits (WCAG)
   - Performance profiling (load testing, metrics)

4. **Design & UX:**
   - Design consultation (feedback on layouts, patterns)
   - Design brainstorming (multiple UX approaches)
   - HTML/CSS design (pure markup, responsive)
   - Developer experience review (API ergonomics)

5. **Release & Deployment:**
   - Automated merge & deploy
   - Canary deployment (gradual rollout)
   - Smoke tests post-deploy
   - Release notes generation
   - Code freeze management

6. **Knowledge Management:**
   - Learning capture (document decisions, patterns)
   - Retrospectives (project postmortems)
   - Timeline analysis (what happened when)
   - Search across learnings

7. **Incident Response:**
   - Investigation workflow (root cause analysis)
   - Health checks (system status)
   - Monitoring integration (alerts, logs)

### Installation & Runtime Requirements

- **Node.js 18+** (Bun recommended for faster builds)
- **Git 2.0+** (for worktree management)
- **Browser:** Chrome/Chromium (for `/browse` and `/qa`)
- **Node package:** None needed at root; each skill self-contained
- **Storage:** ~100MB for skills + binaries
- **Environment:** Optional (API keys for specific integrations)

### Current State on Machine

- Repository downloaded, structure intact
- Not installed (no global registration)
- No chrome extension loaded
- Not running

### Integration Opportunities

1. **Primary skill ecosystem for 27-agent system:**
   - All 23 gstack skills available to orchestrator
   - Ordered execution: `/plan-ceo-review` → `/review` → `/qa` → `/ship`
   - GSD-2 can invoke gstack skills via workflow YAML

2. **Cross-skill workflows:**
   - `/plan-ceo-review` output feeds into `/plan-eng-review`
   - `/design-consultation` output feeds into `/design-review`
   - `/review` feedback informs `/retro`

3. **Skill enhancement:**
   - `/browse` integrates with last30days (search web, browse results)
   - `/review` integrates with claude-mem (recall prior code patterns)
   - `/investigate` integrates with gsd-2 forensics

4. **Browser automation:**
   - gstack `/browse` replaces MCP Chrome tools (more reliable, local)
   - Enables `/qa` skill (real browser testing)
   - Integrates with last30days web search

### Conflicts & Risks

1. **Browser dependency:** `/browse` and `/qa` require Chrome/Chromium. CI/CD environments may not have GUI.

2. **Skill discoverability:** 23 skills huge catalog. New users overwhelmed. Need structured onboarding (which `/office-hours` provides).

3. **Skill quality variance:** Some skills mature (review, qa), others experimental (design-shotgun). Documentation quality varies.

4. **Browser extension maintenance:** Chrome API changes break extension. Requires ongoing compatibility testing.

5. **Performance overhead:** Some skills complex (cso, qa). Execution times 10-30 minutes. Cost tracking critical.

6. **Learning curve:** Garry Tan wrote these skills over months. Expect weeks to master all 23.

### Verdict

**SKILL ECOSYSTEM**

gstack is the **canonical skill pack** for a 27-agent system. It provides:
- **Proven workflows** — tested by Garry Tan (YC CEO) shipping real products
- **Specialized roles** — each skill has clear identity (designer, security, QA)
- **Reusable templates** — output formats standardized
- **Browser automation** — local, reliable web interaction

Integration plan:
1. **Register gstack skills** as official skill pack in system
2. **Ordered workflows:** planning → engineering → design → review → qa → ship
3. **Skill chaining:** Output of one skill feeds into next
4. **Metrics:** Track skill usage, execution time, success rate
5. **Documentation:** Map each skill to one of 27 agents (e.g., agent-8 uses `/review`, agent-9 uses `/qa`)

**Extractable patterns:**
- Skill.md template format (canonical for this system)
- Workflow ordering (planning before execution)
- Quality gates (review + qa before ship)
- Browser automation (Chrome extension + sidepanel)

---

## REPO 10: last30days-skill-main

**Path:** `C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main\`  
**Language(s):** Python (primary), JavaScript (secondary)  
**License:** MIT

### File Inventory

```
[Core Skill]
├── SKILL.md (master skill definition, 600+ lines)
├── SKILL-original.md (archive)
├── SPEC.md (specification)
├── README.md (documentation)

[Python Scripts — Research Engine]
scripts/
  ├── last30days.py (main entry point, 900+ lines)
  ├── briefing.py (synthesis pipeline)
  ├── evaluate-synthesis.py (quality evaluation)
  ├── evaluate_search_quality.py (search quality metrics)
  ├── generate-synthesis-inputs.py (prepare for synthesis)
  ├── store.py (observation storage)
  ├── watchlist.py (topic tracking)
  └── lib/
      ├── models.py (data structures)
      ├── source.py (search source adapters)
      ├── store.py (storage interface)
      └── [10+ library files]

[Comprehensive Test Suite]
tests/
  ├── test_bird_x.py (X/Twitter via Bird API)
  ├── test_bluesky.py (Bluesky search)
  ├── test_brave_search.py (Brave Search)
  ├── test_cache.py (caching logic)
  ├── test_chrome_cookies.py (cookie extraction)
  ├── test_codex_auth.py (Codex authentication)
  ├── test_cookie_extract.py (cookie parsing)
  ├── test_cross_source.py (multi-source dedup)
  ├── test_dates.py (date filtering)
  ├── test_dedupe.py (deduplication)
  ├── test_entity_extract.py (named entity extraction)
  ├── test_env_cookies.py (env-based auth)
  ├── test_exa_search.py (Exa semantic search)
  ├── test_hackernews.py (HN scraping)
  ├── test_instagram_sc.py (Instagram via ScrapeCreators)
  ├── test_models.py (data model tests)
  ├── test_openai_reddit.py (Reddit via OpenAI)
  ├── test_polymarket.py (Polymarket betting data)
  ├── test_quality_nudge.py (synthesis quality)
  ├── test_query.py (query parsing)
  ├── test_query_type.py (query classification)
  ├── test_reddit_enrich.py (Reddit comment enrichment)
  ├── test_reddit_public.py (public Reddit API)
  ├── test_reddit_sc.py (Reddit via ScrapeCreators)
  ├── test_relevance.py (relevance scoring)
  ├── test_render.py (output rendering)
  ├── test_safari_cookies.py (Safari cookie extraction)
  ├── test_schema_roundtrip.py (data serialization)
  ├── test_score.py (scoring algorithms)
  ├── test_scrapecreators_x.py (X via ScrapeCreators)
  ├── test_setup_wizard.py (onboarding)
  ├── test_smoke.py (smoke tests)
  ├── test_source_priority.py (source ordering)
  ├── test_status_banner.py (UI status)
  ├── test_tiktok.py (TikTok search)
  ├── test_truthsocial.py (Truth Social search)
  ├── test_youtube_relevance.py (YouTube scoring)
  ├── test_youtube_yt.py (YouTube scraping)
  └── [50+ test files]

[Configuration & Hooks]
hooks/
  ├── hooks.json (hook definitions)
  └── scripts/ (hook execution scripts)

[Fixtures & Test Data]
fixtures/
  ├── models_openai_sample.json
  ├── models_xai_sample.json
  ├── openai_sample.json
  ├── reddit_thread_sample.json
  ├── tiktok_search.json
  ├── xai_sample.json
  └── polymarket_sample.json

[Documentation]
docs/
  ├── how-search-works.md
  ├── search-quality-eval.md
  ├── comparison-results/
  ├── test-results/
  └── plans/

[Release & Changelog]
├── CHANGELOG.md
├── release-notes.md
├── LICENSE
```

### Key Files — Deep Read

#### SKILL.md (Master Skill Definition)

**Metadata:**
```yaml
name: last30days
version: "2.9.6"
description: "Deep research engine covering last 30 days across 10+ sources"
argument-hint: "last30 AI video tools, last30 best project management tools"
allowed-tools: Bash, Read, Write, AskUserQuestion, WebSearch
homepage: https://github.com/mvanhorn/last30days-skill
license: MIT
```

**OpenClaw Metadata:**
- Requires: `SCRAPECREATORS_API_KEY`
- Optional: `OPENAI_API_KEY`, `XAI_API_KEY`, `BRAVE_API_KEY`, `BSKY_HANDLE`, etc.
- Binaries: `node`, `python3`
- Files: All of `scripts/*`

**First-Run Wizard (Step 0 — Critical)**

ALWAYS execute wizard FIRST, even if user provided a topic. Wizard has 5 sub-steps:

1. **Welcome message** (plain text, no blockquote)
2. **Setup modal** — AskUserQuestion with 3 options:
   - "Auto setup (~30 sec)" — scan browser for X cookies, install yt-dlp
   - "Manual setup" — guided config
   - "Skip for now" — use Reddit/HN/web only

3. **ScrapeCreators opt-in** (if auto setup chosen):
   - "Open scrapecreators.com" → write key to `~/.config/last30days/.env`
   - "I have a key" → paste and write
   - "Skip for now" → continue without Reddit comments

4. **TikTok/Instagram opt-in** (if SC key saved):
   - Ask if user wants to search TikTok + Instagram on every run
   - Append `INCLUDE_SOURCES=tiktok,instagram` to `.env` if yes

5. **First research topic modal** (if first run):
   - Examples: "Claude Code vs Codex", "Sam Altman", "Warriors Basketball", "AI Legal Prompting"
   - Or: "Type my own topic"
   - Skip if user provided topic with original command

**Detection:** Check for `~/.config/last30days/.env` existence + `SETUP_COMPLETE=true` flag. If exists, skip entire wizard.

#### Core Research Loop (Step 1+)

**Intent parsing:**
- Classify query type (product review, news, trends, comparison, specific person, event)
- Determine relevant sources (e.g., "AI tools" → focus TikTok/YouTube; "market news" → focus Reddit/X/HN)

**Multi-source research:**
- Reddit (threads + comments if SC key present)
- X/Twitter (search via FROM_BROWSER=auto, AUTH_TOKEN, or XAI_API_KEY)
- YouTube (search + transcript fetch via yt-dlp if installed)
- TikTok (if SC key + INCLUDE_SOURCES=tiktok)
- Instagram (if SC key + INCLUDE_SOURCES=instagram)
- Hacker News (public API)
- Polymarket (prediction markets, no auth needed)
- Bluesky (if BSKY_HANDLE + BSKY_APP_PASSWORD)
- Truth Social (if TRUTHSOCIAL_TOKEN)
- Brave Search (if BRAVE_API_KEY)
- Exa (if Exa API key)

**Data enrichment:**
- Deduplication (cross-source)
- Relevance scoring (semantic + keyword matching)
- Date filtering (last 30 days enforced)
- Entity extraction (people, companies, products mentioned)
- Citation tracking (which source said what)

**Synthesis:**
- LLM synthesizes findings (uses OPENAI_API_KEY or XAI_API_KEY or OPENROUTER_API_KEY)
- Generates grounded report with citations
- Structures output: key findings, source breakdown, confidence levels

**Output:**
- Console display (formatted markdown)
- Optional save to `~/Documents/Last30Days/` (markdown file with date)
- File naming: `Last30Days_{date}_{topic}.md`

#### last30days.py (900+ lines)

Core script structure:
```python
# Main entry point: last30days.py <topic> [--output-dir DIR] [--setup]

async def research(topic: str, output_dir: Optional[str] = None):
    # 1. Load config from ~/.config/last30days/.env
    # 2. Initialize sources (Reddit, X, YouTube, etc.)
    # 3. Parallel search across sources
    # 4. Collect + deduplicate results
    # 5. Synthesize using LLM
    # 6. Format output (markdown)
    # 7. Save to file (if output_dir specified)
    # 8. Return structured result

async def setup():
    # 1. Check first run (SETUP_COMPLETE)
    # 2. Scan browser for X cookies
    # 3. Install yt-dlp
    # 4. Prompt for ScrapeCreators key
    # 5. Save config to ~/.config/last30days/.env
```

Key features:
- **Async/parallel execution** (sources queried simultaneously)
- **Error recovery** (individual source failure doesn't stop entire research)
- **Rate limiting** (respects API quotas)
- **Caching** (avoid re-querying same source)
- **Logging** (detailed execution log)

#### lib/source.py

Abstract base class for search sources:
```python
class Source:
    async def search(self, query: str, num_results: int) -> List[Result]:
        """Search source for query, return results"""
    
    async def enrich(self, result: Result) -> Result:
        """Add metadata (comments, engagement, etc.)"""
    
    @property
    def name(self) -> str:
        """Source identifier (e.g., 'reddit', 'x', 'youtube')"""
    
    @property
    def requires_auth(self) -> bool:
        """Does this source require authentication?"""
```

Implementations:
- `RedditSource` — public API + ScrapeCreators
- `TwitterSource` — X API + FROM_BROWSER cookies + XAI (Grok)
- `YouTubeSource` — yt-dlp scraping
- `TikTokSource` — ScrapeCreators
- `InstagramSource` — ScrapeCreators
- `HackerNewsSource` — public API
- `PolymarketSource` — public blockchain data
- `BlueskySource` — public API
- `BraveSearchSource` — Brave API
- `ExaSearchSource` — Exa semantic search

#### Test Coverage (50+ test files)

Comprehensive testing of:
- Each source (mock API responses)
- Query parsing (different question types)
- Date filtering (30-day window enforcement)
- Deduplication (cross-source merging)
- Synthesis quality (LLM output evaluation)
- Cookie extraction (browser automation)
- Authentication (all token types)
- Rendering (markdown, HTML output)
- Setup wizard (new user onboarding)

### Capabilities Inventory

1. **Multi-source research:**
   - 10+ sources (Reddit, X, YouTube, TikTok, Instagram, HN, Polymarket, Bluesky, Truth Social, Brave, Exa)
   - Automatic source selection based on query type
   - Parallel execution for speed

2. **Authentication flexibility:**
   - Browser cookie scanning (no manual setup for X)
   - API keys (OpenAI, XAI, Brave, ScrapeCreators)
   - App passwords (Bluesky)
   - OAuth fallbacks

3. **Data enrichment:**
   - Comment/reply extraction (Reddit)
   - Engagement metrics (likes, retweets, views)
   - User credibility scoring (account age, follower count)
   - Entity extraction (people, products, companies)
   - Date filtering (strict 30-day window)

4. **Synthesis:**
   - LLM-generated summaries (Claude, ChatGPT, or Grok)
   - Citation tracking (which source, exact quote)
   - Confidence scoring (how certain are we)
   - Grounded research (everything backed by evidence)

5. **Storage & persistence:**
   - Save research to markdown files
   - Organized by date + topic
   - Searchable file structure
   - No cloud sync (local only)

6. **Quality assurance:**
   - 50+ test files covering all sources
   - Evaluation scripts for synthesis quality
   - Comparison analysis (v1 vs v2 search results)
   - Coverage reports

7. **Accessibility:**
   - First-run wizard (no auth expertise needed)
   - Optional components (TikTok/Instagram on demand)
   - Graceful degradation (missing source doesn't break research)
   - Clear output (markdown reports)

### Installation & Runtime Requirements

- **Python 3.8+**
- **Node.js 18+** (for some integrations)
- **yt-dlp** (for YouTube transcripts) — auto-installed by setup wizard
- **pip packages:** requests, aiohttp, beautifulsoup4, lxml, pydantic, and others (see setup)
- **API keys (optional):**
  - `SCRAPECREATORS_API_KEY` (enables Reddit comments, TikTok, Instagram)
  - `OPENAI_API_KEY` (synthesis via ChatGPT)
  - `XAI_API_KEY` (synthesis via Grok)
  - `BRAVE_API_KEY` (Brave Search)
  - `BSKY_HANDLE` + `BSKY_APP_PASSWORD` (Bluesky)
  - `TRUTHSOCIAL_TOKEN` (Truth Social)
- **Browser:** Chrome/Chromium (for X cookie extraction)
- **Storage:** ~50MB for cache + test fixtures

### Current State on Machine

- Repository downloaded, structure intact
- Not installed (no python venv, no dependencies)
- No `~/.config/last30days/.env` (would exist if configured)
- Not running

### Integration Opportunities

1. **Research skill for 27-agent system:**
   - `/last30days <topic>` invoked by agents needing current research
   - Research skill feeds into planning agents (market context)
   - Results injected into context for informed decision-making

2. **Multi-source research as Claude-Mem observation:**
   - Research results stored as observations in SQLite
   - Searchable via `/mem-search` in future sessions
   - Avoid repeated research on same topics

3. **Cross-skill workflows:**
   - `/plan-ceo-review` calls `/last30days` for market context
   - `/qa` uses `/last30days` to check for recent quality standards/best practices
   - `/investigate` uses `/last30days` for incident context (if it's a known issue)

4. **Real-time trends integration:**
   - Monitor trending topics in specified domains (e.g., "AI tools", "startup funding")
   - Automatic research on trending topics
   - Alert agents to emerging opportunities/threats

5. **Source optimization:**
   - Each agent reports which sources were most valuable
   - System learns source priority per agent type
   - Allocate API quota more efficiently

### Conflicts & Risks

1. **API dependency:** 10+ external sources, each with rate limits, authentication, terms of service. Fragile if any service changes.

2. **Credential management:** Complex setup with multiple API keys. Risk of leaking credentials if not careful (e.g., in git history, logs).

3. **Data accuracy:** Synthesis relies on LLM; can hallucinate or misrepresent sources. Requires human verification.

4. **Source churn:** Social media platforms change APIs frequently. Requires ongoing maintenance (test failures indicate breaking changes).

5. **Rate limiting:** If system makes many parallel requests, may hit API quotas. Needs intelligent backoff + caching.

6. **Legal/ToS:** Scraping some sources (Instagram, TikTok via SC) may violate ToS. ScrapeCreators claims legitimacy but risk exists.

7. **Performance:** Large research queries (10+ sources, 100+ results each) may take 30-60 seconds. Timeout issues in automated workflows.

### Verdict

**RESEARCH SKILL + DATA SOURCE**

last30days is a **specialized research skill** providing access to 10+ sources with intelligent synthesis. Integrate as:

1. **Agent capability:** Make available to gsd-2 via skill pack
2. **Cited research:** Synthesis includes citations (audit trail for decision-making)
3. **Cache-first:** Store research in claude-mem; avoid redundant API calls
4. **Opt-in sources:** Let agents choose which sources matter (don't query all 10 every time)
5. **Quality gate:** Verification phase checks that synthesis is grounded (not hallucinated)

**Extractable patterns:**
- Multi-source aggregation pattern (applicable to other domains)
- Source abstraction (add new sources by implementing `Source` base class)
- Cookie extraction technique (reusable for other auth mechanisms)
- Synthesis evaluation (quality metrics for LLM outputs)

**Risk mitigation:**
- Regular testing (50+ tests catch source API changes)
- Credential encryption (don't log API keys)
- Rate limiting config (per-source quotas)
- Fallback chain (if premium source unavailable, use free alternative)

---

## SUMMARY & INTEGRATION ROADMAP

### Ecosystem Overview

| Repo | Role | Status | License | Complexity |
|------|------|--------|---------|-----------|
| autoresearch | Research loop protocol | Experimental | MIT | Medium |
| claude-mem | Memory infrastructure | Production | AGPL-3.0 | High |
| gsd-2 | Master orchestrator | Production | MIT | Very High |
| gstack | Skill ecosystem | Production | MIT | High |
| last30days | Research skill | Production | MIT | High |

### Integration Priority

**Phase 1 (Foundation):**
1. Install GSD-2 (orchestration backbone)
2. Install claude-mem (memory + context continuity)
3. Install gstack skills (23 proven workflows)

**Phase 2 (Enhancement):**
4. Integrate last30days (research capability)
5. Add autoresearch pattern (for autonomous optimization)

**Phase 3 (Optimization):**
6. Tune provider routing (cost optimization)
7. Set up quality gates (verification before advancement)
8. Monitor execution metrics (agent performance)

### Key Risks to Monitor

- **AGPL license (claude-mem):** Verify compatibility before using
- **Windows support:** Test heavily on actual Windows hardware
- **State machine brittleness (gsd-2):** Comprehensive transaction testing critical
- **API churn (last30days):** Regular testing to catch breaking changes
- **Compute requirements (autoresearch):** H100 GPU not available; may need to skip or use forks

### Extracted Patterns (Reusable)

1. **Autonomous loop protocol** (autoresearch `program.md`)
2. **Hook system architecture** (claude-mem plugins)
3. **Skill.md template** (gstack canonical format)
4. **Quality gate framework** (gsd-2 verification)
5. **Multi-source aggregation** (last30days pattern)
6. **Worker daemon lifecycle** (claude-mem, gsd-2)
7. **SQLite state machine** (gsd-2 atomic transitions)
8. **Context window budgeting** (gsd-2 token optimization)

