# BENCHMARK HARNESS PATTERN
*Derived from OpenSpace GDPVal benchmark | April 2026*
*Use to measure agent improvement ROI before deploying changes*

## When to Use
Before enhancing an agent's instructions or ref files, run a benchmark to establish baseline.
After enhancement, re-run to measure improvement. Only ship improvements that show measurable gain.

## Benchmark Structure

Define 10-20 representative tasks for the target agent:

```json
{
  "tasks": [
    {
      "id": "task-001",
      "agent": "gsd-executor",
      "description": "Execute a 3-task PLAN.md with one deliberate scope issue",
      "input": "path to PLAN.md",
      "success_criteria": [
        "All 3 tasks verified",
        "Scope issue surfaced (not silently fixed)",
        "SUMMARY.md written correctly"
      ],
      "token_budget": 8000,
      "time_budget_seconds": 120
    }
  ]
}
```

## Metrics to Track

| Metric | How to Measure |
|--------|---------------|
| Task completion rate | Tasks passing all success_criteria / total tasks |
| Token cost | Actual tokens used / token_budget |
| Time cost | Actual seconds / time_budget_seconds |
| Error rate | Tasks with unhandled failures / total tasks |
