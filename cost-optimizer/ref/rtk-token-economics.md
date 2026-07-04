# RTK Token Economics & Savings Framework

## Overview
Rust Token Killer (RTK) is a CLI proxy that filters and compresses command outputs before they reach LLM context. Achieves 60-90% token savings by stripping boilerplate, truncating verbose output, and condensing repetitive patterns.

## Token Savings Targets by Command Category

| Category | Commands | Baseline Savings | Details |
|----------|----------|-----------------|---------|
| File ops | ls, cat, tree, find, grep | 70-80% | Boilerplate removal, line truncation, header stripping |
| Git ops | status, log, diff, commit, push | 75-92% | Metadata compression, commit condensing, patch diffing |
| Build/test | cargo, go, pytest, jest, npm | 80-90% | Show failures only, strip success noise, trim compiler warnings |
| Cloud | aws, docker, kubectl | 60-80% | Strip JSON bloat, condense resource lists, flatten tables |
| Package mgmt | pnpm, pip, bundle | 60-75% | Compact dependency trees, version deduplication |

## Measurement Model

### Baseline & Actual
- **Baseline**: Full unfiltered command output (tokens counted via GPT-3.5 approximation: `words / 0.75`)
- **Actual**: Filtered output with RTK smart filtering applied
- **Target gate**: 60%+ savings minimum; if <60%, investigate filter regression or command pattern change

### Diagnostic Commands
- `rtk gain --graph` — 30-day ASCII chart of token savings trend
- `rtk discover` — Per-project optimization opportunities (identifies high-frequency, high-token commands)

## Token Economics Model

### Example Session Baseline (30 min)
- **Without RTK**: ~118,000 tokens over 30 minutes
- **With RTK**: ~23,900 tokens (80% reduction)
- **Savings per session**: 94,100 tokens

### Cost Implications
- **Haiku**: 3× cheaper than Sonnet; RTK enables affordable long-form research
- **Sonnet**: Reasonable cost; RTK frees budget for higher-quality reasoning
- **Opus**: Prohibitively expensive without RTK; RTK enables Opus use on budget

## Integration with Claude Code

### RTK Hook System
- **Setup**: `rtk init -g` (installs hook + RTK.md reference)
- **Coverage**: Only Bash tool calls (does not affect Read/Grep/Glob built-ins)
- **Adoption**: 14 AI tools supported (Claude Code, Copilot, Cursor, Gemini, Codex, etc.)
- **Behavior**: PreToolUse hook intercepts Bash calls, reduces context bloat by auto-rewriting output

### High-Frequency Commands (Prioritize These)
- `git status` — 10x per session
- `git diff` — 5x per session
- `cargo test` or equivalent — 5x per session
- `ls` or file listings — 10x per session

## Quality Gate Checklist

- [ ] Token savings targets defined per command category (see table above)
- [ ] Baseline measurement taken (full output tokens)
- [ ] RTK filtering applied
- [ ] Actual output tokens measured
- [ ] Savings % calculated
- [ ] If <60%, investigate: filter regression or command pattern changed
- [ ] Monthly trend check: `rtk gain --graph` reviewed

## Implementation Pattern

When cost-optimizer audits a session:
1. Query RTK gain logs (if available)
2. Identify high-frequency, high-impact commands
3. Recommend RTK setup if not already active
4. Calculate projected savings (historical data × session frequency)
5. Prioritize: git + build commands yield 75%+ savings with lowest setup friction
