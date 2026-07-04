# ECC Memory Persistence Patterns

> Synthesized from: claude-mem (thedotmack/claude-mem), ACE Framework (agentic-context-engine), Aegis context persistence patterns.
> Purpose: Reference document for agents needing cross-session memory and state persistence.

---

## 1. Memory Layering Model

Three-tier memory hierarchy for Claude Code agent systems:

### Session Memory (Ephemeral)
- Scope: Single conversation/session
- Storage: In-context window only
- Lifetime: Destroyed when session ends
- Use: Working state, intermediate results, tool output
- Cost: Zero persistence overhead

### Project Memory (Durable)
- Scope: One project directory
- Storage: `STATE.md`, `PLAN.md`, `.claude/` project files
- Lifetime: Persists across sessions for same project
- Use: Task progress, skillbook strategies, phase tracking
- Key files:
  - `STATE.md` — Current execution state, completed tasks, blockers
  - `PLAN.md` — Phase plan with task breakdown
  - `SKILLBOOK` section in STATE.md — Learned strategies for recurring tasks

### Global Memory (Persistent)
- Scope: All projects, all sessions
- Storage: `~/.claude/CLAUDE.md`, `~/.claude/memory/`, plugin databases
- Lifetime: Permanent until explicitly pruned
- Use: User preferences, environment config, cross-project knowledge
- Key files:
  - `CLAUDE.md` chain — Global instructions loaded every session
  - `MEMORY.md` — Auto-memory for cross-session observations
  - Plugin DB (e.g., `~/.claude-mem/claude-mem.db`) — Structured observation store

---

## 2. Persistence Strategies

### File-Based Persistence (Default)
Simplest approach. Write state to markdown files in the project directory.

**Pattern:**
```
On task completion:
  1. Update STATE.md with completed task + outcome
  2. If new strategy discovered → add to SKILLBOOK section
  3. If session ending → write handoff notes for next session

On session start:
  1. Read STATE.md to resume context
  2. Read PLAN.md to understand current phase
  3. Read SKILLBOOK section before starting recurring task types
```

**Advantages:** No infrastructure, works offline, human-readable, version-controllable.
**Limitations:** No search, no deduplication, grows linearly.

### Database-Backed Persistence (Advanced)
For systems needing search, compression, and observation tracking.

**Pattern (from claude-mem):**
```
Lifecycle hooks:
  SessionStart    → Inject relevant past observations into context
  PostToolUse     → Capture tool usage as observation record
  SessionEnd      → Generate session summary, compress observations

Storage: SQLite + FTS5 for full-text search
Search: 3-layer progressive disclosure
  1. search()           → Compact index (~50-100 tokens/result)
  2. timeline()         → Chronological context around results
  3. get_observations() → Full details for filtered IDs only
  Token savings: ~10x vs fetching all details upfront
```

### Skillbook Persistence (ACE Pattern)
Learned strategies persisted and reloaded to reduce token cost on recurring tasks.

**Pattern (from ACE Framework persist.py):**
```
PersistStep:
  - Runs after every sample/task completion
  - Writes current skillbook to target file (e.g., STATE.md SKILLBOOK section)
  - Unlike checkpoint (full JSON at intervals), this writes on every update
  - Format matches what the target expects (markdown for CLAUDE.md, JSON for API)

Benchmark: 46-49% token reduction on recurring task types
  - ACE Tau2: 49% reduction
  - OpenSpace GDPVal: 46% reduction
```

---

## 3. Sync Patterns

### Cross-Session Handoff via STATE.md
The primary handoff mechanism for multi-session work:

```markdown
## STATE.md Structure
### Current Phase: [phase name]
### Completed Tasks:
- [x] Task 1 — outcome summary
- [x] Task 2 — outcome summary
### In Progress:
- [ ] Task 3 — current status, blockers
### SKILLBOOK:
- [Strategy name]: [What works, what to avoid]
### Next Session Should:
1. [First action to take]
2. [Context to load]
```

### Deduplication Strategy
Prevent observation/memory bloat across sessions:

1. **Content hashing** — Hash observation content before storing; skip duplicates
2. **Temporal windowing** — Merge observations from same file within N-minute window
3. **Compression on session end** — Summarize detailed observations into compact summaries
4. **Pruning by relevance** — Drop observations not referenced in last N sessions

### Context Budget Awareness
Memory injection must respect the context window budget:

```
Rule: Memory injection should not exceed 5-10% of context window
At 200K window: max ~10K-20K tokens for injected memory
Progressive disclosure reduces this to ~2K-5K for initial context
Full details loaded only on demand via search
```

---

## 4. Privacy and Filtering

- `<private>content</private>` tags — Strip before persistence (edge processing)
- Credential detection — Never persist API keys, tokens, passwords
- Scope boundaries — Project memory stays in project; never leak to other projects
- User control — All persistence is opt-in or explicitly configured

---

## 5. Anti-Patterns

| Anti-Pattern | Correct Approach |
|---|---|
| Loading all past observations into context | Use progressive disclosure (search → filter → load) |
| Persisting raw tool output verbatim | Compress to summary with key facts only |
| No deduplication across sessions | Hash-based dedup before storage |
| Ignoring context budget for memory | Cap memory injection at 5-10% of window |
| Writing STATE.md only at session end | Update incrementally after each task completion |
| Storing secrets in memory/observations | Strip credentials at edge before persistence |

---

## 6. Implementation Checklist

For agents implementing memory persistence:

- [ ] Define which memory tier(s) are needed (session/project/global)
- [ ] Choose persistence strategy (file-based vs DB-backed)
- [ ] Implement write-on-completion for STATE.md updates
- [ ] Add SKILLBOOK section for recurring task optimization
- [ ] Set context budget cap for memory injection
- [ ] Add deduplication for repeated observations
- [ ] Test cross-session handoff (end session, start new, verify continuity)
- [ ] Verify no secrets persist in memory store
