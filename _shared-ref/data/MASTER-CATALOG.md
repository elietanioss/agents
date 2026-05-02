# MASTER-CATALOG.md — Data Layer Reference
# Loaded by orchestrator to know what data exists and how to use it.
# Keep under 150 lines. Last updated: Session 2.

---

## 1. UI/UX Design Intelligence

```
Path: D:\prompts\data\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\src\ui-ux-pro-max\
Files:
  data\styles.csv        — 67 named UI styles (minimal, glassmorphism, brutalist, etc.)
  data\colors.csv        — 96 color palettes with hex values and mood descriptors
  data\typography.csv    — 57 font pairings with use-case tags
  data\ux-guidelines.csv — 99 UX rules with Do/Don't/severity columns
  data\ui-reasoning.csv  — 100 industry reasoning rules
  data\stacks\nextjs.csv — Next.js-specific component guidelines
  data\stacks\shadcn.csv — shadcn/ui component guidelines
  scripts\search.py      — BM25 full-text search across all CSVs
HOW TO USE: python "D:\prompts\data\ui-ux-pro-max-skill-main\ui-ux-pro-max-skill-main\src\ui-ux-pro-max\scripts\search.py" "<product type>" --design-system --stack nextjs
TRIGGERS: Any UI component or visual design task — MANDATORY to query before designing
```

---

## 2. n8n Workflow Templates

```
Path: D:\prompts\data\n8n-workflows-main\n8n-workflows-main\
Files:
  workflows\             — 188+ integration directories with JSON workflow files
  CLAUDE.md              — repo working instructions (read this first)
  workflow_db.py         — Python DB interface for querying workflows
  templates\             — Reference template workflows (9001-9004)
CATALOG: D:\prompts\claude-system\data\n8n\catalog.csv (built in Session 2)
HOW TO USE: Check catalog.csv first → navigate to matching integration dir → read JSON
TRIGGERS: Any automation, workflow, webhook, schedule, or integration task
```

---

## 3. Get-Shit-Done (GSD) Methodology

```
Source: D:\prompts\data\get-shit-done-main\agents\
Distilled: D:\prompts\claude-system\data\gsd\
  goal-backward.md          — Phase/task planning methodology (backward from outcomes)
  deviation-rules.md        — 4 rules for handling unexpected work during execution
  verification-protocol.md  — 3-level artifact verification (exists/substantive/wired)
  context-budget.md         — 50% context budget rule + quality degradation curve
TRIGGERS: Any project planning, task breakdown, phased execution, or quality verification
```

---

## 4. Sherlock Research Skills

```
Path: D:\prompts\data\sherlock-ai-plugin-main\sherlock-ai-plugin-main\skills\
Skills:
  deep-research\SKILL.md    — Multi-pass parallel research report generation with citations
  paper2code\SKILL.md       — 4-stage pipeline: paper PDF → executable Python code
  paper-analyzer\SKILL.md   — PDF parsing for formulas, tables, LaTeX (requires MINERU_TOKEN)
  visual-architect\SKILL.md — System schema generation → DALL-E 3 / Midjourney prompts
  paper-comic\SKILL.md      — Dense technical content → visual narrative explanation
TRIGGERS: Research reports, academic papers, implement-this-paper, system visualization
```

---

## 5. Antigravity Agent Skills (36 modules)

```
Path: D:\prompts\data\antigravity-kit-main\antigravity-kit-main\.agent\skills\
Each skill has its own SKILL.md. Referenced by agent files via absolute paths.
Key skills: api-patterns, architecture, database-design, deployment-procedures,
  frontend-design, game-development, mobile-design, performance-profiling,
  red-team-tactics, testing-patterns, tdd-workflow, vulnerability-scanner
HOW TO USE: Agent files already reference these. For direct use: read the specific SKILL.md.
```

---

## 6. Superpowers Skills

```
Path: D:\prompts\data\superpowers-main\superpowers-main\skills\
Key files:
  subagent-driven-development\ — implementer + spec + code-quality reviewer prompts
  systematic-debugging\        — root-cause-tracing.md, defense-in-depth.md, condition-based-waiting.md
  test-driven-development\     — TDD workflow + testing-anti-patterns.md
  verification-before-completion\SKILL.md — completion standards
  writing-plans\SKILL.md       — plan writing methodology
  brainstorming\SKILL.md       — design exploration before coding
```

---

## 7. Intelligence Reference

```
Path: D:\prompts\claude-system\data\intelligence\patterns.md (built in Session 2)
Source: D:\prompts\data\system-prompts-and-models-of-ai-tools-main\
        D:\prompts\data\system_prompts_leaks-main\
        D:\prompts\data\agentic_book.pdf
Content: Key patterns from Cursor, Devin, v0, Windsurf, Claude Code system prompts
         + agentic design patterns book summary
TRIGGERS: Orchestrator design, agent coordination, context management decisions
```

---

## 8. Claude Cookbooks (Anthropic Reference)

```
Path: D:\prompts\data\claude-cookbooks-main\claude-cookbooks-main\
Key paths:
  patterns\agents\              — orchestrator-workers, evaluator-optimizer loop
  patterns\agents\prompts\      — research_lead_agent.md, research_subagent.md
  capabilities\                 — RAG, classification, text-to-SQL, summarization
  skills\                       — Excel/PowerPoint/PDF/Word via Skills API (beta headers)
  extended_thinking\            — extended thinking patterns
  tool_use\                     — parallel tools, memory cookbook, vision with tools
```
