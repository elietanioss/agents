# Context Compaction (Claude Agent SDK)

**Source:** Anthropic cookbook `context-compaction.ipynb` — distilled from the raw notebook (verbose demo transcripts removed; API contract + guidance retained).

## What it is

`compaction_control` is a `tool_runner` parameter that auto-manages context in long tool-heavy loops: when token usage crosses a threshold, the SDK injects a summary prompt, has Claude produce a `<summary></summary>` block, clears the message history, and resumes with only the summary. Demonstrated result on a 5-ticket support-processing loop: 208,838 tokens baseline vs 86,446 tokens with compaction (58.6% reduction, 2 compaction events).

## API shape

```python
runner = client.beta.messages.tool_runner(
    model=MODEL,
    max_tokens=4096,
    tools=tools,
    messages=messages,
    compaction_control={
        "enabled": True,                       # required
        "context_token_threshold": 5000,        # optional, default 100_000
        "model": "claude-haiku-4-5",            # optional — cheaper model for the summary itself
        "summary_prompt": "...",                # optional — custom, see below
    },
)
```

## Threshold guidance

| Threshold | Use when |
|---|---|
| 5k–20k | Iterative processing with clear per-item boundaries (tickets, records, files) — frequent compaction, minimal accumulation |
| 50k–100k | Multi-phase workflows, fewer/larger checkpoints, expensive tool calls |
| 100k–150k | Task genuinely needs deep historical context; fewer compactions, higher per-call cost |
| 100k (default) | General long-running tasks with no special shape |

Don't set the threshold so low the summary generation itself re-triggers compaction.

## Custom summary prompt (structure that preserves what matters)

For GSD-style task execution, a compaction summary should preserve exactly the categories STATE.md already tracks:
1. **Task overview** — objective + success criteria + constraints
2. **Current state** — what's done, files touched, artifacts produced
3. **Discoveries** — constraints found, decisions + rationale, errors resolved, dead ends ruled out
4. **Next steps** — specific remaining actions, blockers, priority order
5. **Context to preserve** — user preferences, domain specifics, promises made

Wrap in `<summary></summary>` tags (SDK convention; not parsed but guides the model).

## When to use vs skip

**Use** for: sequential/independent-item processing (tickets, batch records), multi-phase workflows, extended analysis across many entities.

**Skip** for: short tasks (<50-100k tokens total — compaction is pure overhead), tasks needing a full audit trail, highly iterative refinement where every step depends on exact prior detail, server-side sampling loops (extended thinking, server-side web search — cache tokens accumulate and can trigger compaction prematurely based on cached content, not real conversation growth).

## Manual chat-loop pattern (no tool_runner)

For plain conversational loops without tools, implement the same idea by hand: track cumulative tokens after each turn, and when they cross your threshold, send the existing history plus a summarization prompt, then replace `messages` with just the returned `<summary>` text as a single user turn. Same 5-part structure as above applies.

## Information loss — the trade-off

Retained: IDs, categories/classifications, decisions, outcomes, progress status.
Lost: full tool-result bodies (complete KB articles, full drafted text, detailed intermediate reasoning).
Mitigation: custom summary prompts naming exactly what must survive; raise the threshold for tasks that need deep history; keep tasks modular so each phase builds on a summary rather than raw prior detail.

## GSD-executor application

This is the concrete mechanism behind "if context fills before plan completes: stop, write SUMMARY.md" — compaction is the same operation, just automatic and mid-task instead of at a plan boundary. For a PLAN.md with many tool-heavy tasks (bulk file edits, repeated verification runs), treat SUMMARY.md as a manual compaction checkpoint: same 5-part structure, written at plan boundaries rather than token thresholds.
