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
