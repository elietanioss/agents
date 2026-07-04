# Work Decomposition Ladder (Phase-Level)

**Source:** gsd-2 `docs/building-coding-agents/01-work-decomposition.md` (ch.1) — restored/re-authored after an earlier pass deleted this file in error; content preserved from the original gsd2-work-decomposition-ladder.md.

## The compression ladder

```
Vision        → the business outcome (product lifecycle timeframe)
Capabilities  → user-facing things the system must DO (independently valuable)
Systems       → HOW it works internally (users don't see these)
Features      → vertical, end-to-end slices of a system (3-8 per system)
Tasks         → executable units, <1 day / <4hr, fits in one commit
```

Roadmapper's job stops at **Systems/Features** — phases map to this layer, never straight from Vision. Task-level decomposition (Features → Tasks) belongs to gsd-planner (`planner-kb-01-work-decomposition-ladder.md`).

**Example (real-time collaborative editor):**
```
Vision:        Ship a real-time collaborative editor
Capabilities:  Synchronous editing · Presence awareness · Persistence
Systems:       WebSocket sync engine (CRDT + conflict resolver) · Presence system · Storage
Features:      Initialize CRDT store · Insert at position · Delete range · Apply remote delta
```

## MECE principle (Mutually Exclusive, Collectively Exhaustive)

At every level: no two phases overlap (a line of code belongs to exactly one phase), and nothing needed by the vision is left uncovered.

**Check:** for each phase, ask "could this belong to another phase?" — if yes, refine boundaries. Then ask "is any part of the vision not covered?" — if yes, add the missing phase.
**Test:** could two engineers work on separate systems in parallel without merge conflicts? If not, they weren't really MECE.

## Vertical slices, not horizontal layers

Wrong: Phase 1 = all schemas, Phase 2 = all APIs, Phase 3 = all UI, Phase 4 = integrate. Nothing works until the last phase, and all integration risk lands there.

Right: Phase 1 = one capability end-to-end (schema + API + UI, demoable). Phase 2 extends it. Each phase ships or demos independently; integration happens incrementally, not as a cliff at the end. If a phase can't produce a demo, it's scaffolding, not a real phase.

## 1-Day Rule (phase-scale analog)

Applied at roadmap level: if a phase is so large no exit criterion is testable within a reasonable timeframe, it's actually two phases. Decompose further rather than accept a vague, open-ended phase.

## Complexity escalation

If a Capability doesn't fit one phase: split into multiple phases ordered by risk + learning velocity (risky/unknown work first, so later phases benefit from what was learned, not last where mistakes are expensive to unwind).

## Reference

- `C:\Users\User\.claude\agents\gsd-planner\ref\planner-kb-01-work-decomposition-ladder.md` — the same ladder carried down to Features → Tasks, plus MECE checks, parallelization topology, and the 6-question pre-planning gate (task-level detail gsd-roadmapper doesn't need).
