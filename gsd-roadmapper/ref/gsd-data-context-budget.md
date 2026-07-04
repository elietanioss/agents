# GSD Context Budget Reference
# Source: gsd-planner.md | Apply when sizing tasks and deciding when to split.

---

## Quality Degradation Curve

| Context Used | Quality Level | Behavior |
|-------------|---------------|----------|
| 0–30% | PEAK | Full reasoning, catches edge cases, best output |
| 30–50% | GOOD | Reliable — this is the target zone |
| 50–70% | DEGRADING | Misses details, shortcuts taken, errors creep in |
| 70%+ | POOR | Significant quality loss, unreliable output |

**Rule: Stop at 50% context used. Do not push to 70-80%.**

---

## The 50% Rule — WHY Not 80%

Four reasons to stop at 50%, not 80%:

1. **Discovery overhead** — reading files, understanding context eats budget before writing starts
2. **Verification requires context** — you need remaining context to check your own work
3. **Error recovery** — fixing mistakes takes context; no budget = can't fix
4. **Quality cliff is nonlinear** — degradation accelerates, 60% feels like 80% in practice

---

## Task Sizing

**Target: 15–60 minutes of work per task** (not per plan)

| Task Size | Estimated Context Cost | Action |
|-----------|----------------------|--------|
| Single file change | ~5–10% | Fine as standalone task |
| New component + hook | ~10–20% | Fine as one task |
| Feature slice (UI + API + DB) | ~20–35% | One task, possibly large |
| Multiple features | ~35–50% | Split into separate tasks |
| Full system implementation | 50%+ | Must split — too large |

---

## 2–3 Tasks Per Plan

**Maximum 3 tasks per PLAN.md.**

Why: Each task incurs discovery + implementation + verification overhead.
3 tasks × ~15% each = ~45% context = stays within GOOD zone.
4+ tasks push into DEGRADING territory before final task begins.

---

## Split Signals

**ALWAYS split when:**
- Task touches 5+ files
- Task introduces new data model AND new UI
- Task has 3+ distinct verification steps
- Any single task estimated >35% context

**CONSIDER splitting when:**
- Task touches 3–4 files across multiple layers
- Task has dependencies on previous task's output
- Two tasks could run sequentially with natural checkpoint

---

## Discovery Levels

Budget context per discovery level before implementation starts:

| Level | Description | Context Spent |
|-------|-------------|---------------|
| 0 | File paths known, structure understood | ~2–5% |
| 1 | Read 2–3 existing files for patterns | ~5–10% |
| 2 | Read 4–8 files, understand full feature area | ~10–20% |
| 3 | Deep audit: 8+ files, trace data flow end-to-end | ~20–35% |

**If discovery is Level 3, reduce tasks in plan to 1–2 max.**

---

## Context Per Task Estimation

```
Estimated context = (files to modify × complexity factor) + discovery overhead

Complexity factors:
  Simple edit (change a value, rename)    → 2–3% per file
  Add function/component                  → 5–8% per file
  New feature with integration            → 10–15% per file
  Complex logic with tests                → 15–20% per file
```

---

## Practical Rule

> Before starting a plan: estimate total context cost.
> If estimate > 40% → split into two plans.
> If estimate > 25% AND you're already at 20% used → split immediately.
