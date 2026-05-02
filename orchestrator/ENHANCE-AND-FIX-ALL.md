---
name: enhance-and-fix-all
description: One-shot prompt to fix all agent ref paths to absolute, rewrite MASTER-CATALOG.md, and apply 8 research enhancements to orchestrator.md
tools: Read, Write, Edit, Bash, Glob, Grep
model: claude-opus-4-5
---

# FULL SYSTEM FIX — Self-Contained Claude Code Prompt
# Base: C:\Users\User\.claude\agents\
# Run from: anywhere — all paths are absolute

## MISSION

Three tasks, executed in order. Do not skip any step.

1. Rewrite MASTER-CATALOG.md with all correct absolute paths
2. Fix every agent .md file — replace relative/stale paths with absolute paths
3. Apply 8 research enhancements to orchestrator.md

---

## CONSTANTS (embed these — do not re-derive)

```
AGENTS_ROOT  = C:\Users\User\.claude\agents
SHARED_REF   = C:\Users\User\.claude\agents\_shared-ref
ORCHESTRATOR = C:\Users\User\.claude\agents\orchestrator
```

Agent list (26 agents + orchestrator):
api-designer, backend-specialist, code-archaeologist, database-architect,
devops-engineer, documentation-writer, explorer-agent, game-developer,
gsd-debugger, gsd-executor, gsd-planner, gsd-roadmapper, gsd-verifier,
mobile-developer, n8n-specialist, nano-genesis, penetration-tester,
performance-optimizer, project-manager, research-specialist, security-auditor,
seo-specialist, testing-specialist, ui-specialist, ux-specialist, veo-genesis,
orchestrator

---

## TASK 1 — Rewrite MASTER-CATALOG.md

Write this exact content to:
C:\Users\User\.claude\agents\orchestrator\ref\data\MASTER-CATALOG.md


--- MASTER-CATALOG.md START ---

# MASTER-CATALOG.md — Data Layer Reference
# All paths are ABSOLUTE. Relative paths are forbidden per orchestrator anti-patterns.
# Updated: Session 4 — migrated from D:\prompts\ to C:\Users\User\.claude\agents\

## 1. UI/UX Design Intelligence

```
Base: C:\Users\User\.claude\agents\orchestrator\ref\ui-ux\
Files:
  data\styles.csv         — UI styles (minimal, glassmorphism, brutalist, etc.)
  data\colors.csv         — Color palettes with hex values and mood descriptors
  data\typography.csv     — Font pairings with use-case tags
  data\ux-guidelines.csv  — UX rules with Do/Don't/severity columns
  data\ui-reasoning.csv   — Industry reasoning rules
  data\web-interface.csv  — Web interface patterns
  data\landing.csv        — Landing page patterns
  data\charts.csv         — Data visualization patterns
  data\icons.csv          — Icon usage guidelines
  data\products.csv       — Product UI patterns
  data\react-performance.csv — React performance patterns
  data\stacks\            — Stack-specific guidelines
  scripts\search.py       — BM25 full-text search across all CSVs
HOW TO USE: python "C:\Users\User\.claude\agents\orchestrator\ref\ui-ux\scripts\search.py" "<type>" --design-system --stack nextjs
TRIGGERS: Any UI/UX task — MANDATORY query before designing
AGENTS WITH OWN COPY:
  ui-specialist: C:\Users\User\.claude\agents\ui-specialist\ref\ui-ux\
  ux-specialist: C:\Users\User\.claude\agents\ux-specialist\ref\ui-ux\
```

## 2. n8n Workflow Templates

```
Catalog (orchestrator): C:\Users\User\.claude\agents\orchestrator\ref\data\n8n\catalog.csv
Full repo (n8n-specialist owns): C:\Users\User\.claude\agents\n8n-specialist\ref\repos\n8n-workflows-main\n8n-workflows-main\
HOW TO USE: Read catalog.csv to identify template → delegate to n8n-specialist with template name
NOTE: Orchestrator reads catalog only. n8n-specialist has the full repo and workflow_db.py.
TRIGGERS: Any automation, webhook, schedule, or integration task
```

## 3. GSD Methodology

```
Base: C:\Users\User\.claude\agents\orchestrator\ref\gsd\
Methodology:
  data\goal-backward.md          — Phase/task planning (backward from outcomes)
  data\deviation-rules.md        — 4 rules for unexpected work during execution
  data\verification-protocol.md  — 3-level artifact verification
  data\context-budget.md         — Context budget + quality degradation curve
GSD Sub-agents (11):
  agents\gsd-roadmapper.md
  agents\gsd-planner.md
  agents\gsd-executor.md
  agents\gsd-verifier.md
  agents\gsd-debugger.md
  agents\gsd-phase-researcher.md
  agents\gsd-plan-checker.md
  agents\gsd-integration-checker.md
  agents\gsd-project-researcher.md
  agents\gsd-research-synthesizer.md
  agents\gsd-codebase-mapper.md
TRIGGERS: Project planning, task breakdown, phased execution, quality verification
```


## 4. Sherlock Research Skills

```
Base: C:\Users\User\.claude\agents\orchestrator\ref\sherlock\
Skills:
  deep-research\SKILL.md    — Multi-pass parallel research with citations
  paper2code\SKILL.md       — 4-stage: paper PDF → executable Python
  paper-analyzer\SKILL.md   — PDF parsing for formulas/tables/LaTeX (needs MINERU_TOKEN)
  visual-architect\SKILL.md — System schema → DALL-E 3 / Midjourney prompts
  paper-comic\SKILL.md      — Dense content → visual narrative
  genimg-gemini-web\SKILL.md — Gemini image generation via web
AGENT WITH OWN COPY:
  research-specialist: C:\Users\User\.claude\agents\research-specialist\ref\sherlock\
TRIGGERS: Research reports, paper implementation, system visualization
```

## 5. Antigravity Skills — PER-AGENT MODEL

```
CRITICAL: Skills are NOT at a single global path. Each agent has ONLY its relevant skills.

Orchestrator full set (routing awareness):
  C:\Users\User\.claude\agents\orchestrator\ref\antigravity\skills\
  Contains all 21 skills: api-patterns, bash-linux, clean-code, code-review-checklist,
  database-design, deployment-procedures, documentation-templates, frontend-design,
  game-development, geo-fundamentals, mobile-design, nextjs-react-expert,
  nodejs-best-practices, performance-profiling, powershell-windows, red-team-tactics,
  seo-fundamentals, server-management, tailwind-patterns, vulnerability-scanner

Per-agent skill locations (each agent\ref\antigravity\skills\<skill>\SKILL.md):
  api-designer         → api-patterns
  backend-specialist   → database-design
  code-archaeologist   → clean-code, code-review-checklist
  database-architect   → database-design, nodejs-best-practices
  devops-engineer      → bash-linux, deployment-procedures, powershell-windows, server-management
  documentation-writer → documentation-templates
  game-developer       → game-development
  mobile-developer     → mobile-design
  penetration-tester   → red-team-tactics, vulnerability-scanner, playwright-cli
  performance-optimizer → clean-code, performance-profiling
  seo-specialist       → geo-fundamentals, seo-fundamentals
  ui-specialist        → frontend-design, nextjs-react-expert, tailwind-patterns
  ux-specialist        → frontend-design, tailwind-patterns
  explorer-agent       → (no skills — uses claude-system-code-archaeologist.md)
  nano-genesis, veo-genesis, n8n-specialist, testing-specialist,
  project-manager, security-auditor, research-specialist → (domain-specific ref files, no antigravity)

HOW TO USE: Read C:\Users\User\.claude\agents\<agent-name>\ref\antigravity\skills\<skill>\SKILL.md
Skills enrichment CSV: C:\Users\User\.claude\agents\orchestrator\ref\antigravity\skills-enrichment.csv
```

## 6. Intelligence Patterns

```
Path: C:\Users\User\.claude\agents\orchestrator\ref\data\intelligence\patterns.md
Source: Production system prompts from Cursor, Devin, v0, Windsurf, Claude Code, Manus
Also at: C:\Users\User\.claude\agents\_shared-ref\data\intelligence\patterns.md
Content: Tool discipline, two-mode operation, agentic loop, task tracking,
         code editing, memory scoring, communication discipline, parallel tool use
TRIGGERS: Orchestration design, agent coordination, context management decisions
```

## 7. Claude Cookbooks

```
Path: C:\Users\User\.claude\agents\orchestrator\ref\repos\claude-cookbooks-main\claude-cookbooks-main\
Key paths:
  patterns\agents\       — orchestrator-workers, evaluator-optimizer loop
  patterns\agents\prompts\ — research_lead_agent.md, research_subagent.md
  capabilities\          — RAG, classification, text-to-SQL, summarization
  extended_thinking\     — extended thinking patterns
  tool_use\              — parallel tools, memory cookbook, vision with tools
TRIGGERS: Advanced agentic patterns, RAG implementation, extended thinking
```

## 8. Shared Reference Library

```
Path: C:\Users\User\.claude\agents\_shared-ref\
Key files used by agents:
  core\ecc-cost-aware-pipeline.md     — Cost-aware agent pipeline patterns
  core\ecc-agentic-engineering.md     — Agentic engineering principles
  core\ecc-autonomous-agent-harness.md — Autonomous agent harness
  core\confidence-check.md            — Confidence scoring patterns
  core\reflexion-pattern.md           — Reflexion self-improvement loop
  core\ecc-context-budget.md          — Context budget management
  core\ecc-longform-guide.md          — Long-form content patterns
  core\ecc-continuous-learning.md     — Continuous learning patterns
  repos\                              — Source repos (superpowers, system-prompts, etc.)
NOTE: Always use absolute path C:\Users\User\.claude\agents\_shared-ref\<file> in agent files
```

--- MASTER-CATALOG.md END ---


---

## TASK 2 — Fix ALL Agent .md Files (Absolute Paths)

### THE RULE
The orchestrator anti-patterns state: "❌ Using relative paths in any agent reference"
Every path in every agent .md KNOWLEDGE BASE section must be absolute.

### PATH CONVERSION ALGORITHM

For each agent <NAME> in the agent list:

1. Read: C:\Users\User\.claude\agents\<NAME>\<NAME>.md
2. Apply these replacements:

   Pattern A — Relative ref\ paths:
   FIND:    ref\<anything>
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\<anything>

   Pattern B — Shared ref paths:
   FIND:    _shared-ref\<anything>
   REPLACE: C:\Users\User\.claude\agents\_shared-ref\<anything>

   Pattern C — Stale D:\prompts\ paths (if any remain):
   FIND:    D:\prompts\data\antigravity-kit-main\.agent\skills\<skill>\
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\antigravity\skills\<skill>\

   FIND:    D:\prompts\data\ui-ux-pro-max-skill-main\...\
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\ui-ux\

   FIND:    D:\prompts\claude-system\data\gsd\
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\gsd\data\

   FIND:    D:\prompts\data\sherlock-ai-plugin-main\...\skills\
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\sherlock\

   FIND:    D:\prompts\claude-system\data\intelligence\patterns.md
   REPLACE: C:\Users\User\.claude\agents\<NAME>\ref\data\intelligence\patterns.md

3. Write the corrected file back to the same path.
4. Log: "Fixed: <NAME>.md — <N> paths corrected"

### EXACT KNOWLEDGE BASE CORRECTIONS PER AGENT

Apply these exact absolute paths. Read the current file first, then surgically replace.

**api-designer:**
  ref\antigravity\skills\api-patterns\SKILL.md
  → C:\Users\User\.claude\agents\api-designer\ref\antigravity\skills\api-patterns\SKILL.md
  ref\core\02-BACKEND_SPECIALIST.md
  → C:\Users\User\.claude\agents\api-designer\ref\core\02-BACKEND_SPECIALIST.md

**backend-specialist:**
  ref\core\02-BACKEND_SPECIALIST.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\core\02-BACKEND_SPECIALIST.md
  ref\core\04-SECURITY_AUDITOR.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\core\04-SECURITY_AUDITOR.md
  ref\antigravity\skills\database-design\SKILL.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\antigravity\skills\database-design\SKILL.md
  ref\antigravity\skills-enrichment.csv
  → C:\Users\User\.claude\agents\backend-specialist\ref\antigravity\skills-enrichment.csv
  ref\antigravity-backend.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\antigravity-backend.md
  ref\mcp-builder-skill.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\mcp-builder-skill.md
  ref\mcp-node-server.md
  → C:\Users\User\.claude\agents\backend-specialist\ref\mcp-node-server.md
  ref\mcp-python-server.md
  → C:\Users\User\.clone\agents\backend-specialist\ref\mcp-python-server.md
  _shared-ref\core\ecc-memory-persistence.md
  → C:\Users\User\.claude\agents\_shared-ref\core\ecc-memory-persistence.md
  _shared-ref\core\ecc-cost-aware-pipeline.md
  → C:\Users\User\.claude\agents\_shared-ref\core\ecc-cost-aware-pipeline.md
  _shared-ref\core\confidence-check.md
  → C:\Users\User\.claude\agents\_shared-ref\core\confidence-check.md
  _shared-ref\core\reflexion-pattern.md
  → C:\Users\User\.claude\agents\_shared-ref\core\reflexion-pattern.md


**code-archaeologist:**
  ref\antigravity\skills\clean-code\SKILL.md
  → C:\Users\User\.claude\agents\code-archaeologist\ref\antigravity\skills\clean-code\SKILL.md
  ref\antigravity\skills\code-review-checklist\SKILL.md
  → C:\Users\User\.claude\agents\code-archaeologist\ref\antigravity\skills\code-review-checklist\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**database-architect:**
  ref\antigravity\skills\database-design\SKILL.md
  → C:\Users\User\.claude\agents\database-architect\ref\antigravity\skills\database-design\SKILL.md
  ref\antigravity\skills\nodejs-best-practices\SKILL.md
  → C:\Users\User\.claude\agents\database-architect\ref\antigravity\skills\nodejs-best-practices\SKILL.md
  ref\core\02-BACKEND_SPECIALIST.md
  → C:\Users\User\.claude\agents\database-architect\ref\core\02-BACKEND_SPECIALIST.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**devops-engineer:**
  ref\antigravity\skills\bash-linux\SKILL.md
  → C:\Users\User\.claude\agents\devops-engineer\ref\antigravity\skills\bash-linux\SKILL.md
  ref\antigravity\skills\deployment-procedures\SKILL.md
  → C:\Users\User\.claude\agents\devops-engineer\ref\antigravity\skills\deployment-procedures\SKILL.md
  ref\antigravity\skills\powershell-windows\SKILL.md
  → C:\Users\User\.claude\agents\devops-engineer\ref\antigravity\skills\powershell-windows\SKILL.md
  ref\antigravity\skills\server-management\SKILL.md
  → C:\Users\User\.claude\agents\devops-engineer\ref\antigravity\skills\server-management\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**documentation-writer:**
  ref\antigravity\skills\documentation-templates\SKILL.md
  → C:\Users\User\.claude\agents\documentation-writer\ref\antigravity\skills\documentation-templates\SKILL.md
  All ref\ → C:\Users\User\.claude\agents\documentation-writer\ref\
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**explorer-agent:**
  All ref\ → C:\Users\User\.claude\agents\explorer-agent\ref\
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**game-developer:**
  ref\antigravity\skills\game-development\SKILL.md
  → C:\Users\User\.claude\agents\game-developer\ref\antigravity\skills\game-development\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**gsd-debugger, gsd-executor, gsd-planner, gsd-roadmapper, gsd-verifier:**
  ref\gsd\data\<file>
  → C:\Users\User\.claude\agents\<agent-name>\ref\gsd\data\<file>
  ref\gsd\agents\<file>
  → C:\Users\User\.claude\agents\<agent-name>\ref\gsd\agents\<file>
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**mobile-developer:**
  ref\antigravity\skills\mobile-design\SKILL.md
  → C:\Users\User\.claude\agents\mobile-developer\ref\antigravity\skills\mobile-design\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**n8n-specialist:**
  ref\data\n8n\catalog.csv
  → C:\Users\User\.claude\agents\n8n-specialist\ref\data\n8n\catalog.csv
  ref\repos\n8n-workflows-main\
  → C:\Users\User\.claude\agents\n8n-specialist\ref\repos\n8n-workflows-main\
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**nano-genesis:**
  ref\core\07-NANO_GENESIS.md
  → C:\Users\User\.claude\agents\nano-genesis\ref\core\07-NANO_GENESIS.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**penetration-tester:**
  ref\antigravity\skills\red-team-tactics\SKILL.md
  → C:\Users\User\.claude\agents\penetration-tester\ref\antigravity\skills\red-team-tactics\SKILL.md
  ref\antigravity\skills\vulnerability-scanner\SKILL.md
  → C:\Users\User\.claude\agents\penetration-tester\ref\antigravity\skills\vulnerability-scanner\SKILL.md
  ref\antigravity\skills\playwright-cli\SKILL.md
  → C:\Users\User\.claude\agents\penetration-tester\ref\antigravity\skills\playwright-cli\SKILL.md
  ref\core\04-SECURITY_AUDITOR.md
  → C:\Users\User\.claude\agents\penetration-tester\ref\core\04-SECURITY_AUDITOR.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\


**performance-optimizer:**
  ref\antigravity\skills\clean-code\SKILL.md
  → C:\Users\User\.claude\agents\performance-optimizer\ref\antigravity\skills\clean-code\SKILL.md
  ref\antigravity\skills\performance-profiling\SKILL.md
  → C:\Users\User\.claude\agents\performance-optimizer\ref\antigravity\skills\performance-profiling\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**project-manager:**
  ref\core\10-PROJECT_MANAGER.md
  → C:\Users\User\.claude\agents\project-manager\ref\core\10-PROJECT_MANAGER.md
  ref\gsd\agents\<file>
  → C:\Users\User\.claude\agents\project-manager\ref\gsd\agents\<file>
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**research-specialist:**
  ref\sherlock\<skill>\SKILL.md
  → C:\Users\User\.claude\agents\research-specialist\ref\sherlock\<skill>\SKILL.md
  ref\repos\<repo>\
  → C:\Users\User\.claude\agents\research-specialist\ref\repos\<repo>\
  ref\data\intelligence\patterns.md
  → C:\Users\User\.claude\agents\research-specialist\ref\data\intelligence\patterns.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**security-auditor:**
  All ref\ → C:\Users\User\.claude\agents\security-auditor\ref\
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**seo-specialist:**
  ref\antigravity\skills\seo-fundamentals\SKILL.md
  → C:\Users\User\.claude\agents\seo-specialist\ref\antigravity\skills\seo-fundamentals\SKILL.md
  ref\antigravity\skills\geo-fundamentals\SKILL.md
  → C:\Users\User\.claude\agents\seo-specialist\ref\antigravity\skills\geo-fundamentals\SKILL.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**testing-specialist:**
  ref\gsd\agents\gsd-verifier.md
  → C:\Users\User\.claude\agents\testing-specialist\ref\gsd\agents\gsd-verifier.md
  ref\core\06-TESTING_SPECIALIST.md
  → C:\Users\User\.claude\agents\testing-specialist\ref\core\06-TESTING_SPECIALIST.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**ui-specialist:**
  ref\antigravity\skills\frontend-design\SKILL.md
  → C:\Users\User\.claude\agents\ui-specialist\ref\antigravity\skills\frontend-design\SKILL.md
  ref\antigravity\skills\nextjs-react-expert\SKILL.md
  → C:\Users\User\.claude\agents\ui-specialist\ref\antigravity\skills\nextjs-react-expert\SKILL.md
  ref\antigravity\skills\tailwind-patterns\SKILL.md
  → C:\Users\User\.claude\agents\ui-specialist\ref\antigravity\skills\tailwind-patterns\SKILL.md
  ref\ui-ux\scripts\search.py
  → C:\Users\User\.claude\agents\ui-specialist\ref\ui-ux\scripts\search.py
  ref\ui-ux\data\
  → C:\Users\User\.claude\agents\ui-specialist\ref\ui-ux\data\
  ref\core\03-FRONTEND_SPECIALIST.md
  → C:\Users\User\.claude\agents\ui-specialist\ref\core\03-FRONTEND_SPECIALIST.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**ux-specialist:**
  ref\antigravity\skills\frontend-design\SKILL.md
  → C:\Users\User\.claude\agents\ux-specialist\ref\antigravity\skills\frontend-design\SKILL.md
  ref\antigravity\skills\tailwind-patterns\SKILL.md
  → C:\Users\User\.claude\agents\ux-specialist\ref\antigravity\skills\tailwind-patterns\SKILL.md
  ref\ui-ux\data\
  → C:\Users\User\.claude\agents\ux-specialist\ref\ui-ux\data\
  ref\core\03-FRONTEND_SPECIALIST.md
  → C:\Users\User\.claude\agents\ux-specialist\ref\core\03-FRONTEND_SPECIALIST.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**veo-genesis:**
  ref\core\08-VEO_GENESIS.md
  → C:\Users\User\.claude\agents\veo-genesis\ref\core\08-VEO_GENESIS.md
  All _shared-ref\ → C:\Users\User\.claude\agents\_shared-ref\

**orchestrator (self):**
  ref\agentic-workflows.ipynb
  → C:\Users\User\.claude\agents\orchestrator\ref\agentic-workflows.ipynb
  ref\evaluator-optimizer.ipynb
  → C:\Users\User\.claude\agents\orchestrator\ref\evaluator-optimizer.ipynb
  ref\orchestrator-workers.ipynb
  → C:\Users\User\.claude\agents\orchestrator\ref\orchestrator-workers.ipynb
  ref\classification-patterns.ipynb
  → C:\Users\User\.claude\agents\orchestrator\ref\classification-patterns.ipynb
  ref\data\MASTER-CATALOG.md
  → C:\Users\User\.claude\agents\orchestrator\ref\data\MASTER-CATALOG.md
  _shared-ref\core\ecc-cost-aware-pipeline.md
  → C:\Users\User\.claude\agents\_shared-ref\core\ecc-cost-aware-pipeline.md
  _shared-ref\core\ecc-agentic-engineering.md
  → C:\Users\User\.claude\agents\_shared-ref\core\ecc-agentic-engineering.md
  _shared-ref\core\ecc-autonomous-agent-harness.md
  → C:\Users\User\.claude\agents\_shared-ref\core\ecc-autonomous-agent-harness.md
  _shared-ref\core\confidence-check.md
  → C:\Users\User\.claude\agents\_shared-ref\core\confidence-check.md
  _shared-ref\core\reflexion-pattern.md
  → C:\Users\User\.claude\agents\_shared-ref\core\reflexion-pattern.md


---

## TASK 3 — Apply 8 Enhancements to orchestrator.md

File: C:\Users\User\.claude\agents\orchestrator\orchestrator.md

Read the file first. Then apply each enhancement as a surgical edit.
Preserve ALL existing content — additions only unless specified.

### ENHANCEMENT 1 — Description Quality Standards
Add AFTER the anti-patterns block (❌ lines), BEFORE ## KNOWLEDGE BASE:

```markdown
## 1.5 Agent Description Quality Standards

The description field drives routing. It is the #1 routing lever — poor descriptions
cause mis-routes before any logic runs.

**Rules (apply when writing or updating any agent description):**
- ✅ Verb-first: "Fetches...", "Reviews...", "Validates...", "Generates..."
- ✅ Include trigger phrases: "Use proactively after...", "Always invoke before..."
- ✅ Name what the agent does NOT do (prevents over-routing to wrong specialist)
- ❌ No vague openers: "A specialist that...", "Handles..."
- ❌ No overlap with adjacent agent domains without a discriminating qualifier

**Routing confidence tiers:**
| Confidence | Signal | Action |
|------------|--------|--------|
| ≥85% | Clear single-domain match | Route silently |
| 50–85% | Partial match or mild ambiguity | Show routing decision, proceed |
| <50% | Multi-domain conflict or unclear | Ask ONE clarifying question |

**Fallback ladder:** Primary specialist → Secondary agent → Generalist → Clarify → Human
```

### ENHANCEMENT 2 — Routing Decision Engine (3 upgrades in STEP 1, 2, 3)

In STEP 1 (ANALYZE REQUEST), add after "Match against roster table above":
```
  → Confidence check:
    Tier 1 (instant): slash-commands, direct agent names → route immediately
    Tier 2 (main):    match intent against descriptions → score confidence
    Tier 3 (ambiguous): 2+ agents score similarly → LLM classify, pick winner
  → Below 50% confidence? Ask ONE clarifying question before routing.
```

In STEP 2 (SELECT MODE), add BEFORE mode list:
```
PARALLEL vs SEQUENTIAL:
  → READ-HEAVY + independent tasks (research, audit, comparison) → parallel / orchestrator-workers
  → WRITE-HEAVY + shared decisions (coding, build, migration) → single agent + compression
  → Mixed → default sequential; parallelize only clearly independent sub-tasks
```

In STEP 3 (ENFORCE CONTEXT BUDGET), REPLACE current content with:
```
STEP 3: ENFORCE CONTEXT BUDGET
  Quality zones (source: C:\Users\User\.claude\agents\orchestrator\ref\gsd\data\context-budget.md):
    0–30%  → PEAK: best quality, complex reasoning intact
    30–50% → GOOD: target zone, reliable output
    50–70% → DEGRADING: spawn fresh agent now — do not push past this
    70%+   → POOR: hallucinations increase, instruction-following degrades
  → Compaction trigger: 75-80% — never break tool-call/result pairs
  → Never load more than 2 agents simultaneously
  → Fresh agent per phase — not one agent carrying full pipeline context
  → Prompt cache target: >70% hit rate for repetitive agent loops
  → Warn user when pipeline requires multiple sessions
```

### ENHANCEMENT 3 — Typed Handoff Schema
In STEP 4 (EXECUTE + HANDOFF), add after "On failure: retry with specific feedback":
```
HANDOFF CONTRACT (Sequential Pipeline and GSD Pipeline modes):
  Required fields when passing between agents:
  - task.objective           → what the receiving agent must accomplish
  - task.success_criteria    → measurable definition of done
  - context.summary          → compressed trace (what receiver needs to know)
  - context.decisions_made   → architectural/design decisions already locked
  - budget.token_budget_remaining → so receiver can calibrate scope
  - return_contract.output_schema → required output format (most-skipped, highest-impact)

  Artifact pattern: outputs >2000 tokens → write to file, pass path only
  Anti-pattern: dumping full previous agent output into handoff payload
```

### ENHANCEMENT 4 — Failure Classification Section
Add as new section AFTER Section 3, BEFORE Section 4:
```markdown
## 3.5 Failure Classification & Retry Protocol

Classify before retrying — wrong retry strategy compounds failures.

| Class | Examples | Action |
|-------|----------|--------|
| PERMANENT | 401/403 auth, 400 validation, schema mismatch | Never retry — escalate immediately |
| TRANSIENT | Network timeout, 429 rate-limit, 503 | Exponential backoff + jitter (base=1s, cap=60s, max=3) |
| LLM-SPECIFIC | Hallucination, bad format, wrong tool | Retry-with-modified-prompt |
| BUDGET | Token runaway, context overflow | Circuit-break → summarize → spawn fresh |
| CASCADING | Downstream fails from upstream bad output | Trace to root — fix origin not symptom |

**Retry-with-modified-prompt:**
"Previous attempt failed with: <exact_error>. The specific issue: <diagnosis>. Correct and retry — do not repeat the same approach."

**Circuit breaker:** 3 consecutive same-class failures → stop, report failure signature + root cause hypothesis.
```

### ENHANCEMENT 5 — STATE.md to Quality Control Checklist
In Section 7 (Quality Control Loop), add these checklist items:
```
□ Session persistence: STATE.md updated at session end? (Current Task / Decisions / Blockers / Next Steps)
□ Multi-session pipeline: PLAN.md reflects current phase and STATE.md complements it?
□ If --resume used: verify context restored — read STATE.md as fallback (known CC bug #43696)
```

### ENHANCEMENT 6 — Agent Teams Criteria
REPLACE the current AGENT TEAMS section with:
```markdown
## AGENT TEAMS

Agent Teams enabled (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1).
Token cost: ~7× regular subagents. Use deliberately.

| Use Agent Teams when | Use Subagents (Task tool) when |
|---------------------|-------------------------------|
| Agents need to share findings across sessions | Agents work independently |
| Peer review: one agent challenges another's output | Simple parallelism (3-5 simultaneous reads) |
| Debate or synthesis required before a decision | Read-only tasks that succeed in isolation |
| Architecture decision needs adversarial review | GSD pipeline phases (handoff via PLAN.md) |

Default: subagents. Agent Teams is the escalation for contested decisions, not default parallelism.
Anti-pattern: Using Agent Teams for tasks that succeed independently — pays 7× for zero coordination benefit.
```

### ENHANCEMENT 7 — Fix KNOWLEDGE BASE absolute paths
In the KNOWLEDGE BASE section, replace all relative paths:
  ref\agentic-workflows.ipynb → C:\Users\User\.claude\agents\orchestrator\ref\agentic-workflows.ipynb
  ref\evaluator-optimizer.ipynb → C:\Users\User\.claude\agents\orchestrator\ref\evaluator-optimizer.ipynb
  ref\orchestrator-workers.ipynb → C:\Users\User\.claude\agents\orchestrator\ref\orchestrator-workers.ipynb
  ref\classification-patterns.ipynb → C:\Users\User\.claude\agents\orchestrator\ref\classification-patterns.ipynb
  ref\data\MASTER-CATALOG.md → C:\Users\User\.claude\agents\orchestrator\ref\data\MASTER-CATALOG.md
  _shared-ref\core\ecc-cost-aware-pipeline.md → C:\Users\User\.claude\agents\_shared-ref\core\ecc-cost-aware-pipeline.md
  _shared-ref\core\ecc-agentic-engineering.md → C:\Users\User\.claude\agents\_shared-ref\core\ecc-agentic-engineering.md
  _shared-ref\core\ecc-autonomous-agent-harness.md → C:\Users\User\.claude\agents\_shared-ref\core\ecc-autonomous-agent-harness.md
  _shared-ref\core\confidence-check.md → C:\Users\User\.claude\agents\_shared-ref\core\confidence-check.md
  _shared-ref\core\reflexion-pattern.md → C:\Users\User\.claude\agents\_shared-ref\core\reflexion-pattern.md

Also fix data table in Section 4 — replace all D:\prompts\ paths with the MASTER-CATALOG.md entries above.

### ENHANCEMENT 8 — STATE.md row in Section 4 Data Knowledge Base
Add this row to the data table in Section 4:
```
| Session recovery | STATE.md at project root | Multi-session pipelines — write at end, read at start |
```


---

## EXECUTION ORDER

Run all steps in this exact sequence. Do not parallelize tasks 1-3 (they depend on each other).

```
STEP 1: Write MASTER-CATALOG.md
  → Write the complete content from TASK 1 above to:
     C:\Users\User\.claude\agents\orchestrator\ref\data\MASTER-CATALOG.md
  → Verify file written: Read it back, confirm 8 sections present

STEP 2: Fix all agent .md files
  → For each agent in the list (27 total including orchestrator):
    a. Read C:\Users\User\.claude\agents\<agent>\<agent>.md
    b. Find all path references using Grep: grep -n "ref\\" or "_shared-ref\\" or "D:\\prompts\\"
    c. Apply the per-agent corrections from TASK 2
    d. Write the corrected file
    e. Log result
  → Run in batches of 5 agents to stay within context budget

STEP 3: Apply orchestrator enhancements
  → Read C:\Users\User\.claude\agents\orchestrator\orchestrator.md
  → Apply enhancements 1-8 from TASK 3 using surgical Edit tool
  → Run self-verification checklist (see below)
  → Write final file

STEP 4: Clean up
  → Delete this prompt file: C:\Users\User\.claude\agents\orchestrator\ENHANCE-AND-FIX-ALL.md
  → Print completion summary
```

## SELF-VERIFICATION CHECKLIST

After completing all steps, verify:
```
MASTER-CATALOG.md:
□ 8 sections present (UI/UX, n8n, GSD, Sherlock, Antigravity, Intelligence, Cookbooks, Shared-ref)
□ Zero D:\prompts\ references
□ Zero relative paths (all start with C:\)
□ Per-agent antigravity model documented correctly

Agent files (spot-check 5 agents):
□ No relative ref\ paths remaining
□ No _shared-ref\ relative references remaining
□ No D:\prompts\ references remaining
□ Absolute paths resolve to files that actually exist (use Read to verify 3 paths per agent)

orchestrator.md:
□ Section 1.5 (Description Quality Standards) added
□ Confidence tiers table present
□ Parallel vs sequential rule in STEP 2
□ 4-zone context quality curve in STEP 3
□ Handoff contract in STEP 4
□ Section 3.5 (Failure Classification) added
□ STATE.md checklist items in Section 7
□ Agent Teams criteria table added
□ All KNOWLEDGE BASE paths now absolute
□ All 26 agents still in roster (no agents removed)
□ All 6 pipeline templates still present
```

## FAILURE RECOVERY

If an agent file fails to write:
- Log the agent name and error
- Skip to next agent
- Report failures at the end
- Do NOT abort the entire run

If orchestrator.md enhancement fails mid-edit:
- Read current state of file
- Identify which enhancements were applied (check for section markers)
- Apply only remaining enhancements
- Never duplicate already-applied content

If a path verification fails (file not found):
- Log: "WARNING: <path> not found — keeping original reference"
- Do NOT blank out the path
- Add a TODO comment in the file: # PATH UNVERIFIED: <original>

