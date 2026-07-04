# CLAUDE.md Additions Proposal

**Date:** 2026-07-02  
**Source:** Extracted from claude-code-templates, everything-claude-code, new-N3-llmsec extractions  
**Status:** PROPOSAL — review before adding to global CLAUDE.md

---

## A. New Global Rule: LLM Security Boundary Enforcement

**Recommendation:** Add to GLOBAL AGENT SYSTEM section.

```markdown
## LLM SECURITY BOUNDARIES (NEW)

### Applies to: ALL agents that invoke Claude API, OpenAI, Gemini, or any LLM

1. **Never concatenate user input directly into prompts:**
   ```python
   # UNSAFE
   prompt = f"Answer: {user_input}"
   
   # SAFE
   from langchain.prompts import PromptTemplate
   template = PromptTemplate(input_variables=["query"], template="Answer: {query}")
   safe_input = html.escape(user_input)
   prompt = template.format(query=safe_input)
   ```

2. **System prompts must never be echoed or leaked:**
   - Never include system prompt in error messages
   - Never return system prompt in model output
   - Use instruction hierarchy (primary goal non-overridable by user input)

3. **API keys must NEVER be hardcoded in prompts:**
   - Inject via environment variables only
   - Use distinct secrets for each LLM provider (Claude, OpenAI, etc.)
   - Rotate keys immediately if exposed in code

4. **Output sanitization before rendering:**
   - HTML output: use DOMPurify
   - Markdown rendering: escape code blocks
   - Shell execution: validate against allowlist only

5. **Validate LLM function calls before execution:**
   - Treat LLM-generated SQL/shell commands as untrusted
   - Use parameterized queries for database calls
   - Sandbox function calls; never grant direct admin access

6. **Token limits must be enforced:**
   - Use model's native tokenizer (tiktoken for OpenAI, custom for Claude)
   - Never estimate as character_count / 4
   - Enforce hard cap per request; measure cost before invoking

7. **Model-specific trust assumptions are temporary:**
   - Safety checks must work regardless of model version
   - Re-evaluate after switching models (Claude 3.5 → Claude 4, etc.)
   - Include garak probe suite in model validation pipeline

### Testing:
- Unit test: prompt injection payload from lakera PINT dataset
- Integration test: garak probes (promptinject, encoding, sysprompt_extraction)
- E2E test: re-run all LLM safety tests after model version changes
```

---

## B. New Global Rule: Hooks Authoring Conventions

**Recommendation:** Add to infrastructure settings section.

```markdown
## HOOK AUTHORING RULES (NEW)

### Required in all hooks:
- `description` field (mandatory): one-line human-readable description
- `event` field: pre-tool-use, post-tool-use, pre-commit, post-commit, etc.
- `tool` matcher: "Edit|Write", "Bash", etc. (pipe for OR)

### Input/Output contract:
- **Input:** Read JSON from stdin: `{"tool_name": "...", "tool_input": {"file_path": "...", "command": "..."}}`
- **Output:** Write diagnostic to stderr if needed
- **Exit code:** 0 = pass/warn, 2 = BLOCK, 1 = fatal error

### Safety idioms:
```bash
# Always use 2>/dev/null || true on non-blocking hooks
some_check || exit 0  # Warn-only: never crash the hook

# Never use set -euo pipefail on warn-only hooks
# (strict mode combined with || true creates false negatives)

# For blocking hooks, be explicit:
if [[ condition ]]; then
  echo "BLOCKED: reason" >&2
  exit 2
fi
exit 0
```

### Three-tier severity model:
- **L1 (catastrophic):** always block (fork bomb, mkfs, rm /, chmod 777 /)
- **L2 (critical-path):** block with explanation (rm .git, rm .env, rm node_modules)
- **L3 (warn):** informational only, exit 0 (outdated spec, expensive operation)

### Environment variables available:
- `CLAUDE_TOOL_NAME`: name of the tool being hooked (e.g., "Edit")
- `CLAUDE_PROJECT_DIR`: absolute path to project root
- (Note: newer hooks read tool_input from stdin JSON instead of env vars)

### Recommended hook patterns:
- TDD-gate: PreToolUse on Edit|Write, block production code edits without test
- Plan-gate: PreToolUse on Edit|Write, warn if .spec.md not updated >14 days
- Dangerous-command-blocker: PreToolUse on Bash, block catastrophic commands
- Secret-scanner: Pre-commit, scan for 2025-era API key patterns
- Scope-guard: PreToolUse on Edit, warn if changes exceed .spec.md scope
- Format-check: Pre-commit, auto-fix with prettier/black/go fmt

See C:\Users\User\.claude\agents\_shared-ref\core\hooks-library.md for drop-in implementations.
```

---

## C. New Cost Rule: Model-by-Task Routing (Explicit)

**Recommendation:** Enhance existing cost section.

```markdown
### MODEL ROUTING — Refined (replaces prose "Haiku for search" rule)

| Task Type | Model | Token Budget | Rationale |
|---|---|---|---|
| Simple search, pattern lookup, 1-file read | Haiku 4.5 | 1-5K | No reasoning required; fast output |
| Single-domain coding (one agent, <2K LOC change) | Sonnet 4 | 5-30K | Balanced quality/cost; most tasks |
| Architecture review, multi-file refactoring, security | Opus 4 | 30-100K+ | Complex reasoning; 19× Haiku cost |
| Multi-agent orchestration (GSD pipeline) | Sonnet main agent, Haiku sub-agents | 50-200K | Route complex → Sonnet, simple sub-tasks → Haiku |
| Research → implementation pipeline | Haiku research, Sonnet implementation | 20-80K | Research is structured; implementation needs depth |

**Golden rule:** Don't pay Opus prices for simple execution. Use Haiku for EVERY sub-task that doesn't require deep reasoning (yes/no checks, code diffs, pattern matching, file reading).
```

---

## D. New Cost Rule: MCP Tool Overhead Accounting

**Recommendation:** Add to existing cost budget section.

```markdown
### MCP TOOL SCHEMA COST (NEW)

Each MCP tool adds ~500 tokens of schema overhead (tool_name, description, parameters, examples).

**Token cost of an agent invocation = base prompt + context + agent_file + activated_MCP_schemas**

Example:
- Simple task + Haiku: 10K tokens (context 5K, agent 3K, MCP tools 2K)
- Complex task + Sonnet: 50K tokens (context 20K, agent 5K, MCP tools 25K)

**Budget impact:**
- Each additional tool adds 500 tokens to EVERY agent using that tool
- Prefer CLI equivalents when available: `gh` (CLI) over `mcp__github__*` tools
- Disable unused MCP servers in .claude/settings.json

**When to use MCP:**
- Specialized domain tools (Supabase, Figma, Linear) — narrow, high-value
- Deactivate: generic MCP like raw "http-request" (use Bash curl instead)
```

---

## E. New Global Rule: Context Compaction Decision Table

**Recommendation:** Add to GSD/multi-session section.

```markdown
### WHEN TO COMPACT CONTEXT (NEW)

**Compact (summarize + spawn fresh agent) at these phase boundaries:**
- Research → Planning (distill findings to 500-token research summary)
- Planning → Implementation (distill PLAN.md to objective + 5 decision bullets)
- Implementation → Testing (current code state is implicit; just pass test plan)
- Testing → Next feature (archive test results; start fresh for new feature)

**NEVER compact mid-phase** (loses variable names, partial progress, recent context).

**What survives compaction:**
- CLAUDE.md (always included)
- Phase objective (1 sentence)
- Key decisions locked (tech stack, architecture choices)
- .spec.md / PLAN.md (if current phase)

**What dies:**
- Reasoning traces (keep only conclusions)
- Previous file contents (just list paths that matter)
- Stack traces (keep only root cause hypothesis)
- Session history >2 phases ago

**Cost savings:** 40-50% context reduction per compaction at phase boundary.
```

---

## F. Proposed New Skill: `ecc-llm-threat-taxonomy` (Reference, not Skill)

**Status:** This is a REFERENCE FILE, not a new skill.  
**Location:** `C:\Users\User\.claude\agents\_shared-ref\core\ecc-llm-threat-taxonomy.md`  
**Consumed by:** native-adversary v2.2, security-auditor (LLM extension), emergence-engine

**Do NOT add to CLAUDE.md.** It is already indexed in the Reference Library section of orchestrator.md.

---

## G. Proposed New Hook Presets

**Recommendation:** Optionally add to settings.json under `hooks` array.

```json
{
  "hooks": [
    {
      "event": "pre-tool-use",
      "tool": "Edit|Write|MultiEdit",
      "command": "bash ~/.claude/hooks/tdd-gate.sh",
      "description": "Require test file for production code edits (TDD-gate)"
    },
    {
      "event": "pre-tool-use",
      "tool": "Bash",
      "command": "python3 ~/.claude/hooks/dangerous-command-blocker.py",
      "description": "Block catastrophic shell commands"
    },
    {
      "event": "pre-commit",
      "command": "python3 ~/.claude/hooks/secret-scanner.py $(git diff --cached --name-only)",
      "description": "Scan for 2025-era API key patterns"
    }
  ]
}
```

See C:\Users\User\.claude\agents\_shared-ref\core\hooks-library.md for full implementations and installation.

---

## Summary of Changes

| Item | Type | Priority | File |
|---|---|---|---|
| LLM security boundaries (6 rules) | Rule | HIGH | CLAUDE.md / LLM SECURITY BOUNDARIES |
| Hook authoring conventions | Rule | MEDIUM | CLAUDE.md / HOOK AUTHORING RULES |
| Model routing table (refined) | Rule | HIGH | CLAUDE.md / MODEL ROUTING |
| MCP tool overhead accounting | Rule | MEDIUM | CLAUDE.md / MCP TOOL SCHEMA COST |
| Context compaction decision table | Rule | MEDIUM | CLAUDE.md / WHEN TO COMPACT CONTEXT |
| ecc-llm-threat-taxonomy.md | Reference | HIGH | _shared-ref/core/ |
| hooks-library.md | Reference | MEDIUM | _shared-ref/core/ |

---

## Review Checklist

- [ ] LLM security boundaries tested with garak probe suite before rolling out
- [ ] Hook patterns tested in CI/CD pipeline before mandating globally
- [ ] MCP overhead accounting verified with token-metered test runs
- [ ] Compaction decision table validated on a multi-session GSD pipeline
- [ ] Reference files linked in MASTER-CATALOG.md (already done)

**Approval:** Review by cost-optimizer agent before adding to production CLAUDE.md.
