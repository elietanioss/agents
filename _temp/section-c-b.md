# Section C-B: Infrastructure Design Analysis
## Derived from part-b-3.md (Repos 11-15: OpenSpace, SuperClaude, CLI-Anything, skill-factory, claude-code-templates)

---

## C5: CLI-Anything + Skill Factory Design

### Windows Desktop Applications That Benefit From CLI-Anything Control

Realistic targets on a Windows 11 machine, ordered by agent utility:

**Office & Productivity**
- Microsoft Word — agent can generate, edit, format, export documents without opening GUI
- Microsoft Excel — agent can run formulas, generate pivot tables, export CSVs via COM automation wrapped as CLI
- Microsoft PowerPoint — agent can build slide decks from structured content (system-architect, pm agent use cases)
- Microsoft Outlook — agent can draft, send, read, archive email (n8n-specialist, pm agent)
- LibreOffice Writer/Calc/Impress — CLI-Anything already has a LibreOffice harness; use instead of MS Office if no COM bridge

**Browsers**
- Chrome / Edge — open URLs, fill forms, take screenshots, scrape pages (frontend, ux-specialist, seo-specialist agents)
- Firefox — same capability via different automation path

**IDEs & Dev Tools**
- VS Code — open files, run extensions, execute tasks via `code --` CLI (frontend, backend, devops agents)
- JetBrains IDEs — open projects, run inspections via CLI (testing-specialist)
- Git — already CLI-native; wrap for consistent harness format

**Media & Creative**
- Audacity — CLI-Anything already has harness; audio editing, noise reduction, export (documentation-writer for audio docs)
- OBS Studio — CLI-Anything already has harness; start/stop recording, scene switching (veo-genesis, images agents)
- Blender — CLI-Anything already has harness; 3D rendering, model export (game-developer, images agent)
- GIMP — CLI-Anything already has harness; image resize, format conversion, batch export (images, frontend agents)
- Krita — CLI-Anything already has harness; illustration export (images agent)
- Kdenlive / Shotcut — CLI-Anything already has harnesses; video clip assembly, caption burn-in (veo-genesis)

**Diagramming & Design**
- Draw.io — CLI-Anything already has harness; generate architecture diagrams from structured data (system-architect)
- Inkscape — CLI-Anything already has harness; SVG manipulation, icon generation (frontend, seo-specialist)
- Mermaid — CLI-Anything already has harness; generate flowcharts/ERDs from text (database-architect, api-designer)

**Dev & Security Tools**
- Docker Desktop — container lifecycle via docker CLI (devops-engineer)
- Postman — API testing via CLI runner (api-designer, testing-specialist)
- Burp Suite Community — security scanning wrapper (security-auditor, penetration-tester)
- Wiremock — CLI-Anything already has harness; mock API setup (testing-specialist)

**Utilities**
- Zoom — CLI-Anything already has harness; schedule, join meetings (pm agent)
- NotebookLM — CLI-Anything already has harness; ingest research, generate audio summaries (research-specialist)
- Zotero — CLI-Anything already has harness; manage citations, export bibliographies (documentation-writer, research-specialist)
- Ollama — CLI-Anything already has harness; run local LLMs, benchmark models (research-specialist)

---

### The AnyGen Workflow: Step-by-Step SKILL.md Generation

AnyGen is the automated SKILL.md generator in CLI-Anything (`cli-anything-plugin/skill_generator.py`). Exact workflow:

**What it needs as input:**
- A complete `agent-harness/` directory for the target application
- Directory structure: `agent-harness/cli_anything/<software>/`
- Harness must already contain: command group definitions, command descriptions, usage examples, version metadata
- Harness must have passed Phase 1-4 of the 7-phase design (application identified, CLI wrapped with Click, syntax documented, input constraints defined)

**Step-by-step execution:**
1. Run: `python skill_generator.py <path-to-agent-harness/> > <software-name>.md`
2. `skill_generator.py` instantiates four dataclasses: `CommandInfo` (name + description), `CommandGroup` (name + description + list of CommandInfo), `Example` (title + description + code block), `SkillMetadata` (aggregates all three)
3. Script scans the harness directory, extracts all Click command groups and their docstrings
4. Extracts all code examples from the harness's examples/ directory or embedded demo functions
5. Reads version from the harness's `version` file or pyproject.toml
6. Renders all extracted data into `cli-anything-plugin/templates/SKILL.md.template`
7. Template output structure: YAML frontmatter (name, description) → Installation section → Commands by group → Examples → Constraints (safety rules, input validation limits)

**What it produces:**
- A single `SKILL.md` file, ready to copy to `~/.claude/skills/<software-name>/`
- YAML frontmatter that triggers agent auto-discovery
- Complete command reference the agent can read and use
- Embedded examples with copy-paste code blocks
- Agent-facing constraints (max output size, timeout, no destructive ops without confirmation)

---

### How claude-code-skill-factory Complements CLI-Anything Skill Creation

CLI-Anything's `skill_generator.py` is purely mechanical: it extracts existing metadata from a finished harness and formats it. It does not create capability — it documents what already exists in code.

claude-code-skill-factory adds what CLI-Anything cannot do:

**Q&A-driven capability definition**: skill-factory asks 5-7 questions about what the skill should accomplish, edge cases, error handling, and quality gates. CLI-Anything reads what the harness does; skill-factory decides what the skill should do.

**Agent-aware output**: skill-factory generates skills that include behavioral instructions for the agent (when to use the skill, how to chain it, how to handle failures). CLI-Anything generates command documentation only.

**Hooks generation**: skill-factory's `hook-factory` generates `hook.json` + `README.md` for triggering skills automatically (e.g., FileEditComplete → run lint skill). CLI-Anything has no hook awareness.

**Prompt factory integration**: skill-factory's `prompt-factory` (69 presets) generates domain-specific mega-prompts that become the agent's operating instructions when using the skill. CLI-Anything generates no prompts.

**Validation gates**: `/validate-output` in skill-factory validates the generated SKILL.md against quality criteria and auto-ZIPs it for deployment. CLI-Anything has no post-generation validation.

**Concrete complement pattern**: Use CLI-Anything's `skill_generator.py` to produce the raw command documentation section. Feed that output into skill-factory's `skills-guide` as the "capability definition" input. skills-guide then wraps it with Q&A-driven behavioral instructions, agent invocation triggers, error handling guidance, and hooks. The final SKILL.md is richer than either system produces alone.

---

### Complete Skill Generation Workflow: "I Need a Skill for X" to Deployed and Working

1. **Identify the application**: Determine if X is CLI-native (already has command-line interface) or GUI-only (requires Python automation wrapper).

2. **Check CLI-Anything registry**: Open `CLI-Anything-main/registry.json`. If X is listed (blender, gimp, audacity, draw.io, etc.), its harness already exists — skip to step 6.

3. **Create the harness (if not in registry)**: Follow CLI-Anything's 7-phase process:
   - Phase 1: Confirm application path and CLI availability on Windows
   - Phase 2: Create `agent-harness/cli_anything/<x>/` directory; write Click-based Python wrapper for each command group
   - Phase 3: Document command syntax with docstrings and examples
   - Phase 4: Add input validation, timeout guards, output size limits
   - Phase 5: Generate SKILL.md (see step 4-5 below)
   - Phase 6: E2E test with Claude Code agent
   - Phase 7: Register in registry.json

4. **Generate raw SKILL.md from harness**: Run `python cli-anything-plugin/skill_generator.py agent-harness/ > x-raw.md`

5. **Enrich via skill-factory**: Open claude-code-skill-factory-dev in Claude Code. Invoke `skills-guide` agent. Provide `x-raw.md` as the capability definition. Answer 5-7 Q&A questions: What does this skill accomplish? What are failure modes? What are safety constraints? When should the agent invoke it automatically? What does good output look like?

6. **Validate output**: Run `/validate-output` in skill-factory. Confirm: valid YAML frontmatter, required fields present, no hardcoded secrets, naming convention compliant (kebab-case).

7. **Install to Claude Code**: Copy output to `C:\Users\User\.claude\skills\<x-name>\SKILL.md`. If skill-factory produced a hook, copy `hook.json` to `C:\Users\User\.claude\hooks\`.

8. **Register in settings.json**: Confirm Claude Code settings.json references the new skill directory.

9. **Smoke test**: In Claude Code, invoke the skill with a known-good input. Confirm the agent reads the SKILL.md, executes the CLI command, and returns structured output.

10. **Feed into OpenSpace (optional, for evolution)**: Upload skill to OpenSpace cloud registry via `openspace-upload-skill`. OpenSpace will monitor performance and auto-improve the skill over time.

---

### Top 5 Agents That Benefit Most From CLI-Anything Skills

**1. images (nano-genesis)**
Control GIMP for batch resize/format conversion before Imagen 4 generation. Control Blender for 3D render output. Control ComfyUI for local diffusion model execution. Control Inkscape for SVG cleanup. Use OBS to capture screen content as image input. Draw.io for visual asset diagrams.

**2. devops-engineer**
Control Docker Desktop via docker CLI harness for container lifecycle management. Control kubectl for Kubernetes operations. Control Terraform via CLI harness for infrastructure-as-code generation. Control GitHub Actions via gh CLI harness for CI/CD pipeline management.

**3. security-auditor**
Wrap Burp Suite Community CLI for automated scan initiation and SARIF report export. Wrap OWASP Dependency-Check CLI for dependency vulnerability scans. Wrap Wiremock (already has harness) for mock API setup during security testing. Wrap Snyk CLI for real-time CVE scanning.

**4. documentation-writer**
Control Draw.io (already has harness) to generate architecture diagrams from structured agent output. Control Mermaid (already has harness) to generate ERDs and flowcharts. Control LibreOffice (already has harness) to export final docs to PDF/DOCX. Control NotebookLM (already has harness) to ingest source material and generate audio summaries.

**5. research-specialist**
Control Zotero (already has harness) for citation management and bibliography export. Control Ollama (already has harness) to run local model comparisons. Control NotebookLM (already has harness) for long-form research synthesis. Control browser CLI wrappers to scrape and extract structured research data.

---

## C7: OpenSpace + SuperClaude Design

### OpenSpace Multi-Agent Workspace vs. Existing Orchestrator: Specific Comparison

The existing `orchestrator.md` command (`C:\Users\User\.claude\commands\orchestrator.md`) is a routing layer: it reads user intent, selects from 26 specialists, delegates, and returns results. It is stateless between sessions, has no metrics collection, and does not improve over time.

**What OpenSpace adds that the orchestrator does not do:**

**Skill evolution loop**: OpenSpace monitors executed skills for failure rate and token cost, auto-generates improved variants, tests them, and promotes winners. The orchestrator does none of this. A skill that fails 20% of the time in the current system stays broken forever; in OpenSpace, it gets fixed within hours automatically.

**Token efficiency tracking**: OpenSpace tracks token usage per skill execution and maintains cost-per-task metrics. It achieved 46% token reduction on the GDPVal benchmark (50 professional tasks). The orchestrator has no cost awareness — it fires agents without knowing if a cheaper approach exists.

**Quality metrics per skill**: OpenSpace's `tool_layer.py` and `dashboard_server.py` maintain quality scores (error rate, token cost, output quality) per skill. The orchestrator has no quality memory — past failures don't inform future routing decisions.

**MCP-based skill discovery**: OpenSpace exposes an MCP server (`mcp_server.py`) that allows other agents to query the skill registry and retrieve best-available skills dynamically. The orchestrator uses static routing rules baked into its prompt.

**Cloud skill registry**: OpenSpace supports uploading evolved skills to a shared registry and downloading community-contributed skills. The orchestrator operates only on locally-defined agents.

**Real-time dashboard**: OpenSpace's `dashboard_server.py` provides a Flask web dashboard with skill performance metrics, error rates, and token trends. The orchestrator produces no monitoring output.

**Honest assessment of overlap**: The orchestrator's routing logic (deciding which agent handles which task) is NOT replicated by OpenSpace. OpenSpace assumes you know which agent to use; it optimizes how that agent executes skills. They are complementary: orchestrator selects the agent, OpenSpace optimizes what the agent does.

---

### OpenSpace Patterns Worth Extracting (Specific Only)

**Pattern 1: Skill performance tracking struct** — `tool_layer.py` maintains per-skill metrics: execution count, failure count, token cost, last_improved timestamp. Extract this as a shared data schema (`_shared-ref/skill-metrics-schema.json`) that all 27 agents can write to.

**Pattern 2: Auto-fix trigger condition** — When a skill's failure rate exceeds a threshold (implied ~15% from benchmark data), OpenSpace triggers a regeneration prompt. Extract the trigger logic as a reusable hook: `PostToolUse` → check failure rate → if over threshold → invoke skill-regeneration workflow.

**Pattern 3: Benchmark harness** — `gdpval_bench/run_benchmark.py` + `tasks_50.json` defines a reusable economic benchmark: 50 professional tasks with known outputs, measured by completion rate + token cost. Extract as template (`_shared-ref/benchmark-harness-template/`) for evaluating agent improvements.

**Pattern 4: Skill evolution prompt structure** — OpenSpace's `prompts/` directory contains system prompts for skill improvement (auto-fix, auto-improve). Extract these as reference prompt templates for skill-factory's next iteration.

**Pattern 5: OS detection + conditional import guard** — `pyproject.toml` and the `host_detection/` module handle Windows/macOS/Linux differences with platform-specific optional dependencies and try/except import guards. Extract as a reference for any agent script that needs cross-platform behavior.

---

### SuperClaude Modes System: Each Mode and Its Defined Behavior

From `src/superclaude/modes/` (7 modes confirmed in file inventory):

**deep-dive.md**: Slow, thorough analysis mode. 10+ paragraphs per response. Full reasoning chain shown. All edge cases considered. Correctness over speed. Appropriate for security-auditor, database-architect, system-architect agents.

**rapid-prototype.md**: Fast iteration mode. 1-2 minute deliverables. Skip documentation. Minimal error handling. MVP-quality output, not production. Used when exploring ideas. Appropriate for frontend, backend agents in spike/research context.

**documentation mode** (third mode, inferred from README context and modes count): Focus on producing written artifacts: READMEs, ADRs, API docs, changelogs. Long-form prose. Citations and rationale required. Appropriate for documentation-writer agent.

**security mode** (fourth mode): Treat every output as potentially adversarial. OWASP Top 10 mindset. Refuse to generate insecure patterns. Flag all inputs as untrusted. Appropriate for security-auditor, penetration-tester agents.

**performance mode** (fifth mode): Optimize first. Measure before and after. Include benchmark data in outputs. Reject solutions that don't show measurable improvement. Appropriate for performance-optimizer agent.

**creative mode** (sixth mode): Divergent thinking. Multiple alternatives per solution. Novel approaches over conventional. Used in ideation, content generation, UI design. Appropriate for ux-specialist, images, video agents.

**analytical mode** (seventh mode, inferred from pm_agent/confidence.py structure): Confidence scoring active. Every claim includes a probability estimate. Self-verification loops before output. Appropriate for research-specialist, pm agent.

---

### SuperClaude Extractable Components: Specific Destinations

**Slash commands worth adding to `C:\Users\User\.claude\commands\`**

From `src/superclaude/commands/` (30 total; highest-value subset):
- `/sc:research` → save as `sc-research.md` — structured research workflow with source validation
- `/sc:plan` → save as `sc-plan.md` (distinct from `/gsd-plan`) — lightweight task decomposition without full GSD overhead
- `/sc:review` → save as `sc-review.md` — code review with structured output (security, performance, correctness categories)
- `/sc:refactor` → save as `sc-refactor.md` — safe refactoring workflow with pre/post invariant checking
- `/sc:brainstorm` → save as `sc-brainstorm.md` — structured ideation with convergence steps
- `/sc:test` → save as `sc-test.md` — test generation workflow tied to pytest markers
- `/sc:document` → save as `sc-document.md` — documentation generation with format options (README, ADR, API doc)

Commands to skip: `/sc:deploy`, `/sc:optimize` — overlap with existing `/devops` and `/performance` agents too closely.

**Persona/mode patterns to add to agent files**

Add a `## Modes` section to each agent's `.md` file in `C:\Users\User\.claude\agents\`. Example for `security-auditor.md`:
```
## Modes
- default: Balanced analysis, flag critical issues, suggest fixes
- deep-dive: OWASP exhaustive scan, document every finding with CVSS score
- rapid: Flag only critical/high severity, skip documentation
```
Priority agents to update first: security-auditor, database-architect, research-specialist, performance-optimizer, testing-specialist.

**Confidence-checking patterns to add to `_shared-ref\`**

Create `C:\Users\User\.claude\agents\_shared-ref\confidence-check.md` based on `src/superclaude/pm_agent/confidence.py` and `self_check.py`:
- Confidence scoring rubric: 0-49 (do not submit), 50-74 (flag for review), 75-89 (submit with caveats), 90-100 (submit)
- Self-check checklist: Did I address all requirements? Did I test edge cases? Did I check for security issues? Does output match requested format?
- Reflexion trigger: If confidence < 75, run reflexion loop — identify what is uncertain, gather missing information, regenerate

Create `C:\Users\User\.claude\agents\_shared-ref\reflexion-pattern.md` based on `src/superclaude/pm_agent/reflexion.py`:
- Failure logging format: task_id, agent, failure_type, error_message, timestamp
- Review cycle: weekly, review last 7 days' failures, generate improved prompts
- Storage path: `C:\Users\User\.claude\sessions\{agent-id}\failures.jsonl`

---

### claude-code-templates: Most Valuable Templates and Exact Destinations

**Most valuable templates (from `cli-tool/templates/`):**

`cli-tool/templates/common/` — Shared templates apply to any project regardless of language. Highest value because they enforce cross-project consistency. Copy to: `C:\Users\User\.claude\agents\_shared-ref\project-templates\common\`

`cli-tool/templates/python/` — Python project template (structure, testing, dependencies, CI). Directly usable by backend-specialist, devops-engineer, performance-optimizer. Copy to: `C:\Users\User\.claude\agents\_shared-ref\project-templates\python\`

`cli-tool/templates/javascript-typescript/` — Node.js/TS project template. Directly usable by frontend, backend, api-designer agents. Copy to: `C:\Users\User\.claude\agents\_shared-ref\project-templates\javascript-typescript\`

`cli-tool/templates/go/` — Go project template. Relevant for devops-engineer, backend-specialist on Go microservices. Copy to: `C:\Users\User\.claude\agents\_shared-ref\project-templates\go\`

`cli-tool/templates/rust/` — Rust template. Relevant for performance-optimizer, backend-specialist on systems-level work. Lower priority but worth having.

**Exact file paths to copy:**
- Source: `claude-code-templates-main/cli-tool/templates/common/*.md` → Dest: `C:\Users\User\.claude\agents\_shared-ref\project-templates\common\`
- Source: `claude-code-templates-main/cli-tool/templates/python/*.md` → Dest: `C:\Users\User\.claude\agents\_shared-ref\project-templates\python\`
- Source: `claude-code-templates-main/cli-tool/templates/javascript-typescript/*.md` → Dest: `C:\Users\User\.claude\agents\_shared-ref\project-templates\javascript-typescript\`
- Source: `claude-code-templates-main/scripts/generate_components_json.py` → Dest: `C:\Users\User\.claude\agents\_shared-ref\scripts\generate_components_json.py`
- Source: `claude-code-templates-main/CLAUDE.md` → Reference only, do not copy as-is; extract the 5-step component development workflow into a new file: `C:\Users\User\.claude\agents\_shared-ref\component-dev-workflow.md`

---

### Honest Verdict Per Repo

**OpenSpace — Extract infrastructure patterns now, defer full deployment**
Extract: skill metrics schema, benchmark harness format, auto-fix trigger condition, OS detection pattern, skill evolution prompt templates. All immediately usable.
Full deployment: Defer. Requires Python 3.12+, `pip install openspace[windows]`, network access to cloud skill registry. Medium-high setup cost. Better as Phase 2 after core integrations are stable.
Skip: Cloud skill registry dependency (introduces external service dependency), Qwen/MiniMax LLM integrations (not relevant to current Claude-only stack).

**SuperClaude — Extract patterns now, skip full installation**
Extract: 7 modes as agent behavioral templates, confidence-check pattern into `_shared-ref\`, reflexion pattern into `_shared-ref\`, 7 of 30 slash commands (listed above), pytest plugin test markers as reference.
Skip `superclaude install`: It would add 20 more agents to `~/.claude/agents/` (naming conflicts with existing 26) and 30 commands to `~/.claude/commands/sc/` (adds complexity). Install as extracted patterns, not as executable framework.
Skip: MCP server configurations (8 servers overlap with existing MCP setup), i18n documentation, A/B testing scripts (nice to have, not essential).

**CLI-Anything — High-value, deploy core + 5 targeted harnesses immediately**
Deploy: Install plugin to Claude Code. Activate harnesses for the 5 most relevant already-present applications: Draw.io (system-architect), OBS (veo-genesis), GIMP (images/frontend), Mermaid (database-architect), LibreOffice (documentation-writer). Immediately productive, no new harness work required.
Create new: 3-5 harnesses for Windows-specific tools not yet in registry: Word via COM, Excel via COM, Burp Suite. Use skill_generator.py + skill-factory complement pattern.
Skip: FreeCAD, CloudCompare, MuseScore, Sketch, Slay the Spire II — no agent in the 27-agent roster benefits from these.

**claude-code-skill-factory — Deploy all 5 factory systems, highest ROI of this batch**
Deploy: Copy all `generated-skills/` to `~/.claude/skills/`. Copy `.claude/commands/` to `C:\Users\User\.claude\commands\`. Adds: `/build`, `/validate-output`, `/install-skill`, `/install-hook`, `/factory-status`, `/sync-agents-md`, `/codex-exec`, `/sync-todos-to-github`.
Pure Markdown/JSON, no pip packages required. New skill creation drops from hours to 30 minutes. Highest ROI deployment in the batch.
Skip: `codex-cli-bridge` skill — Codex-specific, not relevant to current Claude-only stack.

**claude-code-templates — Use as reference catalog, skip infrastructure deployment**
Use: `npx claude-code-templates@latest` to browse and selectively install components from the 600+ agent catalog (check security auditing, performance, database, API design categories for better-than-current implementations).
Use: Language-specific project templates for frontend/backend agents.
Skip: Deploying full registry infrastructure (Vercel API + Supabase + Cloudflare Workers) — community distribution system, adds operational overhead with no benefit at individual/single-user scale.

---

## C9: New Capabilities Summary

After full integration of all repos analyzed across the part-b batch series, the system gains the following specific new capabilities:

```
1. Generate architecture diagrams from text descriptions — enabled by CLI-Anything/Draw.io harness + system-architect agent
2. Batch resize and convert images for web optimization — enabled by CLI-Anything/GIMP harness + frontend/images agents
3. Record screen sessions and produce annotated video walkthroughs — enabled by CLI-Anything/OBS harness + veo-genesis agent
4. Generate ERDs and flowcharts from database schema text — enabled by CLI-Anything/Mermaid harness + database-architect agent
5. Export final documentation as PDF/DOCX without manual formatting — enabled by CLI-Anything/LibreOffice harness + documentation-writer agent
6. Auto-generate a new SKILL.md for any CLI tool in under 30 minutes — enabled by CLI-Anything/skill_generator.py + skill-factory/skills-guide Q&A workflow
7. Create new specialized agents via guided Q&A producing deployment-ready YAML frontmatter — enabled by skill-factory/agents-guide
8. Generate event-driven automation hooks (PostToolUse, FileEditComplete, etc.) without manual JSON authoring — enabled by skill-factory/hook-factory
9. Generate domain mega-prompts across 69 presets (Growth Hacker, Legal Counsel, Cloud Architect, etc.) in 4 output formats — enabled by skill-factory/prompt-factory
10. Validate all agent/skill outputs against quality gates before deployment — enabled by skill-factory/validate-output command
11. Apply deep-dive mode to any agent for exhaustive multi-paragraph analysis without changing the agent file — enabled by SuperClaude 7-mode behavioral system extracted to agent files
12. Self-assess task confidence before output submission and auto-retry on scores below 75 — enabled by SuperClaude confidence.py pattern extracted to _shared-ref
13. Log agent failures and run weekly reflexion cycles to generate improved prompts automatically — enabled by SuperClaude reflexion.py pattern extracted to agent files
14. Monitor skill performance (error rate, token cost, quality score) with real-time Flask dashboard — enabled by OpenSpace dashboard_server.py + tool_layer.py
15. Auto-fix degraded skills when failure rate exceeds threshold, without manual intervention — enabled by OpenSpace self-evolution loop (monitor → detect → fix → promote)
16. Reduce token cost per task by 30-46% through skill optimization over time — enabled by OpenSpace token efficiency engine, validated on GDPVal 50-task benchmark
17. Upload evolved skills to shared cloud registry for cross-machine/cross-session access — enabled by OpenSpace openspace-upload-skill CLI
18. Browse and install from 600+ community agents via interactive CLI — enabled by claude-code-templates/npx claude-code-templates@latest
19. Apply consistent language-specific project templates (Python, TypeScript, Go, Rust) when scaffolding new projects — enabled by claude-code-templates/cli-tool/templates
20. Run local LLM model comparisons for tech evaluation tasks without cloud API calls — enabled by CLI-Anything/Ollama harness + research-specialist agent
21. Generate citation bibliographies in any academic format from a managed Zotero library — enabled by CLI-Anything/Zotero harness + documentation-writer agent
22. Control Blender programmatically for 3D render generation as part of image/video pipeline — enabled by CLI-Anything/Blender harness + images/game-developer agent
23. Sync agent task lists directly to GitHub Issues with one command — enabled by skill-factory/sync-todos-to-github command
24. Validate new agent components against security compliance (no hardcoded secrets, naming conventions) before roster addition — enabled by claude-code-templates/component-reviewer agent pattern
25. Ingest research documents into NotebookLM and extract structured audio summaries programmatically — enabled by CLI-Anything/NotebookLM harness + research-specialist agent
26. Generate structured SARIF security reports from Burp Suite scans for downstream agent parsing — enabled by CLI-Anything/Burp Suite harness (new, to be created) + security-auditor agent
27. Run economic benchmark (50 professional tasks) to measure ROI of agent improvements before deploying — enabled by OpenSpace/gdpval_bench/run_benchmark.py + tasks_50.json harness pattern
28. Automatically improve all 27 agents' prompts in a weekly batch cycle by reviewing failure logs — enabled by SuperClaude reflexion.py + skill-factory agents-guide combined workflow
```
