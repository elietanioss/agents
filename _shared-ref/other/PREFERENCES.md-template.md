# PREFERENCES.md — Project Agent Configuration
*Copy to project root as PREFERENCES.md. Read by gsd-planner and gsd-executor.*

## Cost & Model

cost_budget_usd: 5.00          # Max spend per GSD phase. Stop and report if approaching.
preferred_model: inherit        # inherit | sonnet | opus | haiku
max_parallel_tasks: 2          # Max tasks running simultaneously in a wave

## Commands

test_command: npm test          # Run after each task for verification
build_command: npm run build    # Run before phase sign-off
type_check: npm run type-check  # Run before any TypeScript commit
lint: npm run lint              # Run before commit

## Style

code_style_guide: .eslintrc.json  # Path to style config (relative to project root)
commit_format: "type(scope): description"  # conventional commits
branch_prefix: feature/         # Branch naming

## Behavior

worktree_isolation: false       # true = git worktree per task (risky tasks only)
stop_on_test_failure: true      # true = surface immediately; false = continue and log
auto_commit: true               # Commit after each passing task
require_quality_gate: true      # Run 8-question gate before phase sign-off

## Notes

# Add project-specific agent instructions here.
# Example:
# - "Always use the existing error handler in src/lib/errors.ts"
# - "Never modify files in src/legacy/"
