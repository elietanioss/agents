# Spec-Kit Constitution Gates for GSD Planning

**Source:** spec-kit/.specify/memory/constitution.md + github.com/github/spec-kit

## Overview

Constitution as an executable first-class artifact: a living set of binding governance principles that gate all downstream planning and execution decisions. Every PLAN.md must verify compliance before tasks begin.

## Constitution Model: Principles I–V

A constitution codifies the *values* and *non-negotiables* that define project success. These are distinct from *requirements* (what you build) and *constraints* (what you can't do).

### Principle I: Vision Clarity
**Statement:** "Every feature traces to a user outcome."

**Enforcement:** Plan MUST include traceability matrix linking:
- Each task → feature → capability → vision
- No task exists without upstream justification
- Remove tasks not traceable to vision

**Example Violation:**
```
Vision: "Ship collaborative real-time editor"
Feature: "User presence awareness"
Task: "Install Prometheus monitoring"
  → Violation: Monitoring doesn't trace to vision
  → Fix: Add task only if required by a feature
```

### Principle II: MECE Decomposition
**Statement:** "Work is mutually exclusive (no overlap) and collectively exhaustive (nothing missed)."

**Enforcement:** Plan MUST verify:
- No two tasks modify the same code region (or explicitly document pairing)
- Every capability needed for vision has a feature in the plan
- Every feature has all necessary tasks

**Example Violation:**
```
Feature: "CRDT insert"
  Task A: "Implement insertion algorithm"
  Task B: "Implement insertion algorithm"  ← Duplicate (not mutually exclusive)
  Fix: Merge into single task or split by scope (interface vs implementation)
```

### Principle III: Sequencing & Dependencies
**Statement:** "Task order respects knowledge dependencies and reduces rework."

**Enforcement:** Plan MUST include explicit dependency graph:
- "Task A must complete before Task B" (sequential)
- "Task A & Task B can run in parallel" (no shared files/data)
- Detect circular dependencies and break them

**Example Violation:**
```
Task: "Write integration test for API"
  Depends on: "API interface finalized"
  But: "Finalize API interface" depends on internal tests
  → Circular dependency
  Fix: Move "finalize interface" before "integration test"
```

### Principle IV: Incremental Value
**Statement:** "Each completed task delivers measurable value; no task's output is only internal scaffolding."

**Enforcement:** Plan MUST show per-task exit criteria:
- What gets shipped (or tested, or documented)?
- Who verifies it?
- How does it unblock downstream work?

**Example Violation:**
```
Task: "Research OAuth libraries"
  Deliverable: "Comparison doc"
  Exit criteria: "Doc written"
  Problem: If doc is read but decision is ignored, no value
  Fix: "Doc + selected library approved by team"
```

### Principle V: Risk & Learning Velocity
**Statement:** "High-risk tasks execute early; learning informs later decisions."

**Enforcement:** Plan MUST order tasks by:
1. **Technical risk:** Unknown → Known
2. **Learning velocity:** Do risky/experimental things before committing to architecture
3. **Example:** Build prototype spike before writing production code

**Example Violation:**
```
Phase 1: Write schema migrations
Phase 2: Build API
Phase 3: Spike: "Do we need caching?"
  → Violation: Should spike BEFORE phase 1 (architecture decision)
  Fix: Spike first, then plan phases with that knowledge
```

## Constitution Check Gate in PLAN.md

Every PLAN.md frontmatter should include a constitution validation section:

```yaml
---
plan: "Feature: Real-time sync"
phase: 2
wave: 1
constitution-check:
  vision-traced: true     # Every task traces to vision
  mece-verified: true     # No overlap, complete coverage
  dependencies-clean: true # No circular deps
  incremental-value: true  # Each task ships value
  risk-ordered: true       # Risky tasks first
constitution-violations: []  # List any violations
constitution-waivers: []     # List approved exceptions with rationale
---
```

## Pre-Planning Validation Checklist

**Before writing PLAN.md, answer these 6 strategic questions:**

1. **What problem does this phase solve?**
   - Clear problem statement, not a solution
   - Links to vision and user outcome

2. **Why now? What changed?**
   - What new information justifies this phase?
   - Why not do it in phase N-1?

3. **Measurable outcome?**
   - How do we know the phase succeeded?
   - Specific, quantifiable, verifiable

4. **Smallest scope that's still valuable?**
   - What's the minimum to deliver value?
   - What's the first slice we can ship?

5. **Top 2 risks?**
   - What could fail or take 3× longer?
   - How do we de-risk (prototype, spike, third-party)?

6. **Constraining decision?**
   - What decision, once made, shapes all downstream tasks?
   - Who owns this decision?
   - Can we test/defer it?

## Example: Constitution Check in Action

**Scenario:** Planning the "Persistence" feature for collaborative editor

**Raw task list:**
1. Design document schema
2. Write database schema migration
3. Implement save endpoint
4. Add unit tests
5. Write user docs
6. Integrate with UI

**Constitution check:**

| Principle | Status | Rationale | Fix |
|-----------|--------|-----------|-----|
| **Vision-Traced** | ✓ PASS | Every task serves "persist edits" capability | – |
| **MECE** | ✗ FAIL | "Design schema" and "Write migration" overlap (both define schema) | Split: "Design" outputs spec; "Migrate" executes spec |
| **Dependencies-Clean** | ✓ PASS | Migration → Save endpoint → Tests → Docs → UI (clear sequence) | – |
| **Incremental-Value** | ✓ PASS | After each task: runnable (save works / tests pass / docs updated / UI integrated) | – |
| **Risk-Ordered** | ✓ PASS | Highest risk is "Will DB choice work at scale?" This spikes in design phase. | – |

**Constitution violation found:** MECE failure. Fix before planning tasks.

## Constitution Waiver Pattern

Sometimes a violation is intentional (e.g., code duplication for fast iteration). Document it:

```yaml
constitution-waivers:
  - violation: "MECE: Tasks A & B both modify user schema"
    rationale: "Parallel implementation speeds up timeline; refactor after both shipped"
    owner: "Engineering lead"
    review-date: "2026-07-15"
    sunset-clause: "Remove waiver after schema refactor done"
```

## Linking Constitution to GSD Agents

- **gsd-roadmapper:** Validates constitution when deriving phases from goal
- **gsd-planner:** Runs constitution check before accepting PLAN.md as complete
- **gsd-executor:** Skips tasks that violate non-waivered constitution rules
- **gsd-verifier:** Checks if implementation matches constitution-promised behavior

## Template: Constitution.md for a Project

```markdown
# Project Constitution: [Project Name]

Version: 1.0.0 (Ratified 2026-07-03)

## Principles

### I. Vision Clarity
Every feature must trace to this outcome: [Vision statement]
- User: [Who benefits]
- Outcome: [What's true after]
- Success metric: [How we measure]

### II. MECE Decomposition
Work is partitioned with no overlap and no gaps.
- Phases are independent (except documented dependencies)
- Features within phases are independent
- All capabilities required by vision have a feature

### III. Sequencing & Dependencies
Task order respects knowledge and avoids rework.
- Critical path: [Sequence of blocking decisions]
- Parallel tracks: [Which features can run simultaneously]

### IV. Incremental Value
Every completed task delivers measurable value.
- No task outputs only scaffolding or drafts
- Exit criteria define what "done" means

### V. Risk & Learning Velocity
High-risk / high-learning tasks execute early.
- Spike on unknowns before committing architecture
- Validate assumptions with code, not theory

## Governance

- **Constitution owner:** [Name]
- **Approval threshold:** [Unanimous / 2/3 vote]
- **Review cadence:** [Weekly / per-phase]
- **Violation consequence:** [Block PR / Log issue / Waiver required]
```

