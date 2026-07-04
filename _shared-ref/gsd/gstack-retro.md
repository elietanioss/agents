---
ref-name: retro
preamble-tier: 2
version: 2.0.0
description: |
  Weekly engineering retrospective. Analyzes commit history, work patterns,
  and code quality metrics with persistent history and trend tracking.
  Team-aware: breaks down per-person contributions with praise and growth areas.
  Use when asked to "weekly retro", "what did we ship", or "engineering retrospective".
  Proactively suggest at the end of a work week or sprint. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - AskUserQuestion
source: gstack
---

# retro (gstack)

Weekly engineering retrospective. Analyzes commit history and work patterns.

## When to Use

- End of week or sprint
- "weekly retro" / "what did we ship" / "engineering retrospective"
- Team wants visibility into velocity and patterns

## Process

### 1. Gather Data
```bash
git log --oneline --since="7 days ago" --format="%h %an %s"
git diff --stat HEAD~$(git log --oneline --since="7 days ago" | wc -l)
```

### 2. Analyze by Person (Team Mode)
For each contributor:
- What did they ship? (commits, features, fixes)
- What patterns stand out? (consistent areas, breadth vs depth)
- Praise: what was done well?
- Growth area: one thing to improve next week

### 3. Quality Metrics
- Test coverage delta
- Bug-to-feature ratio
- PR review turnaround
- Build success rate

### 4. Velocity Trends
Compare to previous weeks:
- Lines changed
- PRs merged
- Features shipped
- Bugs fixed vs introduced

### 5. Blockers and Patterns
- What slowed the team down?
- What patterns are emerging in the codebase?
- What technical debt accumulated?

## Output Format

```markdown
# Week of [DATE] — Engineering Retro

## What We Shipped
- [Feature 1]: [description, who, when]
- [Feature 2]: [description, who, when]

## By the Numbers
- Commits: N
- PRs merged: N
- Tests added: N

## Team Highlights
### [Person Name]
- Shipped: [specific work]
- Well done: [specific praise]
- Next week: [one growth area]

## Patterns and Trends
- [Observation about the codebase or process]

## Blockers Removed / Created
- [What slowed things down]

## Next Week Priorities
1. [Top priority]
2. [Second priority]
```

## Tone

Direct and concrete. Praise should be specific — not "good work" but "the auth refactor reduced login latency by 40% and the test suite is now clean." Growth areas should be actionable — not "communicate better" but "write the root cause in PRs before the fix."
