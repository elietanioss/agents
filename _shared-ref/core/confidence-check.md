# CONFIDENCE CHECK PATTERN
*Derived from SuperClaude confidence.py + reflexion.py | April 2026*

## When to Use
Apply before submitting any output that involves architectural decisions,
security implications, or task completion claims.

## Confidence Scoring Rubric (0-100)

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100 | High confidence — verified, tested, complete | Submit directly |
| 75-89 | Good confidence — reasonable but has gaps | Submit with caveats noted |
| 50-74 | Medium confidence — uncertain on key points | Flag for review, note what's uncertain |
| 0-49 | Low confidence — guessing or incomplete | DO NOT submit — gather more information first |

## Self-Check Checklist (run before any task output)

- [ ] Did I address ALL requirements stated in the task?
- [ ] Have I checked edge cases relevant to this output?
- [ ] Is my output in the correct format requested?
- [ ] For code: does it run / pass the verification step?
- [ ] For plans: does each task have a clear acceptance criterion?
- [ ] For security work: did I apply OWASP / STRIDE as applicable?
- [ ] Am I making assumptions not stated in the task? (if yes — state them explicitly)
- [ ] Have I checked STATE.md / SKILLBOOK for prior relevant decisions on this project?

## Reflexion Trigger

If confidence < 75 after self-check:
1. Identify exactly what is uncertain — write it out
2. Check if STATE.md SKILLBOOK has relevant prior learnings
3. Check if a ref file in this agent's ref/ directory covers the gap
4. If still uncertain after checking — surface the uncertainty explicitly rather than guessing
5. Never submit low-confidence output silently

## Failure Logging

When a task fails or produces incorrect output, log to:
`C:\Users\User\.claude\sessions\{agent-name}\failures.jsonl`

Format:
```json
{"task_id": "...", "agent": "...", "failure_type": "...", "error": "...", "timestamp": "...", "fix_applied": "..."}
```

Review failures weekly. Any agent with >15% failure rate on a task type → update that agent's ref files.
