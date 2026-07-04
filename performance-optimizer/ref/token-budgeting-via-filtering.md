# Token Budgeting via Filtering (RTK Framework)

## Overview
Token context bloat from verbose command outputs is the #1 token leak in LLM-driven development. RTK (Rust Token Killer) provides a filtering + tracking framework that reduces per-session token consumption by 60-90% without sacrificing diagnostic information.

## Problem Statement

Unfiltered command outputs contain:
- **Boilerplate headers/footers** (license blocks, ASCII art, progress bars)
- **Success noise** (thousands of passing tests, grep results across 100 files)
- **Metadata cruft** (JSON object keys, environment dumps, build system logging)
- **Repetitive patterns** (git log with 50 identical commit headers)

**Example**: A single `cargo test --all` can emit 50KB+ of "test ok" noise. At ~0.75 words per token, this is ~18,000 tokens wasted on visual confirmation the build succeeded.

## Token Savings Framework

### Measurement Baseline

Before implementing filters, establish baseline:

```bash
# Measure: unfiltered output
COMMAND="git log --oneline -50"
TOKENS=$(echo "$(eval $COMMAND)" | wc -w | awk '{print int($1 / 0.75)}')
echo "Baseline tokens: $TOKENS"

# Apply filter
TOKENS_FILTERED=$(rtk run -- git log --oneline -50 | wc -w | awk '{print int($1 / 0.75)}')
echo "Filtered tokens: $TOKENS_FILTERED"

# Calculate savings
SAVINGS=$((TOKENS - TOKENS_FILTERED))
SAVINGS_PCT=$((SAVINGS * 100 / TOKENS))
echo "Savings: $SAVINGS tokens ($SAVINGS_PCT%)"
```

### Filtering Strategy by Command Type

#### File Operations (70-80% savings)
```
Strategy: Omit file metadata, truncate listings, condense paths
Example: ls -lah (45 columns) → ls -h (2 columns: size + filename)
```

**Commands & defaults**:
- `ls -la` → omit permissions, owner, group, date (keep size, name)
- `find` → omit inode, size (keep path, type)
- `cat file.log` → truncate to last 100 lines, remove repeated empty lines
- `tree` → limit depth 3, condense common prefixes

#### Git Operations (75-92% savings)
```
Strategy: Compress commit metadata, abbreviate hashes, skip merge commits in log
```

**Commands & defaults**:
- `git log` → limit 20 commits, oneline format, skip --all branches
- `git diff` → limit 500 lines, unified context=1, skip binary files
- `git status` → omit "On branch X" header, compress file lists
- `git branch -a` → omit remotes, condense orphaned refs

#### Build/Test (80-90% savings)
```
Strategy: Show failures only, suppress passed tests, condense compiler output
```

**Commands & defaults**:
- `cargo test` → show FAIL only (hide PASS), truncate at first 3 failures
- `npm test` → filter jest summary, skip coverage report
- `pytest` → collapse passing modules (show . not verbose module names)
- `go test` → inline errors (skip ok: package [0.5s] noise)

#### Cloud CLI (60-80% savings)
```
Strategy: Flatten JSON, summarize tables, omit null fields
```

**Commands & defaults**:
- `aws s3 ls` → condense output to: size, key (no metadata)
- `docker ps` → abbreviate container ID, omit CREATED/STATUS/PORTS details
- `kubectl get pods` → omit RESTARTS, READY (keep NAME, STATUS, AGE)

#### Package Management (60-75% savings)
```
Strategy: Collapse dependency tree, show only top-level, highlight conflicts
```

**Commands & defaults**:
- `pnpm ls` → depth 1, omit versions < 1 minor back
- `pip list` → critical packages only (sort by last-updated)
- `npm ls` → problematic/outdated only

## RTK Hook Integration

### Installation
```bash
rtk init -g
# Adds ~/.claude/hooks/pre-tool-use-rtk.sh
# Edits .claude/settings.json to enable hook
```

### Coverage
- **Applies to**: Bash tool calls (full stdout capture + filtering)
- **Does NOT apply to**: Read, Grep, Glob (these are already efficient)
- **Backward compatible**: Command runs unfiltered if RTK encounters error

### Per-Session Impact

| Command | Frequency | Baseline Tokens | Filtered Tokens | Savings per Use | Total Savings/Session |
|---------|-----------|-----------------|-----------------|-----------------|----------------------|
| git status | 10× | 600 | 120 | 480 | 4,800 |
| git diff | 5× | 2,500 | 250 | 2,250 | 11,250 |
| cargo test | 5× | 18,000 | 1,800 | 16,200 | 81,000 |
| ls -la | 10× | 400 | 150 | 250 | 2,500 |
| **Total/Session** | | | | | **~100,000 tokens** |

## Implementation Checklist for Performance-Optimizer

### Phase 1: Establish Baselines
- [ ] Document high-frequency commands in your projects (git, cargo/npm, ls, cat)
- [ ] Measure unfiltered token counts for each
- [ ] Define savings targets (60%+ minimum gate)

### Phase 2: Deploy RTK Hook
- [ ] Run `rtk init -g`
- [ ] Verify hook appears in `.claude/hooks/`
- [ ] Run test session with RTK active
- [ ] Measure filtered output tokens

### Phase 3: Track Trends
- [ ] Use `rtk gain --graph` monthly
- [ ] Log baseline + filtered tokens in session STATE.md
- [ ] Calculate cumulative ROI (tokens saved × cost per token)

### Phase 4: Tune Filters
- [ ] If savings <60%, review filter configuration
- [ ] Check if command pattern changed (e.g., new verbose flag)
- [ ] Adjust filter rules in ~/.claude/rtk.toml

### Phase 5: Integrate Into Cost Audit
- [ ] Add "RTK activation check" to cost-optimizer audit
- [ ] Recommend setup if sessions averaging >100K tokens/30min
- [ ] Calculate ROI: setup time (10 min) vs savings (80-90%)

## Quality Gates

- [ ] Savings target defined (60%+ minimum)
- [ ] Baseline measured before filtering
- [ ] Filtered output verified for correctness (no data loss)
- [ ] Trend tracked monthly (`rtk gain --graph`)
- [ ] If <60% savings, root-cause investigated
- [ ] High-frequency commands prioritized (git status, build commands)

## Cost Justification

**Setup time**: 10 minutes (install + configure)  
**Savings per 30-min session**: 80-100K tokens  
**Cost per 30-min at Haiku**: $0.30 → $0.06 with RTK  
**ROI**: Break-even in ~5 minutes of first session; 3 months = 9000K token savings

---

**Sources**:
- RTK Framework: https://rtk.dev
- Token approximation formula: words / 0.75 (GPT-3.5 empirical average)
