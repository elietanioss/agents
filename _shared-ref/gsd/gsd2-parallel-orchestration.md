# Parallel Milestone Orchestration

Run multiple milestones simultaneously in isolated git worktrees. Each milestone gets its own worker process, its own branch, and its own context window — while a coordinator tracks progress, enforces budgets, and keeps everything in sync.

> **Status:** Behind `parallel.enabled: false` by default. Opt-in only — zero impact to existing users.

## Quick Start

1. Enable parallel mode in your preferences:

```yaml
---
parallel:
  enabled: true
  max_workers: 2
---
```

2. Start: `/gsd parallel start`
3. Monitor: `/gsd parallel status`
4. Stop: `/gsd parallel stop`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Coordinator (your GSD session)                         │
│  - Eligibility analysis (deps + file overlap)           │
│  - Worker spawning and lifecycle                        │
│  - Budget tracking across all workers                   │
│  - Signal dispatch (pause/resume/stop)                  │
│  - Merge reconciliation                                 │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Worker 1 │  │ Worker 2 │  │ Worker 3 │              │
│  │ M001     │  │ M003     │  │ M005     │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Worker Isolation

| Resource | Isolation Method |
|----------|-----------------|
| Filesystem | Git worktree — each worker has its own checkout |
| Git branch | `milestone/<MID>` — one branch per milestone |
| Context window | Separate process — each worker has its own agent sessions |
| Metrics | Each worktree has its own `.gsd/metrics.json` |

## Eligibility Rules

1. **Not complete** — Finished milestones are skipped
2. **Dependencies satisfied** — All `dependsOn` entries must have status `complete`
3. **File overlap check** — Milestones touching the same files get a warning (still eligible)

## Configuration Reference

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `false` | Master toggle |
| `max_workers` | number (1-4) | `2` | Maximum concurrent workers |
| `budget_ceiling` | number | none | Aggregate cost ceiling in USD |
| `merge_strategy` | `"per-slice"` or `"per-milestone"` | `"per-milestone"` | When to merge back |
| `auto_merge` | `"auto"`, `"confirm"`, `"manual"` | `"confirm"` | How merge-back is handled |

## Commands

| Command | Description |
|---------|-------------|
| `/gsd parallel start` | Analyze eligibility, confirm, start workers |
| `/gsd parallel status` | Show all workers with state, units completed, cost |
| `/gsd parallel stop` | Stop all workers |
| `/gsd parallel pause` | Pause all workers |
| `/gsd parallel resume` | Resume all paused workers |
| `/gsd parallel merge` | Merge all completed milestones back to main |

## Merge Reconciliation

- `.gsd/` state files — **auto-resolved** by accepting the milestone branch version
- Code conflicts — **stop and report**. Merge halts, showing which files conflict.

## Safety Model

| Safety Layer | Protection |
|-------------|------------|
| Feature flag | `parallel.enabled: false` by default |
| Eligibility analysis | Dependency and file overlap checks |
| Worker isolation | Separate processes, worktrees, branches |
| `GSD_MILESTONE_LOCK` | Each worker only sees its milestone |
| Budget ceiling | Aggregate cost enforcement |
| Doctor integration | Detects and cleans up orphaned sessions |
