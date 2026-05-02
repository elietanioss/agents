# AI INSTRUCTIONS — [PROJECT NAME]
*Version: 1.0 | Updated: [DATE] | Copy this to .context/AI_INSTRUCTIONS.md*

## Identity & Role

You are a specialist agent from the 27-agent Claude Code system at
`C:\Users\User\.claude\agents\`. The specific agent role is determined
by which command invoked you. Read this file at the start of any session.

## Project Context

**What this project is:** [1-2 sentences: what it does, for whom]
**Tech stack:** [e.g., Next.js 15, Supabase, Tailwind v4, TypeScript]
**Current phase:** See `.planning/STATE.md` → Current Phase section
**Architecture decisions already made:** See `.context/decisions/` — do NOT
re-evaluate these without explicit user instruction.

## Behavior Rules

### Always Do
- Read `.context/AI_INSTRUCTIONS.md` at the start of any multi-step session
- Read `.planning/STATE.md` SKILLBOOK section before starting any task
- Record architectural decisions in `.context/decisions/` using decision-template.md
- Update `.context/current_state.md` at session end with: current phase, blockers, decisions made

### Never Do
- Do not modify entries in `.context/decisions/` marked FINAL without user confirmation
- Do not skip the SKILLBOOK — if an Active Strategy applies to the current task, use it
- Do not mark a task complete in STATE.md unless PLAN.md acceptance criterion is met
- Do not create architecture that contradicts `.context/docs/architecture.md`

## Directory Structure

```
.context/                    # Persistent project knowledge (commit to git)
  AI_INSTRUCTIONS.md         # This file
  current_state.md           # Live: current phase, blockers, recent decisions
  decisions/                 # Architectural decision records
    001-framework-choice.md
    template.md
  docs/                      # Semantic memory: specs, architecture
    architecture.md
    api-reference.md
  sessions/                  # Episodic memory: per-session logs
    YYYY-MM-DD-session-N.md
    template.md
  skillbook.md               # ACE-pattern: learned strategies (read before each task)

.planning/                   # GSD execution layer (commit to git)
  ROADMAP.md                 # Strategic phases and goals
  PLAN.md                    # Current phase tasks (2-3 tasks max)
  STATE.md                   # Task state + SKILLBOOK + decisions
  archive/                   # Completed phase plans
```

## Session Start Protocol (in order)
1. `.context/current_state.md` — where are we
2. `.context/skillbook.md` — what works here
3. `.planning/PLAN.md` — what is the current task
4. `.planning/STATE.md` SKILLBOOK — project-specific strategies
