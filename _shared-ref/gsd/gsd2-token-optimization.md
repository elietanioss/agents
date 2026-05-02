# Token Optimization

*Introduced in GSD v2.17.0*

GSD 2.17 introduces a coordinated token optimization system that can reduce token usage by 40-60% without sacrificing output quality for most workloads. The system has three pillars: **token profiles**, **context compression**, and **complexity-based task routing**.

## Token Profiles

Set in preferences:

```yaml
---
version: 1
token_profile: balanced
---
```

### `budget` — Maximum Savings (40-60% reduction)

| Dimension | Setting |
|-----------|---------|
| Planning/Execution models | Sonnet |
| Simple task model | Haiku |
| Milestone/Slice research | **Skipped** |
| Context inline level | **Minimal** |

Best for: prototyping, small projects, cost-conscious iteration.

### `balanced` — Smart Defaults (default)

| Dimension | Setting |
|-----------|---------|
| All models | User's default |
| Subagent model | Sonnet |
| Milestone research | Runs |
| Slice research | **Skipped** |
| Context inline level | **Standard** |

Best for: most projects, day-to-day development.

### `quality` — Full Context (no compression)

Every phase runs. Every context artifact is inlined. No shortcuts.

## Complexity-Based Task Routing

Tasks are classified by analyzing the task plan:

| Signal | Simple | Standard | Complex |
|--------|--------|----------|---------|
| Step count | ≤ 3 | 4-7 | ≥ 8 |
| File count | ≤ 3 | 4-7 | ≥ 8 |
| Description length | < 500 chars | 500-2000 | > 2000 chars |

**Signal words** that prevent simple classification: `research`, `investigate`, `refactor`, `migrate`, `integrate`, `architect`, `redesign`, `security`, `performance`, `concurrent`, `parallel`.

## Budget Pressure

When approaching budget ceiling:

| Budget Used | Effect |
|------------|--------|
| < 50% | No adjustment |
| 50-75% | Standard → Light |
| > 90% | Everything except Heavy → Light; Heavy → Standard |

## Observation Masking

*v2.59.0* — Replaces tool results older than N user turns with a placeholder before each LLM call. Zero LLM overhead.

```yaml
context_management:
  observation_masking: true
  observation_mask_turns: 8
  tool_result_max_chars: 800
```

## Configuration Examples

### Cost-Optimized Setup

```yaml
---
version: 1
token_profile: budget
budget_ceiling: 25.00
models:
  execution_simple: claude-haiku-4-5-20250414
---
```

### Full Quality for Critical Work

```yaml
---
version: 1
token_profile: quality
models:
  planning: claude-opus-4-6
  execution: claude-opus-4-6
---
```
