---
name: cost-optimizer
description: Standalone cost reduction skill for Claude Code sessions. Covers model routing, context budgeting, MCP overhead, caching, compression, skillbook patterns, and all benchmark data. Invoke with /cost-optimizer for a full session audit, or read sections directly.
trigger:
  - cost audit
  - token optimization
  - reduce cost
  - context budget
  - too expensive
  - model routing
  - /cost-optimizer
allowed-tools:
  - Glob
  - Grep
  - Read
  - Bash
  - Write
---

# COST OPTIMIZER SKILL

## HOW TO USE THIS SKILL
- **Full audit**: Read all sections, audit session setup, produce ranked fix list
- **Quick lookup**: Jump to section by topic (Model Routing, Context Budget, MCP, Caching, etc.)
- **Cite sources**: Every number is sourced — format `(Source: <file>)`

---

## SECTION 1: PRICING REFERENCE

Source: `skills/cost-aware-llm-pipeline/SKILL.md` (ECC repo)

| Model | Input $/1M | Output $/1M | Relative Cost |
|-------|-----------|------------|---------------|
| Haiku 4.5 | $0.80 | $4.00 | **1x** |
| Sonnet 4.6 | $3.00 | $15.00 | **~4x** |
| Opus 4.5 | $15.00 | $75.00 | **~19x** |

**Rule**: Haiku is 3-4x cheaper than Sonnet; Sonnet is ~4x cheaper than Opus; Opus is ~19x the cost of Haiku.

---

## SECTION 2: MODEL ROUTING RULES

### 2A. Task-Type Routing (Quick Reference)

Source: `the-longform-guide.md` (ECC), `ecc-agentic-engineering.md`

| Task Type | Model | Rationale |
|-----------|-------|-----------|
| Exploration/search | **Haiku** | Fast, cheap, sufficient |
| Simple edits (1 file) | **Haiku** | Clear instructions, no reasoning depth needed |
| Classification, boilerplate transforms, narrow edits | **Haiku** | — |
| Writing docs | **Haiku** | Structure is simple |
| Multi-file implementation | **Sonnet** | Best cost/quality balance for coding |
| PR reviews | **Sonnet** | Context + nuance without Opus cost |
| Implementation and refactors | **Sonnet** | — |
| Complex architecture | **Opus** | Deep reasoning required |
| Security analysis | **Opus** | Can't miss vulnerabilities |
| Debugging complex bugs | **Opus** | Needs to hold entire system in mind |
| Root-cause analysis, multi-file invariants | **Opus** | — |

**Default**: Sonnet for 90% of coding tasks. Upgrade to Opus only when:
- First attempt failed
- Task spans 5+ files
- Architectural decisions required
- Security-critical code

**Escalation rule**: Escalate model tier ONLY when lower tier fails with a clear reasoning gap.

### 2B. Complexity-Based Routing Thresholds

Source: `gsd2-token-optimization.md` (GSD-2 docs), `ADR-004-capability-aware-model-routing.md`

| Signal | Simple → Haiku | Standard → Sonnet | Complex → Opus |
|--------|----------------|-------------------|----------------|
| Step count | ≤ 3 | 4–7 | ≥ 8 |
| File count | ≤ 3 | 4–7 | ≥ 8 |
| Description length | < 500 chars | 500–2,000 chars | > 2,000 chars |
| Code blocks | — | — | ≥ 5 |

**Signal words that PREVENT simple classification** (force Standard or Complex):
`research`, `investigate`, `refactor`, `migrate`, `integrate`, `architect`, `redesign`,
`security`, `performance`, `concurrent`, `parallel`, `distributed`, `backward compat`, `migration`

Empty or malformed plans default to Standard (conservative fallback).

### 2C. Python Routing Code Pattern

Source: `ecc-cost-aware-pipeline.md`, `skills/cost-aware-llm-pipeline/SKILL.md`

```python
MODEL_SONNET = "claude-sonnet-4-6"
MODEL_HAIKU  = "claude-haiku-4-5-20251001"

_SONNET_TEXT_THRESHOLD = 10_000  # chars
_SONNET_ITEM_THRESHOLD = 30      # items

def select_model(text_length: int, item_count: int, force_model: str | None = None) -> str:
    if force_model is not None:
        return force_model
    if text_length >= _SONNET_TEXT_THRESHOLD or item_count >= _SONNET_ITEM_THRESHOLD:
        return MODEL_SONNET  # Complex
    return MODEL_HAIKU  # Simple (3-4x cheaper)
```

### 2D. GSD v2 Tier Mapping

Source: `gsd2-token-optimization.md`

| Tier | Unit Types | Model (budget profile) |
|------|-----------|----------------------|
| Light | `complete-slice`, `run-uat`, hooks | Haiku |
| Standard | `research-*`, `plan-*`, `execute-task`, `complete-milestone` | Sonnet |
| Heavy | `replan-slice`, `reassess-roadmap` | Opus / user default |

### 2E. Prompt-Level Scope Routing

Source: `skills/prompt-optimizer/SKILL.md` (ECC)

| Scope | Main Model | Planning Model |
|-------|-----------|----------------|
| TRIVIAL-LOW | Sonnet 4.6 | — |
| MEDIUM | Sonnet 4.6 | — |
| HIGH | Sonnet 4.6 | Opus 4.6 (architecture only) |
| EPIC | Sonnet 4.6 | Opus 4.6 (blueprint) |

---

## SECTION 3: CONTEXT BUDGET & QUALITY DEGRADATION

### 3A. Quality Degradation Curve

Source: `gsd/data/context-budget.md` (_shared-ref), `gsd-planner.md`

| Context Used | Quality | Behavior |
|-------------|---------|----------|
| 0–30% | **PEAK** | Full reasoning, catches edge cases, best output |
| 30–50% | **GOOD** | Reliable — target zone |
| 50–70% | **DEGRADING** | Misses details, shortcuts, errors creep in |
| 70%+ | **POOR** | Significant quality loss, unreliable |

**The 50% Rule**: Stop at 50% used. Do NOT push to 70–80%.

**Why 50% not 80%** (4 reasons):
1. Discovery overhead — reading files eats budget before writing starts
2. Verification requires context — need remaining context to check own work
3. Error recovery — fixing mistakes takes context; no budget = can't fix
4. Quality cliff is **nonlinear** — degradation accelerates, 60% feels like 80%

### 3B. Task Sizing

Source: `gsd/data/context-budget.md`

| Task Size | Context Cost | Action |
|-----------|-------------|--------|
| Single file change | ~5–10% | Fine standalone |
| New component + hook | ~10–20% | Fine as one task |
| Feature slice (UI + API + DB) | ~20–35% | One task, possibly large |
| Multiple features | ~35–50% | Split |
| Full system implementation | 50%+ | **Must split** |

**Complexity factors per file:**
- Simple edit (rename, change value): 2–3%
- Add function/component: 5–8%
- New feature with integration: 10–15%
- Complex logic with tests: 15–20%

**Discovery overhead by level:**
| Level | Description | Context |
|-------|-------------|---------|
| 0 | Paths known, structure understood | ~2–5% |
| 1 | Read 2–3 files | ~5–10% |
| 2 | Read 4–8 files | ~10–20% |
| 3 | Deep audit 8+ files, trace data flow | ~20–35% |

If discovery is Level 3 → reduce plan to 1–2 tasks max.

**Estimation formula:**
```
context = (files to modify × complexity factor) + discovery overhead
```

**Split triggers:**
- Estimate > 40% → split into two plans
- Estimate > 25% AND already at 20% used → split immediately
- Task touches 5+ files → always split
- Task has 3+ distinct verification steps → always split

**Max tasks per plan: 3**
3 tasks × ~15% each = ~45% → stays in GOOD zone.
4+ tasks → pushes into DEGRADING before final task starts.

### 3C. Token Estimation Formulas

Source: `skills/context-budget/SKILL.md` (ECC), `types.ts` (claude-mem)

- Prose: `words × 1.3`
- Code-heavy / mixed: `chars / 4`
- Estimation accuracy: ~85–90%, variance ±15%

### 3D. Resource Zone Model

Source: `MODE_Orchestration.md` (SuperClaude)

| Zone | Context Used | Behavior |
|------|-------------|---------|
| 🟢 Green | 0–75% | Full capabilities, normal verbosity |
| 🟡 Yellow | 75–85% | Efficiency mode, reduce verbosity, defer non-critical |
| 🔴 Red | 85%+ | Essential only, minimal output, fail fast on complex requests |

### 3E. Context Window Overhead Example

Source: `skills/context-budget/SKILL.md` (ECC), `ecc-context-budget.md`

```
16 agents   → ~12,400 tokens
28 skills   → ~6,200 tokens
87 MCP tools → ~43,500 tokens  ← biggest lever
2 CLAUDE.md → ~1,200 tokens
Total: ~63,300 tokens = ~31.6% of 200K window overhead
```

Removing 3 CLI-replaceable MCP servers → -27,500 tokens = **47% overhead reduction** in that example.

---

## SECTION 4: MCP OVERHEAD (BIGGEST LEVER)

Source: `skills/context-budget/SKILL.md`, `the-longform-guide.md` (ECC)

**Each tool schema costs ~500 tokens.**
A 30-tool server costs more than all skills combined.

**Thresholds to flag:**
- MCP servers > 10 → over-subscribed
- Active tools > 80 → over-subscribed
- Any server wrapping CLI tools that are available for free: `gh`, `git`, `npm`, `supabase`, `vercel` → replace with CLI + skill command

**200K context window practical reality:**
> "Your 200K context window before compacting might only be 70K with too many tools enabled. Performance degrades significantly."
(Source: `the-shortform-guide.md`, ECC)

**Rule of thumb**: Have 20–30 MCPs in config, but keep under 10 enabled / under 80 tools active.

**Agent description overhead:**
- Agent descriptions are loaded into EVERY Task tool invocation, even if the agent never runs
- Keep frontmatter description fields to **< 30 words**
- Agent files > 200 lines → flag as heavy

**Lazy loading impact**: Trigger-based skill activation reduces baseline context by **50%+**
(Source: `skills/strategic-compact/SKILL.md`, ECC)

**CLI over MCP**: Token cost is NOT solved by lazy loading alone. CLI + skill approach is still cheaper per invocation.
(Source: `the-longform-guide.md`, ECC)

---

## SECTION 5: CACHING TECHNIQUES

### 5A. Prompt Caching (Anthropic API)

Source: `skills/cost-aware-llm-pipeline/SKILL.md` (ECC)

Use for system prompts over **1,024 tokens** — saves both cost and latency.

```python
messages = [{"role": "user", "content": [
    {"type": "text", "text": system_prompt,
     "cache_control": {"type": "ephemeral"}},  # Cache this
    {"type": "text", "text": user_input},       # Variable part
]}]
```

### 5B. Content-Hash Caching (File Processing Pipelines)

Source: `skills/content-hash-cache-pattern/SKILL.md` (ECC)

SHA-256 content hash → `{hash}.json` file naming. O(1) lookup, path-independent, auto-invalidates on content change.

```python
_HASH_CHUNK_SIZE = 65536  # 64KB chunks for large files
```

**Anti-patterns:**
- Path-based caching (breaks on file move/rename)
- Cache logic inside processing function (SRP violation)

### 5C. Reflexion Error Cache (0-Token Reuse)

Source: `pm_agent/reflexion.py` (SuperClaude), `superclaude-reflexion-source.py` (_shared-ref)

```
Token Budget:
  Cache hit:  0 tokens  (known error → instant solution)
  Cache miss: 1-2K tokens (new investigation)

Performance:
  Error recurrence rate: <10%
  Solution reuse rate:   >90%
```

**Similarity threshold**: 0.70 word overlap (numbers normalized: "Expected 5, got 3" → "Expected N, got N")
**Mindbase score threshold**: > 0.70 (HTTP POST `localhost:18003/api/search`, 3s timeout)

Storage: `docs/memory/solutions_learned.jsonl` (primary), mindbase (secondary), grep fallback.

---

## SECTION 6: CONTEXT COMPRESSION TECHNIQUES

### 6A. GSD Token Profiles

Source: `docs/token-optimization.md` (GSD-2), `gsd2-token-optimization.md` (_shared-ref)

| Profile | Savings | What Changes |
|---------|---------|-------------|
| `budget` | **40–60%** | Simple tasks → Haiku; research phases skipped; context level minimal |
| `balanced` | **10–20%** | Subagent → Sonnet; slice research skipped; standard context |
| `quality` | 0% (baseline) | Everything runs, full context |

```yaml
# Cost-optimized preferences.yaml
token_profile: budget
budget_ceiling: 25.00
models:
  execution_simple: claude-haiku-4-5-20250414
context_management:
  observation_masking: true
  observation_mask_turns: 8
  tool_result_max_chars: 800
```

**Budget profile minimal context drops:**
- Decisions register
- REQUIREMENTS.md / PROJECT.md inlining
- UAT templates, secrets manifests
- Root GSD file inlining
- Summary truncated to most recent 1

### 6B. Observation Masking

Source: `gsd2-token-optimization.md`, `docs/token-optimization.md` (GSD-2)

```yaml
context_management:
  observation_masking: true       # default: true
  observation_mask_turns: 8       # replace tool results older than 8 user turns
  tool_result_max_chars: 800      # truncate individual results beyond this
```

Replaces tool results (`toolResult`, `bashExecution`) older than N turns with `[result masked — within summarized history]`. All assistant and user messages always preserved. **Zero LLM overhead.**

**Benchmark** (JetBrains, SWE-bench Verified, 500 tasks, up to 250-turn trajectories):
- 50%+ cost reduction vs unmanaged history
- Performance matched or slightly exceeded LLM summarization
(Source: `docs/token-optimization.md`, GSD-2)

### 6C. Budget Pressure Graduated Downgrading

Source: `gsd2-token-optimization.md` (_shared-ref)

| Budget Used | Effect |
|------------|--------|
| < 50% | No adjustment |
| 50–75% | Standard → Light |
| > 90% | Everything except Heavy → Light; Heavy → Standard |

**Adaptive failure learning**: If a tier's failure rate exceeds **20%** for a given task pattern (rolling window of last 50 entries), future classifications bump up one tier.
(Source: `docs/token-optimization.md`, GSD-2)

### 6D. TF-IDF Smart Context Selection

Source: `docs/token-optimization.md` (GSD-2)

For large files (> 3KB): TF-IDF semantic chunking at `budget` profile — relevant portions only, not full file.
Context formatting at `budget` + `balanced` inline levels uses compact notation saving **30–50% tokens** vs full markdown tables.

### 6E. Strategic Compaction

Source: `skills/strategic-compact/SKILL.md` (ECC)

| Phase Transition | Compact? | Why |
|-----------------|---------|-----|
| Research → Planning | Yes | Research context is bulky; plan is distilled output |
| Planning → Implementation | Yes | Plan is in TodoWrite or a file |
| After a failed approach | Yes | Clear dead-end reasoning |
| Mid-implementation | **No** | Losing variable names, file paths, partial state is costly |
| Debugging → Next feature | Yes | Debug traces pollute unrelated work |

**What survives compaction**: CLAUDE.md, TodoWrite tasks, memory files, git state, files on disk.
**What is lost**: Intermediate reasoning, previously-read file contents, tool call history, nuanced verbal preferences.

**Trigger threshold**: Default 50 tool calls before first compaction suggestion; every 25 calls after.
Command: `/compact Focus on implementing X next` (guide what to retain)

### 6F. Context Virtualization

Source: `skills/strategic-compact/SKILL.md` (ECC)

`context-mode` MCP: demonstrated **315KB → 5.4KB** (~98.3% reduction).
`token-optimizer` MCP: automated 95%+ token reduction via content deduplication.

---

## SECTION 7: MEMORY & RETRIEVAL EFFICIENCY

### 7A. 3-Layer Progressive Disclosure

Source: `README.md` (claude-mem), `mcp-server.ts`

```
Layer 1: search(query)        → ~50-100 tokens/result   (compact index: ID, title, date)
Layer 2: timeline(anchor=ID)  → chronological context
Layer 3: get_observations([IDs]) → ~500-1,000 tokens/result (full detail)

NEVER fetch full details without filtering first. 10x token savings.
```

**Always**: Layer 1 → filter IDs → Layer 3 only for relevant IDs.

### 7B. Session Start Context Injection

Source: claude-mem hooks, `ecc-continuous-learning.md`

On every `SessionStart` hook, compressed timeline auto-injected into system prompt. Zero tool calls needed to access recent memory.

**Stop Hook vs UserPromptSubmit** for learning:
- UserPromptSubmit: runs on every message → adds latency to every prompt
- **Stop Hook**: runs once at session end → lightweight, doesn't slow sessions
(Source: `the-longform-guide.md`, ECC)

### 7C. Smart Code Navigation

Source: `mcp-server.ts` (claude-mem)

- `smart_outline` — structural outline (signatures only, bodies folded) — "much cheaper than reading the full file"
- `smart_unfold` — expand specific symbol on demand
- `smart_search` — tree-sitter AST parsing with token counts

Pattern: outline first (cheap) → unfold specific symbol (targeted) → never read entire files unless necessary.

### 7D. Compression Ratio (claude-mem)

Source: `MarkdownFormatter.ts`, `types.ts` (claude-mem)

```typescript
const CHARS_PER_TOKEN_ESTIMATE = 4;  // token = chars / 4
```

Stats footer rendered into system prompt:
```
Stats: N obs (Xt read) | Yt work | Z% savings
```

Where:
- `read tokens` = chars of compressed context / 4
- `discovery tokens` = tokens used in original work
- `savings % = (discovery - read) / discovery × 100`

Deduplication: SHA-256 hash of `(session_id + title + narrative)`, 30-second window prevents double-storage.

---

## SECTION 8: BENCHMARK DATA (ALL SOURCES)

### 8A. ACE (Agentic Context Engine)

Source: `README.md` (ACE repo)

| Metric | Result | Context |
|--------|--------|---------|
| Token reduction | **49%** | Browser automation, 10-run learning curve |
| Consistency improvement | **2× pass^4** | Tau2 airline benchmark, 15 strategies, Haiku 4.5, no reward signals |
| Translation cost | **$1.50** | 14K lines Python→TypeScript, 119 commits, 0 build errors, 4 hours |
| CLI startup improvement | ~2s → ~50ms | After lazy imports (LiteLLM import alone was ~1.5s) |
| RR code reduction | ~3,500 → ~1,000 lines | PydanticAI migration, ~2,500 lines deleted |

### 8B. OpenSpace (GDPVal Benchmark)

Source: `README.md`, `gdpval_bench/README.md` (OpenSpace repo)

| Metric | Result | Context |
|--------|--------|---------|
| Income multiple | **4.2×** | vs ClawWork baseline, same LLM (Qwen 3.5-Plus) |
| Value capture | **72.8%** | $11,484 / $15,764 task value |
| Quality improvement | **+30pp** | 70.8% vs 40.8% best ClawWork agent |
| Phase 2 token savings | **~46%** | (Phase 2 uses 45.9% of Phase 1 tokens) |

**Token savings by category (Phase 1 → Phase 2):**
| Category | Token Savings | Income Gain |
|----------|-------------|------------|
| Documents & Correspondence | −56% | +3.3pp |
| Compliance & Form | −51% | +18.5pp |
| Media Production | −46% | +5.8pp |
| Engineering | −43% | +8.7pp |
| Spreadsheets | −37% | +7.3pp |
| Strategy & Analysis | −32% | +1.0pp |

165 skills evolved autonomously from 50 Phase 1 tasks. Most skills (28/29 Execution Recovery; 32/44 File Format I/O) were **CAPTURED from actual failures**, not pre-written.

### 8C. Regex-First Hybrid Pipeline

Source: `skills/regex-vs-llm-structured-text/SKILL.md` (ECC)

From production pipeline (410 items):
| Metric | Value |
|--------|-------|
| Regex success rate | **98.0%** |
| Low confidence items | 8 (2.0%) |
| LLM calls needed | **~5** |
| Cost savings vs all-LLM | **~95%** |

**Confidence threshold for LLM escalation**: 0.95 (items below go to LLM).

### 8D. mgrep vs grep

Source: `the-longform-guide.md` (ECC)

In 50-task benchmark, mgrep + Claude Code used **~2x fewer tokens** than grep-based workflows at similar or better judged quality.

### 8E. ACE Skillbook Pattern (Tau2 Benchmark)

Source: `gsd/skillbook-template.md` (_shared-ref)

- **2× consistency** improvement (pass^k)
- **49% token reduction**
- Model: Claude Haiku 4.5

### 8F. Observation Masking Research

Source: `docs/token-optimization.md` (GSD-2), JetBrains / SWE-bench Verified

- **50%+ cost reduction** vs unmanaged history
- 500 tasks, up to 250-turn trajectories
- Zero overhead vs LLM summarization

### 8G. Context Budget Savings (Example)

Source: `ecc-context-budget.md` (_shared-ref)

Removing 3 CLI-replaceable MCP servers: **-27,500 tokens = 47% overhead reduction**

### 8H. Lazy Loading Impact

Source: `skills/strategic-compact/SKILL.md` (ECC)

Trigger-table skill activation reduces baseline context by **50%+**.

---

## SECTION 9: CONFIDENCE CHECK PATTERN

Source: `pm_agent/confidence.py` (SuperClaude), `superclaude-confidence-source.py` (_shared-ref)

**Token Budget**: 100–200 tokens  
**ROI**: 25–250× token savings when stopping wrong direction

| Level | Score | Action |
|-------|-------|--------|
| High | ≥ 0.90 | ✅ Proceed with implementation |
| Medium | 0.70–0.89 | ⚠️ Continue investigation — DO NOT implement yet |
| Low | < 0.70 | ❌ STOP and continue investigation loop |

**5 weighted checks:**
| Check | Weight |
|-------|--------|
| No duplicate implementations | 25% |
| Architecture compliance | 25% |
| Official documentation verified | 20% |
| Working OSS references exist | 15% |
| Root cause identified (non-vague) | 15% |

**Vague root cause indicators** (fail the check): `maybe`, `probably`, `might`, `possibly`, `unclear`, `unknown`
Root cause must be > 10 characters.

**ROI breakdown:**
- Simple task (200 tokens budget): 5× ROI at minimum
- Medium task (1,000 tokens): 5–10× ROI
- Complex task (2,500 tokens): 12–25× ROI
- Stated range: **25–250× when wrong direction prevented**

---

## SECTION 10: ANTI-PATTERNS (RANKED BY COST)

### High Cost Anti-Patterns

1. **Using Opus for all tasks regardless of complexity** — 19× the cost of Haiku
   (Source: `ecc-cost-aware-pipeline.md`)

2. **MCP over-subscription** — Each tool = ~500 tokens; a 30-tool server costs more than all skills combined
   (Source: `skills/context-budget/SKILL.md`)

3. **Implementing at < 70% confidence** — 25–250× wasted tokens on wrong-direction work
   (Source: `superclaude-confidence-source.py`)

4. **Sending all text to LLM when regex handles 95%+** — ~95% savings available with regex-first hybrid
   (Source: `skills/regex-vs-llm-structured-text/SKILL.md`)

5. **Pushing context to 70–80%** — nonlinear quality cliff; 60% feels like 80%
   (Source: `gsd/data/context-budget.md`)

6. **4+ tasks per plan** — pushes into DEGRADING territory before final task begins
   (Source: `gsd/data/context-budget.md`)

7. **Repeating known-failed approaches** — without reflexion cache, errors can recur > 10%
   (Source: `superclaude-reflexion-source.py`)

8. **Horizontal phase architecture** — "Phase 1: All DB, Phase 2: All API, Phase 3: All UI" — can't verify independently, nothing works until end; wastes context on unverifiable work
   (Source: `gsd/data/goal-backward.md`)

9. **Retrying on ALL errors** — wastes budget on permanent failures; only retry: `APIConnectionError`, `RateLimitError`, `InternalServerError`
   (Source: `skills/cost-aware-llm-pipeline/SKILL.md`)

10. **Bloated agent descriptions** — description > 30 words loads into every Task tool invocation even if agent never runs
    (Source: `ecc-context-budget.md`)

### Context Anti-Patterns

- Redundant tool calls (Windsurf pattern: "only call tools when absolutely necessary")
- Using semantic search for exact-match lookups (wrong tool for the job)
- Level 3 discovery + 3 tasks = guaranteed degradation before final task
- Duplicate instructions in `~/.claude/rules/` AND project `.claude/rules/`
- Skills that repeat CLAUDE.md instructions
- Mega-files (thousands of lines) — both token cost AND first-attempt success rate are worse
- Compacting mid-implementation — loses variable names, file paths, partial state

### Cognitive Bias Anti-Patterns (Debugging)

Source: `gsd/agents/gsd-debugger.md` (_shared-ref)

| Bias | Trap | Recovery |
|------|------|---------|
| Confirmation | Only seeking evidence supporting hypothesis | Generate 3+ independent hypotheses first |
| Anchoring | First explanation becomes the anchor | Every 30 min: "If I started fresh, is this still the path?" |
| Sunk Cost | 2+ hours in, keep going despite evidence | Restart if: 3+ fixes that didn't work, can't explain behavior |

**Debug restart triggers** (save context by starting fresh):
1. 2+ hours with no progress
2. 3+ fixes that didn't work
3. Can't explain current behavior
4. Fix works but you don't know why

---

## SECTION 11: PARALLELIZATION COST PATTERNS

### 11A. Tool Call Parallelism

Source: `data/intelligence/patterns.md` (_shared-ref — Cursor pattern)

> Run independent tool calls simultaneously — always.
> - Two searches that don't depend on each other: run both in same response
> - Reading multiple files: batch all in one response
> - TodoWrite + first tool call can be in same response

### 11B. DAG-Based Parallel Tool Execution

Source: `FRONTIER-TECHNIQUES.md` (GSD-2), LLM Compiler pattern (ICML 2024)

Parallelizable tool calls: 60% of a typical coding turn (reads, greps, globs)
Per-turn latency reduction: **40–60%** with DAG execution

| Tool A | Tool B | Parallel OK? |
|--------|--------|-------------|
| Read(file) | Read(file) | ✅ Yes |
| Read(file) | Grep(pattern) | ✅ Yes |
| Read(file) | Edit(file) | ❌ No (edit depends on read) |
| Edit(file) | Edit(same file) | ❌ No |

### 11C. Speculative Tool Execution

Source: `FRONTIER-TECHNIQUES.md` (GSD-2)

Prediction hit rates:
| Strategy | Hit Rate |
|----------|---------|
| Keyword extraction | 40–60% |
| Session history | 50–70% |
| Learned patterns | 60–80% |
| Model pre-query (fast model) | 70–85% |

Net positive if hit rate > 20%.

### 11D. Parallel Worker Architecture

Source: `docs/parallel-orchestration.md` (GSD-2)

```yaml
parallel:
  enabled: false         # default off — opt-in only
  max_workers: 2         # range 1-4
  budget_ceiling: 50.00  # aggregate USD ceiling across all workers
```

Each worker: separate git worktree, separate branch, separate context window, separate metrics.
Workers cannot spawn nested parallel sessions (`GSD_PARALLEL_WORKER` guard).
Stale detection: PID not running OR last heartbeat > 30 seconds.

**Optimal concurrency**: 3–8 simultaneous agents for most projects.
Above ~8 agents: coordination tax eats gains.

### 11E. Parallelization Decision Rules

Source: `building-coding-agents/05-parallelization-strategy.md` (GSD-2)

> Parallelize across boundaries, serialize within them.

- Don't parallelize tasks modifying the same files
- Don't parallelize interacting decisions
- Don't skip convergence/integration verification
- **Anti-pattern**: arbitrary terminal counts without necessity — each instance multiplies cost linearly

---

## SECTION 12: SKILLBOOK PATTERN (TOKEN REUSE)

Source: `gsd/skillbook-template.md` (_shared-ref), `ACE_ARCHITECTURE.md` (ACE repo), `OpenSpace README`

**Benchmark**: 2× consistency, 49% token reduction (Tau2, ACE). 4.2× income, 46% token reduction (GDPVal, OpenSpace).

**Mechanism**: Strategies from prior runs injected into agent prompt → avoids redundant exploration, tool calls, and error recovery loops.

**SKILLBOOK structure in STATE.md:**
```markdown
## SKILLBOOK

### Active Strategies
<!-- [CONFIDENCE: HIGH|MED|LOW] Strategy text -->
- [HIGH] Run npm run type-check before any TypeScript commit
- [MED] Project test suite requires npm run db:seed before npm test

### Reflection Log
| Task | Outcome | Lesson | Date |

### Discard Log
<!-- Approaches tried and confirmed failed — prevents re-attempting same failures -->
```

**How to use at session start:**
1. Read SKILLBOOK before any other file
2. Inject Active Strategies into task context — apply without being told
3. Check Discard Log before attempting any approach — never retry discarded approaches

**Promotion/demotion:**
- 3 successes with same strategy → [MED] → [HIGH]
- Any failure → [HIGH] → [MED]
- Second failure → move to Discard Log

---

## SECTION 13: GSD v2 FULL CONFIGURATION REFERENCE

Source: `gsd2-token-optimization.md` (_shared-ref), `docs/token-optimization.md` (GSD-2)

```yaml
---
version: 1
token_profile: balanced           # budget | balanced | quality
budget_ceiling: 25.00             # USD aggregate ceiling
models:
  planning: claude-sonnet-4-6
  execution: claude-sonnet-4-6
  execution_simple: claude-haiku-4-5-20250414
context_management:
  observation_masking: true
  observation_mask_turns: 8       # replace results older than 8 user turns
  tool_result_max_chars: 800      # truncate individual results
  compression_strategy: compress  # compress | truncate
  context_selection: smart        # smart | full (TF-IDF for budget profile)
parallel:
  enabled: false
  max_workers: 2
  budget_ceiling: 50.00
  merge_strategy: per-milestone
  auto_merge: confirm
git:
  isolation: worktree
  merge_strategy: squash
---
```

**Project-level PREFERENCES.md:**
```yaml
cost_budget_usd: 5.00            # Max spend per phase. Stop if approaching.
preferred_model: inherit
max_parallel_tasks: 2
stop_on_test_failure: true
auto_commit: true
require_quality_gate: true
```

---

## SECTION 14: COMPLETE KEY NUMBERS REFERENCE

| Metric | Value | Source |
|--------|-------|--------|
| Haiku cost | $0.80/$4.00 per 1M | ecc-cost-aware-pipeline.md |
| Sonnet cost | $3.00/$15.00 per 1M | ecc-cost-aware-pipeline.md |
| Opus cost | $15.00/$75.00 per 1M | ecc-cost-aware-pipeline.md |
| Haiku:Sonnet:Opus relative | 1×:4×:19× | ecc-cost-aware-pipeline.md |
| Sonnet text threshold | 10,000 chars | ecc-cost-aware-pipeline.md |
| Sonnet item threshold | 30 items | ecc-cost-aware-pipeline.md |
| Token reduction — budget profile | 40–60% | gsd2-token-optimization.md |
| Token reduction — balanced profile | 10–20% | cost-management.md (GSD-2) |
| Token reduction — ACE Skillbook | 49% | ACE README |
| Token reduction — OpenSpace Phase 2 | ~46% | OpenSpace README |
| Token reduction — mgrep vs grep | ~50% | ECC longform guide |
| Token reduction — regex-first hybrid | ~95% | ECC regex skill |
| Token reduction — lazy loading | 50%+ baseline | ECC strategic-compact |
| Token reduction — observation masking | 50%+ | GSD-2 docs |
| Confidence check cost | 100–200 tokens | confidence.py (SuperClaude) |
| Confidence check ROI | 25–250× | confidence.py (SuperClaude) |
| Reflexion cache hit | 0 tokens | reflexion.py (SuperClaude) |
| Reflexion cache miss | 1–2K tokens | reflexion.py (SuperClaude) |
| Error recurrence rate (with reflexion) | < 10% | reflexion.py |
| Solution reuse rate | > 90% | reflexion.py |
| Self-check detection rate | 94% | self_check.py (SuperClaude) |
| Self-check cost | 200–2,500 tokens | self_check.py |
| MCP tool schema overhead | ~500 tokens/tool | context-budget.md (ECC) |
| 3-layer memory retrieval savings | 10× | claude-mem README |
| Search result token cost | 50–100 tokens | claude-mem README |
| Full observation token cost | 500–1,000 tokens | claude-mem README |
| Context virtualization | 315KB → 5.4KB | strategic-compact (ECC) |
| Token estimation (prose) | words × 1.3 | ECC, claude-mem |
| Token estimation (code) | chars / 4 | ECC, claude-mem |
| Stop at context % | 50% | context-budget.md |
| Quality zone: peak | 0–30% | context-budget.md |
| Quality zone: good | 30–50% | context-budget.md |
| Quality zone: degrading | 50–70% | context-budget.md |
| Quality zone: poor | 70%+ | context-budget.md |
| Green zone | 0–75% | MODE_Orchestration.md |
| Yellow zone | 75–85% | MODE_Orchestration.md |
| Red zone | 85%+ | MODE_Orchestration.md |
| Max tasks per plan | 3 | context-budget.md |
| Task duration target | 15–60 min | context-budget.md |
| Agent file heavy threshold | > 200 lines | ecc-context-budget.md |
| Agent description bloat threshold | > 30 words | ecc-context-budget.md |
| Skill file heavy threshold | > 400 lines | ecc-context-budget.md |
| CLAUDE.md bloat threshold | > 300 lines combined | ecc-context-budget.md |
| Max MCP servers | 10 active | ECC shortform guide |
| Max active tools | 80 | ECC shortform guide |
| Observation masking turns | 8 | gsd2-token-optimization.md |
| Tool result max chars | 800 | gsd2-token-optimization.md |
| Similarity threshold (reflexion) | 0.70 word overlap | reflexion.py |
| Confidence threshold: proceed | ≥ 0.90 | confidence.py |
| Confidence threshold: investigate | 0.70–0.89 | confidence.py |
| Confidence threshold: stop | < 0.70 | confidence.py |
| Budget pressure: Standard→Light | > 50% budget | gsd2-token-optimization.md |
| Budget pressure: everything→Light | > 90% budget | gsd2-token-optimization.md |
| Adaptive routing failure threshold | 20% failure rate | GSD-2 token-optimization.md |
| Adaptive routing window | last 50 entries | GSD-2 token-optimization.md |
| Parallel workers | 1–4 (default 2) | parallel-orchestration.md |
| Optimal agent concurrency | 3–8 | building-coding-agents/05 |
| Stale session threshold | > 30 seconds | parallel-orchestration.md |
| libgit2 process spawns eliminated | ~70/dispatch cycle | git-strategy.md (GSD-2) |
| Prompt caching threshold | > 1,024 tokens | cost-aware-llm-pipeline (ECC) |
| ACE pass^4 improvement | 2× | ACE README |
| ACE learning cost (14K lines) | $1.50 | ACE README |
| OpenSpace income multiple | 4.2× | OpenSpace README |
| OpenSpace value capture | 72.8% | OpenSpace README |
| OpenSpace skills from 50 tasks | 165 | OpenSpace README |
| Document-gen skill family iterations | 13 versions | OpenSpace README |
| Token budget (simple task) | 200 | token_budget.py (SuperClaude) |
| Token budget (medium task) | 1,000 | token_budget.py (SuperClaude) |
| Token budget (complex task) | 2,500 | token_budget.py (SuperClaude) |
| pass@1 success rate | ~70% | ECC longform guide |
| pass@3 success rate | ~91% | ECC longform guide |
| pass^3 success rate | ~34% | ECC longform guide |
| Benchmark token budget/task | 8,000 tokens | openspace-benchmark-pattern.md |
| Benchmark time budget/task | 120 seconds | openspace-benchmark-pattern.md |
