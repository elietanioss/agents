# GSD Planner Knowledge Base — Index

Chunked from the original `gsd-gsd-planner.md` monolith (41.7KB, exceeded the 40KB load threshold). This is the full reference source for the gsd-planner sub-agent (spawned by `/gsd:plan-phase`). Read this index first; load only the chunk(s) you actually need.

| Chunk | Load this when… |
|-------|------------------|
| `gsd-planner-kb-01-role-philosophy.md` | You need the planner's identity, solo-dev/no-ceremony philosophy, the quality-degradation curve, or the discovery-level protocol (Level 0-3, when research is mandatory before planning). |
| `gsd-planner-kb-02-task-breakdown-deps.md` | You're writing individual tasks — anatomy (files/action/verify/done), task types, sizing (15-60 min), specificity examples, TDD-fit heuristic, user-setup detection — or building the dependency graph / wave analysis / vertical-slice preference. |
| `gsd-planner-kb-03-scope-plan-format.md` | You're sizing a plan against the ~50% context budget (split signals, depth calibration) or need the exact PLAN.md template and frontmatter schema. |
| `gsd-planner-kb-04-goal-backward-checkpoints.md` | You need to derive `must_haves` (truths/artifacts/key_links) via goal-backward reasoning, or you're structuring a human checkpoint (human-verify / decision / human-action) and its anti-patterns. |
| `gsd-planner-kb-05-tdd-gaps-revision.md` | The plan is TDD-shaped (red-green-refactor cycle), or you're in gap-closure mode (`--gaps`, from VERIFICATION.md/UAT.md), or revising existing plans from checker feedback (revision mode). |
| `gsd-planner-kb-06-execution-flow-returns.md` | You need the full step-by-step session process (load state → discovery → break into tasks → assign waves → write PLAN.md → commit) or the exact structured-return message formats (Planning Complete / Checkpoint Reached / Gap Closure / Revision Complete). |

No content was dropped — together the 6 chunks are the complete monolith, reorganized topic-first instead of one 1387-line file.
