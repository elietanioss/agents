# Work Decomposition Ladder

**Source:** merged from gsd-2 `docs/building-coding-agents/01-work-decomposition.md` + SuperClaude PLANNING.md pattern (previously two near-duplicate files: `work-decomposition-ladder.md` + `gsd2-work-decomposition-ladder.md` — combined here, no content dropped, overlap deduped, best examples from each kept).

## The compression ladder

```
Vision        → the business outcome (product lifecycle timeframe)
Capabilities  → user-facing things the system must DO (independently valuable)
Systems       → HOW it works internally (users don't see these)
Features      → vertical, end-to-end slices of a system (3-8 per system)
Tasks         → executable units, <1 day / <4hr, fits in one commit
```

**Example (real-time collaborative editor):**
```
Vision:        Ship a real-time collaborative editor
Capabilities:  Synchronous editing · Presence awareness · Persistence
Systems:       WebSocket sync engine (CRDT + conflict resolver) · Presence system · Storage
Features:      Initialize CRDT store · Insert at position · Delete range · Apply remote delta
Tasks:         Define CRDT Node type · Implement insert algorithm · Unit tests for edge cases
```

## MECE principle (Mutually Exclusive, Collectively Exhaustive)

At every level: no two items overlap (a line of code belongs to exactly one task), and nothing needed by the parent level is left uncovered.

**Check:** for each item, ask "could this belong to another item?" — if yes, refine boundaries. Then ask "is any part of the parent not covered?" — if yes, add the missing item.
**Test:** could two engineers work on separate systems in parallel without merge conflicts? If not, they weren't really MECE.

## Vertical slices, not horizontal layers

Wrong: Phase 1 = all schemas, Phase 2 = all APIs, Phase 3 = all UI, Phase 4 = integrate. Nothing works until the last phase, and all integration risk lands there.

Right: Feature 1 = one capability end-to-end (schema + API + UI, demoable). Feature 2 extends it. Each feature ships or demos independently; integration happens incrementally, not as a cliff at the end.

## 1-Day Rule

Any task estimating >1 day (>8 hours) is really a feature — decompose further, or explicitly escalate it to sub-milestone status if it's genuinely irreducible (external dependency, review cycle). This keeps scheduling predictable and keeps failure isolated to a single day's work.

## Parallelization topology (diamond pattern)

```
Planning (serial)
   → Fan Out [Task A | Task B | Task C] (parallel, interface-first — define contracts before implementing)
   → Convergence (serial — integration + E2E test)
   → Fan Out (next wave)
```
Rules: tasks in the same wave must not touch the same files (or must be explicitly coordinated); max concurrency 3–8 tasks per wave to avoid context fragmentation. Scan PLAN.md file paths across parallel tasks — if two touch the same file, they're not really independent; sequence them or merge them.

## Pre-planning validation — 6 questions (answer before writing any PLAN.md)

1. What problem does this phase solve?
2. Why now — what changed, what's the dependency that unblocked this?
3. What is the measurable outcome that proves success?
4. What is the smallest scope that's still valuable?
5. What are the top 2 risks?
6. What decision, once made, constrains everything downstream — and can it be deferred or tested first?

Record answers in PLAN.md frontmatter; revisit if assumptions shift mid-phase.

## Complexity escalation

If a Capability doesn't fit one phase: split into multiple phases ordered by risk + learning velocity (risky/unknown work first, so later phases benefit from what was learned). If a Task still looks >1 day after full decomposition, you likely skipped a ladder level — recheck before accepting it as a heavy task.
