# REFLEXION PATTERN
*Derived from SuperClaude reflexion.py | April 2026*

## Overview
Reflexion is a structured improvement loop where agents review their own
failure logs and generate improved instructions for themselves. Run weekly.

## Weekly Reflexion Cycle

### Step 1: Collect Failures
Read all `.jsonl` files in `C:\Users\User\.claude\sessions\*/failures.jsonl`
Group by agent name and failure_type.

### Step 2: Identify Patterns
For each agent with >2 failures of same type:
- What pattern keeps failing?
- Is this a knowledge gap (missing ref file)?
- Is this a instruction gap (missing rule in agent .md)?
- Is this a tool gap (agent needs a tool it doesn't have)?

### Step 3: Generate Fix
For knowledge gaps → write new content to agent's ref/ directory
For instruction gaps → add explicit rule to agent's main .md file
For tool gaps → add tool to agent's tools: frontmatter field

### Step 4: Document in SKILLBOOK
Update the relevant agent's SKILLBOOK (see skillbook-template.md):
- Add successful fix to Active Strategies
- Move failed approach to Discard Log

### Step 5: Clear Old Failures
Archive processed failures. Keep failures.jsonl clean so next week's review is fresh.

## Failure Types Taxonomy

| Type | Description | Typical Fix |
|------|-------------|-------------|
| `missing_context` | Agent didn't have info it needed | Add ref file or pointer |
| `wrong_tool` | Used incorrect tool for task | Add routing rule |
| `scope_creep` | Did more than asked | Strengthen DO NOT rules |
| `verification_skip` | Didn't verify before marking done | Add verification checklist |
| `stale_pattern` | Used outdated approach | Update ref file, add to Discard Log |
| `format_error` | Wrong output format | Add explicit format examples |
| `wrong_agent` | Task sent to wrong specialist | Update orchestrator routing |
