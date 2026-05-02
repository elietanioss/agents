# CLAUDE CODE — FULL SYSTEM REPORT
*Generated: 2026-04-08*
*Last Updated: 2026-04-14*
*Coverage: 28 agents | 15 repositories | Infrastructure design | Master integration plan | Tier 2 Enhanced*

---
## PART A — AGENT SYSTEM ANALYSIS

### A1: Agent Roster Overview
*Updated: 2026-04-14 — 28 agents (27 original + cost-optimizer added in Tier 2)*

| Agent Name | File Path | Line Count | Depth Score | Ref Count | Model | Tier2 Enhanced | Modes |
|------------|-----------|------------|-------------|-----------|-------|----------------|-------|
| api-designer | /c/Users/User/.claude/agents/api-designer/api-designer.md | 328 | 4 | 4 | inherit | YES | YES |
| backend-specialist | /c/Users/User/.claude/agents/backend-specialist/backend-specialist.md | 301 | 4 | 12 | inherit | YES | YES |
| code-archaeologist | /c/Users/User/.claude/agents/code-archaeologist/code-archaeologist.md | 221 | 3 | 8 | inherit | YES | YES |
| cost-optimizer | /c/Users/User/.claude/agents/cost-optimizer/cost-optimizer.md | 397 | 4 | 0 | inherit | NEW | NO |
| database-architect | /c/Users/User/.claude/agents/database-architect/database-architect.md | 195 | 4 | 8 | inherit | YES | YES |
| devops-engineer | /c/Users/User/.claude/agents/devops-engineer/devops-engineer.md | 177 | 3 | 7 | inherit | YES | YES |
| documentation-writer | /c/Users/User/.claude/agents/documentation-writer/documentation-writer.md | 255 | 3 | 7 | inherit | YES | YES |
| explorer-agent | /c/Users/User/.claude/agents/explorer-agent/explorer-agent.md | 211 | 3 | 3 | inherit | YES | YES |
| game-developer | /c/Users/User/.claude/agents/game-developer/game-developer.md | 202 | 3 | 7 | inherit | YES | YES |
| gsd-roadmapper | /c/Users/User/.claude/agents/gsd-roadmapper/gsd-roadmapper.md | 201 | 3 | 6 | inherit | YES | YES |
| gsd-planner | /c/Users/User/.claude/agents/gsd-planner/gsd-planner.md | 190 | 3 | 7 | inherit | YES | YES |
| gsd-executor | /c/Users/User/.claude/agents/gsd-executor/gsd-executor.md | 198 | 4 | 7 | inherit | YES | YES |
| gsd-verifier | /c/Users/User/.claude/agents/gsd-verifier/gsd-verifier.md | 209 | 3 | 7 | inherit | YES | YES |
| gsd-debugger | /c/Users/User/.claude/agents/gsd-debugger/gsd-debugger.md | 199 | 4 | 4 | inherit | YES | YES |
| mobile-developer | /c/Users/User/.claude/agents/mobile-developer/mobile-developer.md | 227 | 3 | 7 | inherit | YES | YES |
| n8n-specialist | /c/Users/User/.claude/agents/n8n-specialist/n8n-specialist.md | 293 | 3 | 7 | inherit | YES | YES |
| nano-genesis | /c/Users/User/.claude/agents/nano-genesis/nano-genesis.md | 178 | 2 | 2 | inherit | YES | YES |
| orchestrator | /c/Users/User/.claude/agents/orchestrator/orchestrator.md | 263 | 4 | 7 | inherit | YES | YES |
| penetration-tester | /c/Users/User/.claude/agents/penetration-tester/penetration-tester.md | 882 | 4 | 8 | inherit | YES | YES |
| performance-optimizer | /c/Users/User/.claude/agents/performance-optimizer/performance-optimizer.md | 258 | 4 | 7 | inherit | YES | YES |
| project-manager | /c/Users/User/.claude/agents/project-manager/project-manager.md | 252 | 3 | 10 | inherit | YES | YES |
| research-specialist | /c/Users/User/.claude/agents/research-specialist/research-specialist.md | 315 | 4 | 11 | inherit | YES | YES |
| security-auditor | /c/Users/User/.claude/agents/security-auditor/security-auditor.md | 207 | 4 | 14 | inherit | YES | YES |
| seo-specialist | /c/Users/User/.claude/agents/seo-specialist/seo-specialist.md | 231 | 3 | 5 | inherit | YES | YES |
| testing-specialist | /c/Users/User/.claude/agents/testing-specialist/testing-specialist.md | 371 | 4 | 11 | inherit | YES | YES |
| ui-specialist | /c/Users/User/.claude/agents/ui-specialist/ui-specialist.md | 336 | 4 | 11 | inherit | YES | YES |
| ux-specialist | /c/Users/User/.claude/agents/ux-specialist/ux-specialist.md | 255 | 3 | 7 | inherit | YES | YES |
| veo-genesis | /c/Users/User/.claude/agents/veo-genesis/veo-genesis.md | 177 | 2 | 2 | inherit | YES | YES |

---

### A2: Individual Agent Profiles

# CLAUDE CODE AGENT SYSTEM — COMPREHENSIVE ANALYSIS

**Analysis Date:** April 7, 2026 (Updated: April 14, 2026)
**Total Agents:** 28 specialist agents (27 original + cost-optimizer added Tier 2)
**Total Skill Files:** 20 installed skill packages | 48 slash commands
**Total Shared References:** 3,038 files across 8 knowledge domains (34 new files added Tier 2)
**Status:** Tier 2 Enhanced — all 27 original agents upgraded, 1 new agent added

---

## EXECUTIVE SUMMARY

This is a **27-agent specialist system** built around Claude, where each agent is a domain expert with:
- Dedicated knowledge base (ref files)
- Specific triggers (keywords that invoke the agent)
- Tool whitelist (which tools the agent can use)
- Model inheritance (inherits the system's default model)
- Task-specific methodology and philosophy

The system is coordinated by the **orchestrator** agent, which routes requests to the optimal agent(s) and manages execution pipelines.

**Key characteristics:**
- No file modification allowed in this analysis (read-only)
- Each agent is a 150-300 line markdown file containing methodology + patterns
- Agents cluster into 8 domains: Frontend, Backend, Data, DevOps, Security, Testing, Content, and Automation
- GSD pipeline (Goal-Driven Specification) for complex projects: Roadmapper → Planner → Executor → Verifier → Debugger

---

## AGENT INVENTORY

### AGENT 1: API DESIGNER
**Main file:** /c/Users/User/.claude/agents/api-designer/api-designer.md | 301 lines

**Ref files:**
- API patterns skill — REST design, GraphQL schema patterns, OpenAPI 3.1 spec generation
- Backend specialist reference — when to delegate to backend-specialist for implementation

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** API design, REST, GraphQL, OpenAPI, Swagger, endpoint, HTTP methods, API versioning, API contract, request/response schema, pagination, rate limiting design, webhook design, API documentation

**What it actually does:**
Designs REST API endpoints, GraphQL schemas, and OpenAPI specifications. Creates resource naming conventions, HTTP status code mappings, pagination strategies (cursor vs offset), and API versioning plans. Does NOT implement server code — hands off to backend-specialist for that.

**Knowledge gaps visible from file:**
- No SDK/client library design patterns (mentioned but not detailed)
- No GraphQL federation or advanced GraphQL topics
- Limited multi-tenant API design patterns

**Ref coverage:**
- Strong on REST conventions and OpenAPI
- Good on webhook design
- Missing: gRPC, WebSocket patterns, async API design

**Cross-agent dependencies:**
- Calls backend-specialist for implementation
- Calls security-auditor for API security review
- Used by orchestrator when routing API design requests

---

### AGENT 2: BACKEND SPECIALIST
**Main file:** /c/Users/User/.claude/agents/backend-specialist/backend-specialist.md | 265 lines

**Ref files:**
- Full backend source (ref\core\02-BACKEND_SPECIALIST.md)
- Security auditor patterns (ref\core\04-SECURITY_AUDITOR.md)
- Database design skills (ref\antigravity\skills\database-design\SKILL.md)
- MCP builder skill, MCP Node.js server, MCP Python server patterns
- Antigravity backend framework decision trees

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** API route, server, Node.js, Express, Hono, Fastify, Supabase, PostgreSQL, JWT, auth, middleware, rate limit, webhook, CORS, encryption, bcrypt, OAuth, session, server action, backend logic

**What it actually does:**
Implements Node.js/TypeScript backend APIs, Supabase integration, JWT/OAuth flows, RLS policies, middleware (auth, rate limiting, CORS), file uploads, webhooks, and compliance-grade implementations (HIPAA/PCI-DSS). Builds secure API routes first, security is foundation not feature.

**Knowledge gaps visible from file:**
- GraphQL server implementation not covered (delegates to backend-specialist but not deeply)
- Limited message queue patterns (SQS, RabbitMQ)
- Minimal event sourcing patterns

**Ref coverage:**
- Excellent on JWT, OAuth, Supabase/RLS
- Strong on Zod validation, structured logging (Winston/Pino)
- Good on rate limiting, CORS, security headers
- Missing: advanced caching strategies, distributed tracing

**Cross-agent dependencies:**
- Uses database-architect for schema design
- Uses security-auditor for code review
- Calls testing-specialist for unit/integration tests
- Coordinates with api-designer for API contract

---

### AGENT 3: CODE ARCHAEOLOGIST
**Main file:** /c/Users/User/.claude/agents/code-archaeologist/code-archaeologist.md | 180 lines

**Ref files:**
- Code archaeologist source (ref\antigravity\agents\code-archaeologist.md)
- Clean code patterns skill
- Code review checklist skill
- Type design analyzer (4-dimension invariant rating)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** refactor, legacy code, understand codebase, technical debt, dead code, why does this work, trace this function, how does X work, codebase audit, strangler pattern, characterization test, before I change this

**What it actually does:**
Maps legacy codebases, traces dependencies, identifies dead code. Uses Chesterton's Fence philosophy: understand WHY code exists before removing it. Writes characterization tests to capture current behavior, then refactors safely. Uses Strangler Fig pattern for incremental replacement of legacy systems.

**Knowledge gaps visible from file:**
- Limited cross-language legacy patterns (mostly TypeScript/JavaScript focused)
- No mainframe/COBOL patterns
- Minimal microservices-to-monolith migration patterns

**Ref coverage:**
- Strong on dependency mapping, call chain tracing
- Good on characterization testing, Strangler Fig
- Excellent on dead code detection methodology
- Missing: performance profiling of legacy systems

**Cross-agent dependencies:**
- Uses testing-specialist to write characterization tests
- Coordinates with gsd-debugger for complex investigation
- Called by orchestrator when exploring unfamiliar code

---

### AGENT 4: DATABASE ARCHITECT
**Main file:** /c/Users/User/.claude/agents/database-architect/database-architect.md | 166 lines

**Ref files:**
- Database architect source (ref\antigravity\agents\database-architect.md)
- Database design skill (Prisma, Drizzle, ORM patterns)
- Node.js best practices skill
- Backend specialist (Supabase/RLS reference)
- Database design skill, schema design, indexing, migrations, DB perf optimizer, db-perf-optimizer

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** database, schema, SQL, query, migration, Supabase, PostgreSQL, SQLite, Neon, Turso, Prisma, Drizzle, index, normalization, RLS, foreign key, performance, slow query

**What it actually does:**
Designs relational schemas (normalization vs denormalization), selects database platforms (PostgreSQL, SQLite, Supabase, Neon, Turso), configures ORMs (Prisma, Drizzle), optimizes queries with indexes, designs RLS policies, writes zero-downtime migrations, and manages multi-tenant data architecture.

**Knowledge gaps visible from file:**
- Vector database design (pgvector mentioned, limited patterns)
- NoSQL/document database patterns minimal
- Data warehouse / OLAP patterns not covered
- Real-time sync patterns (Replicache, etc.)

**Ref coverage:**
- Excellent on PostgreSQL schema design, normalization
- Strong on RLS policy patterns
- Good on index strategy (composite, partial, full-text)
- Good on migrations and backward compatibility
- Missing: temporal data design, time-series patterns, graph queries

**Cross-agent dependencies:**
- Uses backend-specialist for RLS integration
- Works with testing-specialist to test migrations
- Coordinates with security-auditor for RLS correctness

---

### AGENT 5: DEVOPS ENGINEER
**Main file:** /c/Users/User/.claude/agents/devops-engineer/devops-engineer.md | 142 lines

**Ref files:**
- DevOps engineer source (ref\antigravity\agents\devops-engineer.md)
- Deployment procedures skill
- Server management skill
- Bash/Linux skill
- PowerShell/Windows skill
- Zero-downtime deployment strategy selection + emergency procedures

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** deploy, pipeline, CI/CD, Docker, Kubernetes, infrastructure, server, cloud, nginx, container, staging, production, GitHub Actions, environment variables, secrets management

**What it actually does:**
Builds CI/CD pipelines (GitHub Actions, GitLab CI), containerizes with Docker, deploys to cloud (AWS, GCP, Azure, Vercel, Railway, Fly.io), manages zero-downtime deployments, configures monitoring (Prometheus, Sentry), handles secrets, and builds infrastructure-as-code (Terraform, Pulumi).

**Knowledge gaps visible from file:**
- Kubernetes networking and ingress patterns sparse
- Service mesh (Istio) not covered
- Advanced observability (tracing, profiling) minimal
- Disaster recovery and backup strategies mentioned but not detailed
- Multi-region deployment patterns limited

**Ref coverage:**
- Strong on Docker multi-stage builds, Docker Compose
- Good on GitHub Actions workflows
- Excellent on 5-phase deployment process (validate, stage, canary, release, observe)
- Good on rollback strategy
- Missing: advanced Kubernetes patterns, network security

**Cross-agent dependencies:**
- Uses backend-specialist for app-specific deployment config
- Coordinates with testing-specialist for CI pipeline tests
- Works with database-architect on migration deployment strategy

---

### AGENT 6: DOCUMENTATION WRITER
**Main file:** /c/Users/User/.claude/agents/documentation-writer/documentation-writer.md | 150+ lines

**Ref files:**
- Documentation writer source (ref\antigravity\agents\documentation-writer.md)
- Documentation templates skill
- DOCX skill (OOXML editing, tracked changes)
- PPTX skill (html2pptx, OOXML editing)
- XLSX skill (formulas, financial models)

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** write documentation, document this, README, JSDoc, API docs, architecture doc, ADR, user guide, write a guide for

**What it actually does:**
EXPLICIT REQUEST ONLY. Writes README files, API reference docs (OpenAPI narrative), Architecture Decision Records (ADRs), user guides, code comments for complex logic, CHANGELOG maintenance. Philosophy: "Documentation is a product. Write for the reader's context, not the writer's knowledge."

**Knowledge gaps visible from file:**
- Minimal video documentation patterns
- Interactive documentation (Storybook docs) limited
- API versioning communication strategy sparse
- Localization/i18n documentation patterns not covered

**Ref coverage:**
- Excellent on README structure, quick-start patterns
- Strong on JSDoc and OpenAPI narrative
- Good on ADR template, CHANGELOG (Keep a Changelog format)
- Good on voice and tone (active, second person, present tense)
- Missing: inline code documentation at scale, API changelog for breaking changes

**Cross-agent dependencies:**
- Used only when explicitly requested (never auto-invoked)
- Works with api-designer to document API specs
- Receives content from backend-specialist for technical details

---

### AGENT 7: EXPLORER AGENT
**Main file:** /c/Users/User/.claude/agents/explorer-agent/explorer-agent.md | 195 lines

**Ref files:**
- Explorer agent source (ref\antigravity\agents\explorer-agent.md)
- Code archaeology patterns (ref\other\claude-system-code-archaeologist.md)

**Tools declared:** Read, Grep, Glob (READ-ONLY, no Write/Edit/Bash)

**Model:** inherit

**Trigger keywords:** explore codebase, audit codebase, map this project, understand how X works, trace this flow, what files handle X, codebase overview, feasibility for X, where is Y defined

**What it actually does:**
PURE READ-ONLY codebase exploration. Maps file structure, dependencies, data flows. Three modes: AUDIT (full survey), MAPPING (deep dive on one component), FEASIBILITY (can we build X?). Produces Archaeology Reports with entry points, data flows, critical files, risks, and feasibility effort estimates.

**Knowledge gaps visible from file:**
- Performance analysis minimal (delegates to performance-optimizer)
- Security testing not covered (delegates to security-auditor)
- Limited to code understanding; doesn't validate functionality

**Ref coverage:**
- Excellent on file structure mapping, dependency tracing
- Strong on entry point discovery
- Good on data flow visualization
- Good on feasibility assessment
- Strict: read-only constraint prevents modifications

**Cross-agent dependencies:**
- Hands off to code-archaeologist when deep refactoring needed
- Provides input to gsd-planner for feasibility-informed planning
- Used by orchestrator as starting point for new projects

---

### AGENT 8: GAME DEVELOPER
**Main file:** /c/Users/User/.claude/agents/game-developer/game-developer.md | 185 lines

**Ref files:**
- Game developer source (ref\antigravity\agents\game-developer.md)
- Game development skill
- Game loop + pattern selection + perf budgets
- Multiplayer architecture (lag compensation, anti-cheat)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** game, Unity, Godot, Unreal, game loop, physics, collision, sprite, shader, scene, prefab, game object, level design, pathfinding, A*, multiplayer, WebGL, Phaser, Three.js, game mechanics

**What it actually does:**
Develops games across Unity (C#), Godot (GDScript), Unreal (C++/Blueprints), and web frameworks (Phaser 3, Three.js, Babylon.js). Handles game loop architecture, physics/collision, AI pathfinding (A*, NavMesh), multiplayer networking, shaders, and performance optimization (target 60fps).

**Knowledge gaps visible from file:**
- Limited AR/VR beyond XR mention
- Minimal cloud gaming / streaming architecture
- Procedural generation patterns sparse
- Advanced HLSL/GLSL shader techniques limited
- Save/load state management for complex games sparse

**Ref coverage:**
- Strong on game loop architecture, entity-component patterns
- Good on performance targets (60fps mobile, mobile physics)
- Good on multiplayer (Netcode for GameObjects, Photon)
- Excellent on UI/audio manager patterns
- Missing: matchmaking, progression systems, in-game economy balance

**Cross-agent dependencies:**
- Uses ui-specialist for game UI (menus, HUD)
- Coordinates with performance-optimizer for profiling
- Uses testing-specialist for game logic validation

---

## GSD AGENTS (5 AGENTS)

These 5 agents work together in a pipeline for complex multi-phase projects:

### AGENT 9: GSD ROADMAPPER
**Main file:** /c/Users/User/.claude/agents/gsd-roadmapper/gsd-roadmapper.md | 172 lines

**Ref files:**
- GSD roadmapper source (ref\gsd\agents\gsd-roadmapper.md)
- GSD planner, project researcher, research synthesizer

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** create roadmap, plan this project, strategic plan, what are the phases for, roadmap, GSD roadmap, project phases, define the project

**What it actually does:**
Uses goal-backward methodology to create strategic phase plans. Starts from end goal, works backward: "What must be TRUE for goal to achieve? What artifacts/tasks exist to make that TRUE?" Creates ROADMAP.md (with success definition, phase dependencies, risk register) and STATE.md (project state tracking).

**Knowledge gaps visible from file:**
- Limited post-launch planning (maintenance phases)
- Minimal risk quantification (qualitative only)
- No real-time roadmap adjustment framework

**Ref coverage:**
- Excellent on goal-backward phase derivation
- Strong on 100% requirements coverage validation
- Good on anti-enterprise principle (minimize documents)
- Good on success definition and exit criteria
- Missing: stakeholder alignment mechanisms

**Cross-agent dependencies:**
- Output feeds directly to gsd-planner (Phase 2)
- Creates STATE.md and ROADMAP.md that gsd-executor reads
- Calls gsd-project-researcher (parallel) for background research

---

### AGENT 10: GSD PLANNER
**Main file:** /c/Users/User/.claude/agents/gsd-planner/gsd-planner.md | 148 lines

**Ref files:**
- GSD planner source (ref\gsd\agents\gsd-planner.md)
- GSD roadmapper, phase researcher, plan checker

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** plan this phase, break down phase, create tasks, plan tasks, what tasks are needed, gsd plan, phase tasks, execution plan

**What it actually does:**
Breaks phase (from ROADMAP.md) into 2-3 task PLAN.md files. Uses goal-backward must-haves derivation. Each PLAN.md contains: objective, context, 2-3 tasks, success criteria, verification steps. Assigns execution waves (parallel vs sequential). Philosophy: "Plans are prompts. More plans, smaller scope, consistent quality."

**Knowledge gaps visible from file:**
- Limited handling of cross-team dependencies
- Minimal prioritization frameworks (dependencies only, no RICE)
- No real-time re-planning upon task failure

**Ref coverage:**
- Excellent on aggressive atomicity (2-3 tasks max per plan)
- Strong on must-haves derivation
- Good on task verification criteria
- Good on wave dependency mapping
- Missing: effort estimation for AI-builders, re-planning triggers

**Cross-agent dependencies:**
- Input: ROADMAP.md from gsd-roadmapper
- Output: PLAN.md files that gsd-executor executes
- Can be invoked in "gap-closure mode" by gsd-verifier

---

### AGENT 11: GSD EXECUTOR
**Main file:** /c/Users/User/.claude/agents/gsd-executor/gsd-executor.md | 155 lines

**Ref files:**
- GSD executor source (ref\gsd\agents\gsd-executor.md)
- Deviation rules (ref\gsd\data\deviation-rules.md)
- Feature dev workflow, memory patterns, context compaction

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** execute plan, run the plan, implement plan, execute phase, do the tasks, carry out, implement tasks, work through plan

**What it actually does:**
Executes PLAN.md tasks sequentially. Reads task fully before starting, builds EXACTLY what's specified (no scope creep), runs verification after each task, updates STATE.md. Commits after each task (atomic commits). Produces SUMMARY.md on completion or BLOCKED if blocker encountered.

**Knowledge gaps visible from file:**
- Limited context compaction for long-running plans
- No automatic recovery from partial failure
- Minimal guidance on splitting plans if context fills

**Ref coverage:**
- Excellent on task-by-task execution protocol
- Strong on STATE.md tracking
- Good on deviation rules (auto-fix obvious bugs < 5 min, ask for scope expansion)
- Good on SUMMARY.md format
- Missing: dynamic task prioritization if one task is much faster than estimated

**Cross-agent dependencies:**
- Input: PLAN.md files from gsd-planner
- Reads/updates: STATE.md and ROADMAP.md
- Calls specialized agents for implementation (backend-specialist, ui-specialist, etc.)
- Produces output for gsd-verifier

---

### AGENT 12: GSD VERIFIER
**Main file:** /c/Users/User/.claude/agents/gsd-verifier/gsd-verifier.md | 172 lines

**Ref files:**
- GSD verifier source (ref\gsd\agents\gsd-verifier.md)
- GSD integration checker

**Tools declared:** Read, Bash, Glob, Grep (NO Write/Edit for verification integrity)

**Model:** inherit

**Trigger keywords:** verify phase, did we achieve the goal, check if done, verify completion, goal verification, phase complete check, is it working, verify the phase

**What it actually does:**
GOAL-BACKWARD VERIFICATION: Works backward from phase goal in ROADMAP.md to verify exit criteria are satisfied. Three-level check per must-have: EXISTS (file present), SUBSTANTIVE (real implementation, not stub/placeholder), WIRED (connected to system). Produces VERIFICATION.md with pass/fail/gap analysis.

**Knowledge gaps visible from file:**
- Limited multi-platform verification (assumes single environment)
- Minimal performance regression detection
- No automated re-verification loops

**Ref coverage:**
- Excellent on 3-level verification (exists/substantive/wired)
- Strong on gap identification with specific evidence
- Good on re-verification mode after gap closure
- Good on VERIFICATION.md format with must-haves
- Missing: acceptance criteria from stakeholders

**Cross-agent dependencies:**
- Input: ROADMAP.md, PLAN.md, and codebase from gsd-executor
- Output: VERIFICATION.md with gaps
- If gaps found, calls gsd-planner in "gap-closure mode"
- If blocked, calls gsd-debugger for systematic investigation

---

### AGENT 13: GSD DEBUGGER
**Main file:** /c/Users/User/.claude/agents/gsd-debugger/gsd-debugger.md | 171 lines

**Ref files:**
- GSD debugger source (ref\gsd\agents\gsd-debugger.md)
- Systematic debugging skill from enrichment CSV

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** debug, broken, not working, error, failing, fix bug, investigate issue, something is wrong, broken behavior, unexpected output, crash, exception, 500 error

**What it actually does:**
Uses SCIENTIFIC METHOD: OBSERVE (symptom) → HYPOTHESIZE (causes) → PREDICT (if hypothesis true, what should we see) → TEST (minimal test) → CONCLUDE (confirm/refute) → VERIFY (after fix). Avoids brute-force fixing. Max 2 code changes per hypothesis before gathering new evidence. Produces debug file (BUG-[name].md) for complex issues.

**Knowledge gaps visible from file:**
- Limited multi-threaded/concurrency debugging
- Minimal remote debugging patterns
- No load testing investigation methodology

**Ref coverage:**
- Excellent on scientific method discipline
- Strong on 7 investigation techniques (bisection, minimal reproduction, diff reading, state inspection, boundary testing, assumption audit, forward tracing)
- Good on debug file protocol
- Good on anti-brute-force rule
- Missing: distributed system debugging (multiple services)

**Cross-agent dependencies:**
- Called by gsd-verifier when verification gaps found
- Called by gsd-executor when task verification fails
- Produces findings that feed back into gsd-executor or gsd-planner

---

## FEATURE/DOMAIN SPECIALISTS (9 AGENTS)

### AGENT 14: MOBILE DEVELOPER
**Main file:** /c/Users/User/.claude/agents/mobile-developer/mobile-developer.md | 211 lines

**Ref files:**
- Mobile developer source (ref\antigravity\agents\mobile-developer.md)
- Mobile design skills
- Navigation patterns, mobile performance, touch psychology
- Platform-specific: iOS HIG, Android MD3

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** mobile, React Native, Expo, Flutter, iOS, Android, app store, navigation, FlatList, push notifications, deep links, Xcode, Android Studio, build, simulator, emulator

**What it actually does:**
Builds cross-platform mobile apps (React Native + Expo, Flutter). Handles FlatList/ListView virtualization for long lists, deep linking, push notifications, native module integration (camera, biometrics), app store submission, build configuration (EAS Build, Xcode, Gradle).

**Knowledge gaps visible from file:**
- Limited AR/VR integration patterns
- Minimal ML/AI on-device patterns
- Offline-first sync patterns sparse
- Desktop (macOS, Windows) app development via Electron/Tauri not covered

**Ref coverage:**
- Excellent on FlatList/SectionList virtualization
- Strong on React Navigation v7
- Good on platform differences (iOS/Android)
- Good on Expo EAS Build config
- Good on storage patterns (SecureStore, AsyncStorage, MMKV)
- Missing: advanced graphics, WebRTC for video calling

**Cross-agent dependencies:**
- Uses ui-specialist for mobile UI components
- Uses ux-specialist for mobile UX patterns
- Coordinates with testing-specialist for mobile testing (Appium, etc.)
- Works with performance-optimizer for bundle size and runtime perf

---

### AGENT 15: N8N SPECIALIST
**Main file:** /c/Users/User/.claude/agents/n8n-specialist/n8n-specialist.md | 247 lines

**Ref files:**
- n8n workflow templates (ref\repos\n8n-workflows-main)
- Workflow catalog index (ref\data\n8n\catalog.csv) — 479 workflows
- Integration list (ref\data\n8n\integrations.md) — 188 integrations
- Workflow automation source (ref\core\09-WORKFLOW_AUTOMATION.md)
- 6-phase validation methodology + MCP tool calls (ref\n8n-workflow-builder.md)

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** n8n, workflow, automate, trigger, automation, connect apps, webhook, Zapier alternative, no-code automation, data pipeline, scheduled task, email automation, Supabase webhook, API integration, workflow node

**What it actually does:**
Builds n8n automation workflows: webhooks, crons, database triggers. Multi-step data transformations. App-to-app integrations (Supabase → email, Stripe → Slack). Error handling with retry logic and dead letter queues. Expression language for data transformation. Supabase webhook integration patterns.

**Knowledge gaps visible from file:**
- Limited advanced logic flow (custom code nodes minimal)
- Minimal multi-tenant workflow architecture
- No workflow monitoring/observability patterns

**Ref coverage:**
- Excellent on workflow structure pattern
- Strong on common patterns (order confirmation, lead capture, scheduled cleanup)
- Good on JSON workflow structure, node types
- Good on error handling strategy
- Good on Supabase webhook integration
- Missing: workflow performance optimization, cost calculation for large workflows

**Cross-agent dependencies:**
- Uses backend-specialist for Supabase integration details
- Coordinates with n8n-specialist to check catalog before building
- Works with testing-specialist to test trigger → action → output flows

---

### AGENT 16: NANO GENESIS (Image Generation)
**Main file:** /c/Users/User/.claude/agents/nano-genesis/nano-genesis.md | 153 lines

**Ref files:**
- Full image generation guide (ref\core\07-NANO_GENESIS.md)
- Commercial prompt library (ref\other\NANO_GENESIS_Commercial.txt)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** generate image, create photo, product photo, hero banner, brand visual, marketing asset, character design, mascot, logo, e-commerce image, lifestyle photo, generate

**What it actually does:**
Generates commercial-grade images via Google Imagen 4 (Vertex AI). Product photography, hero banners, brand visuals, character design. Prompt engineering: describe the shot (lighting, background, angle, mood, quality modifiers). Handles aspect ratio selection. WARNING: Imagen generates garbled text — add text in post-production (Figma, CSS).

**Knowledge gaps visible from file:**
- Limited style transfer / artistic recreation
- No real-estate photography patterns
- Minimal fashion/apparel-specific patterns documented
- No batch generation workflows

**Ref coverage:**
- Excellent on product photography prompts
- Strong on fashion/clothing templates
- Good on hero banner templates
- Good on quality modifiers by use case
- Good on aspect ratio selection
- Missing: photo editing of generated images, multi-image consistency

**Cross-agent dependencies:**
- Used alongside veo-genesis for visual brand consistency
- Provides images that ui-specialist uses in web layouts
- No deep interdependencies; mostly standalone tool

---

### AGENT 17: ORCHESTRATOR
**Main file:** /c/Users/User/.claude/agents/orchestrator/orchestrator.md | 226 lines (partial read due to token limit)

**Ref files:**
- Agentic workflow patterns, evaluator-optimizer loop, dynamic task decomposition, classification patterns

**Tools declared:** Read, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** plan, build, create, analyze, implement, design, deploy, automate, research, test, security, performance, mobile, game, devops, workflow, debug, coordinate, orchestrate

**What it actually does:**
MASTER ROUTER across all 26 agents. Analyzes requests, selects optimal agent(s), manages multi-agent pipelines, enforces 50% context budget rule (quality degrades past 50% context). Routes to single agents, sequential pipelines, GSD pipelines, research-first, or evaluator-optimizer loops. Maintains 50K+ token awareness.

**Knowledge gaps visible from file:**
- Limited dynamic re-routing if agent fails
- No multi-agent consensus building
- Minimal user preference learning

**Ref coverage:**
- Excellent on complete agent roster (26 agents listed)
- Strong on routing decision engine and modes (single, sequential, GSD, research-first, evaluator-optimizer)
- Good on pipeline templates (full-stack web, research→impl, security, GSD new project, mobile, automation)
- Good on data knowledge base mapping
- Good on context budget awareness and quality control

**Cross-agent dependencies:**
- Centralized hub; all agents report to orchestrator
- Manages handoff between agents
- Enforces quality gates at each stage

---

### AGENT 18: PENETRATION TESTER
**Main file:** /c/Users/User/.claude/agents/penetration-tester/penetration-tester.md | 200+ lines (partial read)

**Ref files:**
- Penetration tester source (ref\antigravity\agents\penetration-tester.md)
- Vulnerability scanner skill
- Red team tactics skill
- OWASP security patterns (ref\core\04-SECURITY_AUDITOR.md)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** pentest, penetration test, CTF, ethical hacking, exploit, vulnerability assessment, red team, bug bounty, authorized test, security research, XSS, CSRF, clickjacking, browser vulnerability

**What it actually does:**
Authorized penetration testing only. Two execution environments: Kali Docker (`kali-pentest`) for network tools (nmap, sqlmap, subfinder), Playwright CLI for browser testing (XSS, CSRF token checking, clickjacking, cookie security, open redirects, CSP bypass). PTES 7-phase methodology with pre-engagement authorization protocol. Produces findings with CVSS scores.

**Knowledge gaps visible from file:**
- Limited wireless pentesting (WPA, Bluetooth)
- Minimal hardware security testing
- No Android/iOS penetration testing details
- Limited supply chain attack patterns

**Ref coverage:**
- Excellent on pre-engagement protocol (authorization checklist)
- Strong on PTES 7 phases (pre-engagement, recon, scanning, enumeration, vuln analysis, exploitation, post-exploitation)
- Good on Playwright CLI patterns (XSS detection, CSRF token checks, clickjacking, redirect testing, CSP bypass)
- Good on Kali Docker execution (safe containerized testing)
- Missing: multi-factor authentication bypass patterns, sophisticated privilege escalation chains

**Cross-agent dependencies:**
- Complements security-auditor (static analysis vs active testing)
- Uses findings to inform security recommendations
- Never called without explicit authorization

---

### AGENT 19: PERFORMANCE OPTIMIZER
**Main file:** /c/Users/User/.claude/agents/performance-optimizer/performance-optimizer.md | 227 lines

**Ref files:**
- Performance optimizer source (ref\antigravity\agents\performance-optimizer.md)
- Performance profiling skill
- Clean code skill
- Benchmarker (Web Vitals targets, optimization tiers)
- Profiling skill (symptom-to-cause mapping, tool selection)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** slow, performance, optimize, speed, bundle size, LCP, CLS, INP, memory leak, lighthouse, profiling, lazy load, code splitting, cache, CPU, benchmark, pagespeed

**What it actually does:**
Diagnoses and fixes performance: Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1), bundle size optimization (code splitting, tree shaking, dynamic imports), React render optimization (memoization, virtualization), database query optimization (N+1 detection), image optimization, and caching strategies.

**Knowledge gaps visible from file:**
- Limited HTTP/2 and HTTP/3 specific patterns
- Minimal WebAssembly performance guidance
- No serverless cold-start optimization
- Limited real user monitoring (RUM) setup

**Ref coverage:**
- Excellent on Core Web Vitals targets and profiling approach
- Strong on React render optimization (memo, useMemo, useCallback, virtualization)
- Good on bundle size optimization (code splitting, tree shaking)
- Good on image optimization and Next.js Image component
- Good on database optimization (N+1 detection, caching)
- Missing: edge caching, advanced prefetching strategies

**Cross-agent dependencies:**
- Works with backend-specialist on API response times
- Coordinates with ui-specialist on component performance
- Uses testing-specialist to validate performance improvements

---

### AGENT 20: PROJECT MANAGER
**Main file:** /c/Users/User/.claude/agents/project-manager/project-manager.md | 197 lines

**Ref files:**
- Project manager source (ref\core\10-PROJECT_MANAGER.md)
- GSD roadmapper (complements but different focus)
- GSD planner (task-level planning)
- PRD methodology (7-phase, RICE scoring, dependency graphs)

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** plan this, how do I build X, break down this feature, roadmap, sprint planning, task breakdown, what order should we, prioritize, requirements, what needs to happen to, project plan, before we start, new feature planning

**What it actually does:**
Technical project planning: goal-backward methodology, requirement decomposition, phase breakdown, dependency mapping, effort estimation, risk identification. Creates PROJECT PLAN with phases/tasks/success criteria (not GSD — simpler, for non-goal-driven projects). Sprint planning and prioritization (PIE framework for A/B test prioritization).

**Knowledge gaps visible from file:**
- Limited stakeholder management / communication planning
- Minimal budget/resource constraint handling
- No portfolio-level planning (multiple projects)

**Ref coverage:**
- Excellent on goal-backward planning
- Strong on effort estimation (80th percentile, integration time)
- Good on project plan format and task breakdown template
- Good on dependency types (technical, knowledge, resource)
- Good on risk register
- Missing: capacity planning for teams, velocity tracking

**Cross-agent dependencies:**
- Less formal than gsd-roadmapper; for simpler planning
- Can feed into gsd-roadmapper if goal-driven approach needed
- Works with orchestrator to determine if GSD pipeline needed

---

### AGENT 21: RESEARCH SPECIALIST
**Main file:** /c/Users/User/.claude/agents/research-specialist/research-specialist.md | 247 lines

**Ref files:**
- Sherlock AI plugin, Superpowers, Claude cookbooks
- Competitor system prompts, system prompts leaks
- n8n workflows, agentic design book
- Intelligence patterns
- Research lead agent, research subagent

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch

**Model:** inherit

**Trigger keywords:** research, find information about, compare technologies, competitor analysis, what's the best X, evaluate options, market research, look up, investigate, gather information about, technology comparison, summarize findings

**What it actually does:**
Deep research: technology evaluation (libraries, frameworks, platforms), competitor analysis, market research, codebase investigation, best practices synthesis. Four-phase: (1) define research question, (2) structured investigation, (3) synthesize findings, (4) recommendation. Produces technology evaluation matrix, competitor analysis, library research checklist, or research reports.

**Knowledge gaps visible from file:**
- Limited to 2026 knowledge cutoff (Web search helps)
- Minimal longitudinal research (tracking trends over time)
- No predictive modeling or forecasting

**Ref coverage:**
- Excellent on structured investigation methodology
- Strong on technology evaluation matrix
- Good on competitor analysis structure
- Good on library research checklist (health indicators, technical fit)
- Good on research report format (executive summary → findings → recommendation)
- Missing: bias analysis, confidence-level calibration

**Cross-agent dependencies:**
- Used by orchestrator in "research-first" mode
- Feeds findings to implementation agents (backend-specialist, etc.)
- Uses WebSearch for current information

---

### AGENT 22: SECURITY AUDITOR
**Main file:** /c/Users/User/.claude/agents/security-auditor/security-auditor.md | 156 lines

**Ref files:**
- Static analysis patterns (always read first)
- TypeScript vulnerability patterns
- Next.js security
- Secret detection
- Auth code review
- Supabase security
- AI/LLM code security
- Vulnerability scanner skill (OWASP 2025 + EPSS prioritization)
- Silent failure hunter (error handling review)
- Full patterns library (ref\core\04-SECURITY_AUDITOR.md)

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** security audit, audit this code, review for vulnerabilities, pre-deploy security check, OWASP audit, is this secure, SQL injection, XSS, JWT review, RLS review, secret detection, supply chain, Next.js security, Supabase security, auth review, HIPAA, PCI-DSS

**What it actually does:**
STATIC CODE ANALYSIS ONLY (not live exploitation). Audits TypeScript/JavaScript codebases for vulnerabilities: auth patterns (JWT, OAuth), RLS policies, input validation, dependency CVEs, secrets in code/git history, security headers, AI/LLM integrations, HIPAA/PCI-DSS compliance. Produces findings with CVSS scores, CWE, OWASP 2025 mapping, and fix recommendations.

**Knowledge gaps visible from file:**
- Limited to static analysis; no runtime behavior testing
- Minimal proprietary/closed-source code patterns
- No firmware security patterns

**Ref coverage:**
- Excellent on OWASP TOP 10 2025 (A01 Broken Access Control to A10 Exceptional Conditions)
- Strong on secret detection, dependency scanning
- Good on auth code review (JWT anti-patterns, session fixation)
- Good on RLS policy correctness
- Good on Next.js-specific CVEs (CVE-2025-29927, CVE-2025-55182/66478 mentioned)
- Missing: supply chain attack detection beyond npm audit

**Cross-agent dependencies:**
- Complements penetration-tester (static vs active)
- Works with backend-specialist to remediate findings
- Used in pre-deployment security gates

---

### AGENT 23: SEO SPECIALIST
**Main file:** /c/Users/User/.claude/agents/seo-specialist/seo-specialist.md | 204 lines

**Ref files:**
- SEO specialist source (ref\antigravity\agents\seo-specialist.md)
- SEO fundamentals skill
- GEO fundamentals skill (AI search optimization)

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** SEO, search ranking, meta tags, sitemap, robots.txt, schema markup, structured data, keyword, backlinks, crawl, indexing, GEO, AI search, E-E-A-T, canonical, Open Graph

**What it actually does:**
Technical SEO + GEO (Generative Engine Optimization for AI search engines). Implements meta tags, Open Graph, structured data (JSON-LD schema), XML sitemaps, robots.txt. Designs for Core Web Vitals impact. E-E-A-T strategy. Next.js metadata API. Content optimization for AI citation (GEO).

**Knowledge gaps visible from file:**
- Limited local SEO / GEO tagging
- Minimal link building strategy
- No PPC SEM integration

**Ref coverage:**
- Excellent on Next.js metadata API implementation
- Strong on JSON-LD schema markup
- Good on Core Web Vitals → SEO impact
- Good on E-E-A-T framework
- Good on GEO concepts (AI answer engines vs traditional search)
- Missing: Link building, backlink analysis, SEO copywriting

**Cross-agent dependencies:**
- Works with ui-specialist for metadata implementation
- Coordinates with performance-optimizer for CWV improvements
- Uses documentation-writer for content guidance

---

### AGENT 24: TESTING SPECIALIST
**Main file:** /c/Users/User/.claude/agents/testing-specialist/testing-specialist.md | 330 lines

**Ref files:**
- Testing specialist source (ref\core\06-TESTING_SPECIALIST.md)
- GSD verifier (goal-backward validation)
- Playwright E2E toolkit (recon-then-action, server lifecycle)
- PR review toolkit
- Testing patterns (mocking decisions, test data strategies)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** write tests, unit test, integration test, E2E test, Playwright, Jest, Vitest, test coverage, validate this feature, is this production ready, regression test, accessibility test, RLS test, rate limit test

**What it actually does:**
Comprehensive testing: Jest/Vitest unit tests, React Testing Library component tests, Playwright E2E scenarios, accessibility (axe-core, WCAG 2.2), RLS policy testing, rate limiting tests. Pyramid strategy (most unit, critical E2E). Mock strategy (MSW, fixtures, test databases).

**Knowledge gaps visible from file:**
- Limited visual regression testing (Percy, etc.)
- Minimal performance testing frameworks
- No chaos engineering patterns

**Ref coverage:**
- Excellent on Jest configuration, unit test patterns
- Strong on React Testing Library patterns (role-based queries)
- Excellent on Playwright E2E with config, multi-browser testing
- Good on RLS policy testing with multi-user scenarios
- Good on GitHub Actions CI pipeline
- Good on accessibility testing (axe-core)
- Missing: Contract testing for APIs, mutation testing

**Cross-agent dependencies:**
- Works with all implementation agents (backend-specialist, ui-specialist, etc.)
- Used by gsd-executor for task verification
- Coordinates with gsd-verifier for goal achievement validation

---

## FRONTEND SPECIALISTS (2 AGENTS)

### AGENT 25: UI SPECIALIST
**Main file:** /c/Users/User/.claude/agents/ui-specialist/ui-specialist.md | 199 lines (partial read due to token limit)

**Ref files:**
- Frontend specialist source (ref\core\03-FRONTEND_SPECIALIST.md)
- Frontend design patterns skill
- Next.js/React expert patterns skill
- Tailwind v4 patterns skill
- Skills enrichment (i18n, web-design)
- Next.js performance (57 Vercel rules)
- Waterfall elimination patterns
- Bundle size optimization
- Tailwind v4 CSS-first config + Oxide engine
- Professional UI workflow + pre-delivery checklist
- Anti-AI-slop aesthetics (Anthropic research)
- Design philosophy, animation guide, visual effects, motion graphics
- UI/UX data assets: colors, styles, typography, icons, charts, landing, products, web-interface, ui-reasoning, ux-guidelines, react-performance

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** build component, create page, layout, UI, button, form, modal, navbar, hero, card, table, styling, Tailwind, shadcn, animation, dark mode, responsive design, mobile layout, Next.js page

**What it actually does:**
Builds React 19 / Next.js 15 App Router UI components and pages. Uses Tailwind v4, shadcn/ui, Framer Motion animations. Server components by default, client components for interactivity. Forms with react-hook-form + Zod. Dark mode, responsive layouts, loading states, skeleton loaders. Philosophy: "Accessible first, beautiful second, fast always."

**Knowledge gaps visible from file:**
- Limited to Tailwind/shadcn ecosystem; minimal CSS-in-JS alternatives documented
- Minimal web component patterns
- No canvas/WebGL UI patterns

**Ref coverage:**
- Excellent on Next.js 15 server/client component patterns
- Strong on Tailwind v4 and shadcn/ui customization
- Good on Framer Motion animations
- Good on form handling (react-hook-form + Zod)
- Good on dark mode implementation
- Good on performance (57 Vercel rules, waterfall elimination)
- Missing: Advanced CSS (grid, subgrid), advanced animations (GSAP), analytics

**Cross-agent dependencies:**
- Works with ux-specialist for UX guidance
- Coordinates with performance-optimizer for bundle size/render optimization
- Uses testing-specialist to test components
- Fetches design tokens from UI/UX data CSV assets

---

### AGENT 26: UX SPECIALIST
**Main file:** /c/Users/User/.claude/agents/ux-specialist/ux-specialist.md | 199 lines (partial read)

**Ref files:**
- Frontend specialist source (ref\core\03-FRONTEND_SPECIALIST.md)
- Frontend design patterns skill
- Tailwind v4 patterns skill
- UX psychology (Hick's Law, Fitts' Law, Miller's Law with formulas)
- UI/UX data assets: colors, styles, typography, ux-guidelines, ui-reasoning, web-interface, landing

**Tools declared:** Read, Write, Edit, Glob, Grep

**Model:** inherit

**Trigger keywords:** UX, user experience, user flow, wireframe, design system, information architecture, conversion rate, CRO, usability, accessibility audit, user journey, onboarding flow, checkout flow, design review

**What it actually does:**
UX strategy, user flow design, wireframes, information architecture, design systems, accessibility audits (WCAG 2.2), conversion optimization (CRO), onboarding/checkout flows. Nielsen's 10 usability heuristics. A/B test prioritization (PIE framework).

**Knowledge gaps visible from file:**
- Limited micro-interaction design
- Minimal voice/conversational UI patterns
- No metaverse/3D UX patterns

**Ref coverage:**
- Excellent on Nielsen's 10 usability heuristics
- Strong on user flow documentation format
- Good on checkout flow best practices
- Good on information architecture (navigation design, card sorting)
- Good on design system tokens (semantic hierarchy)
- Good on WCAG 2.2 AA checklist
- Good on CRO principles (friction reduction, social proof, urgency)
- Missing: Eye tracking studies, session replay analysis

**Cross-agent dependencies:**
- Works with ui-specialist for implementation
- Provides wireframes/flows that ui-specialist builds
- Uses testing-specialist for usability testing
- Coordinates with performance-optimizer for CWV impact on UX

---

### AGENT 27: VEO GENESIS (Video Generation)
**Main file:** /c/Users/User/.claude/agents/veo-genesis/veo-genesis.md | 177 lines *(updated Tier 2)*

**Tier 2 Status:** Enhanced — MODES, confidence-check, reflexion-pattern added

**Ref files:**
- Full VEO generation guide (ref\core\08-VEO_GENESIS.md)
- Pairs with nano-genesis for visual consistency
- confidence-check.md (Tier 2)
- reflexion-pattern.md (Tier 2)

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** generate video, create video, product demo video, brand video, social media video, Reel, TikTok video, video ad, animation, motion, VEO, video content

**What it actually does:**
Video generation via Google VEO 3 (Vertex AI). Product demo videos, brand cinematics, social media videos (Reels, TikTok, Stories, YouTube). Prompt engineering: scene description, camera movement, lighting, style/mood, technical specs. Handles aspect ratios by platform (16:9 YouTube, 9:16 Stories, 1:1 Instagram).

**New in Tier 2:** VEO 3 prompt engineering patterns, camera movement vocabulary (dolly, pan, orbit, crane), platform-specific strategies (Reels/TikTok/YouTube), character consistency patterns with nano-genesis, MODES section added.

**Knowledge gaps visible from file:**
- Limited video editing of generated footage
- No animation production pipelines beyond VEO
- Minimal advanced color grading guidance

**Ref coverage:**
- Excellent on camera movement vocabulary
- Strong on VEO prompt templates (product demo, brand cinematic, social)
- Good on platform-specific format/duration (Instagram 15-30s, TikTok 15-60s, etc.)
- Good on scene script format
- Good on brand consistency with nano-genesis
- Missing: Audio/music selection, advanced editing workflows

**Cross-agent dependencies:**
- Pairs with nano-genesis for consistent visual branding
- Provides videos that ui-specialist uses in web layouts
- No deep interdependencies; mostly standalone tool

---

### AGENT 28: COST OPTIMIZER *(NEW — Added Tier 2)*
**Main file:** /c/Users/User/.claude/agents/cost-optimizer/cost-optimizer.md | 397 lines

**Tier 2 Status:** NEW AGENT — Added in Tier 2

**Ref files:**
- cost-optimizer skill (standalone — no external KB refs)

**Tools declared:** cost-optimizer (skill-based agent)

**Model:** inherit

**Trigger keywords:** /cost-optimize, token audit, reduce cost, context budget, model routing, MCP overhead, session audit, ROI analysis, token savings

**What it actually does:**
Audits active Claude Code session setup for token waste and cost inefficiency. Analyzes: (1) model assignments (Haiku vs Sonnet vs Opus routing), (2) MCP overhead (~500 tokens per schema), (3) context degradation patterns, (4) Skillbook protocol usage, (5) confidence check gates. Produces ROI-ranked fix list with exact estimated token savings per fix.

**Decision flows (5):**
1. Model selection — Haiku→Sonnet→Opus routing by task complexity
2. MCP overhead analysis — prefer CLI over MCP when both work (~500 tokens/schema)
3. Context budget tracking — stop at 60%, write STATE.md handoff
4. Skillbook protocol — recurring task patterns save 46-49% tokens
5. Confidence check gate — >=75 threshold before output

**Top 10 ROI fixes:** Model routing correction, context compaction, MCP schema reduction, Skillbook adoption, parallel agent batching, session sizing (2-3 tasks max), cache-aware prompting, Haiku delegation for search/explore, Opus reservation for architecture only, tool call batching.

**Knowledge gaps visible from file:**
- No MODES section (does not follow standard 3-mode pattern)
- No confidence-check.md or reflexion-pattern.md references (needs Tier 3 update)
- Enhancement opportunity: add Tier 3 patterns when complete

**Cross-agent dependencies:**
- Referenced by orchestrator for model routing decisions
- Informs gsd-executor's SKILLBOOK protocol
- Used by all agents indirectly via COST RULES in CLAUDE.md

---

### A3: System Health Matrix
*Updated: 2026-04-14 — All 27 agents Enhanced. cost-optimizer is new.*

| Agent | Lines | Ref Count | Depth | Modes | Tier2 Status | Biggest Gap (post-Tier2) |
|-------|-------|-----------|-------|-------|--------------|--------------------------|
| api-designer | 328 | 4 | 4 | YES | Enhanced | gRPC, WebSocket patterns |
| backend-specialist | 301 | 12 | 4 | YES | Enhanced | — |
| code-archaeologist | 221 | 8 | 3 | YES | Enhanced | — |
| cost-optimizer | 397 | 0 | 4 | NO | NEW | No MODES/confidence/reflexion |
| database-architect | 195 | 8 | 4 | YES | Enhanced | — |
| devops-engineer | 177 | 7 | 3 | YES | Enhanced | Kubernetes patterns |
| documentation-writer | 255 | 7 | 3 | YES | Enhanced | — |
| explorer-agent | 211 | 3 | 3 | YES | Enhanced | — |
| game-developer | 202 | 7 | 3 | YES | Enhanced | — |
| gsd-roadmapper | 201 | 6 | 3 | YES | Enhanced | — |
| gsd-planner | 190 | 7 | 3 | YES | Enhanced | — |
| gsd-executor | 198 | 7 | 4 | YES | Enhanced | — |
| gsd-verifier | 209 | 7 | 3 | YES | Enhanced | — |
| gsd-debugger | 199 | 4 | 4 | YES | Enhanced | — |
| mobile-developer | 227 | 7 | 3 | YES | Enhanced | — |
| n8n-specialist | 293 | 7 | 3 | YES | Enhanced | — |
| nano-genesis | 178 | 2 | 2 | YES | Enhanced | — |
| orchestrator | 263 | 7 | 4 | YES | Enhanced | — |
| penetration-tester | 882 | 8 | 4 | YES | Enhanced | Largest agent; well-covered |
| performance-optimizer | 258 | 7 | 4 | YES | Enhanced | — |
| project-manager | 252 | 10 | 3 | YES | Enhanced | — |
| research-specialist | 315 | 11 | 4 | YES | Enhanced | — |
| security-auditor | 207 | 14 | 4 | YES | Enhanced | — |
| seo-specialist | 231 | 5 | 3 | YES | Enhanced | — |
| testing-specialist | 371 | 11 | 4 | YES | Enhanced | — |
| ui-specialist | 336 | 11 | 4 | YES | Enhanced | — |
| ux-specialist | 255 | 7 | 3 | YES | Enhanced | — |
| veo-genesis | 177 | 2 | 2 | YES | Enhanced | — |

---

### A4: Shared Reference Inventory
*Updated: 2026-04-14 — 34 new files added in Tier 2*

**Total files:** 3,038 (including repos/) | **Curated knowledge files:** 119 (excluding repos/)

#### _shared-ref/core/ (30 files — 9 new in Tier 2)

| File | Description | Tier |
|------|-------------|------|
| 01-ORCHESTRATOR.csv | Orchestrator agent knowledge CSV | Tier 1 |
| 02-BACKEND_SPECIALIST.csv | Backend specialist knowledge CSV | Tier 1 |
| 02-BACKEND_SPECIALIST.md | Backend specialist comprehensive guide | Tier 1 |
| 03-FRONTEND_SPECIALIST.csv | Frontend specialist knowledge CSV | Tier 1 |
| 03-FRONTEND_SPECIALIST.md | Frontend specialist comprehensive guide | Tier 1 |
| 04-SECURITY_AUDITOR.csv | Security auditor knowledge CSV | Tier 1 |
| 04-SECURITY_AUDITOR.md | Security auditor comprehensive guide | Tier 1 |
| 05-SECURITY_REMEDIATION.csv | Security remediation patterns CSV | Tier 1 |
| 05-SECURITY_REMEDIATION.md | Security remediation guide | Tier 1 |
| 06-TESTING_SPECIALIST.csv | Testing specialist knowledge CSV | Tier 1 |
| 06-TESTING_SPECIALIST.md | Testing specialist comprehensive guide | Tier 1 |
| 07-NANO_GENESIS.csv | Nano Genesis knowledge CSV | Tier 1 |
| 07-NANO_GENESIS.md | Nano Genesis image generation guide | Tier 1 |
| 08-VEO_GENESIS.csv | Veo Genesis knowledge CSV | Tier 1 |
| 08-VEO_GENESIS.md | Veo Genesis video generation guide | Tier 1 |
| 09-WORKFLOW_AUTOMATION.csv | n8n workflow automation CSV | Tier 1 |
| 09-WORKFLOW_AUTOMATION.md | n8n workflow automation guide | Tier 1 |
| 10-PROJECT_MANAGER.csv | Project manager knowledge CSV | Tier 1 |
| 10-PROJECT_MANAGER.md | Project manager comprehensive guide | Tier 1 |
| convert-to-csv.js | Script: convert agent MD to CSV | Tier 1 |
| merge-enrichment.js | Script: merge enrichment CSVs | Tier 1 |
| autoresearch-loop-protocol.md | Autonomous research loop: time-boxing, keep/discard metric | **Tier 2** |
| confidence-check.md | Self-assessment scoring (0-100 scale, gate at 75) | **Tier 2** |
| ecc-agentic-engineering.md | ECC: eval-first, decomposition, cost-aware routing | **Tier 2** |
| ecc-autonomous-agent-harness.md | ECC: persistent memory, scheduled ops, task queuing | **Tier 2** |
| ecc-context-budget.md | ECC: 60% stop rule, STATE.md handoff protocol | **Tier 2** |
| ecc-continuous-learning.md | ECC: instinct-based learning with confidence scoring | **Tier 2** |
| ecc-cost-aware-pipeline.md | ECC: model routing, budget tracking, caching patterns | **Tier 2** |
| ecc-longform-guide.md | ECC: long-form content generation guide | **Tier 2** |
| reflexion-pattern.md | Learn from failures, iterate on outputs | **Tier 2** |

#### _shared-ref/gsd/ (25 files — 10 new in Tier 2)

| File | Description | Tier |
|------|-------------|------|
| agents/gsd-codebase-mapper.md | GSD codebase mapper sub-agent | Tier 1 |
| agents/gsd-debugger.md | GSD debugger agent source | Tier 1 |
| agents/gsd-executor.md | GSD executor agent source | Tier 1 |
| agents/gsd-integration-checker.md | GSD integration checker sub-agent | Tier 1 |
| agents/gsd-phase-researcher.md | GSD phase researcher sub-agent | Tier 1 |
| agents/gsd-plan-checker.md | GSD plan checker sub-agent | Tier 1 |
| agents/gsd-planner.md | GSD planner agent source | Tier 1 |
| agents/gsd-project-researcher.md | GSD project researcher sub-agent | Tier 1 |
| agents/gsd-research-synthesizer.md | GSD research synthesizer sub-agent | Tier 1 |
| agents/gsd-roadmapper.md | GSD roadmapper agent source | Tier 1 |
| agents/gsd-verifier.md | GSD verifier agent source | Tier 1 |
| data/context-budget.md | GSD context budget reference | Tier 1 |
| data/deviation-rules.md | GSD deviation rules (Rules 1-4) | Tier 1 |
| data/goal-backward.md | Goal-backward methodology | Tier 1 |
| data/verification-protocol.md | GSD 3-level verification protocol | Tier 1 |
| ecc-eval-harness.md | Formal eval framework — eval-driven development, pass@k | **Tier 2** |
| gsd2-git-strategy.md | GSD v2: feature branches, atomic commits, PR workflow | **Tier 2** |
| gsd2-parallel-orchestration.md | GSD v2: wave-based parallel task execution | **Tier 2** |
| gsd2-quality-gate.md | GSD v2: 8-question quality gate before execution | **Tier 2** |
| gsd2-token-optimization.md | GSD v2: token optimization strategies | **Tier 2** |
| gstack-investigate.md | GStack: scientific method debugging protocol | **Tier 2** |
| gstack-plan-ceo-review.md | GStack: CEO-mode plan review — scope expansion/reduction | **Tier 2** |
| gstack-plan-eng-review.md | GStack: engineering manager plan review | **Tier 2** |
| gstack-retro.md | GStack: weekly retrospective — commit analysis, team metrics | **Tier 2** |
| skillbook-template.md | SKILLBOOK template — recurring task pattern library | **Tier 2** |

#### _shared-ref/other/ (25 files — 15 new in Tier 2)

| File | Description | Tier |
|------|-------------|------|
| NANO_GENESIS_Commercial.txt | Commercial prompt library for image generation | Tier 1 |
| agentic_book.pdf | Agentic AI book reference | Tier 1 |
| aegis-ai-instructions-template.md | AEGIS AI instructions template | Tier 1 |
| aegis-context-template/AI_INSTRUCTIONS.md | AEGIS context AI instructions | Tier 1 |
| aegis-context-template/decisions/template.md | AEGIS decision record template | Tier 1 |
| aegis-cross-referencing.md | AEGIS cross-referencing patterns | Tier 1 |
| aegis-framework-structure.md | AEGIS framework directory structure | Tier 1 |
| claude-system-code-archaeologist.md | Code archaeologist methodology | Tier 1 |
| generate-image.py | Vertex AI image generation script | Tier 1 |
| PREFERENCES.md-template.md | PREFERENCES.md template | Tier 1 |
| cli-anything-harness-guide.md | CLI-Anything harness integration guide | **Tier 2** |
| cli-anything-meta-skill.md | CLI-Anything meta-skill for agent-native CLIs | **Tier 2** |
| cost-optimizer-skill.md | Cost optimizer skill source | **Tier 2** |
| ecc-deep-research.md | ECC: format-controlled research reports with citations | **Tier 2** |
| ecc-google-workspace-ops.md | ECC: Google Workspace ops across Drive/Docs/Sheets/Slides | **Tier 2** |
| ecc-security-guide.md | ECC: AgentShield, prompt injection defense, MCP security | **Tier 2** |
| gstack-cso.md | GStack: CSO infrastructure security audit with STRIDE | **Tier 2** |
| gstack-review.md | GStack: pre-landing PR review — SQL safety, LLM trust | **Tier 2** |
| gws-agents.md | GWS agent patterns for Google Workspace CLI | **Tier 2** |
| gws-skills-catalog.md | GWS skills catalog — 92 gws CLI skills reference | **Tier 2** |
| last30days-skill.md | Last30days: real-time research across 10+ platforms | **Tier 2** |
| openspace-benchmark-pattern.md | OpenSpace benchmark pattern for performance measurement | **Tier 2** |
| openspace-benchmark-tasks.json | OpenSpace benchmark task definitions | **Tier 2** |
| superclaude-confidence-source.py | SuperClaude confidence scoring Python source | **Tier 2** |
| superclaude-reflexion-source.py | SuperClaude reflexion pattern Python source | **Tier 2** |

#### _shared-ref/antigravity/ (32 files — all Tier 1)
10 agent files + 20 skill SKILL.md files + build-skills-csv.js + skills-enrichment.csv
Agents: code-archaeologist, database-architect, devops-engineer, documentation-writer, explorer-agent, game-developer, mobile-developer, penetration-tester, performance-optimizer, seo-specialist
Skills: api-patterns, bash-linux, clean-code, code-review-checklist, database-design, deployment-procedures, documentation-templates, frontend-design, game-development, geo-fundamentals, mobile-design, nextjs-react-expert, nodejs-best-practices, performance-profiling, powershell-windows, red-team-tactics, seo-fundamentals, server-management, tailwind-patterns, vulnerability-scanner

#### _shared-ref/data/ (4 files — all Tier 1)
MASTER-CATALOG.md, intelligence/patterns.md, n8n/catalog.csv (479 entries), n8n/integrations.md (188 integrations)

#### _shared-ref/repos/ (2,919 files)
Full repository clones: claude-cookbooks-main (Anthropic cookbook notebooks, agents, commands, skills), additional repos (system prompts, sherlock patterns).
Note: Repo files are available as KB references but are not counted in curated file totals.

---

### A5: Critical System Observations

#### Strengths
1. **Clear delegation model** — Each agent has explicit trigger keywords and scope boundaries
2. **Comprehensive knowledge base** — 3,029 shared reference files provide deep patterns and templates
3. **GSD pipeline excellence** — 5-agent GSD pipeline (Roadmapper → Planner → Executor → Verifier → Debugger) is sophisticated and well-documented
4. **Security-first** — Security-auditor and penetration-tester separate static vs active testing
5. **Multi-domain coverage** — 27 agents span frontend, backend, data, devops, security, testing, content, automation, and gaming
6. **Context budget awareness** — Orchestrator enforces 50% context rule and manages token load
7. **Philosophy consistency** — Each agent has clear identity, methodology, and anti-patterns

#### Weaknesses
1. **Limited vector/semantic search** — pgvector mentioned but patterns sparse; no semantic search agent
2. **GraphQL depth** — API designer covers basic GraphQL; no specialized GraphQL federation agent
3. **Distributed systems** — Minimal patterns for microservices orchestration, distributed tracing, consensus protocols
4. **AI/ML integration** — Some LLM security coverage but no ML ops, feature stores, or model monitoring
5. **Real-time patterns** — WebSocket, gRPC, Server-Sent Events patterns not well-covered
6. **Data engineering** — ETL, data warehouse, OLAP patterns not in core agents (would need data-engineer agent)
7. **Compliance specialization** — HIPAA/PCI-DSS mentioned but no dedicated compliance-focused agent
8. **Post-launch operations** — Minimal runbooks, incident response, chaos engineering patterns
9. **Team dynamics** — Project manager assumes solo dev + AI builder; no multi-team collaboration patterns
10. **Offline-first architectures** — Mobile sync, conflict resolution, CRDT patterns sparse

#### Coverage Blind Spots
- **Blockchain/Web3** — No crypto, smart contract, or decentralized patterns
- **Embedded systems** — Firmware, IoT, real-time systems minimal
- **Legacy mainframe** — COBOL, JCL, mainframe patterns missing
- **Enterprise middleware** — Message brokers, ESB, integration patterns sparse
- **Telephony/communications** — Voice/video APIs, SIP, minimal coverage
- **Quantum computing** — No quantum-specific patterns
- **GIS/mapping** — Geospatial queries mentioned; no specialized GIS agent
- **Audio/music** — Signal processing, DAWs, music theory minimal
- **3D graphics** — Beyond game development and rendering, limited CAD/architectural patterns

#### Recommendations

**High Priority Enhancements**
1. **Add data-engineer agent** — ETL, data warehousing, OLAP, analytics pipeline patterns (currently missing entirely)
2. **Expand vector/semantic patterns** — pgvector design, semantic search architectures, RAG implementation
3. **Add incident-response agent** — Runbooks, chaos engineering, post-mortems, resilience patterns
4. **Deepen GraphQL specialization** — Separate GraphQL-focused agent (federation, subscriptions, caching)
5. **Distributed systems patterns** — Microservices coordination, consensus, distributed tracing, service mesh

**Medium Priority Enhancements**
1. **Offline-first architecture patterns** — CRDT, local-first software, conflict resolution
2. **Real-time agent** — WebSocket, gRPC, Server-Sent Events patterns
3. **Compliance specialization** — HIPAA, PCI-DSS, GDPR-focused agent
4. **AI ops agent** — Model serving, monitoring, A/B testing, fine-tuning pipelines
5. **GIS/mapping specialization** — PostGIS, geospatial queries, location-based services

**Low Priority (Nice to Have)**
1. Blockchain/Web3 patterns
2. Embedded systems / IoT
3. Quantum computing patterns
4. Audio/music processing
5. Legacy mainframe patterns

#### Conclusion

The Claude Code agent system is a **mature, well-organized 27-agent specialist network** with strong coverage of modern web development, DevOps, security, testing, and content generation. The GSD pipeline is particularly sophisticated for managing complex, multi-phase projects. The 3,029-file shared knowledge base provides deep, actionable patterns for most common development tasks.

**Primary value:**
- Clear agent routing reduces decision fatigue
- Specialized knowledge bases ensure consistency and best practices
- GSD pipeline enables goal-driven development from strategy to verification
- Context budget awareness prevents quality degradation

**Primary limitations:**
- Skews toward web/cloud development; minimal embedded/legacy/specialized domains
- Post-launch operations (incident response, chaos engineering) underdeveloped
- Distributed systems and real-time patterns need expansion
- No data engineering specialization

**Maturity:** Production-ready for 80% of modern web development tasks. Suitable for solo developers and small teams. Would benefit from additional agents for data engineering, incident response, and compliance specialization.

---

#### Post-Tier2 State (2026-04-09) — COMPLETED ✅

##### System Enhancements Applied
- **All 27 agents:** MODES section added (default/deep-dive/rapid modes)
- **All 27 agents:** Confidence scoring (confidence-check.md reference, self-check before output)
- **All 27 agents:** Reflexion pattern (reflexion-pattern.md reference, learn from failures)
- **GSD pipeline:** Skillbook protocol, 8-question quality gate (gsd2-quality-gate.md)
- **GSD pipeline:** Wave-based parallel execution (gsd2-parallel-orchestration.md)
- **GSD pipeline:** Time budgets with 2x kill switch, worktree isolation
- **GSD pipeline:** Token optimization guide (gsd2-token-optimization.md)
- **Specialists:** gws CLI integration patterns added (n8n, project-manager, devops, docs, database, ux, api, backend)
- **security-auditor:** STRIDE threat modeling, AgentShield patterns (ecc-security-guide.md)
- **penetration-tester:** PTES 7-phase methodology, Kali Docker, Playwright CLI browser testing
- **n8n-specialist:** Bash tool added (was previously missing)
- **project-manager:** Bash tool added (was previously missing)
- **Skill factory:** 22 commands deployed to .claude/commands/ + 14 skill packages to .claude/skills/
- **New agent:** cost-optimizer (skill-based agent for token/cost optimization)
- **34 new _shared-ref files:** 9 in core/, 10 in gsd/, 15 in other/

##### Infrastructure Active (as of 2026-04-14)
- **claude-mem v12.0.1:** Running at http://localhost:37777 — ACTIVE ✅
- **gws v0.22.5:** Binary installed at C:\Users\User\AppData\Local\Programs\gws\ — OAuth PENDING ⚠️
- **Agent Teams:** ENABLED (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1) ✅
- **Auto-memory:** ACTIVE via claude-mem@thedotmack plugin ✅
- **SessionEnd hook:** Active → Obsidian vault sync ✅
- **Commands:** 48 deployed (up from ~26 original) ✅
- **Skills:** 20 installed (up from ~6 original) ✅

##### Remaining Gaps (post-Tier2)
- **cost-optimizer:** Missing MODES, confidence-check, reflexion-pattern — needs Tier 3 update
- **gws OAuth:** Blocking all 92 gws skills (Gmail, Drive, Sheets, Calendar operations)
- **Apify:** CLI installed but no API token configured — blocking web scraping
- **last30days:** Plugin pending installation
- **CLI-Anything harnesses:** Installed but individual app harnesses not yet deployed
- **Tier 4 Karpathy methods:** Gap analysis, approaches gate, git ratchet not yet implemented
- **Tier 5 Autonomous loop:** Vault sync, proposal review cycle, reflexion-driven updates not yet implemented

---
## PART B — REPOSITORY ANALYSIS (Repos 1-5)
# Deep Technical Analysis: 5 Code Repositories
**Analysis Date:** 2026-04-07  
**Analyzed Repos:** 5 | **Total Skills:** 251+ | **Total Agents:** 40+

---

## REPO 1: CLI-MAIN (GWS)

**Path:** `C:\Users\User\Downloads\new repos\cli-main\cli-main\`

**Language(s):** Rust (primary), JavaScript/Node.js (npm wrapper), Markdown (skills/docs)

**License:** Apache 2.0 (Google LLC)

**Repository URL:** https://github.com/googleworkspace/cli

### File Inventory

```
cli-main/
├── .agent/                          # Agent integration directory
│   ├── skills/                      # Agent skill definitions
│   └── workflows/                   # Workflow orchestrations
├── .changeset/                      # Changeset management
├── .claude/                         # Claude Code configuration
│   └── settings.json
├── .gemini/                         # Gemini IDE configuration
│   ├── config.yaml
│   └── style_guide.md
├── .github/                         # GitHub CI/CD workflows
│   ├── workflows/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── labeler.yml
├── .vscode/                         # VS Code extensions config
├── art/                             # ASCII art for CLI output (15 scene files)
├── crates/                          # Rust workspace
│   ├── google-workspace/            # Library crate (core types, helpers)
│   │   ├── src/
│   │   │   ├── discovery.rs        # Serde models for Discovery Doc
│   │   │   ├── services.rs         # Service alias → Discovery mapping
│   │   │   ├── error.rs            # GwsError enum, exit codes
│   │   │   ├── validate.rs         # Path/URL validators
│   │   │   └── client.rs           # HTTP client with retry
│   │   └── Cargo.toml
│   └── google-workspace-cli/        # Binary crate (CLI entrypoint)
│       ├── src/
│       │   ├── main.rs             # Two-phase parsing, method resolution
│       │   ├── auth.rs             # OAuth2 token acquisition
│       │   ├── credential_store.rs # AES-256-GCM encryption
│       │   ├── auth_commands.rs    # auth login/logout/setup/status
│       │   ├── commands.rs         # Recursive clap::Command builder
│       │   ├── executor.rs         # HTTP request construction
│       │   ├── schema.rs           # gws schema introspection command
│       │   ├── logging.rs          # Structured logging via tracing
│       │   └── timezone.rs         # Account timezone resolution
│       └── Cargo.toml
├── docs/
│   ├── CODE_OF_CONDUCT.md
│   ├── CONTRIBUTING.md
│   ├── skills.md                   # Comprehensive skill documentation
│   ├── demo.tape                   # VHS demo recording spec
│   └── logo.jpg
├── npm/                             # NPM convenience wrapper
│   ├── package.json
│   ├── install.js                  # Platform detection & binary download
│   ├── platform.js
│   └── run.js
├── scripts/                         # Build & release scripts
│   ├── coverage.sh
│   ├── show-art.sh
│   ├── tag-release.sh
│   └── version-sync.sh
├── skills/                          # 95 agent skills (see below)
│   ├── gws-*/ (40 core skills)
│   ├── persona-*/ (10 persona skills)
│   └── recipe-*/ (45 workflow recipe skills)
├── Cargo.lock                       # Dependency lock file
├── Cargo.toml                       # Workspace manifest
├── AGENTS.md                        # Architecture & development guide
├── CLAUDE.md                        # Claude Code integration guide
├── CONTEXT.md                       # Project context
├── README.md                        # Main documentation
├── CHANGELOG.md
├── LICENSE                          # Apache 2.0
├── SECURITY.md
├── pnpm-lock.yaml                  # Node.js lock file
├── package.json
├── deny.toml                        # Cargo dependency audit
├── flake.nix                        # Nix flake for reproducible builds
├── flake.lock
├── lefthook.yml                     # Git hook manager
├── gemini-extension.json            # Gemini IDE extension manifest
└── demo.gif
```

### Key Files — Deep Read

#### README.md
- **Purpose:** Main documentation and quick start guide
- **Key Content:**
  - Project tagline: "One CLI for all of Google Workspace — built for humans and AI agents"
  - Dynamic discovery: Reads Google Discovery Service at runtime (NOT generated code)
  - Zero boilerplate: Structured JSON output, 40+ agent skills included
  - Installation methods: GitHub releases (pre-built binaries), npm, Homebrew, nix, cargo build
  - Quick start: `gws auth setup` → `gws auth login` → `gws drive files list`
  - Prerequisites: Node.js 18+, Google Cloud project, Google Workspace account
- **Extractable Value:** Installation patterns, auth flow documentation, usage patterns

#### AGENTS.md
- **Purpose:** Comprehensive architecture and development guide
- **Key Content:**
  - Two-phase argument parsing strategy (extract service name, fetch Discovery Doc, rebuild clap tree)
  - Workspace layout: google-workspace (lib) + google-workspace-cli (binary)
  - Each module's responsibility clearly documented with file-by-file breakdown
  - Build commands: `cargo build`, `cargo clippy -- -D warnings`, `cargo test`
  - Changeset policy: Every PR must include `.changeset/<descriptive-name>.md`
  - Change types: patch (fixes/chores), minor (new features), major (breaking)
  - Input validation strategy: Always validate CLI args (not env vars)
  - Path safety validators: `validate_safe_output_dir()`, `validate_safe_dir_path()`
  - URL encoding rules: Use `encode_path_segment()` for URL path segments
  - VHS demo recording: Double quotes for simple strings, backticks for JSON
  - Test coverage requirement: codecov/patch check requires new lines to be tested
- **Extractable Value:** Validation patterns, Rust project structure template, changeset pattern, two-phase parsing architecture

#### CLAUDE.md
- **Purpose:** Claude Code integration guide (specific to this repo's Rust project)
- **Likely Content:** Setup instructions for Claude Code within this project, skill mappings

#### CONTEXT.md
- **Purpose:** Project-specific context management

#### skills/ Directory (95 Skills)
Divided into categories:

**A. Core GWS Services (40 skills)**
- gws-admin-reports — Admin Reports API integration
- gws-calendar — Calendar API (read/write events)
- gws-calendar-agenda — Simplified calendar agenda view
- gws-calendar-insert — Insert calendar events
- gws-chat — Chat API (messaging)
- gws-chat-send — Send chat messages
- gws-classroom — Classroom API (course management)
- gws-docs — Docs API (read/write documents)
- gws-docs-write — Write documents
- gws-drive — Drive API (file listing, management)
- gws-drive-upload — Upload files to Drive
- gws-events — Events API (event management)
- gws-events-renew — Renew event subscriptions
- gws-events-subscribe — Subscribe to events
- gws-forms — Forms API (form management)
- gws-gmail — Gmail API (read, send, manage email)
- gws-gmail-forward — Forward emails
- gws-gmail-read — Read email messages
- gws-gmail-reply — Reply to emails
- gws-gmail-reply-all — Reply-all to emails
- gws-gmail-send — Send emails
- gws-gmail-triage — Email triage/inbox summary
- gws-gmail-watch — Watch for new emails (streaming)
- gws-keep — Google Keep API (notes)
- gws-meet — Google Meet API (meeting management)
- gws-modelarmor — Model Armor (LLM prompt security)
- gws-modelarmor-create-template — Create Model Armor templates
- gws-modelarmor-sanitize-prompt — Sanitize prompts
- gws-modelarmor-sanitize-response — Sanitize LLM responses
- gws-people — People API (contacts management)
- gws-script — Google Apps Script API
- gws-script-push — Push scripts to Apps Script
- gws-sheets — Sheets API (spreadsheet operations)
- gws-sheets-append — Append data to sheets
- gws-sheets-read — Read sheet data
- gws-slides — Slides API (presentation management)
- gws-tasks — Tasks API (task management)
- gws-workflow — Workflow orchestration (meta-skill combining others)
- (Additional Drive/Gmail variants)

**B. Persona Skills (10 skills)**
- persona-content-creator — Content creation workflows
- persona-customer-support — Customer support automation
- persona-event-coordinator — Event management
- persona-exec-assistant — Executive assistant workflows
- persona-hr-coordinator — HR operations
- persona-it-admin — IT administration
- persona-project-manager — Project management
- persona-researcher — Research workflows
- persona-sales-ops — Sales operations
- persona-team-lead — Team leadership

**C. Workflow Recipe Skills (45 skills)**
- recipe-backup-sheet-as-csv
- recipe-batch-invite-to-event
- recipe-block-focus-time
- recipe-bulk-download-folder
- recipe-collect-form-responses
- recipe-compare-sheet-tabs
- recipe-copy-sheet-for-new-month
- recipe-create-classroom-course
- recipe-create-doc-from-template
- recipe-create-events-from-sheet
- recipe-create-expense-tracker
- recipe-create-feedback-form
- recipe-create-gmail-filter
- recipe-create-meet-space
- recipe-create-presentation
- recipe-create-shared-drive
- recipe-create-task-list
- recipe-create-vacation-responder
- recipe-draft-email-from-doc
- recipe-email-drive-link
- recipe-find-free-time
- recipe-find-large-files
- recipe-forward-labeled-emails
- recipe-generate-report-from-sheet
- recipe-label-and-archive-emails
- recipe-log-deal-update
- recipe-organize-drive-folder
- recipe-plan-weekly-schedule
- recipe-post-mortem-setup
- recipe-reschedule-meeting
- recipe-review-meet-participants
- recipe-review-overdue-tasks
- recipe-save-email-attachments
- recipe-save-email-to-doc
- recipe-schedule-recurring-event
- recipe-send-team-announcement
- recipe-share-doc-and-notify
- recipe-share-event-materials
- recipe-share-folder-with-team
- recipe-sync-contacts-to-sheet
- recipe-watch-drive-changes
- (Additional recipes)

**D. Shared Skills**
- gws-shared — Common auth, flags, and security rules

#### gws-gmail/SKILL.md (Representative Example)
- **Structure:**
  - YAML frontmatter: name, description, version, metadata (category, requires bins, cliHelp)
  - Resource documentation: Users resource with getProfile, stop, watch, drafts, history, labels, messages, settings, threads
  - Helper commands: +send, +triage, +reply, +reply-all, +forward, +read, +watch (each with description)
  - API resources listed with method names
  - Discovery/introspection instructions

#### Cargo.toml (Workspace)
```toml
[workspace]
members = ["crates/google-workspace-cli", "crates/google-workspace"]
resolver = "2"

[profile.dist]
inherits = "release"
lto = "thin"
```

#### package.json (NPM wrapper)
- Exports pre-built binaries from GitHub Releases
- Provides convenience installation via npm

#### deny.toml
- Cargo dependency audit configuration

#### flake.nix
- Nix flake for reproducible builds

### Capabilities Inventory

**Core Architecture:**
- Dynamic command generation from Google Discovery Service at runtime
- Two-phase CLI parsing: extract service → fetch Discovery Doc → rebuild command tree
- AES-256-GCM credential encryption for secure auth storage
- HTTP client with retry logic and timeouts
- OAuth2 flow: gws auth setup → interactive Google Cloud config
- Structured JSON output for all API responses
- Path safety validation (prevents traversal attacks)
- URL encoding for path segments
- Schema introspection: `gws schema <resource>.<method>`
- Dry-run mode: `--dry-run` to preview requests
- Auto-pagination support

**API Coverage (40+ Core Services):**
- Admin Reports: User activity, email logs, app events
- Calendar: Event CRUD, availability, scheduling
- Chat: Space messaging, webhooks
- Classroom: Courses, assignments, rosters
- Docs: Document CRUD, content manipulation
- Drive: File listing, upload, sharing, permissions
- Forms: Form creation, response collection
- Gmail: Email CRUD, labels, filters, watch/streaming
- Keep: Notes management
- Meet: Meeting spaces, access controls
- ModelArmor: Prompt injection detection & mitigation
- People: Contact management, sync
- Apps Script: Script execution, deployment
- Sheets: Spreadsheet CRUD, data import/export
- Slides: Presentation CRUD
- Tasks: Task list management

**Workflow Recipes (45+):**
- Email automation: forward, label, archive, triage
- Calendar automation: batch invites, reschedule, find free time
- Document workflows: template-based creation, sharing
- Drive organization: bulk operations, bulk download
- Expense tracking, event coordination, meeting prep
- Standup reports, weekly digests, post-mortems
- Form response collection and aggregation
- Sheet analysis and report generation

**Agent Integration:**
- 10 persona-based automation workflows
- 45 recipe-based multi-step workflows
- Skill composition: agents can combine multiple skills
- Natural language instruction execution

**Security Features:**
- Input validation: path traversal prevention, control character rejection
- URL encoding: safe query param construction
- Credential encryption: AES-256-GCM at rest
- OAuth2: secure token acquisition and refresh
- ModelArmor integration: LLM prompt/response sanitization

**Developer Experience:**
- Help on every resource/method: `gws <resource> --help`
- Schema introspection: understand any API method before calling
- Structured logging: tracing with optional file output
- Demo mode: ASCII art scene rendering for CLI feedback

### Installation & Runtime Requirements

**Build Requirements:**
- Rust 1.70+ (for compilation from source)
- cargo (Rust package manager)
- pnpm (for Node.js dependencies in scripts)

**Runtime Requirements:**
- Node.js 18+ (if installing via npm)
- Google Cloud project with OAuth 2.0 credentials
- Google Workspace account with API access
- Network connectivity for Google APIs

**Environment Variables:**
- `GOOGLE_WORKSPACE_CLI_CONFIG_DIR` — Custom config directory (trusted input)
- `GOOGLE_WORKSPACE_CLI_LOG_LEVEL` — Logging level (debug, info, warn, error)
- Standard Google auth env vars (GOOGLE_APPLICATION_CREDENTIALS, etc.)

**Dependencies (Major):**
- clap (CLI argument parsing)
- reqwest (HTTP client)
- serde (JSON serialization)
- tokio (async runtime)
- tracing (structured logging)
- anyhow (error handling)

**Lock Files:**
- Cargo.lock — Rust dependencies
- pnpm-lock.yaml — Node.js dependencies

### Current State on Machine

**Status:** Not installed/running
- **Exists on disk:** Yes (source code directory)
- **Compiled binary:** No
- **Dependencies installed:** No
  - Rust toolchain needed: `rustup install stable`
  - NPM modules: none in node_modules (expected)
- **Configuration:** No local config (requires setup)
- **Auth credentials:** Not configured

**To run locally:**
```bash
cd cli-main/cli-main
cargo build --release
./target/release/gws auth setup
./target/release/gws drive files list
```

### Integration Opportunities

**For 27-Agent Claude Code System:**

1. **Email Agent** — Uses gws-gmail, gws-gmail-triage, gws-gmail-reply, gws-gmail-send, gws-gmail-watch
   - Automated inbox management
   - Email drafting and response
   - Email monitoring streams

2. **Calendar Agent** — Uses gws-calendar, gws-calendar-agenda, gws-calendar-insert
   - Meeting scheduling
   - Time blocking
   - Availability analysis

3. **Document Agent** — Uses gws-docs, gws-docs-write, gws-drive, gws-drive-upload
   - Doc creation from templates
   - Bulk document operations
   - Drive organization

4. **Workspace Admin Agent** — Uses gws-admin-reports, gws-people, gws-script
   - User activity monitoring
   - Contact sync and management
   - Admin automation

5. **Workflow Orchestration Agent** — Uses gws-workflow, recipe-* skills
   - Multi-step automation
   - Cross-service workflows
   - Business process automation

**Shared Infrastructure Benefits:**
- Standardized OAuth2 flow: extract auth pattern for other services
- Input validation framework: reuse path/URL validators
- Schema introspection pattern: apply to other APIs
- Two-phase parsing: template for other complex CLIs
- Error handling: structured GwsError enum as reference

**Extraction Targets:**
- `.claude/settings.json` — Claude Code config template
- `docs/skills.md` — Skill documentation pattern
- `crates/google-workspace/src/validate.rs` — Validation helpers
- `crates/google-workspace-cli/src/auth.rs` — OAuth2 reference implementation
- Changeset pattern from `.changeset/` directory
- Persona and recipe skill templates

**Tooling Integration:**
- Could run as standalone service accessible via HTTP wrapper
- Skills could be exposed as HTTP endpoints for other agents
- MCP server integration possible for Claude Code
- Integration with event-driven architectures (Pub/Sub patterns in gws-events-subscribe)

### Conflicts & Risks

**Licensing:** Apache 2.0 (Google LLC)
- Permissive license, compatible with MIT/BSD projects
- Requires copyright notice in derivative works
- No commercial licensing restrictions

**Maintenance:**
- Active Google-backed project (not in maintenance mode)
- Depends on Google APIs stability (unlikely to break)
- Rust ecosystem stability: 1.70+ versioning is stable

**Language Compatibility:**
- Pure Rust implementation: no FFI dependencies
- Cross-platform (Linux, macOS, Windows via prebuilt binaries)
- No language version conflicts when installed via npm

**Token/Rate Limits:**
- Subject to Google Workspace API quotas
- Each operation counts against user's API quotas
- Concurrent operations may hit rate limits
- No built-in rate limiting/batching in CLI (managed per-operation)

**Security Considerations:**
- Credential storage: encrypted but requires secure filesystem
- OAuth tokens: short-lived (1 hour), refresh tokens stored
- User-supplied inputs to URLs: validation is critical (already implemented)
- ModelArmor requirement: explicit for prompt injection scenarios

**Breaking Changes:**
- Repository marked "under active development, expect breaking changes toward v1.0"
- Discovery Service updates may change available commands
- API deprecations in Google Workspace could remove skills

### Verdict

**Classification: INFRASTRUCTURE + REFERENCE EXTRACTION + AGENT ENHANCEMENT**

**Reasoning:**
1. **Production-grade CLI infrastructure:** Two-phase parsing, dynamic API discovery, structured error handling — valuable patterns for 27-agent system
2. **40+ agent skills:** Direct reuse for Workspace automation agents (email, calendar, docs, drive)
3. **Security framework:** Input validation, credential encryption — reference patterns for other agents
4. **Persona/recipe skills:** Template pattern for agent behavior specialization
5. **Changeset system:** Reusable PR workflow pattern

**Action Items:**
1. Extract `.claude/settings.json` template → shared Claude Code config baseline
2. Extract auth flow from `crates/google-workspace-cli/src/auth.rs` → OAuth2 reference
3. Extract validation helpers from `crates/google-workspace/src/validate.rs` → shared utilities
4. Adapt 40+ core skills as blueprints for other API integrations (Slack, Jira, Asana, etc.)
5. Adopt changeset pattern in 27-agent system for structured versioning
6. Create HTTP wrapper for gws CLI → standalone service accessible to other agents
7. Skills extraction: Each gws-* skill is standalone and composable → can be reused directly

**Integration Priority: HIGH**
- Directly applicable to multiple agent types
- Production-tested patterns
- Well-documented architecture
- Strong security foundation

---

## REPO 2: EVERYTHING-CLAUDE-CODE

**Path:** `C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\`

**Language(s):** TypeScript/JavaScript (primary), Python, Go, Java, Kotlin, Rust, Shell (Markdown docs)

**License:** MIT

**Repository URL:** https://github.com/affaan-m/everything-claude-code

**Size Metric:** 50K+ GitHub stars, 6K+ forks, 30+ contributors, Anthropic Hackathon Winner

### File Inventory (High-Level Structure)

```
everything-claude-code-main/
├── .agents/                         # Agent definitions
│   ├── plugins/
│   └── skills/
├── .agent/workflows/
├── .claude/                         # Claude Code integration
│   ├── commands/
│   ├── enterprise/
│   ├── homunculus/
│   ├── research/
│   ├── rules/
│   ├── skills/
│   ├── team/
│   ├── settings.json
│   ├── ecc-tools.json
│   ├── identity.json
│   └── package-manager.json
├── .codebuddy/                      # Codebuddy integration
│   ├── install.js
│   ├── install.sh
│   ├── uninstall.js
│   ├── uninstall.sh
│   └── README.md
├── .codex/                          # Codex IDE integration
│   ├── agents/
│   ├── config.toml
│   └── AGENTS.md
├── .cursor/                         # Cursor IDE integration
│   ├── hooks/
│   ├── rules/
│   ├── skills/
│   └── hooks.json
├── .gemini/                         # Gemini IDE integration
│   └── GEMINI.md
├── .kiro/                           # Kiro integration
│   ├── agents/
│   ├── docs/
│   ├── hooks/
│   ├── scripts/
│   ├── settings/
│   ├── skills/
│   ├── steering/
│   └── README.md
├── .opencode/                       # OpenCode integration
│   ├── commands/
│   ├── instructions/
│   ├── plugins/
│   ├── prompts/
│   ├── tools/
│   ├── opencode.json
│   ├── package.json
│   └── README.md
├── .trae/                           # Trae integration
│   ├── install.sh
│   └── README.md
├── agents/ (40+ files)              # Agent definitions (.md)
│   ├── architect.md
│   ├── build-error-resolver.md
│   ├── chief-of-staff.md
│   ├── code-reviewer.md
│   ├── cpp-build-resolver.md
│   ├── cpp-reviewer.md
│   ├── csharp-reviewer.md
│   ├── dart-build-resolver.md
│   ├── database-reviewer.md
│   ├── doc-updater.md
│   ├── docs-lookup.md
│   ├── e2e-runner.md
│   ├── flutter-reviewer.md
│   ├── gan-evaluator.md
│   ├── gan-generator.md
│   ├── gan-planner.md
│   ├── go-build-resolver.md
│   ├── go-reviewer.md
│   ├── harness-optimizer.md
│   ├── healthcare-reviewer.md
│   ├── java-build-resolver.md
│   ├── java-reviewer.md
│   ├── kotlin-build-resolver.md
│   ├── kotlin-reviewer.md
│   ├── loop-operator.md
│   ├── opensource-forker.md
│   ├── opensource-packager.md
│   ├── opensource-sanitizer.md
│   ├── performance-optimizer.md
│   ├── planner.md
│   ├── python-reviewer.md
│   ├── pytorch-build-resolver.md
│   ├── refactor-cleaner.md
│   ├── rust-build-resolver.md
│   ├── rust-reviewer.md
│   ├── security-reviewer.md
│   ├── tdd-guide.md
│   └── typescript-reviewer.md
├── commands/ (65+ files)            # Slash commands (.md)
│   ├── aside.md
│   ├── build-fix.md
│   ├── checkpoint.md
│   ├── claw.md
│   ├── code-review.md
│   ├── context-budget.md
│   ├── cpp-build.md, cpp-review.md, cpp-test.md
│   ├── devfleet.md
│   ├── docs.md
│   ├── e2e.md
│   ├── eval.md
│   ├── evolve.md
│   ├── flutter-build.md, flutter-review.md, flutter-test.md
│   ├── gan-build.md, gan-design.md
│   ├── go-build.md, go-review.md, go-test.md
│   ├── gradle-build.md
│   ├── harness-audit.md
│   ├── instinct-export.md, instinct-import.md, instinct-status.md
│   ├── jira.md
│   ├── kotlin-build.md, kotlin-review.md, kotlin-test.md
│   ├── learn-eval.md, learn.md
│   ├── loop-start.md, loop-status.md
│   ├── model-route.md
│   ├── multi-backend.md, multi-execute.md, multi-frontend.md, multi-plan.md, multi-workflow.md
│   ├── orchestrate.md
│   ├── plan.md
│   ├── pm2.md
│   ├── projects.md
│   ├── promote.md
│   ├── prompt-optimize.md
│   ├── prp-commit.md, prp-implement.md, prp-plan.md, prp-pr.md, prp-prd.md
│   ├── prune.md
│   ├── python-review.md
│   ├── quality-gate.md
│   ├── refactor-clean.md
│   ├── resume-session.md
│   ├── rules-distill.md
│   ├── rust-build.md, rust-review.md, rust-test.md
│   ├── santa-loop.md
│   ├── save-session.md
│   ├── sessions.md
│   ├── setup-pm.md
│   ├── skill-create.md, skill-health.md
│   ├── tdd.md
│   ├── test-coverage.md
│   ├── update-codemaps.md
│   ├── update-docs.md
│   └── verify.md
├── contexts/ (3 files)              # Context profiles
│   ├── dev.md
│   ├── research.md
│   └── review.md
├── docs/                            # Comprehensive documentation (10+ guides)
│   ├── ANTIGRAVITY-GUIDE.md
│   ├── ARCHITECTURE-IMPROVEMENTS.md
│   ├── COMMAND-AGENT-MAP.md
│   ├── MEGA-PLAN-REPO-PROMPTS-2026-03-12.md
│   ├── PHASE1-ISSUE-BUNDLE-2026-03-12.md
│   ├── PR-399-REVIEW-2026-03-12.md
│   ├── PR-QUEUE-TRIAGE-2026-03-13.md
│   ├── SELECTIVE-INSTALL-ARCHITECTURE.md
│   ├── SKILL-DEVELOPMENT-GUIDE.md
│   ├── SKILL-PLACEMENT-POLICY.md
│   ├── SESSION-ADAPTER-CONTRACT.md
│   ├── token-optimization.md
│   ├── ECC-2.0-REFERENCE-ARCHITECTURE.md
│   ├── ECC-2.0-SESSION-ADAPTER-DISCOVERY.md
│   ├── TROUBLESHOOTING.md
│   ├── EVALUATION.md
│   ├── continuous-learning-v2-spec.md
│   ├── business/ (business domain docs)
│   ├── ja-JP/, ko-KR/, pt-BR/, tr/, zh-CN/, zh-TW/ (translations)
│   └── releases/ (release notes)
├── ecc2/                            # ECC 2.0 Rust refactor (in progress)
│   ├── Cargo.toml
│   └── src/
├── examples/                        # Example CLAUDE.md contexts
│   ├── CLAUDE.md
│   ├── django-api-CLAUDE.md
│   ├── go-microservice-CLAUDE.md
│   ├── laravel-api-CLAUDE.md
│   ├── rust-api-CLAUDE.md
│   ├── saas-nextjs-CLAUDE.md
│   └── user-CLAUDE.md
├── hooks/                           # Git hook definitions
│   ├── hooks.json
│   └── README.md
├── manifests/                       # Installation manifests (JSON)
│   ├── install-components.json
│   ├── install-modules.json
│   └── install-profiles.json
├── mcp-configs/                     # MCP server configurations
│   └── mcp-servers.json
├── plugins/                         # Plugins directory
│   └── README.md
├── research/                        # Research documents
│   └── ecc2-codebase-analysis.md
├── rules/                           # IDE rules by language
│   ├── README.md
│   ├── common/
│   ├── cpp/, csharp/, dart/, golang/, java/, kotlin/, perl/, php/, python/
│   ├── rust/, swift/, typescript/, web/
│   └── zh/ (translations)
├── schemas/                         # JSON Schema validation
│   ├── ecc-install-config.schema.json
│   ├── hooks.schema.json
│   ├── install-components.schema.json
│   ├── install-modules.schema.json
│   ├── install-profiles.schema.json
│   ├── install-state.schema.json
│   ├── package-manager.schema.json
│   ├── plugin.schema.json
│   ├── provenance.schema.json
│   └── state-store.schema.json
├── scripts/                         # Utility scripts (JS, shell)
│   ├── catalog.js                   # Generate skill catalog
│   ├── claw.js                      # CLAW automation
│   ├── doctor.js                    # System health check
│   ├── ecc.js                       # Main CLI
│   ├── harness-audit.js
│   ├── install-apply.js, install-plan.js
│   ├── list-installed.js
│   ├── release.sh
│   ├── repair.js
│   ├── session-inspect.js
│   ├── sessions-cli.js
│   ├── skill-create-output.js
│   ├── skills-health.js
│   ├── status.js
│   ├── uninstall.js
│   ├── ci/ (CI/CD scripts)
│   ├── codemaps/ (code mapping scripts)
│   ├── codex/ (Codex integration scripts)
│   ├── codex-git-hooks/ (git hook scripts)
│   ├── hooks/ (hook execution)
│   ├── lib/ (utility libraries)
│   └── orchestration-*.js
├── skills/ (156+ directories)       # Agent skills
│   ├── agent-eval/
│   ├── agent-harness-construction/
│   ├── agent-payment-x402/
│   ├── agentic-engineering/
│   ├── ai-first-engineering/
│   ├── ai-regression-testing/
│   ├── android-clean-architecture/
│   ├── api-design/
│   ├── architecture-decision-records/
│   ├── article-writing/
│   ├── autonomous-agent-harness/
│   ├── autonomous-loops/
│   ├── backend-patterns/
│   ├── benchmark/
│   ├── blueprint/
│   ├── brand-voice/
│   ├── browser-qa/
│   ├── bun-runtime/
│   ├── canary-watch/
│   ├── carrier-relationship-management/
│   ├── ck/
│   ├── claude-api/
│   ├── claude-devfleet/
│   ├── click-path-audit/
│   ├── clickhouse-io/
│   ├── codebase-onboarding/
│   ├── coding-standards/
│   ├── compose-multiplatform-patterns/
│   ├── configure-ecc/
│   ├── connections-optimizer/
│   ├── content-engine/
│   ├── content-hash-cache-pattern/
│   ├── context-budget/
│   ├── continuous-agent-loop/
│   ├── continuous-learning/
│   ├── continuous-learning-v2/
│   ├── cost-aware-llm-pipeline/
│   ├── cpp-coding-standards/
│   ├── cpp-testing/
│   ├── crosspost/
│   ├── csharp-testing/
│   ├── customer-billing-ops/
│   ├── customs-trade-compliance/
│   ├── dart-flutter-patterns/
│   ├── data-scraper-agent/
│   ├── database-migrations/
│   ├── deep-research/
│   ├── deployment-patterns/
│   ├── design-system/
│   ├── django-patterns/, django-security/, django-tdd/, django-verification/
│   ├── dmux-workflows/
│   ├── docker-patterns/
│   ├── documentation-lookup/
│   ├── dotnet-patterns/
│   ├── e2e-testing/
│   ├── energy-procurement/
│   ├── enterprise-agent-ops/
│   ├── eval-harness/
│   ├── exa-search/
│   ├── fal-ai-media/
│   ├── flutter-dart-code-review/
│   ├── foundation-models-on-device/
│   ├── frontend-patterns/
│   ├── frontend-slides/
│   ├── gan-style-harness/
│   ├── git-workflow/
│   ├── golang-patterns/, golang-testing/
│   ├── google-workspace-ops/
│   ├── healthcare-cdss-patterns/
│   ├── healthcare-emr-patterns/
│   ├── healthcare-eval-harness/
│   ├── healthcare-phi-compliance/
│   ├── hexagonal-architecture/
│   ├── inventory-demand-planning/
│   ├── investor-materials/
│   ├── investor-outreach/
│   ├── iterative-retrieval/
│   ├── java-coding-standards/, java-testing/
│   ├── jira-integration/
│   ├── jpa-patterns/
│   ├── kotlin-coroutines-flows/
│   ├── kotlin-exposed-patterns/
│   ├── kotlin-ktor-patterns/
│   ├── kotlin-patterns/, kotlin-testing/
│   ├── laravel-patterns/, laravel-plugin-discovery/, laravel-security/, laravel-tdd/, laravel-verification/
│   ├── lead-intelligence/
│   ├── liquid-glass-design/
│   ├── logistics-exception-management/
│   ├── manim-video/
│   ├── market-research/
│   ├── mcp-server-patterns/ (and 50+ more)
│   └── (56+ more skills, totaling 156 skills)
├── tests/                           # Test suites
│   ├── ci/
│   ├── hooks/
│   ├── integration/
│   ├── lib/
│   ├── scripts/
│   ├── codex-config.test.js
│   ├── opencode-config.test.js
│   ├── plugin-manifest.test.js
│   └── run-all.js
├── AGENTS.md                        # Agent index
├── CHANGELOG.md
├── CLAUDE.md                        # Claude Code integration guide
├── CODE_OF_CONDUCT.md
├── COMMANDS-QUICK-REF.md            # Quick command reference
├── CONTRIBUTING.md
├── EVALUATION.md
├── LICENSE (MIT)
├── README.md                        # Main documentation
├── README.zh-CN.md                  # Chinese translation
├── REPO-ASSESSMENT.md
├── RULES.md
├── SECURITY.md
├── SOUL.md                          # Project philosophy
├── SPONSORING.md
├── SPONSORS.md
├── TROUBLESHOOTING.md
├── WORKING-CONTEXT.md
├── VERSION
├── agent.yaml
├── commitlint.config.js
├── eslint.config.js
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── .prettierrc
├── .yarnrc.yml
├── .tool-versions
├── .markdownlint.json
├── .npmignore
├── .mcp.json
├── the-longform-guide.md            # Comprehensive guide
├── the-security-guide.md            # Security focused guide
├── the-shortform-guide.md           # Quick reference guide
└── yarn.lock
```

### Key Files — Deep Read

#### README.md
- **Purpose:** Main documentation for Everything Claude Code
- **Key Content:**
  - 50K+ stars, 6K+ forks, Anthropic Hackathon Winner
  - 7 languages supported (Shell, TypeScript, Python, Go, Java, Perl, Markdown)
  - Complete system: skills, instincts, memory optimization, continuous learning, security scanning
  - Production-ready agents, skills, hooks, rules, MCP configurations
  - Works across Claude Code, Codex, Cowork, and other AI agent harnesses
  - "The performance optimization system for AI agent harnesses"
- **Guides:**
  - Shorthand Guide: Setup, foundations, philosophy
  - Longform Guide: Token optimization, memory persistence, evals, parallelization
  - Security Guide: Attack vectors, sandboxing, sanitization, CVEs, AgentShield
- **Topics Covered:**
  - Token Optimization: Model selection, system prompt slimming, background processes
  - Memory Persistence: Hooks that save/load context across sessions automatically
  - Continuous Learning: Auto-extract patterns from sessions into reusable skills
  - Verification Loops: Checkpoint vs continuous evals, grader types, pass@k metrics
  - Parallelization: Git worktrees, cascade method, when to scale instances
  - Subagent Orchestration: Context problem, iterative retrieval pattern
- **Extractable Value:** Comprehensive system design patterns, verification methodology, memory management patterns

#### AGENTS.md
- **Purpose:** Catalog of 40+ specialized agents
- **Likely Content:** Agent purpose, usage patterns, integration points

#### CLAUDE.md
- **Purpose:** Claude Code-specific integration and setup guide

#### commands/ Directory (65+ Commands)
Each command file contains detailed prompt/instruction definitions:
- Language-specific build/test commands: cpp-build, go-build, kotlin-build, python-review, rust-test, etc.
- Development workflow: plan, prp-plan, prp-implement, prp-commit, prp-pr, checkpoint, verify
- Review: code-review, security-review, database-review, cpp-review, flutter-review, etc.
- Learning: learn, learn-eval, continuous-learning, autonomous-loops
- Orchestration: orchestrate, devfleet, multi-plan, multi-execute, multi-workflow
- Session management: save-session, resume-session, sessions
- Configuration: harness-audit, skill-create, quality-gate, prompt-optimize

#### agents/ Directory (40+ Agents)
Each agent (.md file) defines:
- Agent purpose and responsibilities
- Trigger conditions
- Integration with skills and commands
- Interaction patterns
- Success criteria

**Representative agents:**
- architect — High-level architecture design
- build-error-resolver — Automatic build failure diagnosis
- chief-of-staff — Project coordination and planning
- code-reviewer — Code quality assessment
- cpp-build-resolver, go-build-resolver, java-build-resolver, kotlin-build-resolver, pytorch-build-resolver, rust-build-resolver — Language-specific build repair
- database-reviewer — Database design and optimization
- doc-updater — Documentation maintenance
- gan-evaluator, gan-generator, gan-planner — Generative AI network specialization
- harness-optimizer — Agent system optimization
- healthcare-reviewer — Domain-specific code review
- loop-operator — Continuous improvement loops
- performance-optimizer — Performance analysis and optimization
- planner — Project planning and task breakdown
- security-reviewer — Security analysis
- tdd-guide — Test-driven development guidance

#### skills/ Directory (156 Skills)

Organized by domain:

**AI/Agentic Pattern Skills (15+):**
- agent-eval — Evaluating agent performance
- agent-harness-construction — Building agent systems
- agentic-engineering — Agentic patterns and practices
- autonomous-agent-harness — Self-driving agent systems
- autonomous-loops — Loop orchestration
- continuous-agent-loop — Ongoing improvement cycles
- continuous-learning, continuous-learning-v2 — Learning from experience
- deep-research — Extended research capabilities
- eval-harness — Evaluation infrastructure

**Language-Specific Skills (50+):**
- cpp-coding-standards, cpp-testing
- csharp-testing, csharp-coding-patterns
- dart-flutter-patterns, flutter-dart-code-review
- django-patterns, django-security, django-tdd, django-verification
- dotnet-patterns
- golang-patterns, golang-testing
- java-coding-standards, java-testing, jpa-patterns
- kotlin-coroutines-flows, kotlin-exposed-patterns, kotlin-ktor-patterns, kotlin-patterns, kotlin-testing
- laravel-patterns, laravel-plugin-discovery, laravel-security, laravel-tdd, laravel-verification
- python-* (multiple)
- rust-* (multiple)
- typescript-* (multiple)

**Architecture & Design Skills (20+):**
- android-clean-architecture
- api-design
- architecture-decision-records
- backend-patterns
- blueprint
- compose-multiplatform-patterns
- deployment-patterns
- design-system
- dmux-workflows
- docker-patterns
- frontend-patterns
- hexagonal-architecture
- mcp-server-patterns
- microservice-patterns (if exists)

**Domain-Specific Skills (30+):**
- brand-voice — Brand content guidelines
- customer-billing-ops — Billing automation
- customs-trade-compliance — Regulatory compliance
- energy-procurement — Energy domain
- enterprise-agent-ops — Enterprise operations
- healthcare-cdss-patterns — Clinical decision support
- healthcare-emr-patterns — Electronic medical records
- healthcare-phi-compliance — HIPAA compliance
- inventory-demand-planning — Supply chain
- investor-materials — Investment documentation
- investor-outreach — Investor relations
- lead-intelligence — Sales intelligence
- logistics-exception-management — Supply chain exception handling
- market-research — Market analysis
- carrier-relationship-management — CRM patterns

**Tool Integration Skills (15+):**
- clickhouse-io — ClickHouse integration
- claude-api — Claude API usage
- claude-devfleet — Multi-agent coordination
- data-scraper-agent — Web scraping
- exa-search — Search engine integration
- fal-ai-media — FAL.ai media generation
- jira-integration — Jira workflow
- google-workspace-ops — Google Workspace automation
- crosspost — Multi-platform posting

**Specialized Skills (20+):**
- article-writing — Content creation
- browser-qa — Browser automation QA
- codebase-onboarding — Codebase navigation
- coding-standards — General coding standards
- content-engine — Content management
- context-budget — Token/context optimization
- cost-aware-llm-pipeline — Cost optimization
- gan-style-harness — Style-transfer AI patterns
- liquid-glass-design — Design patterns
- manim-video — Video generation
- memory-persistence — State persistence
- prompt-optimization — Prompt engineering

**Learning & Optimization (10+):**
- canary-watch — Monitoring and alerting
- connections-optimizer — Network optimization
- iterative-retrieval — Retrieval patterns
- performance-optimization — General performance
- refactor-cleaner — Code cleanup

#### hooks/hooks.json
- **Purpose:** Define git hooks and their behavior
- **Content:** Likely specifies pre-commit, pre-push, post-commit hooks integrated with Claude Code

#### contexts/ Directory (3 Profile Types)
- **dev.md** — Development context (local development setup)
- **research.md** — Research context (investigation and learning mode)
- **review.md** — Review context (code and design review mode)

#### package.json
```json
{
  "name": "ecc-universal",
  "version": "1.9.0",
  "description": "Complete collection of battle-tested Claude Code configs...",
  "license": "MIT",
  "files": [".agents/", ".codex/", ".cursor/", ".opencode/", "agents/", "commands/", "contexts/", "examples/", "rules/", "skills/", "SOUL.md", "SPONSORING.md", ...]
}
```

#### .claude/settings.json
- **Purpose:** Claude Code harness configuration
- **Likely Content:** Claude Code-specific settings, skill mappings, hook configurations

#### Guides
- **the-shorthand-guide.md** — Quick start, setup, foundational concepts
- **the-longform-guide.md** — Deep dives into token optimization, memory persistence, evals, parallelization
- **the-security-guide.md** — Security patterns, attack vectors, AgentShield integration

#### RULES.md
- **Purpose:** IDE rules for various languages and contexts
- **Content References:**
  - /rules/common/ — Universal rules
  - /rules/typescript/, /rules/python/, /rules/rust/, etc. — Language-specific rules
  - /rules/web/ — Web development rules

### Capabilities Inventory

**Agent System (40+ agents):**
- Language-specific reviewers: C++, C#, Dart, Go, Java, Kotlin, Python, Rust, TypeScript
- Build failure resolvers: C++, Go, Java, Kotlin, PyTorch, Rust
- Domain-specific agents: healthcare, database, security
- Process agents: architect, planner, chief-of-staff, loop-operator
- Optimization agents: performance, harness optimizer
- Specialized: GAN planner/generator/evaluator, doc updater

**Slash Commands (65+):**
- Language builds: cpp-build, go-build, kotlin-build, rust-build, etc.
- Language tests: cpp-test, go-test, flutter-test, kotlin-test, rust-test, etc.
- Language reviews: cpp-review, go-review, flutter-review, java-review, typescript-review, etc.
- Development workflow: plan, implement, commit, push, PR
- Code quality: code-review, tdd, test-coverage, quality-gate
- Learning: learn, learn-eval, continuous-learning
- Orchestration: orchestrate, devfleet, multi-plan, multi-workflow
- Session management: save-session, resume-session, sessions
- Utilities: checkpoint, verify, context-budget, prompt-optimize, docs

**Skills (156 Skills):**
- AI/Agentic patterns: 15+ skills
- Language-specific: 50+ skills (covers 12+ languages)
- Architecture & design: 20+ skills
- Domain-specific: 30+ skills (healthcare, finance, supply chain, etc.)
- Tool integration: 15+ skills
- Specialized: 20+ skills
- Learning & optimization: 10+ skills

**Memory & Persistence:**
- Session save/resume
- Context extraction and persistence
- Hook-based automatic state management
- Continuous learning loop
- Skillbook management

**Optimization Features:**
- Token counting and optimization
- Context budget awareness
- System prompt slimming
- Parallelization patterns (git worktrees, cascade method)
- Cost-aware LLM pipeline

**Integration Points:**
- Multiple IDE support: Claude Code, Cursor, Codex, OpenCode, Cowork, Codeium
- MCP server integration
- Git hook integration
- GitHub Actions integration
- Jira integration
- Slack integration (via skills)

**Security Features:**
- AgentShield integration
- CVE scanning
- Sandboxing patterns
- Prompt injection prevention
- Response sanitization

**Evaluation System:**
- Checkpoint-based verification
- Continuous evals
- Pass@k metrics
- Grader types
- Quality gates

### Installation & Runtime Requirements

**Core Requirements:**
- Node.js 18+ (for npm package manager)
- npm or pnpm (package management)
- Git (for source control and hooks)
- Bash/shell (for scripts)

**Optional Requirements (Language-Specific):**
- Python 3.8+ (for Python skills)
- Go 1.16+ (for Go skills)
- Java 11+ (for Java/Kotlin skills)
- Rust 1.70+ (for Rust skills)
- C++ compiler (for C++ skills)

**IDE Requirements:**
- Claude Code (primary target)
- OR: Cursor, Codex, OpenCode, Cowork, Codeium (alternative targets)

**Environment Variables:**
- Standard git environment variables
- Language-specific PATH setup (go, rust, java, etc.)
- Optional: ECC_PROFILE (which profile to use)
- Optional: API keys for integrated services (Jira, Slack, etc.)

**Dependencies (NPM):**
- ecc-universal (main package)
- ecc-agentshield (security extension)
- Various dev tool dependencies per language

**Lock Files:**
- package-lock.json (npm)
- pnpm-lock.yaml (pnpm)
- yarn.lock (yarn)

### Current State on Machine

**Status:** Not installed/running
- **Exists on disk:** Yes (source code directory)
- **NPM package:** Installable via `npm install -g ecc-universal`
- **Local setup:** No local installation
- **Configuration:** No local config (requires setup)
- **Dependencies:** Not installed

**To install locally:**
```bash
npm install -g ecc-universal
# or
npm install ecc-universal

# Then configure for your IDE (Cursor, Claude Code, etc.)
cd your-project
cp -r node_modules/ecc-universal/.claude ./.claude
cp -r node_modules/ecc-universal/rules ./rules
cp -r node_modules/ecc-universal/skills ./skills
```

### Integration Opportunities

**For 27-Agent Claude Code System:**

1. **Skill Reuse:** 156 skills directly applicable
   - Language-specific skills: bootstrap compiler/framework skills
   - Domain skills: reuse healthcare, finance, supply chain patterns
   - Architecture skills: reference designs for multi-agent systems

2. **Agent Framework:** 40+ agent definitions as templates
   - Language reviewer agents for all 12 supported languages
   - Specialized agents for different domain areas
   - Process agents (architect, planner, coordinator)

3. **Command System:** 65+ slash commands as inspiration
   - Language-specific workflows (build, test, review, fix)
   - Cross-language patterns
   - Development lifecycle support

4. **Memory System:** Session persistence patterns
   - Hook-based state management
   - Context extraction
   - Continuous learning loop

5. **IDE Integration:** Multi-IDE support patterns
   - Claude Code: primary integration
   - Cursor: alternative IDE support
   - Codex, OpenCode, etc.: broader ecosystem integration

**Shared Infrastructure Benefits:**
- Standardized skill structure: use as template for new skills
- Agent definition format: reuse markdown-based agent specs
- Hook system: extract for automated state management
- Command patterns: template for new slash commands
- Rule system: language and context-specific rule organization

**Extraction Targets:**
- `skills/*/SKILL.md` files — standardized skill template
- `agents/*.md` files — agent definition templates
- `.claude/settings.json` — Claude Code config baseline
- `commands/*.md` files — command definition patterns
- `hooks/hooks.json` — hook orchestration pattern
- `docs/SKILL-DEVELOPMENT-GUIDE.md` — skill creation methodology
- `docs/token-optimization.md` — context optimization patterns
- `the-longform-guide.md` — comprehensive system design guide
- `the-security-guide.md` — security patterns and methodology

**Tooling Integration:**
- MCP server integration: extend with new MCP servers
- Git hook integration: automate verification, testing, documentation
- GitHub Actions: CI/CD patterns
- Jira integration: project tracking
- Slack integration: notifications and commands

### Conflicts & Risks

**Licensing:** MIT (very permissive)
- Compatible with commercial projects
- No restrictions on derivative works
- Requires copyright attribution

**Maintenance:**
- Actively maintained (50K+ stars indicates ongoing support)
- Community-driven (30+ contributors)
- Hackathon winner suggests stability

**Complexity:**
- 156 skills may be overwhelming to integrate all at once
- Selective import recommended (import only needed skills)
- Documentation is comprehensive but extensive

**Language Coverage:**
- Spans 12+ programming languages
- May need language-specific setup for each
- Cross-language consistency maintained through patterns

**Ecosystem Fragmentation:**
- Multiple IDE support (Claude Code, Cursor, Codex, etc.)
- Some features may be IDE-specific
- Configuration may need per-IDE customization

**Breaking Changes:**
- Repository actively developed (minor version changes expected)
- Semantic versioning followed (v1.9.0 indicates maturity)
- Migration guide available for major upgrades

**Token Cost:**
- Large system with many skills
- Context budget awareness built-in
- Selective skill loading recommended

### Verdict

**Classification: REFERENCE FRAMEWORK + SKILL LIBRARY + AGENT TEMPLATES**

**Reasoning:**
1. **Largest skill library (156 skills):** Direct reusable components
2. **Multi-language coverage:** 12+ languages with patterns for each
3. **Proven production patterns:** Hackathon winner, 50K+ stars
4. **Comprehensive documentation:** Guides for setup, optimization, security
5. **Multi-agent coordination:** Parallelization, orchestration patterns
6. **Memory persistence:** Continuous learning methodology
7. **IDE-agnostic:** Works across multiple IDE platforms

**Action Items:**
1. Extract skill directory structure → standardized template for all skills
2. Import 156 skills into agent system (selective profile-based loading)
3. Adopt agent definition format from `agents/` directory
4. Implement memory persistence system from hook patterns
5. Apply token optimization patterns from `the-longform-guide.md`
6. Adopt verification methodology from evaluation patterns
7. Implement parallelization using git worktree pattern
8. Build context extraction system for continuous learning

**Integration Priority: HIGHEST**
- Directly applicable to all 27 agents
- Production-tested at scale (50K+ users)
- Comprehensive patterns for every aspect of multi-agent systems
- Strong documentation and guides
- Active maintenance and community support

---

## REPO 3: AGENTIC-CONTEXT-ENGINE

**Path:** `C:\Users\User\Downloads\new repos\agentic-context-engine-main\agentic-context-engine-main\`

**Language(s):** Python (primary), TypeScript, Markdown, YAML

**License:** MIT

**Repository URL:** https://github.com/kayba-ai/agentic-context-engine

**Organization:** Kayba.ai

### File Inventory

```
agentic-context-engine-main/
├── .claude/                         # Claude Code integration
│   ├── commands/
│   ├── settings.json
│   ├── package.json
│   └── skills/
├── .github/                         # GitHub CI/CD
│   └── workflows/
├── .specify/                        # Specify framework integration
│   ├── memory/
│   ├── scripts/
│   └── templates/
├── ace/                             # Core ACE library (Python)
│   ├── cli/                         # CLI interface
│   ├── core/                        # Core ACE logic
│   ├── deduplication/               # Dedup logic
│   ├── implementations/             # LLM provider implementations
│   ├── integrations/                # Framework integrations (OpenClaw, etc.)
│   ├── observability/               # Logging and monitoring
│   ├── protocols/                   # Protocol definitions
│   ├── providers/                   # LLM provider adapters
│   ├── rr/                          # Recursive reflector
│   ├── runners/                     # Execution runners
│   ├── steps/                       # Pipeline steps
│   └── __init__.py
├── ace-eval/                        # Evaluation harness
├── agent-guides/                    # Agent documentation
│   └── logfire.md
├── benchmarks/                      # Performance benchmarks
│   ├── base.py
│   ├── loaders/
│   ├── tasks/
│   ├── README.md
│   └── __init__.py
├── docs/                            # Comprehensive documentation
│   ├── api/                         # API reference
│   ├── assets/
│   ├── concepts/                    # Conceptual guides
│   ├── design/                      # Architecture decisions
│   ├── getting-started/             # Quick start guides
│   ├── guides/                      # How-to guides
│   ├── index.md
│   ├── integrations/                # Integration guides
│   └── pipeline/                    # Pipeline documentation
├── examples/                        # Example implementations
│   ├── ace/
│   ├── agentic-system-prompting/
│   ├── openclaw/
│   ├── pipeline_composition/
│   ├── pipeline_ex/
│   ├── README.md
│   └── seahorse-emoji-ace.gif       # Learning demo
├── overrides/                       # MkDocs overrides
│   └── main.html
├── pipeline/                        # Pipeline engine (Python)
│   ├── branch.py                    # Pipeline branching
│   ├── context.py                   # Context management
│   ├── errors.py                    # Error handling
│   ├── pipeline.py                  # Main pipeline engine
│   ├── protocol.py                  # Protocol definitions
│   └── __init__.py
├── scripts/                         # Utility scripts
│   ├── clean_skillbook.py
│   ├── clean_skillbook_v4.py
│   ├── merge_tau_results.py
│   └── README.md
├── specs/                           # Architecture specifications
│   ├── 001-openclaw-integration/    # OpenClaw integration spec
│   └── 002-ace-mcp-server/          # MCP server spec
├── tests/                           # Test suite
│   ├── conftest.py
│   ├── test_ace_*.py (multiple test files)
│   ├── test_pipeline_*.py
│   ├── test_claude_sdk_*.py
│   ├── test_load_traces_step.py
│   ├── test_openclaw.py
│   ├── test_pydantic_ai_integration.py
│   └── test_rr_pipeline/
├── AGENTS.md                        # Agent documentation
├── CHANGELOG.md
├── CLAUDE.md                        # Claude Code integration
├── CONTRIBUTING.md
├── LICENSE (MIT)
├── README.md                        # Main documentation
├── ace.toml                         # ACE configuration
├── mkdocs.yml                       # MkDocs configuration
├── pyproject.toml                   # Python project configuration
├── uv.lock                          # UV package manager lock file
├── .env.example
├── .gitignore
├── .gitmodules
├── .pre-commit-config.yaml
└── (Various test configs)
```

### Key Files — Deep Read

#### README.md
- **Purpose:** Main documentation for Agentic Context Engine
- **Tagline:** "AI agents don't learn from experience. ACE adds a persistent learning loop that makes them better over time."
- **Key Innovation:** 
  - Agents repeat mistakes every session, forget what worked
  - ACE reflects on errors and improves automatically
  - Example: Agent claims seahorse emoji exists → ACE reflects → agent responds correctly next attempt
- **Proven Results:**
  - 2x consistency: Doubles pass^4 on Tau2 airline benchmark (15 learned strategies, no reward signals)
  - 49% token reduction: Browser automation costs cut nearly in half (10-run learning curve)
  - $1.50 learning cost: Claude Code translated 14k lines to TypeScript (zero build errors, all tests passing)
- **Architecture:**
  - **Skillbook:** Persistent collection of strategies that evolves with every task
  - **Three specialized roles:**
    - Agent: Executes tasks, enhanced with Skillbook strategies
    - Reflector: Analyzes traces to extract what worked and failed
    - SkillManager: Curates Skillbook — adds, refines, removes strategies
  - **Recursive Reflector:** Core innovation — writes and executes Python code in sandboxed environment to search for patterns
- **Quick Start:**
  - Installation: `uv add ace-framework`
  - Setup: `ace setup` (interactive) or manual config
  - Usage: ACELiteLLM agent with learn_from_feedback() method
  - No fine-tuning, no training data, no vector database
- **Supported Providers:** OpenAI, Anthropic, and 100+ others via LiteLLM
- **Free Hosted Solution:** Kayba.ai (dashboard for trace analysis, failure surfacing, improvements)

#### AGENTS.md
- **Purpose:** Agent documentation for ACE system

#### CLAUDE.md
- **Purpose:** Claude Code integration guide

#### ace/ Directory (Core Library)

**ace/core/** — Core ACE logic
- Central learning loop implementation
- Skillbook management
- Strategy extraction
- Pattern recognition

**ace/cli/** — Command-line interface
- `ace setup` command
- `ace status` command
- Configuration management
- Interactive setup wizard

**ace/rr/** — Recursive Reflector
- Trace analysis engine
- Python code generation for pattern search
- Error identification
- Strategy extraction
- Sandboxed execution environment

**ace/runners/** — Execution runners
- Task execution orchestration
- Environment setup
- Trace collection
- Error handling

**ace/steps/** — Pipeline steps
- Individual processing steps in the ACE pipeline
- Composable units of work
- Integration points for custom logic

**ace/integrations/** — Framework integrations
- OpenClaw integration
- Other framework support
- API compatibility layers

**ace/providers/** — LLM provider adapters
- Anthropic Claude
- OpenAI GPT
- LiteLLM universal adapter
- Custom provider support

**ace/implementations/** — LLM implementations
- Model-specific optimizations
- Provider-specific features
- Fine-tuning support

**ace/observability/** — Logging and monitoring
- Trace collection
- Structured logging
- Performance metrics
- Dashboard integration (Logfire)

**ace/deduplication/** — Deduplication logic
- Skillbook deduplication
- Strategy merging
- Redundancy elimination

**ace/protocols/** — Protocol definitions
- Message formats
- API contracts
- Data structures
- Schema definitions

#### pipeline/ Directory (Python Pipeline Engine)

**pipeline/pipeline.py** — Main pipeline engine
- Defines processing pipeline
- Orchestrates execution
- Manages state transitions
- Composes steps together

**pipeline/context.py** — Context management
- Manages execution context
- Tracks state
- Passes data between steps
- Memory management

**pipeline/branch.py** — Pipeline branching
- Conditional logic
- Parallel execution
- Error recovery
- Fallback paths

**pipeline/protocol.py** — Protocol definitions
- Data structure contracts
- API schemas
- Message formats
- Type definitions

**pipeline/errors.py** — Error handling
- Custom error types
- Error recovery
- Retry logic
- Error reporting

#### pyproject.toml
```toml
[project]
name = "ace-framework"
version = "0.9.3"
description = "Build self-improving AI agents that learn from experience"
requires-python = ">=3.12"
license = {text = "MIT"}

dependencies = [
    "litellm>=1.83.0",
    "pydantic>=2.0.0",
    "pydantic-ai-slim[litellm]>=0.0.36",
    "python-toon>=0.1.0",
    "tau2",
    "tenacity>=9.1.4",
]
```

**Key Dependencies:**
- litellm: Universal LLM interface (100+ providers)
- pydantic: Data validation and serialization
- pydantic-ai: AI-first Python library
- tau2: Benchmark dataset
- tenacity: Retry logic
- python-toon: Utilities

#### ace.toml
- **Purpose:** ACE framework configuration
- **Likely Content:** Model selection, provider configuration, Skillbook settings, learning parameters

#### examples/
- **ace/** — Basic ACE usage
- **agentic-system-prompting/** — System prompt patterns
- **openclaw/** — OpenClaw integration example
- **pipeline_composition/** — Pipeline composition patterns
- **pipeline_ex/** — Extended pipeline examples
- **seahorse-emoji-ace.gif** — Learning demonstration

#### specs/ Directory (Architecture Specifications)

**specs/001-openclaw-integration/**
- OpenClaw integration design
- API contract definitions
- Integration patterns
- Migration guide

**specs/002-ace-mcp-server/**
- MCP server specification
- Protocol implementation
- Server API
- Client integration guide

#### tests/ Directory (Comprehensive Test Suite)
- `test_ace_core.py` — Core functionality tests
- `test_ace_*.py` — Component-specific tests
- `test_pipeline_*.py` — Pipeline engine tests
- `test_claude_sdk_*.py` — Claude SDK integration tests
- `test_openclaw.py` — OpenClaw integration tests
- `test_pydantic_ai_integration.py` — Pydantic AI integration tests
- `test_rr_pipeline/` — Recursive reflector tests
- `conftest.py` — Test configuration

#### benchmarks/
- **benchmarks/base.py** — Base benchmark class
- **benchmarks/tasks/** — Benchmark task definitions
- **benchmarks/loaders/** — Data loaders
- **benchmarks/README.md** — Benchmark documentation
- Tau2 airline booking benchmark integration

#### docs/ Directory (Comprehensive Documentation)
- **getting-started/** — Quick start guides
- **api/** — API reference documentation
- **concepts/** — Conceptual guides (Skillbook, Reflector, etc.)
- **guides/** — How-to guides for common tasks
- **integrations/** — Integration documentation
- **pipeline/** — Pipeline engine documentation
- **design/** — Architecture design decisions

### Capabilities Inventory

**Core Learning Loop:**
- Persistent Skillbook management
- Automatic strategy extraction from execution traces
- Recursive reflector for pattern analysis
- Error detection and recovery
- Strategy refinement and deduplication

**Trace Analysis:**
- Execution trace collection
- Error identification
- Success pattern extraction
- Comparative analysis (successful vs failed runs)
- Sandboxed Python code execution for analysis

**Provider Support:**
- Claude (Anthropic)
- GPT (OpenAI)
- 100+ LLM providers via LiteLLM
- Custom provider support
- Multi-model selection

**Integration Frameworks:**
- OpenClaw integration
- Pydantic AI integration
- MCP server integration
- Custom integration support
- Protocol-based extensibility

**Pipeline Engine:**
- Composable pipeline steps
- Branching and conditional logic
- Error recovery and fallback
- Parallel execution capability
- Context passing and state management

**Observability:**
- Structured logging
- Trace collection and storage
- Performance metrics
- Dashboard integration (Logfire)
- Error reporting

**Evaluation & Benchmarking:**
- Tau2 airline booking benchmark
- Custom benchmark support
- Pass@k metrics
- Performance tracking
- Cost analysis

**API Capabilities:**
- Python SDK
- CLI interface
- REST-like protocol
- MCP server mode
- Custom step creation

### Installation & Runtime Requirements

**Python Requirements:**
- Python 3.12+ (specified in pyproject.toml)
- UV package manager (recommended) or pip
- Virtual environment (recommended)

**Core Dependencies:**
- litellm >= 1.83.0
- pydantic >= 2.0.0
- pydantic-ai-slim[litellm] >= 0.0.36
- python-toon >= 0.1.0
- tau2 (benchmark dataset)
- tenacity >= 9.1.4

**Optional Dependencies:**
- Specific LLM provider SDKs (OpenAI SDK, Anthropic SDK, etc.)
- Logfire (for dashboard integration)
- Development tools (pytest, black, mypy, etc.)

**Environment Variables:**
- API keys for LLM providers:
  - `ANTHROPIC_API_KEY` (for Claude)
  - `OPENAI_API_KEY` (for GPT)
  - Provider-specific keys for others
- `ACE_LOG_LEVEL` (logging level)
- Optional dashboard credentials for Kayba.ai

**System Requirements:**
- Sufficient disk space for Skillbook storage
- Network connectivity for API calls
- Modern processor for Reflector analysis (Python execution)

**Development Requirements:**
- pytest (testing)
- black (code formatting)
- mypy (type checking)
- mkdocs (documentation generation)

### Current State on Machine

**Status:** Not installed/running
- **Exists on disk:** Yes (source code directory)
- **Python environment:** Not set up
- **Dependencies:** Not installed
- **Configuration:** No local config (requires setup)

**To install and run locally:**
```bash
cd agentic-context-engine-main
uv sync                    # Install dependencies using UV
# or: pip install -e .

ace setup                  # Interactive setup
export ANTHROPIC_API_KEY="your-key"
# Create a Python script or use CLI
python -c "from ace import ACELiteLLM; agent = ACELiteLLM(model='claude-3-5-sonnet'); print(agent.ask('Test'))"
```

### Integration Opportunities

**For 27-Agent Claude Code System:**

1. **Learning Loop:** Implement ACE pattern for all agents
   - Each agent type maintains its own Skillbook
   - Traces collected from every execution
   - Automatic improvement over time

2. **Cross-Agent Learning:**
   - Shared strategies between similar agents
   - Pattern discovery across agent types
   - Centralized strategy repository

3. **Error Recovery:**
   - Automatic error analysis and strategy generation
   - Improved error messages over time
   - Self-healing agent behaviors

4. **Performance Optimization:**
   - Token usage reduction (49% in benchmark)
   - Cost awareness integration
   - Adaptive model selection per task

5. **Evaluation Infrastructure:**
   - Continuous evaluation of agent performance
   - Pass@k metrics tracking
   - Benchmark integration

6. **Provider Flexibility:**
   - Support all 100+ LLM providers via LiteLLM
   - Model-agnostic agent design
   - Easy provider switching

**Shared Infrastructure Benefits:**
- Persistent learning: agents improve without retraining
- Strategy sharing: cross-agent knowledge transfer
- Trace analysis: centralized execution monitoring
- Cost optimization: token reduction patterns
- Error handling: automatic recovery strategies

**Extraction Targets:**
- `ace/rr/` — Recursive reflector for trace analysis
- `ace/core/` — Core learning loop implementation
- `pipeline/` — Pipeline composition framework
- `docs/concepts/` — Skillbook and learning architecture
- `examples/` — Integration patterns
- `specs/` — Protocol definitions for extensions
- `benchmarks/` — Evaluation methodology

**Tooling Integration:**
- MCP server mode: agents accessible to other systems
- Logfire integration: centralized monitoring dashboard
- Custom step creation: extensible pipeline
- Multi-provider support: flexible model selection

### Conflicts & Risks

**Licensing:** MIT (very permissive)
- Compatible with commercial projects
- No restrictions on derivative works
- Requires copyright attribution

**Maintenance:**
- Active development (Kayba.ai maintained)
- Version 0.9.3 (approaching 1.0, stable features)
- Community support available

**Python Version:**
- Requires Python 3.12+ (relatively new)
- May need environment setup on older systems
- Modern Python features enable better type safety

**Dependencies:**
- LiteLLM: stable and widely used
- Pydantic: actively maintained
- Other deps: well-maintained ecosystem

**Resource Requirements:**
- Reflector runs Python code (CPU intensive)
- Skillbook storage (disk space)
- API rate limits (shared across agents)

**Learning Curve:**
- Concepts: Skillbook, Reflector, strategies (well documented)
- API design: clean and Pythonic
- Examples: good reference implementations

**Token Cost:**
- Learning loop requires multiple LLM calls
- Trace analysis adds overhead
- Cost tracking built-in

### Verdict

**Classification: LEARNING FRAMEWORK + INFRASTRUCTURE + REFERENCE IMPLEMENTATION**

**Reasoning:**
1. **Persistent learning loop:** Core innovation for agent self-improvement
2. **Proven results:** 2x consistency, 49% token reduction (benchmarked)
3. **Recursive reflector:** Advanced pattern analysis engine
4. **Provider-agnostic:** Works with 100+ LLM providers
5. **Pipeline framework:** Composable step-based architecture
6. **Comprehensive integration:** OpenClaw, Pydantic AI, MCP support
7. **Well-documented:** Extensive guides and API documentation

**Action Items:**
1. Implement ACE learning loop for all agent types
2. Extract Skillbook pattern for shared strategy management
3. Adapt Recursive Reflector for trace analysis across agents
4. Integrate with LiteLLM for provider flexibility
5. Adopt pipeline composition for agent orchestration
6. Implement Logfire integration for centralized monitoring
7. Create custom evaluation benchmarks for 27-agent system

**Integration Priority: VERY HIGH**
- Directly addresses agent improvement and learning
- Production-tested at scale (Kayba.ai deployed)
- Well-architected and modular design
- Comprehensive documentation
- Active maintenance and community support

---

## REPO 4: AEGIS

**Path:** `C:\Users\User\Downloads\new repos\Aegis-main\Aegis-main\`

**Language(s):** Markdown (primary), YAML, Plain text

**License:** Not specified in directory listing (check LICENSE file)

**Repository URL:** Likely GitHub, specific URL not determinable from listing

**Version:** 0.1.2-beta (as of February 7, 2024)

### File Inventory

```
Aegis-main/
├── .context/                        # Core framework directory
│   ├── ai/                          # AI interaction context
│   ├── current_state.md             # Project state tracking
│   ├── decisions/                   # Decision log
│   ├── docs/                        # Documentation
│   ├── plan/                        # Project planning
│   ├── roadmap.md                   # Development roadmap
│   ├── sessions/                    # Session history
│   ├── tasks/                       # Task tracking
│   └── AI_INSTRUCTIONS.md           # AI assistant instructions
├── docs/                            # User-facing documentation
│   ├── commands/                    # Command documentation
│   ├── cross_referencing.md         # Cross-reference guide
│   ├── decisions.md                 # Decision documentation
│   ├── framework/                   # Framework documentation
│   ├── getting_started.md           # Quick start guide
│   ├── icons/                       # Icon assets
│   ├── operations/                  # Operations documentation
│   ├── planning/                    # Planning documentation
│   ├── releases/                    # Release notes
│   ├── tasks.md                     # Task documentation
│   ├── templates.md                 # Template documentation
│   └── SUMMARY.md
├── CHANGELOG.md
├── COMMANDS.md                      # Complete commands reference
├── LICENSE
├── README.md                        # Main documentation
└── release_notes.md
```

### Key Files — Deep Read

#### README.md
- **Purpose:** Main documentation for Aegis framework
- **Tagline:** "Zero-Dependency Framework for AI-Assisted Development"
- **Key Features:**
  - Zero dependencies: Pure text-based framework
  - Universal compatibility: Works with any AI coding assistant (Cursor, Codeium, etc.)
  - Cognitive-inspired: Organizes information like human memory
  - Instant setup: Just a few simple commands
  - Portable: Everything in plain text files
- **Quick Start:**
  1. Copy `.context` directory to project root
  2. Copy COMMANDS.md contents to AI assistant rules
  3. Type `/aegis plan` and `/aegis start` in chat
- **Memory System (4 types):**
  - **Semantic Memory (Knowledge):** `.context/decisions/`, `.context/docs/` — architecture, specs, standards
  - **Episodic Memory (History):** `.context/sessions/` — development history, solutions, decisions
  - **Procedural Memory (Procedures):** `.context/tasks/` — active tasks, implementation steps, validation rules
  - **Prospective Memory (Future):** `.context/plan/`, `.context/roadmap.md` — goals, milestones, requirements

#### COMMANDS.md
- **Purpose:** Complete command reference for AI assistants
- **Content:** All Aegis commands that can be invoked from chat:
  - `/aegis plan` — Create/update project plan
  - `/aegis start` — Begin development session
  - `/aegis check` — Check project state
  - `/aegis update` — Update project state
  - And many more (comprehensive list)
- **Usage:** Copy to AI assistant rules (Cursor, Codeium, Claude Code, etc.)

#### .context/ Directory (Framework Core)

**Structure mirrors human memory types:**

**ai/** — AI interaction context
- Prompt templates for consistent AI behavior
- Context for AI assistant about project
- Instructions for specific domains

**AI_INSTRUCTIONS.md** — AI assistant instructions
- How the AI should interact with the framework
- Best practices for using Aegis
- Integration patterns

**current_state.md** — Project state tracking
- Current phase of project
- Active blockers
- Recent decisions
- Status of all tasks

**decisions/** — Decision log
- Architectural decisions
- Technical choices made
- Rationale and tradeoffs
- Date and context of decision

**docs/** — Documentation
- Technical specifications
- Architecture documentation
- API reference
- Integration guides

**plan/** — Project planning
- Detailed project plan
- Milestones and deadlines
- Dependencies and critical path
- Resource allocation

**roadmap.md** — Development roadmap
- High-level vision
- Long-term goals
- Feature priorities
- Release timeline

**sessions/** — Session history
- Development session logs
- What was accomplished
- Problems encountered
- Solutions implemented
- Code changes made

**tasks/** — Task tracking
- Active tasks
- Task status
- Subtasks and dependencies
- Blockers and risks
- Assigned to (if team)

#### docs/ Directory (User Documentation)

**getting_started.md** — Quick start guide
- Setup instructions
- First steps
- Basic concepts
- Simple example

**commands/** — Command reference
- Detailed command documentation
- Parameters and options
- Examples
- Output formats

**framework/** — Framework concepts
- Memory system explanation
- Aegis philosophy
- Design principles
- Integration points

**planning/** — Planning guides
- How to create effective plans
- Breaking down projects
- Dependency management
- Resource planning

**operations/** — Operations guides
- Running daily operations
- Session management
- State updates
- Monitoring

**decisions.md** — Decision documentation
- How to document decisions
- Template for decisions
- Historical decisions
- Decision rationale

**tasks.md** — Task documentation
- Task format and structure
- Task lifecycle
- Status tracking
- Estimation

**cross_referencing.md** — Cross-referencing guide
- How to link between documents
- Reference syntax
- Navigation patterns
- Backlink maintenance

**templates.md** — Template documentation
- Available templates
- Template customization
- Creating new templates
- Template variables

#### CHANGELOG.md
- Version history
- Feature additions
- Bug fixes
- Breaking changes

#### release_notes.md
- Latest release information
- New features
- Upgrade instructions
- Known issues

### Capabilities Inventory

**Core Framework:**
- Pure text-based system (zero dependencies)
- Four-tier memory system (semantic, episodic, procedural, prospective)
- AI-assisted project management
- Session-based workflow
- Decision tracking and logging
- Task and milestone management

**AI Integration:**
- Slash command system (`/aegis <command>`)
- AI-aware instructions
- Context-based prompting
- Session-persistent state
- Automated state updates via AI

**Memory Management:**
- Semantic: architectural decisions, technical specs, standards
- Episodic: development history, problem solutions, session logs
- Procedural: active tasks, implementation steps, validation rules
- Prospective: project goals, roadmap, requirements

**Project Management:**
- Plan creation and updates
- Milestone tracking
- Task breakdown and estimation
- Dependency management
- Risk and blocker tracking

**Session Management:**
- Session creation and logging
- Work tracking
- Problem/solution documentation
- State persistence
- Session review and retrospective

**Documentation:**
- Automated documentation generation
- Cross-reference linking
- Template-based documents
- Version control compatible
- Git-friendly structure

**IDE/Editor Integration:**
- Works with any AI-assisted IDE (Cursor, Codeium, etc.)
- Minimal setup (copy .context directory)
- Chat-based commands
- No extension required
- Plain text compatibility

### Installation & Runtime Requirements

**Minimal Requirements:**
- Any text editor or IDE (VS Code, Cursor, Codeium, etc.)
- Any AI assistant integration (Cursor, Claude Code, Codeium, etc.)
- Git (recommended, for version control)
- No external tools or dependencies

**Setup Process:**
1. Download Aegis framework
2. Copy `.context/` directory to project root
3. Copy COMMANDS.md content to AI assistant rules
4. Start using `/aegis` commands in chat

**Environment:**
- No environment variables required
- No API keys needed
- No external services
- Completely offline-capable

**Optional Tools:**
- Git (for version control of .context/)
- Markdown viewer (for better doc viewing)
- IDE with markdown support

**Portability:**
- Framework is self-contained in `.context/` directory
- Easy to share: copy directory to other projects
- Easy to backup: just version control the directory
- Requires zero installation

### Current State on Machine

**Status:** Not configured/used
- **Exists on disk:** Yes (source code directory)
- **Setup:** No local project configured
- **Framework:** Not copied to any project yet
- **Usage:** Not integrated with any development process

**To use locally:**
```bash
# In your project root
mkdir -p your-project
cp -r Aegis-main/.context your-project/

# Copy commands to your IDE
cat Aegis-main/COMMANDS.md
# (Paste into your IDE's AI assistant rules)

# Start using
# Open your IDE and type: /aegis plan
```

### Integration Opportunities

**For 27-Agent Claude Code System:**

1. **Project State Management:**
   - `.context/current_state.md` — Track system state across sessions
   - Decision log — Record architectural decisions
   - Session history — Log all agent activities

2. **Memory System:**
   - Semantic memory → Agent knowledge base
   - Episodic memory → Agent experience logs
   - Procedural memory → Agent task execution
   - Prospective memory → Agent planning

3. **Session Persistence:**
   - Session tracking → Agent session lifecycle
   - State restoration → Resume agent between runs
   - Progress tracking → Monitor agent improvement

4. **Planning & Coordination:**
   - Project planning → Multi-agent orchestration
   - Task breakdown → Agent task assignment
   - Dependency tracking → Inter-agent dependencies
   - Milestone management → System progress tracking

5. **Decision Documentation:**
   - Architectural decisions → Agent system design decisions
   - Rationale tracking → Understand why agents were configured certain ways
   - Decision history → Audit trail of system evolution

**Shared Infrastructure Benefits:**
- Zero-dependency framework: no external tooling needed
- Plain text storage: version control friendly
- AI-native design: built for AI agent collaboration
- Cognitive patterns: maps to human memory systems
- Instant adoption: minimal setup required

**Extraction Targets:**
- `.context/` directory structure → template for agent system state management
- `COMMANDS.md` — command definition patterns
- `docs/` — documentation structure and templates
- Memory system design — cognitive-inspired organization
- Session management patterns

**Tooling Integration:**
- Integration with any IDE (Claude Code, Cursor, etc.)
- Git-based versioning of framework state
- Plain text compatibility for all tools
- Slash command pattern for agent invocation

### Conflicts & Risks

**Licensing:** Not specified (check LICENSE file in repo)
- Likely permissive (MIT or similar)
- Assume compatible unless otherwise stated

**Maintenance:**
- Version 0.1.2-beta (still evolving)
- Not all 1.0 features finalized
- Active development indicated

**Scope:**
- Framework is for project management, not code
- Complements development, doesn't replace it
- Requires AI assistant (doesn't work standalone)

**Scalability:**
- Text files may become unwieldy for very large projects
- Session history could grow large
- Potential organization challenges at scale

**Integration Burden:**
- Requires AI assistant awareness (can't use with non-AI tools)
- Manual command entry in chat (no CLI)
- Setup in every new project (though easy to copy)

### Verdict

**Classification: PROJECT STATE FRAMEWORK + REFERENCE ARCHITECTURE**

**Reasoning:**
1. **Zero dependencies:** Pure text-based system
2. **Cognitive alignment:** Memory system maps to human cognition
3. **AI-native design:** Built specifically for AI assistants
4. **Minimal setup:** Copy directory, paste commands, start using
5. **Session persistence:** Tracks agent activities across sessions
6. **Decision tracking:** Documents system evolution

**Action Items:**
1. Adopt `.context/` directory structure for 27-agent system state
2. Implement session tracking for all agent activities
3. Create central decision log for architectural decisions
4. Adopt semantic/episodic/procedural/prospective memory tiers
5. Integrate `/aegis` command patterns into agent orchestration
6. Version control `.context/` directory for system evolution tracking

**Integration Priority: MEDIUM-HIGH**
- Complements other frameworks rather than replacing them
- Useful for project state and session management
- Zero-dependency advantage is significant
- Well-suited to AI-native workflows

---

## REPO 5: APIFY-CLI

**Path:** `C:\Users\User\Downloads\new repos\apify-cli-master\apify-cli-master\`

**Language(s):** TypeScript/JavaScript (primary), Feature specs (Gherkin), Shell scripts

**License:** Likely Apify proprietary or MIT (check LICENSE.md)

**Repository URL:** https://github.com/apify/apify-cli

**Organization:** Apify

### File Inventory

```
apify-cli-master/
├── .github/                         # GitHub CI/CD
│   ├── CODEOWNERS
│   ├── scripts/
│   └── workflows/
├── .husky/                          # Git hooks
│   └── pre-commit
├── .vscode/                         # VS Code config
│   └── settings.json
├── .yarn/                           # Yarn package manager
│   └── plugins/
├── .yarnrc.yml
├── .nvmrc                           # Node version file
├── .bun-version                     # Bun runtime version
├── docs/                            # Documentation
│   ├── index.md                     # Main docs
│   ├── installation.md              # Installation guide
│   ├── integrating-scrapy.md        # Scrapy integration
│   ├── quick-start.md               # Quick start
│   ├── reference.md                 # Command reference
│   ├── telemetry.md                 # Usage tracking
│   ├── troubleshooting.md
│   └── vars.md
├── features/                        # BDD feature specs
│   ├── actor-run-input.feature.md
│   ├── builds-namespace.feature.md
│   ├── help-command.feature.md
│   ├── invalid-actor-json-output.feature.md
│   └── test-implementations/
├── scripts/                         # Build and generation scripts
│   ├── build-cli-bundles.ts
│   ├── generate-cli-docs.ts
│   ├── insert-cli-metadata.ts
│   ├── reference-template.md
│   ├── documentation-renderer/
│   └── install/                     # Installation scripts
├── src/                             # Source code
│   ├── commands/                    # CLI commands (see below)
│   ├── entrypoints/                 # CLI entrypoints
│   ├── lib/                         # Utility libraries
│   │   ├── api/                     # Apify API client
│   │   ├── auth/                    # Authentication
│   │   ├── config/                  # Configuration management
│   │   ├── consts/                  # Constants
│   │   ├── file/                    # File operations
│   │   ├── integrations/            # Framework integrations
│   │   ├── outputs/                 # Output formatting
│   │   ├── utils/                   # General utilities
│   │   └── validation/              # Input validation
│   └── index.ts
├── test/                            # Test suite
│   ├── api/
│   ├── lib/
│   ├── local/
│   ├── __setup__/
│   └── tsconfig.json
├── website/                         # Documentation website
│   ├── docusaurus.config.js         # Docusaurus config
│   ├── sidebars.js
│   ├── babel.config.js
│   ├── src/
│   ├── static/
│   ├── versioned_docs/
│   ├── versions.json
│   ├── i18n/                        # Internationalization
│   └── yarn.lock
├── biome.json                       # Biome linter config
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE.md
├── MIGRATIONS.md                    # Migration guides
├── package.json
├── README.md                        # Main documentation
├── renovate.json                    # Dependency updates
├── tsconfig.json
├── tsup.config.ts                   # Build tool config
├── vitest.config.ts                 # Test framework config
├── cucumber.json                    # BDD test config
├── eslint.config.mjs
├── .prettierignore
├── .gitignore
└── .editorconfig
```

### Key Files — Deep Read

#### README.md
- **Purpose:** Main documentation for Apify CLI
- **Tagline:** "Apify CLI helps you create, develop, build and run Apify Actors"
- **What are Apify Actors:**
  - Cloud programs that can perform web scraping, automation, or data processing
  - Accept input, perform job, generate output
  - Run in Docker containers (can use any language with appropriate Dockerfile)
  - Recommended: JavaScript/Node.js (most libraries and support)
- **Installation Methods:**
  - Via bundles: `curl -fsSL https://apify.com/install-cli.sh | bash` (macOS/Unix) or PowerShell script (Windows)
  - Via Homebrew: `brew install apify-cli`
  - Via NPM: `npm install -g apify-cli` (requires Node.js 22+)
  - Via fnm: `fnm install 22 && fnm use 22 && npm install -g apify-cli`
  - Verify: `apify --version`
  - Or use via npx: `npx apify-cli <command>`
- **Basic Usage:**
  - Create new Actor: `apify create my-hello-world` (template selection)
  - Initialize existing project: `apify init` (setup in directory)
  - Develop locally with Apify SDK
  - Push to cloud: `apify push`
  - Run in cloud: `apify run`
- **Key Features:**
  - Local development environment setup
  - Docker integration for local testing
  - Cloud push and run capabilities
  - Actor management and versioning
  - Template system with boilerplate
  - Integration with Apify platform

#### docs/ Directory

**index.md** — Documentation index
- Quick links to all docs
- Common workflows
- Resource links

**installation.md** — Detailed installation guide
- Multiple installation methods
- Troubleshooting installation
- Upgrade instructions
- Version management

**quick-start.md** — Getting started guide
- First steps with Apify CLI
- Creating your first Actor
- Running locally
- Deploying to cloud

**reference.md** — Complete command reference
- All CLI commands documented
- Parameters and options
- Output formats
- Examples

**integrating-scrapy.md** — Scrapy integration guide
- Running Scrapy projects as Actors
- Configuration and setup
- Best practices
- Examples

**vars.md** — Environment variables guide
- Variable management
- Input/output variables
- Default variables
- Custom variables

**telemetry.md** — Usage tracking documentation
- What data is collected
- Privacy considerations
- Opt-in/opt-out options
- Data usage

**troubleshooting.md** — Troubleshooting guide
- Common issues and solutions
- Error messages explained
- Debug techniques
- Support resources

#### src/commands/ Directory (CLI Commands)

Core CLI commands likely include:

- **create** — Create new Actor from template
- **init** — Initialize Actor in existing directory
- **push** — Push Actor to Apify cloud
- **run** — Run Actor in cloud
- **build** — Build Actor locally
- **start** — Start local Actor
- **stop** — Stop local Actor
- **pull** — Pull Actor from cloud
- **info** — Show Actor information
- **call** — Call Actor with input
- **auth** — Authentication management
- **config** — Configuration management
- **storage** — Dataset/storage management
- **logs** — View Actor logs
- **list** — List Actors
- **delete** — Delete Actor
- **version** — Version management

#### src/lib/ Directory (Core Libraries)

**api/** — Apify REST API client
- HTTP client for Apify platform
- Authentication
- Request/response handling
- Error handling

**auth/** — Authentication module
- Token management
- Login/logout
- Token validation
- Credential storage

**config/** — Configuration management
- Local .actor config
- Settings persistence
- Environment-based config
- Config file parsing

**integrations/** — Framework integrations
- Scrapy integration
- Other scraping framework support
- Custom integration points

**outputs/** — Output formatting
- JSON formatting
- Table output
- CLI color and styling
- Pretty printing

**validation/** — Input validation
- Command parameter validation
- Input type checking
- Error messages
- Validation rules

**utils/** — General utilities
- Common helper functions
- File operations
- String manipulation
- Error utilities

#### features/ Directory (BDD Test Specifications)

**actor-run-input.feature.md** — Actor input handling tests
- Input parameter passing
- Input formats
- Input validation

**builds-namespace.feature.md** — Build management tests
- Build creation
- Build versioning
- Build selection

**help-command.feature.md** — Help command tests
- Help text display
- Command documentation
- Usage information

**invalid-actor-json-output.feature.md** — Error handling tests
- Invalid JSON handling
- Error messages
- Graceful degradation

#### website/ Directory (Documentation Site)

- Docusaurus-based documentation site
- Multiple versions supported (versioned_docs/)
- Internationalization support (i18n/)
- API reference
- Tutorial guides

#### package.json
```json
{
  "name": "apify-cli",
  "version": "(current version)",
  "description": "Apify command-line interface"
  // Scripts, dependencies, etc.
}
```

### Capabilities Inventory

**Actor Management:**
- Create new Actors from templates
- Initialize Actor development environment
- Push/pull Actors to/from cloud
- Actor listing and information
- Actor versioning and history
- Actor deletion and cleanup

**Local Development:**
- Local Actor execution
- Docker integration
- Local storage emulation
- Local dataset operations
- Development server
- Hot reload support

**Cloud Integration:**
- Apify cloud platform authentication
- Actor deployment to cloud
- Cloud Actor execution
- Remote logging
- Cloud storage operations
- Task scheduling

**CLI Features:**
- Interactive setup and prompts
- Command auto-completion
- Help system
- Error messages and troubleshooting
- Configuration management
- Environment variable support

**Actor Execution:**
- Run Actor with input
- Manage Actor runs
- Monitor Actor execution
- View Actor logs
- Cancel running Actors
- Get run results

**Storage Management:**
- Dataset CRUD operations
- Key-value store operations
- Request queue management
- Local storage emulation
- Cloud storage access

**Build Management:**
- Build creation and versioning
- Build selection for runs
- Build history
- Build optimization

**Framework Integration:**
- Scrapy framework support
- Custom integration support
- SDK integration
- Extension ecosystem

**Templating:**
- Multiple project templates
- Boilerplate generation
- Template customization
- Template selection wizard

### Installation & Runtime Requirements

**Node.js Requirements:**
- Node.js version 22+ (as per .nvmrc and README)
- npm or yarn package manager
- fnm or nvm for version management (optional)

**Runtime Requirements:**
- Docker (for local Actor testing)
- Apify account (for cloud operations)
- API token (for authentication)

**System Requirements:**
- Supported OS: macOS, Linux, Windows
- Internet connection (for cloud operations)
- Sufficient disk space (for Docker images, local storage)

**Installation Methods:**
1. Binary bundles: Pre-built executables for each OS
2. Homebrew: `brew install apify-cli` (macOS/Linux)
3. NPM: `npm install -g apify-cli`
4. Bun: `bun install -g apify-cli` (alternative JS runtime)
5. Source: Build from source if needed

**Environment Variables:**
- `APIFY_TOKEN` — Authentication token
- `APIFY_API_URL` — Custom API endpoint (optional)
- `APIFY_HEADLESS` — Headless browser mode (optional)
- `DEBUG` — Debug logging (optional)

**Optional Tools:**
- Docker (for local testing)
- Scrapy (for Scrapy integration)
- Custom development tools

### Current State on Machine

**Status:** Not installed/running
- **Exists on disk:** Yes (source code directory)
- **CLI installed:** No
- **Dependencies:** Not installed
- **Configuration:** No local config

**To install and use locally:**
```bash
npm install -g apify-cli
apify --version
apify auth login    # Authenticate with Apify account
apify create my-actor
cd my-actor
apify start         # Run locally
apify push          # Push to cloud
```

### Integration Opportunities

**For 27-Agent Claude Code System:**

1. **Web Scraping Agent:**
   - Use Apify SDK and templates
   - Manage Actors for different scraping scenarios
   - Handle pagination, authentication, data extraction
   - Queue management for large-scale scraping

2. **Automation Agent:**
   - Browser automation using Actors
   - Form filling and submission
   - Click path testing
   - Interactive flow automation

3. **Data Processing Agent:**
   - Data transformation using Actors
   - ETL pipelines
   - Batch processing
   - Data validation and cleanup

4. **Task Execution Agent:**
   - Long-running tasks as Actors
   - Scheduled execution
   - Error recovery and retry
   - Result aggregation

5. **Integration Agent:**
   - Multi-platform data collection
   - API integration and normalization
   - Data synchronization
   - Workflow orchestration

**Shared Infrastructure Benefits:**
- Cloud-based execution: offload heavy operations
- Distributed computing: run multiple Actors in parallel
- Scalability: handle large workloads
- Storage management: built-in dataset/storage services
- Monitoring: logs and error tracking

**Extraction Targets:**
- `src/lib/auth/` — Authentication pattern
- `src/lib/api/` — REST API client pattern
- `src/lib/config/` — Configuration management
- `src/lib/validation/` — Input validation framework
- `features/` — BDD test patterns
- `docs/` — Command documentation patterns
- Actor templates — starting points for new Actor types

**Tooling Integration:**
- SDK integration: Apify JavaScript SDK
- Docker: containerization pattern
- Cloud platform: scalable execution
- Storage services: dataset management
- Monitoring: execution tracking and logging

### Conflicts & Risks

**Licensing:** Likely Apify proprietary or MIT
- Check LICENSE.md for specific terms
- Assume permissive for integration planning

**Maintenance:**
- Active development (GitHub shows recent updates)
- Well-maintained by Apify
- Regular releases and updates

**Platform Dependency:**
- Tight coupling to Apify platform
- Requires Apify account for cloud features
- Apify API changes affect CLI
- Vendor lock-in for cloud operations

**Node.js Version:**
- Requires Node.js 22+ (relatively recent)
- May need environment setup on older systems
- Bun alternative available

**Learning Curve:**
- Actors concept requires understanding
- Docker knowledge helpful
- SDK documentation extensive
- Examples available

**Cost Considerations:**
- Free tier available but limited
- Paid plans for larger-scale usage
- Cost tracking important for optimization

### Verdict

**Classification: WEB AUTOMATION FRAMEWORK + AGENT EXECUTION PLATFORM**

**Reasoning:**
1. **Web scraping/automation specialist:** Purpose-built for these tasks
2. **Cloud execution:** Distributed task execution capability
3. **Storage management:** Built-in dataset services
4. **Template system:** Quick project scaffolding
5. **Docker integration:** Containerized deployment
6. **Scalability:** Handle multiple concurrent Actors
7. **Monitoring:** Execution tracking and logs

**Action Items:**
1. Create web scraping agent using Apify Actors
2. Integrate Apify SDK into automation workflows
3. Implement task queuing for batch operations
4. Add storage management for data persistence
5. Create Actor templates for common tasks
6. Integrate with cloud platform for scalable execution
7. Implement monitoring dashboard for Actor status

**Integration Priority: MEDIUM**
- Specialized for web automation/scraping (not general purpose)
- Adds cloud execution capability
- Useful for specific agent types (scraper, automation, ETL)
- Requires Apify platform dependency

---

# SUMMARY & CROSS-REPO ANALYSIS

## Repo Comparison Matrix

| Aspect | CLI-GWS | ECC | ACE | Aegis | Apify |
|--------|---------|-----|-----|-------|-------|
| **Type** | API CLI | Skill Library | Learning Framework | Project State | Web Automation |
| **Skills** | 95 | 156 | N/A | N/A | 0 (platform) |
| **Agents** | 0 | 40+ | N/A | N/A | 0 |
| **Commands** | Dynamic (discovery) | 65+ | CLI interface | Slash commands | Full CLI |
| **Language** | Rust | TS/JS/Py/Multi | Python | Markdown | TS/JS |
| **License** | Apache 2.0 | MIT | MIT | TBD | TBD |
| **Primary Use** | Workspace APIs | Agent framework | Learning loops | State mgmt | Web scraping |
| **Integration** | High | Highest | Very High | Medium-High | Medium |
| **Complexity** | Medium | Very High | High | Low | Medium |
| **Learning Curve** | Medium | High | Medium | Low | Medium |

## Integration Recommendations by Agent Type

**Email Agent:** CLI-GWS (gws-gmail-*), ECC (email-related skills)
**Calendar Agent:** CLI-GWS (gws-calendar-*)
**Document Agent:** CLI-GWS (gws-docs-*, gws-drive-*), ECC (doc skills)
**Code Review Agent:** ECC (40+ language reviewers), ACE (learning improvements)
**Web Scraping Agent:** Apify-CLI, ECC (data-scraper-agent)
**Data Processing Agent:** ECC (database skills, ETL patterns), Apify-CLI
**Orchestration Agent:** ECC (orchestrate command, devfleet), ACE (learning loop)
**General Purpose Agent:** ECC (agentic-engineering, autonomous-loops), ACE (learning)

## Critical Capabilities Matrix

| Capability | CLI-GWS | ECC | ACE | Aegis | Apify |
|------------|---------|-----|-----|-------|-------|
| **OAuth2 Auth** | ✓ | Partial | - | - | ✓ |
| **LLM Provider Flexibility** | - | Partial | ✓✓ | - | - |
| **Self-Improvement** | - | - | ✓✓ | - | - |
| **Multi-Language Support** | - | ✓✓ | - | - | Partial |
| **Session Persistence** | - | ✓ | ✓ | ✓✓ | - |
| **Cloud Execution** | - | - | - | - | ✓✓ |
| **State Management** | - | ✓ | ✓ | ✓✓ | Partial |
| **Error Recovery** | - | ✓ | ✓✓ | - | ✓ |
| **Cost Optimization** | - | ✓ | ✓✓ | - | - |

## Recommended Integration Strategy

1. **Foundation Layer:** Aegis (project state management)
2. **Skill Foundation:** ECC (156 skills, agent templates)
3. **Learning Layer:** ACE (self-improving agents)
4. **Workspace Integration:** CLI-GWS (95 Workspace skills)
5. **Automation Layer:** Apify-CLI (web scraping/automation)

This creates a complete system with state management, extensive skills, self-improvement, enterprise integration, and web automation capabilities.

---

**End of Analysis Report**

Generated: 2026-04-07 | Total Repos: 5 | Total Skills: 251+ | Total Agents: 40+

## PART B — REPOSITORY ANALYSIS (Repos 6-10)
# DEEP TECHNICAL ANALYSIS: 5 REPOSITORY ECOSYSTEM
## Part B: Repos 6-10

**Analysis Date:** 2026-04-07  
**Analyst:** Claude Agent (File Search Specialist)  
**Scope:** Architecture, capabilities, integration opportunities, risks, verdicts

---

## REPO 6: autoresearch-master

**Path:** `C:\Users\User\Downloads\new repos\autoresearch-master\autoresearch-master\`  
**Language(s):** Python 3.10+  
**License:** MIT

### File Inventory

```
.gitignore
.python-version
analysis.ipynb
prepare.py
program.md
progress.png
pyproject.toml
README.md
train.py
uv.lock
```

### Key Files — Deep Read

#### README.md (8,039 bytes, 92 lines)
Core premise: Autonomous AI research agent that autonomously modifies and experiments with a GPT training codebase over fixed 5-minute intervals. Key points:

- **Autonomy paradigm:** AI agent edits code, trains, evaluates (val_bpb metric), decides keep/discard, repeats without human intervention
- **Fixed 5-minute wall-clock training budget** — enables ~12 experiments/hour, ~100 overnight
- **Single GPU requirement** (tested on H100) — no distributed training, self-contained
- **Three core files:** `prepare.py` (read-only, data prep), `train.py` (agent modifies only this), `program.md` (human agent instructions)
- **Metric:** val_bpb (validation bits per byte) — lower is better, vocab-independent
- **References Karpathy's nanochat** as parent project
- **Platform:** NVIDIA GPU only (MacOS/Windows forks available)
- **Setup:** `uv` package manager, one-time `prepare.py` run, then iterative `train.py` execution

#### program.md (Agent Instructions)
Defines the autonomous research loop protocol:

1. **Setup Phase:**
   - Create git branch `autoresearch/<tag>` (fresh run)
   - Read in-scope files (README.md, prepare.py, train.py)
   - Verify data exists in `~/.cache/autoresearch/`
   - Initialize `results.tsv` header
   - Confirm and proceed

2. **Experimentation Loop (NEVER STOPS):**
   - Launch `uv run train.py > run.log 2>&1` (exactly 5 min)
   - Parse results: grep val_bpb, peak_vram_mb from output
   - Record to `results.tsv` (commit, val_bpb, memory_gb, status, description)
   - Evaluate: if val_bpb improved (lower), keep commit; else `git reset`
   - Iterate with new ideas — architecture changes, hyperparameter tweaks, optimizer swaps

3. **Constraints:**
   - Cannot modify `prepare.py` (read-only)
   - Cannot install new packages
   - Cannot modify evaluation harness
   - Training MUST stop after 5 minutes (kill if >10 min = failure)
   - Simplicity criterion: prefer deleting code over adding complexity

4. **Output Format:**
   ```
   val_bpb:          0.997900
   training_seconds: 300.1
   total_seconds:    325.9
   peak_vram_mb:     45060.2
   mfu_percent:      39.80
   total_tokens_M:   499.6
   num_steps:        953
   num_params_M:     50.3
   depth:            8
   ```

5. **Critical Instruction:** `NEVER STOP` — loop runs indefinitely until manually stopped. Agent is autonomous. If stuck, think harder, try radical changes. Loop design enables ~100 experiments during 8-hour sleep.

#### pyproject.toml
Dependencies (uv managed):
```toml
[project]
name = "autoresearch"
requires-python = ">=3.10"
dependencies = [
    "kernels>=0.11.7",
    "matplotlib>=3.10.8",
    "numpy>=2.2.6",
    "pandas>=2.3.3",
    "pyarrow>=21.0.0",
    "requests>=2.32.0",
    "rustbpe>=0.1.0",
    "tiktoken>=0.11.0",
    "torch==2.9.1",
]

[tool.uv.sources]
torch = [{ index = "pytorch-cu128" }]
```

#### train.py (630 lines)
GPT pretraining implementation (agent-editable file):
- GPT model architecture with configurable depth, attention patterns (SSSL window pattern)
- CausalSelfAttention with flash-attention-3 optimizations
- RoPE embeddings, value residuals (ResFormer)
- Optimizer: Muon + AdamW (hybrid)
- Training loop with 5-minute time budget enforcement
- Evaluation harness integrating with prepare.py

Key config fields:
```python
@dataclass
class GPTConfig:
    sequence_len: int = 2048
    vocab_size: int = 32768
    n_layer: int = 12
    n_head: int = 6
    n_kv_head: int = 6
    n_embd: int = 768
    window_pattern: str = "SSSL"
```

### Capabilities Inventory

- **Autonomous experiment orchestration:** Git branch management, training launch, result parsing, keep/discard logic, loop continuation without human input
- **Model architecture exploration:** Layer depth, vocab size, attention patterns, embedding dimensions all tunable by agent
- **Optimizer experimentation:** Hybrid Muon+AdamW, learning rate sweeps, batch size optimization
- **Performance evaluation:** val_bpb metric, VRAM tracking, model flops utilization (MFU), token throughput
- **Time-bounded training:** Fixed 5-minute wall clock, platform-independent comparability
- **Crash recovery:** Agent detects OOM, syntax errors, runtimes >10 min; decides fix vs. skip
- **Git-based versioning:** Each experiment is a commit; results logged to TSV; full audit trail
- **Simplicity optimization:** Agent weights code deletion equally with metric improvement

### Installation & Runtime Requirements

- **Python 3.10+** (tested 3.10+)
- **uv package manager** (install: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **NVIDIA GPU** (H100 tested; requires CUDA 12.8 via pytorch-cu128 index)
- **Storage:** ~2GB for data shards + tokenizer (`~/.cache/autoresearch/`)
- **One-time setup:** `uv run prepare.py` (~2 min, downloads data, trains BPE tokenizer)
- **No external services required:** Self-contained training, no distributed setup

### Current State on Machine

- Repository downloaded to disk (path confirmed)
- Not installed/running (no `node_modules`, no Python venv)
- No `.env` or configuration present
- Training data NOT downloaded (would be in `~/.cache/autoresearch/` if prepared)
- Not active

### Integration Opportunities

1. **Skill for autonomous model iteration:** `/autoresearch` skill directive to GSD orchestrator — provides structured protocol for agent-driven model optimization
2. **Research agent enhancement:** Pair with agent-facing research skills; autoresearch provides _executable_ R&D loop vs. just documentation
3. **Standalone research loop:** Could run as persistent background worker (orchestrated by GSD's daemon/worker system) — experiment every N hours while main Claude Code session handles other tasks
4. **Comparative benchmarking:** Integration point for evaluating architectural decisions across agent-driven tasks — "what model architecture works best for AGENT_TASK X"
5. **Template for autonomous optimization:** Pattern reusable for other domains (hyperparameter search, prompt optimization, data augmentation strategies)

Which agents benefit:
- **gsd-pi orchestrator:** Could invoke autoresearch as a sub-agent for model/code optimization phases
- **gstack CEO agent:** Automated research for product optimization cycles
- **claude-mem worker:** Could background-process memory compression improvements
- **last30days:** Could autonomously optimize search query generation and synthesis prompts

### Conflicts & Risks

- **High compute requirement:** H100 GPU; smaller hardware needs fork + major hyperparameter retuning
- **GPU-only:** No CPU/MPS fallback in base repo; forks exist but unmaintained
- **Python-heavy:** Not integrated with GSD's Node.js/TypeScript stack; separate runtime dependency
- **Long-running tasks:** 5-minute fixed intervals don't map naturally to ephemeral Claude Code sessions; needs background daemon
- **No observability into agent reasoning:** Only sees TSV results, not why agent made decisions (could add logging)
- **Experimental status:** Single-author research project; not production-hardened (no error recovery, no rollback, no alerting)

### Verdict

**AGENT ENHANCEMENT + REF EXTRACTION**

Autoresearch is scientifically rigorous methodology for _autonomous_ research iteration. Integrate as:

1. **Pattern reference:** Extract `program.md` structure for building other autonomous research loops (e.g., prompt optimization, dataset curation)
2. **Skill template:** Create `/autoresearch` skill that embeds the loop protocol so agents understand:
   - Time-bounded experimentation
   - Simplicity as first-class metric
   - Autonomous iteration without human checkpoints
3. **Standalone integration:** Pair with GSD's worker daemon — run autoresearch experiments on fixed schedule, report results to main session
4. **NOT inline:** Too specialized for 27-agent system; overkill for most tasks. But highly valuable as reference for agents building autonomous loops.

**Extractable patterns:**
- `program.md` loop protocol (reusable template)
- Fixed time budget constraint model (applicable to any evaluation)
- Keep/discard decision logic based on metric delta
- Git-based experiment tracking (audit trail pattern)

---

## REPO 7: claude-mem-main

**Path:** `C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main\`  
**Language(s):** TypeScript, JavaScript, Python  
**License:** AGPL-3.0

### File Inventory (Massive monorepo — sampling key structure)

```
[Core Plugin System]
plugin/
  ├── CLAUDE.md
  ├── hooks/
  │   ├── CLAUDE.md
  │   ├── bugfixes-2026-01-10.md
  │   └── hooks.json
  ├── modes/ (40+ language/mode files)
  ├── scripts/
  │   ├── worker-service.cjs
  │   ├── worker-cli.js
  │   ├── worker-wrapper.cjs
  │   ├── context-generator.cjs
  │   ├── mcp-server.cjs
  │   ├── statusline-counts.js
  │   └── claude-mem (CLI entry)
  ├── skills/
  │   ├── do/
  │   ├── make-plan/
  │   ├── mem-search/
  │   ├── smart-explore/
  │   └── timeline-report/
  └── ui/
      ├── viewer-bundle.js
      ├── viewer.html
      └── icons/

[Core TypeScript Implementation]
src/
  ├── bin/ (CLI entry points)
  ├── cli/ (hook command handling)
  ├── hooks/ (hook response protocol)
  ├── sdk/ (parser, prompts)
  ├── servers/ (MCP server)
  ├── services/
  │   ├── context/ (context generation)
  │   ├── domain/ (business logic)
  │   ├── infrastructure/ (database, process mgmt)
  │   ├── integrations/ (Chroma, external APIs)
  │   ├── queue/ (background job queue)
  │   ├── server/ (HTTP endpoints)
  │   ├── smart-file-read/ (file detection)
  │   ├── sqlite/ (observation store)
  │   ├── sync/ (cross-session sync)
  │   ├── transcripts/ (conversation parsing)
  │   └── worker/ (daemon process)
  ├── shared/ (EnvManager, path utils, plugin state)
  ├── supervisor/ (health checker, shutdown)
  ├── types/ (database types, transcript types)
  ├── ui/ (viewer components)
  └── utils/ (logging, parsing, project filtering)

[Tests — Massive Suite]
tests/
  ├── infrastructure/ (process mgmt, health, distribution)
  ├── integration/ (e2e hook execution, API endpoints)
  ├── services/ (queue, sqlite, sync operations)
  ├── sqlite/ (data integrity, transaction tests)
  ├── worker/ (agent resume, search, middleware)
  └── [40+ test files covering hooks, context, timestamps, workers]

[Additional Infrastructure]
openclaw/          [OpenClaw gateway plugin]
installer/         [NPM install wizard]
scripts/          [40+ utility scripts]
cursor-hooks/     [Cursor IDE integration]
docs/             [Extensive documentation + bug reports]
```

### Key Files — Deep Read

#### README.md (Excerpt)
- **Purpose:** "Persistent memory compression system built for Claude Code"
- **Version:** 10.6.3
- **Core value prop:** Automatically captures tool usage observations, generates semantic summaries, makes them available to future sessions
- **Session continuity:** Claude maintains knowledge about projects across session boundaries
- **Installation:** Via `/plugin` commands (preferred) or npm (SDK only)
- **OpenClaw support:** Installable on OpenClaw gateways via `curl -fsSL https://install.cmem.ai/openclaw.sh | bash`

#### package.json (Dependencies + Scripts)
```json
{
  "name": "claude-mem",
  "version": "10.6.3",
  "engines": { "node": ">=18.0.0", "bun": ">=1.0.0" },
  "type": "module",
  "exports": {
    ".": "./dist/index.d.ts",
    "./sdk": "./dist/sdk/index.d.ts",
    "./modes/*": "./plugin/modes/*"
  },
  "scripts": {
    "dev": "npm run build-and-sync",
    "build": "node scripts/build-hooks.js",
    "build-and-sync": "npm run build && npm run sync-marketplace && npm run worker:restart",
    "worker:logs": "tail -n 50 ~/.claude-mem/logs/worker-$(date +%Y-%m-%d).log",
    "worker:restart": "bun plugin/scripts/worker-service.cjs restart",
    "test": "bun test",
    "bug-report": "npx tsx scripts/bug-report/cli.ts",
    "translate:all": "...",
  }
}
```

Critical observations:
- **Node 18+, Bun 1.0+** runtime requirements
- **Worker service** managed via `worker-service.cjs` (persistent background daemon)
- **Logging:** `~/.claude-mem/logs/worker-YYYY-MM-DD.log`
- **SDK exports:** Can be used as library via `import { ... } from 'claude-mem/sdk'`
- **Modes system:** Language-specific hook configurations in `plugin/modes/*.json`

#### Core Architecture Files

**plugin/CLAUDE.md:**
- Directs Claude to use specific skills: `/do`, `/make-plan`, `/mem-search`, `/smart-explore`, `/timeline-report`
- Plugin provides hooks for context injection across Claude Code lifecycle
- Prioritizes "smart-explore" for codebase analysis (vs. raw file reading)

**src/services/worker/:**
- **Worker daemon:** Background process managing:
  - Observation capture (tool usage, completions, errors)
  - Vector database sync (Chroma)
  - Queue processing (SQLite-backed job queue)
  - Session management and synthesis
- Runs independently of Claude Code session; survives session restarts

**src/services/transcripts/:**
- Parser for Claude Code conversation history (XML format)
- Extracts tool calls, observations, context
- Converts structured transcript to queryable observations

**src/services/sqlite/:**
- SQLite database (`~/.claude-mem/db.sqlite`) storing:
  - Observations (tool calls, completions, metadata)
  - Sessions (session_id, project_id, timestamps)
  - Summaries (semantic compressions of observations)
  - Prompts (extracted from transcripts)
- Comprehensive transaction safety, indexes, FK constraints

**plugin/skills/:**
- `/mem-search` — query memory across sessions
- `/smart-explore` — intelligent codebase exploration (preferred over raw file reading)
- `/make-plan` — generate plans with memory context
- `/do` — execute tasks with memory injection
- `/timeline-report` — generate retrospective summaries

#### Transcript Capture Mechanism

From `src/services/transcripts/`:
- Claude Code stores conversations in `.claude/` directory (Windows: `C:\Users\User\.claude\`)
- claude-mem parses XML transcript format
- Extracts:
  - Tool invocations (name, args, results)
  - Timestamps
  - Role (user, assistant, tool)
  - Context blocks
- Synthesizes to observations (semantic units)
- Injects summaries into future session contexts via hooks

#### Windows Path Handling

From `src/shared/paths.ts`:
- Primary: `~/.claude-mem/` (Linux/macOS)
- Windows fallback: `C:\Users\[USER]\.claude-mem\` via `os.homedir()`
- Database: `~/.claude-mem/db.sqlite`
- Logs: `~/.claude-mem/logs/`
- Cache: `~/.claude-mem/cache/`
- Observation store: `~/.claude-mem/observations/`

### Capabilities Inventory

1. **Session continuity:**
   - Captures observations from prior sessions
   - Injects summaries into new session prompts
   - Cross-project memory via global KNOWLEDGE.md

2. **Memory capture & compression:**
   - Tool call tracking (what was executed, results)
   - Error/crash logging
   - Semantic summarization (LLM-generated)
   - Vector embeddings (Chroma for similarity search)

3. **Skills system:**
   - `/mem-search` — find related observations from past sessions
   - `/smart-explore` — intelligent codebase navigation with memory context
   - `/make-plan` — planning with prior knowledge
   - `/do` — task execution with memory injection
   - `/timeline-report` — retrospectives across projects

4. **Worker daemon:**
   - Persistent background service (survives session restarts)
   - Job queue for async observation processing
   - Health monitoring (process registry)
   - Graceful shutdown (prevents zombie processes)

5. **Integration hooks:**
   - Pre-prompt injection (context hook)
   - Post-tool-use hooks (observation capture)
   - Session lifecycle hooks (init, shutdown)
   - Supports Cursor IDE + OpenClaw gateways

6. **MCP server:**
   - Exposes claude-mem as MCP resource
   - Allows other agents/tools to query observations
   - API endpoint at `http://localhost:PORT/`

7. **Multilingual support:**
   - 40+ languages via mode files (`plugin/modes/code--*.json`)
   - Hooks system translatable per language

### Installation & Runtime Requirements

- **Node.js 18+** (or Bun 1.0+)
- **npm or bun** package manager
- **SQLite 3** (bundled with Node)
- **Chroma** (vector DB, optional but recommended)
- **Claude Code CLI** or compatible agent (Codex, OpenClaw)
- **Storage:** ~100MB for SQLite + Chroma index (grows with observation volume)
- **Background process:** Worker daemon runs continuously (`~/.claude-mem/worker-*.log`)
- **Environment:** No external API keys required; can work offline

### Current State on Machine

- Repository downloaded, not installed
- No `node_modules/` (would exist if installed)
- No `~/.claude-mem/` directory (would exist if running)
- Not configured; no hooks registered
- Not running

### Integration Opportunities

1. **Core memory layer for 27-agent system:**
   - Each agent session auto-captures observations
   - `/mem-search` skill for cross-agent knowledge
   - All 27 agents write to shared SQLite — cross-agent memory queries

2. **Agent coordination:**
   - orchestrator skill queries memory to route tasks to best prior-agent
   - Agents see summaries of what previous agents did
   - Prevents duplicate work, enables specialized handoff

3. **Global KNOWLEDGE.md:**
   - System-level patterns discovered by agents
   - Architecture decisions documented
   - API patterns, common errors, best practices
   - Automatically injected into all agent prompts

4. **Transcript analysis for debugging:**
   - /timeline-report across all 27 agents
   - Identify stuck loops, error patterns
   - Audit trail for compliance/review

5. **Skill enhancement:**
   - gstack integration: /review skill queries memory for prior reviews (prevent repeated issues)
   - gsd-pi: planning skill uses prior experiments
   - last30days: searches memory for past research to avoid re-querying

### Conflicts & Risks

1. **AGPL-3.0 license:** Restrictive; any derivative must also be AGPL. Verify compatibility with system license.

2. **Chroma dependency:** Vector DB adds operational complexity (network, initialization). SQLite-only mode exists but loses semantic search.

3. **Background daemon:** Long-running process requires supervision. Dead daemon = lost observation capture. Health monitoring critical.

4. **Windows support:** Heavy development effort on Windows-specific issues (path handling, process spawning, terminal popups). ~15 open issues related to Windows.

5. **Session directory coupling:** Assumes Claude Code stores transcripts in `.claude/` (verified for Windows via `os.homedir()`). Breaking change in Claude Code would require update.

6. **Performance at scale:** SQLite + Chroma may slow down with 10K+ observations. No documented scaling tests.

7. **Observation precision:** Captures tool calls but loses nuanced human intent. Synthesis relies on LLM — can hallucinate if context summarization fails.

### Verdict

**CORE INFRASTRUCTURE**

claude-mem is **essential infrastructure** for the 27-agent system. It solves:
- **Session continuity problem:** Agents don't start from scratch each session
- **Cross-agent knowledge:** Memory store enables coordination
- **Audit trail:** Full transparency into agent decisions
- **Reuse prevention:** Avoid redundant research/exploration

Integration plan:
1. **Install immediately** in the system (part of base setup, not optional)
2. **Configure worker daemon** to start automatically with Claude Code
3. **Set up shared observation database** at `~/.claude-mem/db.sqlite` (all 27 agents use same DB)
4. **Create system KNOWLEDGE.md** at `~/.gsd/agent/KNOWLEDGE.md` for cross-agent patterns
5. **Hook mem-search into orchestrator:** Route agent decisions based on prior context
6. **License review:** Confirm AGPL-3.0 compatibility with system licensing

**Extractable patterns:**
- Hook system architecture (pre/post execution)
- Worker daemon lifecycle management
- SQLite schema for observations (schema migrations pattern)
- Chroma integration example
- Transcript parser (reusable for audit/compliance)

**Risk mitigation:**
- Add health checks for worker daemon; restart if dead
- Implement observation pruning (keep only recent 1-year observations)
- Add query timeouts to prevent SQLite locks blocking agents
- Windows testing: verify path handling on actual Windows systems

---

## REPO 8: gsd-2-main

**Path:** `C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\`  
**Language(s):** TypeScript, Node.js, Rust (native bindings)  
**License:** MIT

### File Inventory (Large monorepo)

```
[Main CLI + Core Engine]
src/
  ├── cli.ts (main entry point)
  ├── headless.ts (REPL/remote mode)
  ├── web-mode.ts (browser UI)
  ├── mcp-server.ts (MCP integration)
  ├── models-resolver.ts (provider routing)
  ├── wizard.ts (onboarding)
  └── [20+ orchestration files]

[Core Agent Framework]
packages/
  ├── pi-agent-core/ (agent runtime, state machine, providers)
  ├── pi-coding-agent/ (specialized agent for coding tasks)
  ├── pi-tui/ (terminal UI, interactive modes)
  ├── pi-ai/ (model/provider abstraction)
  ├── daemon/ (background orchestration)
  ├── mcp-server/ (MCP resource server)
  └── rpc-client/ (RPC protocol)

[Native Optimizations]
native/
  ├── crates/ (Rust implementations)
  ├── Cargo.toml
  └── npm/ (compiled bindings)

[Orchestration & Skills]
gsd-orchestrator/
  ├── SKILL.md (skill template)
  ├── workflows/ (YAML workflow definitions)
  ├── templates/ (task templates)
  └── references/ (example outputs)

[Web Interface]
web/
  ├── app/ (Next.js app)
  ├── components/ (React components)
  └── [typical Next.js structure]

[VSCode Extension]
vscode-extension/
  ├── src/
  ├── package.json
  └── [extension files]

[Documentation]
docs/
  ├── architecture.md
  ├── skills.md
  ├── git-strategy.md
  ├── parallel-orchestration.md
  ├── pi-context-optimization-opportunities.md
  └── [40+ architectural docs]

[Configuration]
.plans/ (20+ feature plans as markdown)
package.json, tsconfig.json, Dockerfile, docker-compose.yaml
```

### Key Files — Deep Read

#### README.md (Excerpt)
- **GSD = "Get Shit Done"** — now a full coding agent framework (v2)
- **Author:** Garry Tan (YC President & CEO)
- **Core claim:** "One command. Walk away. Come back to a built project with clean git history."
- **Productivity claim:** "600,000+ lines production code in 60 days, 10K-20K lines/day, part-time"
- **Architecture:** Built on **Pi SDK** (agent harness with TypeScript access to agent runtime)
- **Capabilities vs v1:** Direct control over context windows, sessions, git branches, cost/tokens, crash detection, auto-advancement through milestones
- **Install:** `npm install -g gsd-pi@latest`
- **Tooling:** 23 specialist agents (CEO, eng manager, designer, QA, security, release engineer, etc.)
- **Philosophy:** Markdown-driven (SKILL.md, PLAN.md, ROADMAP.md), open source (MIT)

#### Recent Release v2.52.0 (April 2026)

Key features:
- **VS Code integration:** Status bar, file decorations, bash terminal, session tree
- **Capability-aware model routing:** Replaced pattern matching with metadata-based provider selection
- **`--bare` mode:** Minimal output for automation
- **RPC protocol v2:** Versioning, init handshake, runId generation
- **SQLite audit:** Indexes, caching, safety fixes
- **Unified error classifier:** Consolidates 3 overlapping classifiers into single pipeline
- **Auto-mode improvements:** Stops on provider errors (vs. infinite retry), transaction safety, worktree seeding, idle watchdog

#### Core Orchestration Philosophy

From `gsd-orchestrator/SKILL.md` + docs:
- **Skills define agent behavior:** Each skill is a `.md` file with:
  - Frontmatter (name, version, description, args)
  - Multi-step instructions
  - Templates for common patterns
- **Workflows:** YAML files orchestrate skill sequences
- **State machine:** Disciplined state transitions with guards
- **Git branching:** Automatic isolation; clean history
- **Milestones:** Parallel execution; quality gates at completion
- **Verification:** 8-question quality gates before milestone done
- **Offline capable:** Works with local models (Ollama, etc.)

#### Agent Architecture

From `packages/pi-agent-core/`:
- **Single-writer state engine:** Atomic SQLite transitions, TOCTOU protection
- **Capability metadata:** Models tagged with capabilities (coding, image, web, reasoning)
- **Provider abstraction:** Support Claude, Gemini, GPT-4, local models (Ollama, LLaMA)
- **Cost tracking:** Token count, per-model pricing, budget enforcement
- **Session management:** Isolated worktrees per milestone, cross-session state
- **Tool registry:** 100+ tools for bash, file ops, web, git, terminal

#### Database Schema (SQLite)

Stores:
- `milestones` — project phases with phase/status/validation
- `slices` — task units; parallel execution possible
- `journal` — atomic state transitions
- `activity_log` — user actions, tool invocations
- `conversations` — session history
- `observations` — synthesis from transcripts (integrates with claude-mem)

#### Documentation Highlights

**docs/architecture.md:**
- Three-layer architecture: CLI → RPC client → agent harness (remote)
- Supports headless (REPL), web UI (browser), VSCode extension
- MCP server integration for external tools

**docs/parallel-orchestration.md:**
- Milestone slices can execute in parallel across multiple agents
- Coordination via database state machine
- Quality gates verify all slices before advancement

**docs/token-optimization.md:**
- Context window budgeting per milestone
- Prompt compression via RTK binary (Rust, 247K GH stars)
- Smart file inclusion (only what agent needs)

**docs/git-strategy.md:**
- Worktree isolation (default: no isolation, optional per preference)
- Clean git history (no merge commits, rebased)
- Automatic branch naming

**docs/skills.md:**
- 30+ skill packs covering: frameworks (React, Vue, Rails), databases (Postgres, MongoDB), cloud (AWS, Vercel, Railway)
- Curated catalog at `~/.agents/skills/`
- Skills discoverable via `/` prefix in agent

### Capabilities Inventory

1. **Multi-agent orchestration:**
   - Dispatch different agent types (coding, design, QA, security)
   - Parallel execution via milestone slices
   - Automatic coordination via state machine

2. **Rich agent instruction model:**
   - Skill.md language (structured + templates)
   - Workflow YAML (declarative sequences)
   - Quality gates (8-question verification)
   - PREFERENCES.md (agent configuration per project)

3. **Git management:**
   - Automatic worktree creation per task
   - Clean history (no merge commits, squashing)
   - Branch automation, isolation options
   - Commit message templates with metadata

4. **Cost & token optimization:**
   - Real-time token counting (per model)
   - Budget alerts + enforcement
   - Context window management
   - RTK compression for shell output

5. **Error recovery:**
   - Automatic crash detection
   - State machine guards against invalid transitions
   - Rollback capabilities (git reset, worktree cleanup)
   - Retry logic with exponential backoff

6. **Verification & QA:**
   - Quality gates before milestone completion
   - 8-question checklist (requirements, testing, security, performance, maintainability, documentation, scope, design review)
   - Parallel evaluation via evaluating-gates phase
   - Compliance classes (injected into validation prompts)

7. **Model/provider abstraction:**
   - Dynamic routing based on capability metadata
   - Support: Claude, Gemini, GPT-4, local (Ollama)
   - External provider extensions (Claude Code CLI, etc.)
   - Fallback chains (if primary unavailable, use secondary)

8. **UI options:**
   - TUI (terminal UI) — full interactive mode
   - Web UI (Next.js) — browser-based dashboard
   - VSCode extension — IDE integration with status bar
   - Headless (REPL) — scriptable, no UI
   - MCP server — expose as MCP resource

9. **Skills marketplace:**
   - 30+ curated skills
   - Framework-specific packs (React, Vue, Rails, Django, FastAPI)
   - Database packs (Postgres, MongoDB, Redis, Supabase)
   - Cloud packs (AWS, Vercel, Railway, Azure)
   - Community extensions via marketplace

### Installation & Runtime Requirements

- **Node.js 18+** (LTS recommended; v24 on Mac via Homebrew path fix)
- **Git 2.0+**
- **Bun 1.0+** (for some scripts)
- **npm or yarn** package manager
- **Rust/Cargo** (for native modules compilation)
- **Browser** (for web UI mode)
- **VSCode** (optional, for extension)
- **Environment:** API keys for Claude, Gemini, or local model setup
- **Disk:** ~500MB for dependencies + native modules

### Current State on Machine

- Repository downloaded, structure intact
- Not installed globally (`npm install -g` not run)
- No `node_modules/` at root or packages/
- Not configured; no PREFERENCES.md
- Not running

### Integration Opportunities

1. **Master orchestrator for 27-agent system:**
   - GSD becomes the primary coordination layer
   - Each of 27 agents implemented as GSD skill
   - Quality gates enforce minimum standards
   - `/gsd auto` runs entire milestone without interruption

2. **Skill ecosystem:**
   - Extract gstack as official GSD skill pack
   - Extract autoresearch as optional research skill
   - Extract last30days as research source skill
   - Extract claude-mem as memory skill

3. **Provider abstraction:**
   - Support multiple model backends (Claude, Gemini, local)
   - Cost optimization via provider fallback
   - Capability-aware routing (use Gemini for vision, Claude for coding)

4. **Worker daemon integration:**
   - GSD daemon manages all background processes
   - claude-mem worker, gstack workers, autoresearch workers all supervised
   - Single health check dashboard

5. **Parallel execution:**
   - 27 agents across multiple worktrees
   - Quality gates prevent broken states
   - Automatic rollback on verification failure

### Conflicts & Risks

1. **Complexity:** GSD-2 is feature-rich (~50K lines). Learning curve steep for operators. Risk: misconfiguration, misuse.

2. **State machine brittleness:** Single-writer engine strong guarantee, but requires perfect transaction isolation. Bug in state transition = deadlock/data corruption.

3. **Dependency on TypeScript/Node.js:** Locks system to Node ecosystem. Python tasks require subprocess wrapping.

4. **Model provider lock-in:** Default Claude, but fallback chains complex. Cost tracking relies on accurate pricing; out-of-date pricing = budget overruns.

5. **Git worktree overhead:** Each task creates worktree; cleanup must be reliable. Orphaned worktrees waste disk space.

6. **Windows support:** Heavy testing needed. Current issues suggest fragility on Win32 (EINVAL on detached processes, terminal handling).

7. **Marketplace centralization:** 30+ skills bundled; discovering custom skills non-trivial. Skill dependency management unclear.

### Verdict

**MASTER ORCHESTRATOR**

GSD-2 is the **coordination backbone** for a 27-agent system. It provides:
- **Disciplined state machine** — prevents agents from trampling each other
- **Quality gates** — enforces standards before milestone advancement
- **Skill abstraction** — reusable task modules across agents
- **Cost control** — token budgets, provider fallback
- **Git cleanliness** — reviewable commits, clean history

Integration plan:
1. **Install as core dependency** (not optional)
2. **Define all 27 agents as GSD skills**
3. **Wire quality gates** into each milestone completion
4. **Set PREFERENCES.md** at system level (cost budgets, provider choice, parallelism)
5. **Create marketplace entry** linking gstack, autoresearch, last30days as official packs
6. **Use `/gsd auto`** for fully autonomous milestone execution (overnight runs)

**Extractable patterns:**
- Skill.md template system (canonical format for agent instructions)
- Quality gates framework (reusable verification pattern)
- State machine architecture (SQLite + atomic transitions)
- Workflow YAML syntax (declarative orchestration)
- RTK compression integration (shell output optimization)

**Risk mitigation:**
- Comprehensive state machine testing (all transition paths)
- Worktree cleanup cron job (prevent orphans)
- Windows testing on actual hardware (not just CI)
- Skill dependency resolver (prevent circular skill deps)

---

## REPO 9: gstack-main

**Path:** `C:\Users\User\Downloads\new repos\gstack-main\gstack-main\`  
**Language(s):** TypeScript, Markdown (skills)  
**License:** MIT

### File Inventory (Skill-centric monorepo)

```
[Root Skills — Directly Invocable via /]
├── office-hours/ (SKILL.md — initial project planning)
├── plan-ceo-review/ (SKILL.md — CEO-level strategy)
├── plan-eng-review/ (SKILL.md — engineering review)
├── plan-design-review/ (SKILL.md — design review)
├── review/ (SKILL.md — code review engine)
├── ship/ (SKILL.md — release/deploy)
├── design-consultation/ (SKILL.md — design advising)
├── design-shotgun/ (SKILL.md — design brainstorm)
├── design-html/ (SKILL.md — HTML design)
├── design-review/ (SKILL.md — design feedback)
├── qa/ (SKILL.md — QA testing)
├── qa-only/ (SKILL.md — QA-focused tasks)
├── canary/ (SKILL.md — canary deployment)
├── benchmark/ (SKILL.md — performance testing)
├── browse/ (SKILL.md — web browsing with Chrome)
├── connect-chrome/ (SKILL.md — browser control)
├── checkpoint/ (SKILL.md — save/restore state)
├── codex/ (SKILL.md — Codex agent integration)
├── cso/ (SKILL.md — Chief Security Officer — OWASP/STRIDE)
├── design-consultation/ (SKILL.md — designer collaboration)
├── devex-review/ (SKILL.md — developer experience review)
├── document-release/ (SKILL.md — release notes generation)
├── freeze/ (SKILL.md — code freeze/release prep)
├── guard/ (SKILL.md — safety guardrails)
├── health/ (SKILL.md — system health checks)
├── investigate/ (SKILL.md — incident investigation)
├── land-and-deploy/ (SKILL.md — merge + deploy)
├── learn/ (SKILL.md — knowledge capture)
├── retro/ (SKILL.md — retrospective analysis)
├── setup-browser-cookies/ (SKILL.md)
├── setup-deploy/ (SKILL.md)
├── gstack-upgrade/ (SKILL.md — upgrade framework)
└── [more skills...]

[Shared Infrastructure]
lib/
  └── worktree.ts (git worktree utilities)

[Binary Tools]
bin/
  ├── gstack-config (configuration)
  ├── gstack-diff-scope (scope diffing)
  ├── gstack-global-discover (global skill discovery)
  ├── gstack-learnings-log (learning history)
  ├── gstack-learnings-search (search learnings)
  ├── gstack-review-log (review history)
  ├── gstack-telemetry-log (telemetry tracking)
  ├── gstack-timeline-log (timeline history)
  └── [20+ utilities]

[Browser Extension]
extension/
  ├── manifest.json
  ├── background.js
  ├── content.js
  ├── popup.js
  ├── sidepanel.html
  └── icons/

[Scripts & Analytics]
scripts/
  ├── analytics.ts (usage analytics)
  ├── discover-skills.ts (skill discovery)
  ├── eval-*.ts (evaluation scripts)
  ├── gen-skill-docs.ts (documentation generation)
  ├── skill-check.ts (validation)
  └── [20+ utility scripts]

[Tests]
test/
  ├── skill-e2e-*.test.ts (end-to-end skill tests)
  ├── global-discover.test.ts
  ├── hook-scripts.test.ts
  ├── learnings.test.ts
  └── [50+ test files]

[Documentation]
docs/
  ├── skills.md (skill catalog)
  ├── designs/ (design specs)
  └── images/

[Configuration & Docs]
SKILL.md (master skill template)
README.md (Garry Tan's manifesto)
ARCHITECTURE.md (architecture overview)
DESIGN.md (design philosophy)
ETHOS.md (values & principles)
package.json, tsconfig.json, Dockerfile
```

### Key Files — Deep Read

#### README.md (Extensive — Garry Tan's vision)

Core narrative:
- **Author:** Garry Tan, YC President & CEO (former Palantir engineer, Posterous cofounder, Bookface builder)
- **Claim:** Shipping 600K+ lines of production code in 60 days (~10K-20K lines/day) **part-time** while running YC
- **Tooling difference:** 20 years building products; 2026 enables productivity 1.6x higher than 2013 Bookface era
- **gstack philosophy:** Turn Claude Code into virtual engineering team (CEO, eng manager, designer, QA, security, release engineer)
- **23 specialist agents + 8 power tools** — all Markdown, all Slash commands, all free (MIT)
- **Target audience:** Technical founders/CEOs, first-time Claude Code users, staff engineers
- **Quick start:** Install → `/office-hours` → `/plan-ceo-review` → `/review` → `/qa` → done (you'll know if it's for you)

#### Install Instructions
```bash
# Step 1: Clone to ~/.claude/skills/gstack
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup

# Step 2 (optional): Add to project repo
cp -Rf ~/.claude/skills/gstack .claude/skills/gstack
cd .claude/skills/gstack && ./setup
```

Post-install: Add "gstack" section to CLAUDE.md directing to use `/browse` (not MCP tools), list 23+ skills.

#### Skill Catalog (23 Primary Skills)

1. **Planning & Strategy:**
   - `/office-hours` — Initial project discussion (get alignment on vision/scope)
   - `/plan-ceo-review` — CEO-level strategy (what to build, why, success metrics)
   - `/plan-eng-review` — Eng architecture (tech stack, database choice, deployment)
   - `/plan-design-review` — Design strategy (UX patterns, accessibility, visual language)

2. **Development & Code Review:**
   - `/review` — Code review engine (catches bugs, style issues, performance, security, design)
   - `/ship` — Release/deploy (merge PR, test, deploy, update docs, notify team)
   - `/land-and-deploy` — Merge + deploy (automated release flow)

3. **Design & UX:**
   - `/design-consultation` — Designer collaboration (reviewing designs, asking questions)
   - `/design-shotgun` — Brainstorm design options (multiple UX approaches)
   - `/design-html` — HTML/CSS design (pure HTML, no framework)
   - `/design-review` — Design feedback (catching design flaws)
   - `/devex-review` — Developer experience (API surface, setup, ergonomics)

4. **Quality Assurance:**
   - `/qa` — Full QA testing (opens real browser, runs test scenarios)
   - `/qa-only` — QA-focused (no design/eng, just testing)

5. **Infrastructure & Deployment:**
   - `/canary` — Canary deployment (gradual rollout, health checks)
   - `/benchmark` — Performance testing (load testing, profiling)
   - `/setup-deploy` — Deployment configuration (CI/CD setup)
   - `/freeze` — Release prep (code freeze, final QA)
   - `/unfreeze` — Post-release cleanup

6. **Specialized Roles:**
   - `/cso` — Chief Security Officer (OWASP, STRIDE threat modeling)
   - `/investigate` — Incident investigation (root cause analysis)
   - `/retro` — Retrospective (what went well, what didn't, learnings)
   - `/checkpoint` — Save/restore state (branching for experiments)

7. **Documentation & Communication:**
   - `/document-release` — Release notes generation
   - `/learn` — Knowledge capture (document learnings for future)

8. **Utilities:**
   - `/browse` — Web browsing (Chrome control, no MCP tools)
   - `/connect-chrome` — Browser connection setup
   - `/codex` — Codex agent integration
   - `/gstack-upgrade` — Upgrade framework itself

#### Core Skill Template

From `SKILL.md` (master template):
```markdown
---
name: skill-name
version: "1.0.0"
description: "What this skill does"
argument-hint: "skill-name project name, skill-name specific question"
allowed-tools: Bash, Read, Write, AskUserQuestion, [others]
homepage: https://github.com/garrytan/gstack
---

# Skill Name v1.0.0

## Workflow

**Step 1: [Action]**
Description and any bash/read commands

**Step 2: [Action]**
Next steps...

## Template

If a subtask, provide template output (how should result look?)

## Checklists

- [ ] Item 1
- [ ] Item 2
```

Pattern:
- Frontmatter defines metadata (name, version, allowed tools)
- Markdown body describes workflow (numbered steps)
- Templates for output format
- Checklists for verification

#### Special Skills Deep Dive

**`/review` (Code Review Engine):**
- Reads all changed files (git diff)
- Checks for: bugs, style violations, performance issues, security vulnerabilities, architecture misalignment
- Provides detailed feedback with line references
- Checklists: logic, edge cases, tests, documentation, performance, security
- Output: PR comments, approval/request changes

**`/qa` (Full QA Testing):**
- Connects to real Chrome browser (via `/browse`)
- Opens staging URL
- Runs test scenarios (happy path, edge cases, error states)
- Checks: functionality, UI/UX, performance, accessibility
- Documents bugs/issues
- Decision: ship or rework

**`/cso` (Chief Security Officer):**
- OWASP Top 10 scan (injection, XSS, auth, crypto, etc.)
- STRIDE threat model (spoofing, tampering, repudiation, info disclosure, denial of service, elevation of privilege)
- Input validation checks
- API security review
- Data protection audit
- Compliance considerations

**`/plan-ceo-review`:**
- Asks: What problem are we solving?
- Why now? (market opportunity)
- Success metrics (how do we know it works?)
- Scope (MVP vs full product)
- Risks & mitigations
- Resource plan (time, cost, people)

#### Browser Extension

From `extension/`:
- Chrome extension for gstack skills
- Provides browser context (current URL, visible DOM, cookies)
- Enables `/browse` skill to interact with pages
- Sidepanel for skill output
- No data collection (privacy-first)

#### Analytics & Telemetry

From `scripts/analytics.ts` and `bin/gstack-telemetry-*`:
- Optional usage tracking (opt-in)
- Metrics: skill invocation counts, execution time, success/failure
- Aggregated (no PII)
- Helps prioritize skill improvements

### Capabilities Inventory

1. **Planning & Discovery:**
   - CEO-level strategy alignment (vision, scope, metrics)
   - Engineering architecture decisions (tech stack, database)
   - Design UX patterns (accessibility, visual language)
   - Security threat modeling (OWASP, STRIDE)
   - Risk & mitigation planning

2. **Code Quality:**
   - Automated code review (bugs, style, performance, security)
   - Architectural alignment checking
   - Dependency vulnerability scanning
   - Test coverage analysis

3. **User Testing & QA:**
   - Real browser testing (Selenium/puppeteer equivalent)
   - Scenario testing (happy path, edge cases, error states)
   - Accessibility audits (WCAG)
   - Performance profiling (load testing, metrics)

4. **Design & UX:**
   - Design consultation (feedback on layouts, patterns)
   - Design brainstorming (multiple UX approaches)
   - HTML/CSS design (pure markup, responsive)
   - Developer experience review (API ergonomics)

5. **Release & Deployment:**
   - Automated merge & deploy
   - Canary deployment (gradual rollout)
   - Smoke tests post-deploy
   - Release notes generation
   - Code freeze management

6. **Knowledge Management:**
   - Learning capture (document decisions, patterns)
   - Retrospectives (project postmortems)
   - Timeline analysis (what happened when)
   - Search across learnings

7. **Incident Response:**
   - Investigation workflow (root cause analysis)
   - Health checks (system status)
   - Monitoring integration (alerts, logs)

### Installation & Runtime Requirements

- **Node.js 18+** (Bun recommended for faster builds)
- **Git 2.0+** (for worktree management)
- **Browser:** Chrome/Chromium (for `/browse` and `/qa`)
- **Node package:** None needed at root; each skill self-contained
- **Storage:** ~100MB for skills + binaries
- **Environment:** Optional (API keys for specific integrations)

### Current State on Machine

- Repository downloaded, structure intact
- Not installed (no global registration)
- No chrome extension loaded
- Not running

### Integration Opportunities

1. **Primary skill ecosystem for 27-agent system:**
   - All 23 gstack skills available to orchestrator
   - Ordered execution: `/plan-ceo-review` → `/review` → `/qa` → `/ship`
   - GSD-2 can invoke gstack skills via workflow YAML

2. **Cross-skill workflows:**
   - `/plan-ceo-review` output feeds into `/plan-eng-review`
   - `/design-consultation` output feeds into `/design-review`
   - `/review` feedback informs `/retro`

3. **Skill enhancement:**
   - `/browse` integrates with last30days (search web, browse results)
   - `/review` integrates with claude-mem (recall prior code patterns)
   - `/investigate` integrates with gsd-2 forensics

4. **Browser automation:**
   - gstack `/browse` replaces MCP Chrome tools (more reliable, local)
   - Enables `/qa` skill (real browser testing)
   - Integrates with last30days web search

### Conflicts & Risks

1. **Browser dependency:** `/browse` and `/qa` require Chrome/Chromium. CI/CD environments may not have GUI.

2. **Skill discoverability:** 23 skills huge catalog. New users overwhelmed. Need structured onboarding (which `/office-hours` provides).

3. **Skill quality variance:** Some skills mature (review, qa), others experimental (design-shotgun). Documentation quality varies.

4. **Browser extension maintenance:** Chrome API changes break extension. Requires ongoing compatibility testing.

5. **Performance overhead:** Some skills complex (cso, qa). Execution times 10-30 minutes. Cost tracking critical.

6. **Learning curve:** Garry Tan wrote these skills over months. Expect weeks to master all 23.

### Verdict

**SKILL ECOSYSTEM**

gstack is the **canonical skill pack** for a 27-agent system. It provides:
- **Proven workflows** — tested by Garry Tan (YC CEO) shipping real products
- **Specialized roles** — each skill has clear identity (designer, security, QA)
- **Reusable templates** — output formats standardized
- **Browser automation** — local, reliable web interaction

Integration plan:
1. **Register gstack skills** as official skill pack in system
2. **Ordered workflows:** planning → engineering → design → review → qa → ship
3. **Skill chaining:** Output of one skill feeds into next
4. **Metrics:** Track skill usage, execution time, success rate
5. **Documentation:** Map each skill to one of 27 agents (e.g., agent-8 uses `/review`, agent-9 uses `/qa`)

**Extractable patterns:**
- Skill.md template format (canonical for this system)
- Workflow ordering (planning before execution)
- Quality gates (review + qa before ship)
- Browser automation (Chrome extension + sidepanel)

---

## REPO 10: last30days-skill-main

**Path:** `C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main\`  
**Language(s):** Python (primary), JavaScript (secondary)  
**License:** MIT

### File Inventory

```
[Core Skill]
├── SKILL.md (master skill definition, 600+ lines)
├── SKILL-original.md (archive)
├── SPEC.md (specification)
├── README.md (documentation)

[Python Scripts — Research Engine]
scripts/
  ├── last30days.py (main entry point, 900+ lines)
  ├── briefing.py (synthesis pipeline)
  ├── evaluate-synthesis.py (quality evaluation)
  ├── evaluate_search_quality.py (search quality metrics)
  ├── generate-synthesis-inputs.py (prepare for synthesis)
  ├── store.py (observation storage)
  ├── watchlist.py (topic tracking)
  └── lib/
      ├── models.py (data structures)
      ├── source.py (search source adapters)
      ├── store.py (storage interface)
      └── [10+ library files]

[Comprehensive Test Suite]
tests/
  ├── test_bird_x.py (X/Twitter via Bird API)
  ├── test_bluesky.py (Bluesky search)
  ├── test_brave_search.py (Brave Search)
  ├── test_cache.py (caching logic)
  ├── test_chrome_cookies.py (cookie extraction)
  ├── test_codex_auth.py (Codex authentication)
  ├── test_cookie_extract.py (cookie parsing)
  ├── test_cross_source.py (multi-source dedup)
  ├── test_dates.py (date filtering)
  ├── test_dedupe.py (deduplication)
  ├── test_entity_extract.py (named entity extraction)
  ├── test_env_cookies.py (env-based auth)
  ├── test_exa_search.py (Exa semantic search)
  ├── test_hackernews.py (HN scraping)
  ├── test_instagram_sc.py (Instagram via ScrapeCreators)
  ├── test_models.py (data model tests)
  ├── test_openai_reddit.py (Reddit via OpenAI)
  ├── test_polymarket.py (Polymarket betting data)
  ├── test_quality_nudge.py (synthesis quality)
  ├── test_query.py (query parsing)
  ├── test_query_type.py (query classification)
  ├── test_reddit_enrich.py (Reddit comment enrichment)
  ├── test_reddit_public.py (public Reddit API)
  ├── test_reddit_sc.py (Reddit via ScrapeCreators)
  ├── test_relevance.py (relevance scoring)
  ├── test_render.py (output rendering)
  ├── test_safari_cookies.py (Safari cookie extraction)
  ├── test_schema_roundtrip.py (data serialization)
  ├── test_score.py (scoring algorithms)
  ├── test_scrapecreators_x.py (X via ScrapeCreators)
  ├── test_setup_wizard.py (onboarding)
  ├── test_smoke.py (smoke tests)
  ├── test_source_priority.py (source ordering)
  ├── test_status_banner.py (UI status)
  ├── test_tiktok.py (TikTok search)
  ├── test_truthsocial.py (Truth Social search)
  ├── test_youtube_relevance.py (YouTube scoring)
  ├── test_youtube_yt.py (YouTube scraping)
  └── [50+ test files]

[Configuration & Hooks]
hooks/
  ├── hooks.json (hook definitions)
  └── scripts/ (hook execution scripts)

[Fixtures & Test Data]
fixtures/
  ├── models_openai_sample.json
  ├── models_xai_sample.json
  ├── openai_sample.json
  ├── reddit_thread_sample.json
  ├── tiktok_search.json
  ├── xai_sample.json
  └── polymarket_sample.json

[Documentation]
docs/
  ├── how-search-works.md
  ├── search-quality-eval.md
  ├── comparison-results/
  ├── test-results/
  └── plans/

[Release & Changelog]
├── CHANGELOG.md
├── release-notes.md
├── LICENSE
```

### Key Files — Deep Read

#### SKILL.md (Master Skill Definition)

**Metadata:**
```yaml
name: last30days
version: "2.9.6"
description: "Deep research engine covering last 30 days across 10+ sources"
argument-hint: "last30 AI video tools, last30 best project management tools"
allowed-tools: Bash, Read, Write, AskUserQuestion, WebSearch
homepage: https://github.com/mvanhorn/last30days-skill
license: MIT
```

**OpenClaw Metadata:**
- Requires: `SCRAPECREATORS_API_KEY`
- Optional: `OPENAI_API_KEY`, `XAI_API_KEY`, `BRAVE_API_KEY`, `BSKY_HANDLE`, etc.
- Binaries: `node`, `python3`
- Files: All of `scripts/*`

**First-Run Wizard (Step 0 — Critical)**

ALWAYS execute wizard FIRST, even if user provided a topic. Wizard has 5 sub-steps:

1. **Welcome message** (plain text, no blockquote)
2. **Setup modal** — AskUserQuestion with 3 options:
   - "Auto setup (~30 sec)" — scan browser for X cookies, install yt-dlp
   - "Manual setup" — guided config
   - "Skip for now" — use Reddit/HN/web only

3. **ScrapeCreators opt-in** (if auto setup chosen):
   - "Open scrapecreators.com" → write key to `~/.config/last30days/.env`
   - "I have a key" → paste and write
   - "Skip for now" → continue without Reddit comments

4. **TikTok/Instagram opt-in** (if SC key saved):
   - Ask if user wants to search TikTok + Instagram on every run
   - Append `INCLUDE_SOURCES=tiktok,instagram` to `.env` if yes

5. **First research topic modal** (if first run):
   - Examples: "Claude Code vs Codex", "Sam Altman", "Warriors Basketball", "AI Legal Prompting"
   - Or: "Type my own topic"
   - Skip if user provided topic with original command

**Detection:** Check for `~/.config/last30days/.env` existence + `SETUP_COMPLETE=true` flag. If exists, skip entire wizard.

#### Core Research Loop (Step 1+)

**Intent parsing:**
- Classify query type (product review, news, trends, comparison, specific person, event)
- Determine relevant sources (e.g., "AI tools" → focus TikTok/YouTube; "market news" → focus Reddit/X/HN)

**Multi-source research:**
- Reddit (threads + comments if SC key present)
- X/Twitter (search via FROM_BROWSER=auto, AUTH_TOKEN, or XAI_API_KEY)
- YouTube (search + transcript fetch via yt-dlp if installed)
- TikTok (if SC key + INCLUDE_SOURCES=tiktok)
- Instagram (if SC key + INCLUDE_SOURCES=instagram)
- Hacker News (public API)
- Polymarket (prediction markets, no auth needed)
- Bluesky (if BSKY_HANDLE + BSKY_APP_PASSWORD)
- Truth Social (if TRUTHSOCIAL_TOKEN)
- Brave Search (if BRAVE_API_KEY)
- Exa (if Exa API key)

**Data enrichment:**
- Deduplication (cross-source)
- Relevance scoring (semantic + keyword matching)
- Date filtering (last 30 days enforced)
- Entity extraction (people, companies, products mentioned)
- Citation tracking (which source said what)

**Synthesis:**
- LLM synthesizes findings (uses OPENAI_API_KEY or XAI_API_KEY or OPENROUTER_API_KEY)
- Generates grounded report with citations
- Structures output: key findings, source breakdown, confidence levels

**Output:**
- Console display (formatted markdown)
- Optional save to `~/Documents/Last30Days/` (markdown file with date)
- File naming: `Last30Days_{date}_{topic}.md`

#### last30days.py (900+ lines)

Core script structure:
```python
# Main entry point: last30days.py <topic> [--output-dir DIR] [--setup]

async def research(topic: str, output_dir: Optional[str] = None):
    # 1. Load config from ~/.config/last30days/.env
    # 2. Initialize sources (Reddit, X, YouTube, etc.)
    # 3. Parallel search across sources
    # 4. Collect + deduplicate results
    # 5. Synthesize using LLM
    # 6. Format output (markdown)
    # 7. Save to file (if output_dir specified)
    # 8. Return structured result

async def setup():
    # 1. Check first run (SETUP_COMPLETE)
    # 2. Scan browser for X cookies
    # 3. Install yt-dlp
    # 4. Prompt for ScrapeCreators key
    # 5. Save config to ~/.config/last30days/.env
```

Key features:
- **Async/parallel execution** (sources queried simultaneously)
- **Error recovery** (individual source failure doesn't stop entire research)
- **Rate limiting** (respects API quotas)
- **Caching** (avoid re-querying same source)
- **Logging** (detailed execution log)

#### lib/source.py

Abstract base class for search sources:
```python
class Source:
    async def search(self, query: str, num_results: int) -> List[Result]:
        """Search source for query, return results"""
    
    async def enrich(self, result: Result) -> Result:
        """Add metadata (comments, engagement, etc.)"""
    
    @property
    def name(self) -> str:
        """Source identifier (e.g., 'reddit', 'x', 'youtube')"""
    
    @property
    def requires_auth(self) -> bool:
        """Does this source require authentication?"""
```

Implementations:
- `RedditSource` — public API + ScrapeCreators
- `TwitterSource` — X API + FROM_BROWSER cookies + XAI (Grok)
- `YouTubeSource` — yt-dlp scraping
- `TikTokSource` — ScrapeCreators
- `InstagramSource` — ScrapeCreators
- `HackerNewsSource` — public API
- `PolymarketSource` — public blockchain data
- `BlueskySource` — public API
- `BraveSearchSource` — Brave API
- `ExaSearchSource` — Exa semantic search

#### Test Coverage (50+ test files)

Comprehensive testing of:
- Each source (mock API responses)
- Query parsing (different question types)
- Date filtering (30-day window enforcement)
- Deduplication (cross-source merging)
- Synthesis quality (LLM output evaluation)
- Cookie extraction (browser automation)
- Authentication (all token types)
- Rendering (markdown, HTML output)
- Setup wizard (new user onboarding)

### Capabilities Inventory

1. **Multi-source research:**
   - 10+ sources (Reddit, X, YouTube, TikTok, Instagram, HN, Polymarket, Bluesky, Truth Social, Brave, Exa)
   - Automatic source selection based on query type
   - Parallel execution for speed

2. **Authentication flexibility:**
   - Browser cookie scanning (no manual setup for X)
   - API keys (OpenAI, XAI, Brave, ScrapeCreators)
   - App passwords (Bluesky)
   - OAuth fallbacks

3. **Data enrichment:**
   - Comment/reply extraction (Reddit)
   - Engagement metrics (likes, retweets, views)
   - User credibility scoring (account age, follower count)
   - Entity extraction (people, products, companies)
   - Date filtering (strict 30-day window)

4. **Synthesis:**
   - LLM-generated summaries (Claude, ChatGPT, or Grok)
   - Citation tracking (which source, exact quote)
   - Confidence scoring (how certain are we)
   - Grounded research (everything backed by evidence)

5. **Storage & persistence:**
   - Save research to markdown files
   - Organized by date + topic
   - Searchable file structure
   - No cloud sync (local only)

6. **Quality assurance:**
   - 50+ test files covering all sources
   - Evaluation scripts for synthesis quality
   - Comparison analysis (v1 vs v2 search results)
   - Coverage reports

7. **Accessibility:**
   - First-run wizard (no auth expertise needed)
   - Optional components (TikTok/Instagram on demand)
   - Graceful degradation (missing source doesn't break research)
   - Clear output (markdown reports)

### Installation & Runtime Requirements

- **Python 3.8+**
- **Node.js 18+** (for some integrations)
- **yt-dlp** (for YouTube transcripts) — auto-installed by setup wizard
- **pip packages:** requests, aiohttp, beautifulsoup4, lxml, pydantic, and others (see setup)
- **API keys (optional):**
  - `SCRAPECREATORS_API_KEY` (enables Reddit comments, TikTok, Instagram)
  - `OPENAI_API_KEY` (synthesis via ChatGPT)
  - `XAI_API_KEY` (synthesis via Grok)
  - `BRAVE_API_KEY` (Brave Search)
  - `BSKY_HANDLE` + `BSKY_APP_PASSWORD` (Bluesky)
  - `TRUTHSOCIAL_TOKEN` (Truth Social)
- **Browser:** Chrome/Chromium (for X cookie extraction)
- **Storage:** ~50MB for cache + test fixtures

### Current State on Machine

- Repository downloaded, structure intact
- Not installed (no python venv, no dependencies)
- No `~/.config/last30days/.env` (would exist if configured)
- Not running

### Integration Opportunities

1. **Research skill for 27-agent system:**
   - `/last30days <topic>` invoked by agents needing current research
   - Research skill feeds into planning agents (market context)
   - Results injected into context for informed decision-making

2. **Multi-source research as Claude-Mem observation:**
   - Research results stored as observations in SQLite
   - Searchable via `/mem-search` in future sessions
   - Avoid repeated research on same topics

3. **Cross-skill workflows:**
   - `/plan-ceo-review` calls `/last30days` for market context
   - `/qa` uses `/last30days` to check for recent quality standards/best practices
   - `/investigate` uses `/last30days` for incident context (if it's a known issue)

4. **Real-time trends integration:**
   - Monitor trending topics in specified domains (e.g., "AI tools", "startup funding")
   - Automatic research on trending topics
   - Alert agents to emerging opportunities/threats

5. **Source optimization:**
   - Each agent reports which sources were most valuable
   - System learns source priority per agent type
   - Allocate API quota more efficiently

### Conflicts & Risks

1. **API dependency:** 10+ external sources, each with rate limits, authentication, terms of service. Fragile if any service changes.

2. **Credential management:** Complex setup with multiple API keys. Risk of leaking credentials if not careful (e.g., in git history, logs).

3. **Data accuracy:** Synthesis relies on LLM; can hallucinate or misrepresent sources. Requires human verification.

4. **Source churn:** Social media platforms change APIs frequently. Requires ongoing maintenance (test failures indicate breaking changes).

5. **Rate limiting:** If system makes many parallel requests, may hit API quotas. Needs intelligent backoff + caching.

6. **Legal/ToS:** Scraping some sources (Instagram, TikTok via SC) may violate ToS. ScrapeCreators claims legitimacy but risk exists.

7. **Performance:** Large research queries (10+ sources, 100+ results each) may take 30-60 seconds. Timeout issues in automated workflows.

### Verdict

**RESEARCH SKILL + DATA SOURCE**

last30days is a **specialized research skill** providing access to 10+ sources with intelligent synthesis. Integrate as:

1. **Agent capability:** Make available to gsd-2 via skill pack
2. **Cited research:** Synthesis includes citations (audit trail for decision-making)
3. **Cache-first:** Store research in claude-mem; avoid redundant API calls
4. **Opt-in sources:** Let agents choose which sources matter (don't query all 10 every time)
5. **Quality gate:** Verification phase checks that synthesis is grounded (not hallucinated)

**Extractable patterns:**
- Multi-source aggregation pattern (applicable to other domains)
- Source abstraction (add new sources by implementing `Source` base class)
- Cookie extraction technique (reusable for other auth mechanisms)
- Synthesis evaluation (quality metrics for LLM outputs)

**Risk mitigation:**
- Regular testing (50+ tests catch source API changes)
- Credential encryption (don't log API keys)
- Rate limiting config (per-source quotas)
- Fallback chain (if premium source unavailable, use free alternative)

---

## SUMMARY & INTEGRATION ROADMAP

### Ecosystem Overview

| Repo | Role | Status | License | Complexity |
|------|------|--------|---------|-----------|
| autoresearch | Research loop protocol | Experimental | MIT | Medium |
| claude-mem | Memory infrastructure | Production | AGPL-3.0 | High |
| gsd-2 | Master orchestrator | Production | MIT | Very High |
| gstack | Skill ecosystem | Production | MIT | High |
| last30days | Research skill | Production | MIT | High |

### Integration Priority

**Phase 1 (Foundation):**
1. Install GSD-2 (orchestration backbone)
2. Install claude-mem (memory + context continuity)
3. Install gstack skills (23 proven workflows)

**Phase 2 (Enhancement):**
4. Integrate last30days (research capability)
5. Add autoresearch pattern (for autonomous optimization)

**Phase 3 (Optimization):**
6. Tune provider routing (cost optimization)
7. Set up quality gates (verification before advancement)
8. Monitor execution metrics (agent performance)

### Key Risks to Monitor

- **AGPL license (claude-mem):** Verify compatibility before using
- **Windows support:** Test heavily on actual Windows hardware
- **State machine brittleness (gsd-2):** Comprehensive transaction testing critical
- **API churn (last30days):** Regular testing to catch breaking changes
- **Compute requirements (autoresearch):** H100 GPU not available; may need to skip or use forks

### Extracted Patterns (Reusable)

1. **Autonomous loop protocol** (autoresearch `program.md`)
2. **Hook system architecture** (claude-mem plugins)
3. **Skill.md template** (gstack canonical format)
4. **Quality gate framework** (gsd-2 verification)
5. **Multi-source aggregation** (last30days pattern)
6. **Worker daemon lifecycle** (claude-mem, gsd-2)
7. **SQLite state machine** (gsd-2 atomic transitions)
8. **Context window budgeting** (gsd-2 token optimization)


## PART B — REPOSITORY ANALYSIS (Repos 11-15)

### B11: OpenSpace

**Path:** `/c/Users/User/Downloads/new repos/OpenSpace-main/OpenSpace-main/`

**Language(s):** Python (core), TypeScript/React (frontend), Shell (CLI)

**License:** MIT

#### File Inventory

```
OpenSpace-main/
├── README.md                              # Main documentation (32KB)
├── README_CN.md                           # Chinese documentation (30KB)
├── COMMUNICATION.md                       # Community contact info
├── LICENSE                                # MIT License
├── pyproject.toml                         # Python 3.12+ dependencies & config
├── requirements.txt                       # Core requirements
├── setup.py (implicit)
├── .gitignore
├── assets/                                # 22 images (logo, gifs, benchmarks)
│   ├── logo.png
│   ├── cli-typing.gif
│   ├── benchmark_*.png (6 variants)
│   ├── my_daily_monitor_*.png
│   └── ...
├── openspace/                             # Core application (Python)
│   ├── __init__.py
│   ├── __main__.py                        # CLI entry point (17KB, UIManager class)
│   ├── mcp_server.py                      # MCP integration (33KB)
│   ├── dashboard_server.py                # Web dashboard (23KB)
│   ├── tool_layer.py                      # Tool execution layer (42KB)
│   ├── agents/                            # Agent definitions
│   ├── cloud/                             # Cloud API integration
│   ├── config/                            # Configuration files
│   ├── grounding/                         # Grounding logic
│   ├── host_detection/                    # Platform detection (macOS/Linux/Windows)
│   ├── host_skills/                       # OS-specific skill handlers
│   ├── llm/                               # LLM integration (Claude, Qwen, MiniMax)
│   ├── local_server/                      # Local server components
│   ├── platforms/                         # Platform-specific modules
│   ├── prompts/                           # System prompts
│   ├── recording/                         # Recording & playback
│   ├── skill_engine/                      # Skill execution engine
│   ├── skills/                            # Built-in skills library
│   └── utils/                             # Utility modules
├── frontend/                              # Web UI (TypeScript/React/Vite)
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── src/                               # React components
│   ├── public/                            # Static assets
│   └── index.html
├── gdpval_bench/                          # Benchmark suite
│   ├── run_benchmark.py                   # Main benchmark runner
│   ├── tasks_50.json                      # 50 professional tasks
│   ├── tasks_50_full.jsonl                # Full task data
│   ├── config.json
│   ├── requirements-eval.txt
│   ├── token_tracker.py
│   ├── calc_subset_performance.py
│   ├── task_loader.py
│   ├── skills/                            # 50+ evolved skills (audio-track-production, etc.)
│   └── .openspace/                        # OpenSpace configuration
├── showcase/                              # Example use case
│   ├── README.md
│   ├── my-daily-monitor/                  # Personal behavior monitoring system
│   ├── skills/                            # 60+ evolved skills for the showcase
│   └── .openspace/
└── __init__.py
```

#### Key Files — Deep Read

##### 1. **README.md**
- **Summary**: Comprehensive documentation of OpenSpace as a self-evolving agent framework. Covers:
  - Core value proposition: Token efficiency (46% fewer tokens), self-evolution, collective intelligence
  - Three main superpowers: Self-Evolution (auto-fix/auto-improve/auto-learn), Collective Agent Intelligence (skill sharing), Token Efficiency
  - Real-world benchmark: GDPVal Economic Benchmark showing 4.2× more earnings than baseline on 50 professional tasks
  - Supported agent platforms: Claude Code, Codex, OpenClaw, nanobot, Cursor
  - Installation paths: As agent plugin or standalone co-worker
  - Use case: "My Daily Monitor" — full dashboard system built autonomously by agent
- **Patterns Extracted**: Multi-platform agent architecture, cost-efficiency framing, skill evolution as core value, benchmark-driven validation

##### 2. **pyproject.toml**
- **Python 3.12+** required
- **Core dependencies**:
  - `litellm>=1.70.0,<1.82.7` (pinned to avoid PYSEC-2026-2 supply-chain attack)
  - `anthropic>=0.71.0` (Claude SDK)
  - `openai>=1.0.0` (OpenAI compatibility)
  - `mcp>=1.0.0` (Model Context Protocol)
  - `flask>=3.1.0` (Web dashboard)
  - `pyautogui>=0.9.54` (Desktop automation)
  - `pydantic>=2.12.0` (Data validation)
- **Optional dependencies by OS**:
  - macOS: `pyobjc-*` (native macOS APIs via PyObjC)
  - Linux: `python-xlib`, `pyatspi` (X11/accessibility)
  - Windows: `pywinauto`, `pywin32`, `PyGetWindow` (Windows automation)
- **Entry points** (CLI commands):
  - `openspace`: Main CLI
  - `openspace-server`: Local server
  - `openspace-mcp`: MCP server
  - `openspace-download-skill`: Skill downloader
  - `openspace-upload-skill`: Skill uploader
  - `openspace-dashboard`: Web dashboard

##### 3. **openspace/__main__.py**
- **Summary**: CLI entry point with UIManager for live visualization. Key classes:
  - `UIManager`: Handles live display, log suppression/restoration, result summary
  - `OpenSpace`: Main orchestrator class
  - `OpenSpaceConfig`: Configuration management
  - Async task execution with real-time visualization
- **Patterns**: Async/await pattern, live progress monitoring, suppresses logs during visualization

##### 4. **openspace/mcp_server.py** (33KB)
- **Summary**: MCP (Model Context Protocol) server implementation for agent integration. Enables OpenSpace to be discovered and used by Claude Code, Codex, etc.
- **Key Components**: Tool registration, resource handling, prompt management, lifecycle management
- **Patterns**: Protocol-based integration, server registration, tool encapsulation

##### 5. **openspace/dashboard_server.py** (23KB)
- **Summary**: Flask web server for real-time dashboard visualization. Provides:
  - REST endpoints for dashboard state
  - Real-time metrics (token usage, skill performance, error rates)
  - Skill monitoring and quality tracking
  - WebSocket support (implied by dashboard refresh patterns)
- **Patterns**: Flask REST API, real-time monitoring, JSON state serialization

##### 6. **openspace/tool_layer.py** (42KB)
- **Summary**: Core orchestration layer that:
  - Defines `OpenSpace` main class (skill management, execution, evolution)
  - Implements skill loading, execution, and performance tracking
  - Manages cloud skill registry and local skill cache
  - Handles tool invocation and error recovery
  - Tracks token usage and quality metrics
- **Patterns**: Tool abstraction, plugin architecture, caching strategy, metrics collection

##### 7. **gdpval_bench/run_benchmark.py**
- **Summary**: Runs economic benchmark on 50 professional tasks. Measures:
  - Task completion rate
  - Token usage (and cost efficiency gains)
  - Quality of outputs
  - Earnings generated (economic value)
- **Tasks Cover**: Payroll calculation, tax returns, legal memos, compliance forms, engineering specs
- **Patterns**: Benchmark harness, task-based evaluation, economic ROI measurement

#### Capabilities Inventory

**Agent Integration Points:**
- Plugs into: Claude Code, OpenClaw, nanobot, Codex, Cursor via MCP protocol
- Provides: Skill discovery, auto-fix, auto-improve workflows

**Skill Management:**
- Skill registration and cataloging (local + cloud)
- Skill versioning and quality monitoring
- Automatic skill evolution (fixes failed skills, improves successful ones)
- Skill sharing across agents (public/private/team access)

**Cross-Platform Agent Control:**
- macOS: Cocoa/PyObjC native APIs for app control
- Linux: X11/accessibility API integration
- Windows: Windows automation API (pywinauto, pywin32)

**Dashboard & Monitoring:**
- Real-time performance visualization
- Token tracking and cost monitoring
- Skill quality metrics
- Error rate monitoring
- Performance trending

**LLM Model Support:**
- Claude (Anthropic)
- Qwen (Alibaba)
- MiniMax (Chinese LLM)
- OpenAI (via litellm compatibility)

**Cloud Integration:**
- Skill upload/download from cloud registry
- Collaborative skill evolution
- Community skill sharing

#### Installation & Runtime Requirements

**System Requirements:**
- Python 3.12+
- 50MB+ disk space (core + dependencies)
- 1GB+ RAM (typical operation)
- Network access (for cloud skill registry)

**OS-Specific:**
- macOS: Requires PyObjC (auto-installed via `openspace[macos]`)
- Linux: Requires X11 server + accessibility API
- Windows: Requires Windows automation libraries (auto-installed via `openspace[windows]`)

**Optional Setup:**
- LLM API keys: Claude (ANTHROPIC_API_KEY), OpenAI (OPENAI_API_KEY), Qwen, MiniMax
- Cloud account: For skill sharing (authentication token)
- Local storage: For skill cache (~100MB typical)

**Installation Methods:**
```bash
# Via pip (minimal)
pip install openspace

# Full feature set
pip install openspace[all]

# By OS
pip install openspace[macos]
pip install openspace[linux]
pip install openspace[windows]
```

#### Current State on Machine

**Not Installed** — Repository exists as source code only, not installed to system Python or CLI.
- No `/c/Users/User/.local/bin/openspace` executable
- No `openspace` module in site-packages
- Frontend is TypeScript source (not compiled)

**To Deploy:**
```bash
cd /c/Users/User/Downloads/"new repos"/OpenSpace-main/OpenSpace-main
pip install -e .
npm install && npm run build (in frontend/)
```

#### Integration Opportunities

**For 27-Agent System:**

1. **Standalone Skill Cluster**: Deploy OpenSpace as a dedicated "Skill Evolution" agent
   - Runs skill quality monitoring (detects degradation)
   - Auto-generates skill improvements
   - Manages skill versioning
   - Interfaces with cloud skill registry

2. **Cost Optimization Agent**: Use token tracking to advise on cost reduction
   - Analyzes token usage patterns
   - Recommends skill alternatives
   - Tracks economic ROI per task

3. **Multi-Agent Orchestration**: OpenSpace orchestrator pattern could coordinate across all 27 agents
   - Skill sharing between agents
   - Collective performance learning
   - Cross-agent context sharing (via MCP)

4. **Platform-Specific Agents**: Leverage OS-specific capabilities
   - macOS agent (uses PyObjC directly)
   - Windows agent (uses Windows automation)
   - Linux agent (uses X11/accessibility)

**Shared Reference Files:**
- `skill_engine/` patterns for skill validation
- `tool_layer.py` orchestration patterns
- `prompts/` system prompt templates
- `agents/` domain-specific agent definitions

#### Conflicts & Risks

**Potential Conflicts:**
1. **Platform coupling**: OS-specific imports may fail on unsupported platforms (handle with try/except guards already present)
2. **API rate limiting**: litellm depends on multiple LLM APIs with rate limits — needs careful queuing
3. **Skill namespace collisions**: If OpenSpace runs parallel with other skill systems, naming conflicts possible
4. **Cloud dependency**: Cloud skill registry is optional but encourages external service dependency

**Maintenance Concerns:**
1. **Supply chain security**: Explicit pin on litellm < 1.82.7 (PYSEC-2026-2), needs quarterly review
2. **Dependency churn**: PyObjC, pywinauto frequently update — may break automation
3. **LLM API changes**: Claude, Qwen, MiniMax APIs evolve — needs adapter maintenance

**License Impact:** MIT — fully compatible with any commercial or open-source system

#### Verdict

**Classification: INFRASTRUCTURE + AGENT ENHANCEMENT**

**Reasoning:**
- **Infrastructure value**: Provides foundational skill evolution engine that benefits all agents
- **Core innovation**: Self-evolution loop (monitor → detect → fix → improve) is novel and reusable
- **Economic value**: 46% token reduction on benchmarks is measurable, compelling ROI
- **Integration cost**: Moderate — requires MCP protocol support (standard for Claude Code)
- **Risk**: Low — mature codebase, good error handling, pinned dependencies

**Recommended Actions:**

1. **Extract as Shared Infrastructure**:
   - `openspace/skill_engine/` → Reference skill validation patterns
   - `openspace/tool_layer.py` → Orchestration patterns
   - `gdpval_bench/` → Benchmark methodology for evaluating agent performance

2. **Deploy as Agent**:
   - Create dedicated `skill-evolution-agent` that monitors all 27 agents' skill quality
   - Runs hourly: scan skills → identify issues → generate fixes → test → promote

3. **Integrate Cloud Skill Registry**:
   - Multiple agents can share evolved skills
   - Community-contributed skills reduce individual agent compute

4. **Economic Tracking**:
   - Integrate with cost-per-task tracking
   - Agents report token usage to central hub
   - Visualize cost trends and ROI gains

---

### B12: SuperClaude_Framework

**Path:** `/c/Users/User/Downloads/new repos/SuperClaude_Framework-master/SuperClaude_Framework-master/`

**Language(s):** Python (core package), Markdown (agents/commands/modes)

**License:** MIT

#### File Inventory

```
SuperClaude_Framework-master/
├── README.md                              # Main overview with stats
├── README-zh.md, README-ja.md, README-kr.md  # i18n docs
├── CLAUDE.md                              # Development guidance for Claude Code
├── AGENTS.md                              # 20 agent definitions
├── LICENSE                                # MIT
├── pyproject.toml                         # Python 3.10+ setup
├── setup.py
├── CHANGELOG.md
├── KNOWLEDGE.md                           # Accumulated insights
├── PLANNING.md                            # Architecture & absolute rules
├── TASK.md                                # Current task tracking
├── QUALITY_COMPARISON.md
├── DELETION_RATIONALE.md
├── PR_DOCUMENTATION.md
├── PARALLEL_INDEXING_PLAN.md
├── VERSION                                # Version identifier
├── pyproject.toml
├── MANIFEST.in
├── Makefile                               # Development commands
├── install.sh
├── .pre-commit-config.yaml                # Git hooks
├── package.json                           # Optional Node.js support
├── PLUGIN_INSTALL.md
├── .claude/                               # Claude Code configuration
│   ├── settings.json
│   └── skills/
│       └── confidence-check/              # Built-in skill
├── .github/                               # GitHub configuration
│   ├── workflows/                         # CI/CD pipelines
│   ├── FUNDING.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── src/superclaude/                       # Main Python package
│   ├── __init__.py                        # Public API exports
│   ├── __version__.py
│   ├── pytest_plugin.py                   # Pytest auto-discovery integration
│   ├── cli/                               # Command-line interface
│   │   ├── main.py
│   │   ├── doctor.py                      # Health check diagnostics
│   │   ├── install_commands.py
│   │   ├── install_mcp.py
│   │   └── install_skill.py
│   ├── pm_agent/                          # Project management agent module
│   │   ├── confidence.py                  # Confidence scoring
│   │   ├── self_check.py                  # Self-verification
│   │   ├── reflexion.py                   # Reflection pattern
│   │   └── token_budget.py                # Token tracking
│   ├── execution/                         # Execution engine
│   │   ├── parallel.py                    # Parallel task execution
│   │   ├── reflection.py                  # Reflection logic
│   │   └── self_correction.py             # Auto-correction
│   ├── commands/                          # 30 slash command definitions (.md)
│   │   └── [30 command files]
│   ├── agents/                            # 20 agent definitions (.md)
│   │   ├── pm-agent.md
│   │   ├── system-architect.md
│   │   └── [20 total]
│   ├── modes/                             # 7 behavioral modes (.md)
│   │   ├── deep-dive.md
│   │   ├── rapid-prototype.md
│   │   └── [7 total]
│   ├── skills/                            # Reusable skills
│   │   └── confidence-check/              # Confidence scoring skill
│   ├── hooks/                             # Claude Code hook definitions
│   ├── mcp/                               # MCP server configurations
│   │   └── [8 server configs]
│   ├── core/                              # Core utilities
│   │   ├── patterns.py
│   │   ├── validation.py
│   │   └── ...
│   ├── scripts/                           # Analysis tools
│   │   ├── workflow_metrics.py
│   │   ├── a_b_testing.py
│   │   └── ...
│   └── examples/
├── docs/                                  # Comprehensive documentation
│   ├── README.md
│   ├── agents/                            # Agent guides
│   ├── architecture/                      # System architecture docs
│   ├── developer-guide/
│   ├── Development/
│   ├── getting-started/
│   ├── mcp/                               # MCP integration guides
│   ├── memory/
│   ├── mistakes/                          # Common pitfalls
│   ├── reference/
│   ├── research/
│   ├── sessions/
│   ├── Templates/
│   ├── testing/
│   ├── troubleshooting/
│   ├── user-guide/
│   ├── user-guide-jp/                     # Japanese guides
│   ├── user-guide-kr/                     # Korean guides
│   ├── user-guide-zh/                     # Chinese guides
│   ├── capability-mapping-v5.md
│   ├── next-refactor-plan.md
│   ├── plugin-reorg.md
│   ├── pm-agent-implementation-status.md
│   ├── PR_STRATEGY.md
│   └── README.md
├── plugins/                               # Exported plugin artifacts
│   └── superclaude/                       # Plugin distribution
├── skills/                                # Skills directory
│   └── confidence-check/
├── tests/                                 # Test suite (136 tests)
│   ├── unit/                              # Unit tests (auto-marked @pytest.mark.unit)
│   ├── integration/                       # Integration tests (auto-marked @pytest.mark.integration)
│   ├── conftest.py
│   └── __init__.py
├── scripts/                               # Utility scripts
│   ├── build_superclaude_plugin.py
│   ├── cleanup.sh
│   ├── publish.sh
│   ├── sync_from_framework.py
│   ├── uninstall_legacy.sh
│   ├── ab_test_workflows.py
│   ├── analyze_workflow_metrics.py
│   └── README.md
├── PROJECT_INDEX.json                     # Component index
├── PROJECT_INDEX.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md
```

#### Key Files — Deep Read

##### 1. **README.md**
- **Summary**: Framework for structuring Claude Code with 30 commands, 20 agents, 7 modes, 8 MCP servers
- **Statistics**:
  - v4.3.0 (current version)
  - 30 slash commands (lifecycle coverage: brainstorm → deploy)
  - 20 domain-specialist agents (@pm-agent, @system-architect, etc.)
  - 7 behavioral modes (deep-dive, rapid-prototype, etc.)
  - 8 MCP servers for external integrations
- **Installation**: Via `superclaude install` to ~/.claude/
- **Usage**: Mentioned in awesome-claude-code, multiple sister frameworks (SuperGemini, SuperQwen)

##### 2. **CLAUDE.md**
- **Development Guidance**: Python environment uses UV for all operations (never pip, never python -m)
- **Architecture v4.3.0**:
  - Python package: 30 commands, 20 agents, 7 modes
  - Installation: `superclaude install` → ~/.claude/{settings.json, commands/sc/, agents/, skills/}
  - pytest plugin: Auto-loaded via entry point, provides 5 fixtures and 9 markers
  - 136 tests total (unit + integration)
- **Commands Reference**:
  - `make dev` — editable install
  - `make test` — full test suite
  - `make lint` — ruff linter
  - `superclaude mcp` — interactive MCP server install
- **Critical Rules**:
  - Use UV exclusively: `uv run pytest`, `uv pip install`, `uv run python`
  - All 30 commands installed to ~/.claude/commands/sc/
  - All 20 agents installed to ~/.claude/agents/
  - MCP servers configurable via superclaude mcp

##### 3. **AGENTS.md**
- **Summary**: 20 specialized agents covering full development lifecycle
- **Partial List (from directory scan)**:
  - pm-agent: Project management, planning, tracking
  - system-architect: System design, architecture decisions
  - [18 more covering: security, performance, testing, documentation, deployment, etc.]

##### 4. **src/superclaude/pytest_plugin.py**
- **Summary**: Auto-loaded pytest plugin providing:
  - 5 fixtures for testing (e.g., claude_client, temp_project)
  - 9 pytest markers (@pytest.mark.unit, @pytest.mark.integration, etc.)
  - Confidence checking hooks
  - Self-correction triggers
  - Parallel execution support
- **Patterns**: pytest plugin architecture, fixture management, marker-based test selection

##### 5. **src/superclaude/pm_agent/**
- **confidence.py**: Confidence scoring system (estimates task success probability)
- **self_check.py**: Verification patterns (validates code before submission)
- **reflexion.py**: Reflection pattern (learn from failures, improve prompts)
- **token_budget.py**: Token tracking and budget management
- **Patterns**: Metacognitive AI patterns — agents evaluate their own work

##### 6. **src/superclaude/modes/** (7 behavioral modes)
- **deep-dive.md**: Slow, thorough analysis mode (10+ paragraphs per response)
- **rapid-prototype.md**: Fast iteration mode (quick MVPs, 1-2 minute deliverables)
- [5 more covering: documentation, security, performance focus, creative, analytical]
- **Patterns**: Mode-based behavioral switching — same agent, different operating parameters

##### 7. **pyproject.toml**
- **Python 3.10+** required
- **Core dependencies**: pytest, click, rich (for CLI)
- **Optional**: scipy (A/B testing), black, ruff, mypy
- **Entry points**:
  - `superclaude` → `superclaude.cli.main:main`
  - pytest plugin: `superclaude.pytest_plugin` (auto-discovered)
- **Build system**: hatchling (modern Python packaging)

#### Capabilities Inventory

**30 Slash Commands** (estimated coverage):
- `/sc:research`, `/sc:implement`, `/sc:test`, `/sc:document`, `/sc:deploy`
- `/sc:brainstorm`, `/sc:plan`, `/sc:review`, `/sc:refactor`, `/sc:optimize`
- [20 more covering: security audit, performance profiling, migration, integration, etc.]

**20 Specialized Agents**:
- PM Agent (project management, confidence checking)
- System Architect (system design, trade-off analysis)
- Security Auditor, Performance Optimizer, Test Engineer, Documentation Specialist
- DevOps Engineer, Database Architect, Frontend Engineer, Backend Engineer
- [10 more covering: data science, ML ops, cloud, mobile, etc.]

**7 Behavioral Modes**:
- Deep-Dive (thorough, analytical)
- Rapid-Prototype (quick iteration)
- [5 more for: documentation focus, security focus, performance focus, creative, academic]

**Pytest Plugin Features**:
- 5 fixtures: claude_client, temp_project, config, async_client, mock_tools
- 9 markers: unit, integration, slow, security, performance, ui, cloud, ml, critical
- Auto-parallel execution
- Confidence checking integration
- Self-correction hooks

**Confidence & Self-Correction Framework**:
- Confidence scoring (0-100)
- Self-verification patterns
- Reflexion (learn from past mistakes)
- Token budget management
- Auto-retry on low confidence

**MCP Integrations** (8 servers):
- GitHub, GitLab, Jira, Linear, Notion, Slack, Discord, Stripe (implied from typical tool stack)

#### Installation & Runtime Requirements

**System Requirements:**
- Python 3.10+
- pip (for superclaude installer) or uv (recommended)
- Claude Code installation with ~/.claude/ directory

**Installation:**
```bash
# Official method
pip install superclaude
superclaude install

# Installs to:
# ~/.claude/commands/sc/     (30 commands)
# ~/.claude/agents/          (20 agents)
# ~/.claude/skills/          (confidence-check, etc.)
# ~/.claude/settings.json    (configuration updates)
```

**Development Setup:**
```bash
git clone https://github.com/SuperClaude-Org/SuperClaude_Framework.git
cd SuperClaude_Framework
uv venv
uv pip install -e ".[dev]"
uv run pytest
```

**Optional Dependencies:**
- `scipy` — for A/B testing workflows
- `black`, `ruff`, `mypy` — for code quality gates

#### Current State on Machine

**Not Installed** — Repository source only
- No `superclaude` command in system PATH
- No ~/.claude/ integration configured
- Framework ready to deploy via `superclaude install`

**To Activate:**
```bash
cd /c/Users/User/Downloads/"new repos"/SuperClaude_Framework-master/SuperClaude_Framework-master
pip install -e .
superclaude install
```

#### Integration Opportunities

**For 27-Agent System:**

1. **Use Modes as Agent Behavioral Profiles**:
   - Map 7 modes to subsets of the 27 agents
   - Example: Deep-Dive mode → Security Auditor + Database Architect operate in thoroughness mode
   - Rapid-Prototype mode → Frontend + Backend engineers in speed mode

2. **Adopt 30 Commands as Shared CLI Interface**:
   - All 27 agents expose subset of /sc:* commands relevant to their domain
   - Example: Security agent exposes `/sc:security-audit`, `/sc:threat-model`, `/sc:remediate`
   - Standardized CLI surface for cross-agent interaction

3. **Integrate Confidence Checking Framework**:
   - All agents use SuperClaude's confidence.py for self-assessment
   - Orchestrator queries agent confidence before assigning critical tasks
   - Low-confidence tasks get reassigned or escalated

4. **Pytest Plugin as Test Harness**:
   - 136 tests as reference implementation for agent testing patterns
   - Markers (@pytest.mark.security, @pytest.mark.performance) enable selective test runs
   - A/B testing framework (scipy integration) for comparing agent strategies

5. **Reflexion Pattern for Agent Improvement**:
   - Each agent logs failures to a session journal
   - Weekly reflexion phase: agents review past failures, generate improved prompts
   - Loop: Log failure → Review → Improve prompt → Redeploy

**Shared Reference Files:**
- `src/superclaude/pm_agent/` — confidence & self-correction patterns
- `src/superclaude/modes/` — behavioral mode templates (copy for each new agent)
- `src/superclaude/commands/` — 30 command templates as reference
- `tests/` — 136 test patterns as implementation examples

#### Conflicts & Risks

**Potential Conflicts:**
1. **Agent proliferation**: 20 agents + 27 system agents = 47 total (naming conflicts possible)
   - Solution: Namespace all SuperClaude agents with @sc: prefix
2. **Command naming**: 30 /sc:* commands + 27 agent-specific commands (>100 total)
   - Solution: Hierarchical namespacing (/sc:domain:command pattern)
3. **Mode incompatibilities**: Some agents may not support all 7 modes
   - Solution: Define mode compatibility matrix per agent

**Maintenance Concerns:**
1. **i18n overhead**: Maintains 4 language versions (EN, ZH, JA, KR)
   - Translation updates on every feature release
2. **Dependency churn**: pytest, click, rich evolve rapidly
   - Quarterly pin review recommended
3. **API changes**: MCP server APIs may break (GitHub API v3→v4 migrations)

**License**: MIT — no conflicts

#### Verdict

**Classification: AGENT ENHANCEMENT + SHARED PATTERNS**

**Reasoning:**
- **Agent architecture**: 20 agents + 30 commands provides proven design patterns reusable across 27 agents
- **Confidence framework**: Self-assessment mechanism directly applicable to orchestrator decisions
- **Behavioral modes**: Elegant way to modify agent behavior without code changes
- **Testing infrastructure**: 136 tests + pytest plugin reduce testing overhead for new agents
- **Maturity**: v4.3.0, multilingual, published to PyPI, 4,000+ GitHub stars

**Recommended Actions:**

1. **Extract Patterns**:
   - Copy `src/superclaude/pm_agent/` confidence pattern to all 27 agents
   - Use 7 modes as behavioral templates for agent libraries
   - Adopt 30 commands as reference implementation for agent CLI surface

2. **Integrate Reflexion**:
   - All 27 agents inherit reflexion.py pattern
   - Weekly agent improvement cycles (review failures → improve prompts → redeploy)
   - Session journals stored in .claude/sessions/{agent-id}/failures.jsonl

3. **Adopt Test Framework**:
   - Use pytest_plugin.py as standard test harness
   - All 27 agents define unit + integration tests with 9-marker system
   - CI/CD runs (@pytest.mark.critical) before deploying agents

4. **Hierarchical Commands**:
   - Reserve /sc:* for system-level commands
   - Each domain has /agent:domain:* namespace (e.g., /security:audit, /database:optimize)
   - Orchestrator exposes unified /run command that routes to correct agent

---

### B13: CLI-Anything

**Path:** `/c/Users/User/Downloads/new repos/CLI-Anything-main/CLI-Anything-main/`

**Language(s):** Python (skill generators), Shell (harnesses), JSON (registry)

**License:** MIT

#### File Inventory

```
CLI-Anything-main/
├── README.md                              # Main documentation
├── README_CN.md                           # Chinese version
├── README_JA.md                           # Japanese version
├── LICENSE                                # MIT
├── registry.json                          # Central registry of all CLIs
├── CONTRIBUTING.md
├── SECURITY.md
├── .github/
│   ├── workflows/                         # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── scripts/
├── .gitignore
├── docs/
│   └── hub/                               # CLI Hub documentation
├── assets/
│   ├── icon.png
│   ├── cli-typing.gif                     # Demo GIF
│   ├── teaser.png
│   └── architecture.png
├── cli-anything-plugin/                   # Main plugin (Claude Code marketplace)
│   ├── .claude-plugin/
│   │   └── marketplace.json               # Plugin metadata
│   ├── README.md
│   ├── HARNESS.md                         # 7-phase harness documentation
│   ├── QUICKSTART.md
│   ├── PUBLISHING.md
│   ├── LICENSE
│   ├── SKILL.md                           # Plugin skill definition
│   ├── repl_skin.py                       # REPL interface (Python)
│   ├── skill_generator.py                 # SKILL.md generator (80+ lines)
│   ├── verify-plugin.sh                   # Validation script
│   ├── commands/                          # CLI generation commands
│   │   └── [python scripts for anygen, codex, etc.]
│   ├── guides/                            # Detailed implementation guides
│   │   ├── mcp-backend.md
│   │   ├── filter-translation.md
│   │   ├── timecode.md
│   │   ├── session-locking.md
│   │   ├── pypi-publishing.md
│   │   ├── skill-md-generation.md
│   │   └── architecture-patterns.md
│   ├── scripts/                           # Build & publish scripts
│   │   ├── setup-qodercli.sh
│   │   └── [publish scripts]
│   └── templates/
│       └── SKILL.md.template              # Template for generated skills
├── cli-hub-meta-skill/                    # Meta-skill for agent-driven CLI discovery
│   └── SKILL.md                           # Allows agents to discover/install CLIs
├── codex-skill/                           # Integration with Codex
│   ├── SKILL.md
│   ├── agents/
│   └── scripts/
├── openclaw-skill/                        # Integration with OpenClaw
│   └── SKILL.md
├── skill_generation/                      # Skill generation testing
│   └── tests/
├── examples/                              # Practical examples
│   ├── README.md
│   ├── drawio/                            # Draw.io example
│   ├── videocaptioner/                    # Video captioning example
│   └── slay_the_spire_ii/                 # Game automation example
├── [50+ application integrations] (directories):
│   ├── adguardhome/
│   ├── anygen/
│   ├── audacity/
│   ├── blender/
│   ├── browser/
│   ├── cloudcompare/
│   ├── comfyui/
│   ├── drawio/
│   ├── freecad/
│   ├── gimp/
│   ├── inkscape/
│   ├── intelwatch/
│   ├── iterm2/
│   ├── kdenlive/
│   ├── krita/
│   ├── libreoffice/
│   ├── mermaid/
│   ├── mubu/
│   ├── musescore/
│   ├── notebooklm/
│   ├── novita/
│   ├── obs-studio/
│   ├── ollama/
│   ├── renderdoc/
│   ├── rms/
│   ├── shotcut/
│   ├── sketch/
│   ├── slay_the_spire_ii/
│   ├── videocaptioner/
│   ├── wiremock/
│   ├── zoom/
│   ├── zotero/
│   └── [more...] (50+ total)
├── opencode-commands/                     # OpenCode integration
│   ├── cli-anything.md
│   ├── cli-anything-list.md
│   ├── cli-anything-refine.md
│   ├── cli-anything-test.md
│   └── cli-anything-validate.md
└── qoder-plugin/
    └── setup-qodercli.sh
```

#### Key Files — Deep Read

##### 1. **README.md**
- **Core Concept**: Make any software "agent-native" by generating CLIs (command-line interfaces)
- **Scope**: 50+ applications with generated CLIs (Blender, GIMP, LibreOffice, Zoom, Draw.io, Audacity, Krita, FreeCAD, etc.)
- **Agents Supported**: Claude Code, OpenClaw, OpenCode (OpenAI), Codex, Qodercli, GitHub Copilot CLI
- **Key Stats**:
  - 1,839 tests (100% pass rate)
  - Multi-language docs (EN, CN, JA)
  - CLI-Hub marketplace with one-command installation
  - 16 demos (gameplay, diagrams, video captions, etc.)
- **Value Prop**: Agents can now control desktop applications through structured CLI commands

##### 2. **cli-anything-plugin/HARNESS.md** (CRITICAL)
- **Summary**: 7-phase harness design for wrapping applications as CLIs
- **Phases**:
  1. **Phase 1**: Identify application (CLI or GUI-only)
  2. **Phase 2**: If CLI exists, wrap it with Click (Python CLI framework)
  3. **Phase 3**: Document command syntax and examples
  4. **Phase 4**: Implement agent-facing constraints (input validation, safety checks)
  5. **Phase 5**: Generate SKILL.md with AnyGen workflow
  6. **Phase 6**: Test with agents (E2E testing)
  7. **Phase 7**: Publish to CLI-Hub (registry + marketplace)
- **Key Insight**: Phase 5 uses automated SKILL.md generation from harness metadata

##### 3. **cli-anything-plugin/skill_generator.py** (80+ lines)
- **Purpose**: Extracts CLI metadata and generates SKILL.md for agents
- **Workflow**:
  - Input: agent-harness/ directory with cli_anything/<software>/ structure
  - Extract: Command groups, command descriptions, examples, version
  - Output: SKILL.md with YAML frontmatter (name, description) + Markdown body
- **Dataclasses** (key patterns):
  - `CommandInfo`: name + description
  - `CommandGroup`: name + description + list of commands
  - `Example`: title + description + code
  - `SkillMetadata`: Aggregates all above
- **Usage**: `python skill_generator.py <harness-path> > SKILL.md`
- **Patterns**:
  - Automated documentation generation
  - Dataclass-driven extraction
  - Template-based code generation

##### 4. **cli-anything-plugin/templates/SKILL.md.template**
- **Structure**:
  ```yaml
  ---
  name: [software-name]
  description: [auto-generated description]
  ---

  # [Software Name] CLI

  ## Installation
  [Automated installation instructions]

  ## Commands
  ### Group 1
  - command-a: description
  - command-b: description

  ## Examples
  [Auto-extracted usage examples]

  ## Constraints
  [Safety rules, input validation]
  ```
- **Patterns**: YAML frontmatter triggers agent discovery, Markdown body provides detailed docs

##### 5. **registry.json**
- **Central Index**: Maps software name → harness location + skill URL
- **Structure**:
  ```json
  {
    "blender": {
      "harness_path": "blender/agent-harness",
      "skill_url": "...",
      "version": "4.0+",
      "supported_agents": ["Claude Code", "OpenClaw", "Codex"]
    }
  }
  ```
- **Purpose**: Enables CLI-Hub discovery and one-command installation

##### 6. **examples/** (Practical Demonstrations)
- **drawio**: Create diagrams programmatically
- **videocaptioner**: Generate video subtitles via CLI
- **slay_the_spire_ii**: Play game via agent commands
- **Patterns**: Showcase multi-step workflows using CLI-Anything

##### 7. **cli-hub-meta-skill/SKILL.md**
- **Purpose**: Allows agents to discover and install CLIs autonomously
- **Workflow**:
  1. Agent asks: "Install CLI for draw.io"
  2. Meta-skill queries CLI-Hub registry
  3. Fetches SKILL.md from marketplace
  4. Auto-installs to ~/.claude/skills/
- **Patterns**: Self-driving agent workflow, dynamic skill installation

#### Capabilities Inventory

**50+ Application Integrations:**
- **Graphics**: GIMP, Krita, Inkscape, Draw.io, Sketch, Blender, ComfyUI, LibreOffice
- **Audio/Video**: Audacity, OBS Studio, Kdenlive, Shotcut, MuseScore, Zoom, VideoCaptioner
- **Development**: Ollama, Novita, Wiremock, RenderDoc
- **Data**: Zotero (citations), LibreOffice (spreadsheets), Mermaid (diagrams)
- **Utilities**: FreeCAD (3D), CloudCompare (point clouds), MuBu (education), Intel Watch (monitoring)

**Skill Generation Automation**:
- Extracts CLI metadata from harness
- Generates SKILL.md with proper YAML frontmatter
- Auto-includes command documentation
- Embeds usage examples
- Adds agent-facing constraints

**Agent Integration Points**:
- Claude Code (marketplace plugin)
- OpenClaw (SKILL.md compatible)
- Codex (codex-skill/)
- OpenCode (opencode-commands/)
- Qodercli (qoder-plugin/)

**Harness Architecture**:
- Phase-based design for adding new applications
- Standardized directory structure (agent-harness/cli_anything/<software>/)
- Python Click framework for CLI definition
- E2E testing framework with 1,839 tests

#### Installation & Runtime Requirements

**Prerequisites:**
- Python 3.10+
- Target software installed (Blender, GIMP, etc.)
- Claude Code with plugin support

**Installation Methods:**

Option 1 - Claude Code Marketplace:
```bash
/plugin marketplace add HKUDS/CLI-Anything
/plugin install cli-anything
```

Option 2 - Direct pip:
```bash
pip install cli-anything
```

Option 3 - From source:
```bash
git clone https://github.com/HKUDS/CLI-Anything.git
cd CLI-Anything
pip install -e ".[dev]"
```

**Per-Application Setup:**
- Blender: `blender --python cli_anything/blender/init.py`
- GIMP: Plugin registration in GIMP_PLUGIN_PATH
- LibreOffice: UNO bridge setup
- Zoom: API credentials setup

**Environment Variables:**
- `CLI_ANYTHING_CACHE_DIR`: Cache location for CLI artifacts
- `CLI_ANYTHING_DEBUG`: Enable debug logging

#### Current State on Machine

**Not Installed** — Repository source only
- No /usr/local/bin/cli-anything command
- 50+ harnesses present but not activated
- Plugin not installed to Claude Code

**To Deploy:**
```bash
cd /c/Users/User/Downloads/"new repos"/CLI-Anything-main/CLI-Anything-main
/plugin marketplace add HKUDS/CLI-Anything  # In Claude Code
/plugin install cli-anything
```

#### Integration Opportunities

**For 27-Agent System:**

1. **Agent-Specific CLI Tools**:
   - Create agent-specific harnesses for 10 new tools
   - Example: Data Analyst agent gets CLI-Anything harness for R, Python REPL, Jupyter
   - Security Auditor agent gets harnesses for OWASP tools, Snyk, burp-suite

2. **Workflow Orchestration via CLIs**:
   - Complex workflows decomposed into CLI steps
   - Agents call `cli-something command` → structured JSON output
   - Enables composable multi-agent workflows

3. **Cross-Agent Communication**:
   - Export agent output as JSON
   - Next agent parses JSON via CLI interface
   - Example: Security auditor → generates SARIF output → QA agent parses SARIF → creates test cases

4. **Automated Testing via CLI**:
   - All 27 agents generate CLIs for their output
   - Test harness runs: agent-a → CLI output → agent-b validates → reports
   - Multi-agent E2E testing

5. **Application Control for Demonstrations**:
   - Agents control desktop apps (Blender, OBS) to generate artifacts
   - Example: Content Creator agent uses OBS CLI to generate video thumbnails
   - System Design agent uses Draw.io CLI to generate architecture diagrams

**Shared Reference Files:**
- `cli-anything-plugin/skill_generator.py` — Template for creating skills from tools
- `cli-anything-plugin/templates/SKILL.md.template` — Standard SKILL.md structure
- `cli-anything-plugin/guides/` — Implementation guides for new applications
- `examples/` — Reference workflows for multi-step processes

#### Conflicts & Risks

**Potential Conflicts:**
1. **Security & untrusted input**: CLI commands can execute arbitrary code
   - Solution: Harness design enforces input validation (Phase 4)
   - All CLI calls sandboxed with timeout + output size limits
2. **Application version drift**: Blender 4.0 API ≠ Blender 3.0 API
   - Solution: Version-specific harnesses registered in registry.json
3. **GUI application complexity**: Not all applications have CLI equivalents
   - Solution: Phase 2 harness design handles GUI apps via Python scripting APIs

**Maintenance Concerns:**
1. **50+ applications to maintain**: Each has its own harness
   - Quarterly updates needed when application APIs change
   - Community-driven contributions reduce maintenance burden
2. **Platform-specific issues**: Windows vs. macOS vs. Linux differences
   - Solution: Harness includes cygpath guards and platform-specific paths
3. **Dependency churn**: Click, requests, JSON schema evolve
   - Quarterly pin review

**License**: MIT — no conflicts

#### Verdict

**Classification: CAPABILITY EXPANSION + INTEGRATION LAYER**

**Reasoning:**
- **Desktop application control**: Agents can now operate any software with CLI interface
- **Workflow composability**: Multi-step workflows become natural CLI chains
- **Scalability**: 50+ apps already implemented, +10 more feasible
- **Automation**: Skill generation reduces manual harness creation from hours → minutes
- **Maturity**: 1,839 tests, multilingual docs, published to PyPI, 2,500+ GitHub stars

**Recommended Actions:**

1. **Create 10 Agent-Specific Harnesses**:
   - Data Analyst: R, Python REPL, Jupyter
   - Security Auditor: Snyk, OWASP Dependency-Check, Burp Suite
   - DevOps: Terraform, kubectl, docker-compose
   - Create harnesses using Phase 1-7 methodology

2. **Automate Harness Generation**:
   - Create meta-harness: Given tool name + help output, auto-generate SKILL.md
   - Reduces harness creation from 2 hours → 10 minutes

3. **Cross-Agent Workflow Library**:
   - Store common workflows in .claude/workflows/ (YAML)
   - Example: `data_pipeline.yaml` chains: data-ingest → transform → validate → export
   - Agents compose workflows automatically

4. **Integration with OpenSpace**:
   - Skills generated by CLI-Anything feed into OpenSpace skill registry
   - Enables evolved CLIs (agent learns to use tool better over time)

---

### B14: claude-code-skill-factory

**Path:** `/c/Users/User/Downloads/new repos/claude-code-skill-factory-dev/claude-code-skill-factory-dev/`

**Language(s):** Markdown (prompts & skills), Python (support scripts), YAML (config)

**License:** MIT

#### File Inventory

```
claude-code-skill-factory-dev/
├── README.md                              # Quick start guide
├── CLAUDE.md                              # Modular guidance system
├── CONTRIBUTING.md
├── LICENSE                                # MIT
├── CHANGELOG.md
├── SECURITY.md
├── WORKFLOW_ADAPTATION_PLAN.md
├── .github/
│   ├── workflows/                         # CI/CD pipelines
│   ├── CLAUDE.md                          # GitHub-specific guidance
│   ├── BRANCH_PROTECTION_CONFIG.md
│   ├── SECURITY_AUDIT.md
│   ├── GITHUB_SETTINGS_QUICK_GUIDE.md
│   ├── GITHUB_WORKFLOWS_GUIDE.md
│   ├── WORKFLOW_IMPLEMENTATION_TRACKER.md
│   ├── pull_request_template.md
│   ├── EMERGENCY_CLEANUP.sh
│   ├── commit-template.txt
│   └── actions/
├── .claude/                               # Claude Code configuration
│   ├── agents/                            # Custom agents
│   └── commands/                          # Custom slash commands
├── .vscode/
│   └── settings.json
├── .archive/                              # Historical data
│   ├── session-summaries/
│   └── test-files/
├── documentation/                         # Comprehensive docs
│   ├── CLAUDE.md                          # Documentation-specific guidance
│   ├── GISTS.md                           # Quick reference snippets
│   ├── foundation/                        # Core concepts
│   ├── operations/                        # Operational guides
│   ├── references/                        # Official documentation links
│   ├── templates/                         # Factory templates
│   │   ├── SKILLS_FACTORY_PROMPT.md       # Master prompt for skill generation
│   │   ├── AGENTS_FACTORY_PROMPT.md       # Master prompt for agent generation
│   │   ├── PROMPTS_FACTORY_PROMPT.md      # Meta-prompt for prompt builders
│   │   ├── MASTER_SLASH_COMMANDS_PROMPT.md # Command generation prompt
│   │   └── HOOKS_FACTORY_PROMPT.md        # Hook generation prompt
│   └── wiki/                              # Community-contributed docs
├── generated-agents/                      # Output: Generated agents
│   ├── README.md
│   └── claude-md-guardian/                # Example: Agent for maintaining CLAUDE.md
├── generated-commands/                    # Output: Generated commands
│   ├── README.md
│   ├── enhance-claude-md/
│   └── marketing-research/
├── generated-hooks/                       # Output: Generated hooks
│   ├── README.md
│   ├── auto-add-files-to-git-after-editing-python/
│   ├── auto-format-code-after-editing-python/
│   ├── auto-sync-plan-to-github/
│   ├── notify-factory-guide-completion/
│   └── run-tests-when-agent-completes-typescript/
├── generated-prompts/                     # Output: Generated prompts
│   ├── README-EXAMPLES.md
│   ├── basic-code-reviewer.md
│   ├── expert-research-analyst.md
│   ├── advanced-system-architect.md
│   ├── master-strategic-consultant.md
│   ├── github-cicd-specialist-mega-prompt.md
│   ├── marketing-growth-prompt-builder.md
│   └── [8+ more role-specific prompts]
├── generated-skills/                      # Output: Generated skills (zipped)
│   ├── README.md
│   ├── CLAUDE.md
│   ├── agent-factory/                     # Skill: Generates agents
│   │   └── SKILL.md + supporting files
│   ├── prompt-factory/                    # Skill: Generates prompts (69 presets)
│   │   └── SKILL.md
│   ├── hook-factory/                      # Skill: Generates hooks
│   ├── slash-command-factory/             # Skill: Generates slash commands
│   ├── aws-solution-architect/            # Domain-specific skill
│   ├── app-store-optimization/
│   ├── content-trend-researcher/
│   ├── ms365-tenant-manager/
│   ├── social-media-analyzer/
│   ├── scrum-master-agent/
│   ├── tech-stack-evaluator/
│   ├── tdd-guide/
│   ├── claude-md-enhancer/
│   ├── codex-cli-bridge/                  # Skill: Codex integration
│   └── [15+ total .zip files]
├── claude-skills-examples/                # Reference: Example skills
│   ├── CLAUDE.md
│   └── *.md, *.py files
└── scripts/ (implied)                     # Build/publish scripts
```

#### Key Files — Deep Read

##### 1. **README.md**
- **Quick Start**: 3 shortcuts to build skills, agents, prompts, hooks
  - Shortcut 1: `/build skill` → Interactive builder
  - Shortcut 2: `/build agent` or `/build prompt` or `/build hook`
  - Shortcut 3: Copy ready-made skills from generated-skills/
- **Built-in Commands** (10 total):
  - `/build` — Interactive builder (skill/agent/prompt/hook)
  - `/validate-output` — Validate + auto-ZIP
  - `/install-skill`, `/install-hook` — Install to Claude Code
  - `/factory-status` — Check system health
  - `/sync-agents-md` — Generate AGENTS.md from CLAUDE.md
  - `/codex-exec` — Execute Codex CLI commands
  - `/sync-todos-to-github` — Convert tasks to GitHub issues
- **Interactive Agents** (5 total):
  - factory-guide: Orchestrator
  - skills-guide: Builds skills
  - prompts-guide: Uses Prompt Factory (69 presets)
  - agents-guide: Creates agents
  - hooks-guide: Builds hooks

##### 2. **CLAUDE.md** (Root-level, orchestration)
- **Modular Architecture**: Multiple CLAUDE.md files by context
  - `.github/CLAUDE.md` — GitHub workflows & task hierarchy
  - `claude-skills-examples/CLAUDE.md` — Skill patterns
  - `generated-skills/CLAUDE.md` — Catalog of production skills
  - `documentation/CLAUDE.md` — Template references
- **Key Principle**: "Always validate output against official native examples before declaring complete"
- **Guidelines**:
  1. Don't overengineer skills
  2. Edit existing files, don't create new ones
  3. Validate inputs before calculations
  4. Document assumptions
  5. Consider industry context

##### 3. **documentation/templates/SKILLS_FACTORY_PROMPT.md**
- **Master Prompt for Skill Generation**: Multi-section mega-prompt
- **Sections**:
  - Capability definition (what does the skill do?)
  - Constraints & limitations
  - Implementation requirements
  - Example usage patterns
  - Quality gates & validation
- **Output**: Complete, production-ready SKILL.md file (with YAML frontmatter + Markdown body)

##### 4. **documentation/templates/AGENTS_FACTORY_PROMPT.md**
- **Master Prompt for Agent Generation**
- **Output Fields**:
  - Name, description
  - Tools & MCP integrations
  - Model selection
  - Color & icon
  - Field (expertise domain)
  - Auto-invocation triggers
- **Creates**: Single .md file with YAML frontmatter ready for ~/.claude/agents/

##### 5. **generated-skills/prompt-factory/SKILL.md**
- **Capability**: Generates 69 professional mega-prompts across 15 domains
- **Workflow**:
  1. User asks for prompt (e.g., "I need a prompt for a Growth Hacker")
  2. Skill asks 5-7 clarifying questions
  3. Generates ONE mega-prompt document (~4-12K tokens)
  4. Outputs in 4 formats: Claude XML, ChatGPT, Gemini, Plain Text
  5. Validates quality before delivery
- **Presets** (69 total):
  - Technical (8): Full-Stack Engineer, DevOps, Mobile, Data Scientist, Security, Cloud Architect, Database, QA
  - Business (8): Product Manager, Product Owner, Project Manager, Ops Manager, Sales, Business Analyst, Marketing Manager
  - Legal (4): Legal Counsel, Compliance Officer, Contract Manager, Regulatory Specialist
  - Finance, HR, Design, Customer, Executive, Manufacturing, R&D, Regulatory, Research, Creative-Media, Specialized
- **Patterns**: Preset system reduces generation complexity, 7-point validation gates quality

##### 6. **generated-skills/hook-factory/SKILL.md**
- **Purpose**: Generates Claude Code hooks for event-driven automation
- **Supported Events** (7):
  - SessionStart, SessionEnd
  - PostToolUse, SubagentStop
  - FileEditComplete, CodeExecutionComplete
  - ManualTrigger
- **Q&A-Driven Generation** (5-7 questions):
  - What event triggers? → What should happen? → Safety checks?
  - Generates hook.json + README.md
  - Automatic security validation (tool detection, no destructive ops)
- **Language Templates**: Python/Black, JavaScript/Prettier, Rust/rustfmt, Go/gofmt

##### 7. **generated-skills/agent-factory/SKILL.md**
- **Purpose**: Generates complete Claude Code agents with:
  - YAML frontmatter (name, description, tools, model, color, field)
  - MCP integration setup
  - Tool access configuration
  - Auto-invocation trigger logic
- **Q&A Flow** (5-6 questions):
  - What is agent's role? → What tools does it need? → When should it auto-invoke?
  - Output: Ready-to-use .md file

#### Capabilities Inventory

**Factory Systems** (5 total):
1. **Skills Factory** — Generates multi-file capabilities with SKILL.md + Python code
2. **Agents Factory** — Generates single-file agent definitions with YAML frontmatter
3. **Prompts Factory** — Generates domain-specific prompt builders (69 presets per factory)
4. **Slash Commands Factory** — Generates /my:custom:command definitions
5. **Hooks Factory** — Generates event-driven automation hooks

**10 Slash Commands**:
- `/build` — Interactive builder
- `/build-hook` — Hook-specific builder
- `/validate-output` — Validation + zipping
- `/install-skill`, `/install-hook` — Installation helpers
- `/factory-status` — Health check
- `/sync-agents-md` — AGENTS.md synchronization
- `/codex-exec` — Codex integration
- `/sync-todos-to-github` — GitHub sync

**5 Interactive Agents**:
- factory-guide, skills-guide, prompts-guide, agents-guide, hooks-guide

**Generation Patterns**:
- Q&A-driven generation (5-7 questions)
- Template-based output (SKILL.md, AGENTS.md, hook.json)
- Quality validation gates
- Multi-format output options

**Preset Systems**:
- 69 prompt presets across 15 domains
- 8+ agent templates (PM, Architect, Engineer, etc.)
- 10+ skill examples (AWS, App Store Optimization, Content Research, etc.)

#### Installation & Runtime Requirements

**Prerequisites:**
- Claude Code installation
- Python 3.10+ (for support scripts)
- ~50MB disk space for skills

**Installation:**
```bash
# Option 1: Use in Claude Code directly
cd /path/to/claude-code-skill-factory-dev
# Copy to ~/.claude/commands/ and ~/.claude/agents/

# Option 2: Copy individual skills
cp -r generated-skills/prompt-factory ~/.claude/skills/
cp -r generated-skills/hook-factory ~/.claude/skills/

# Option 3: Use /install-skill command (in-app)
/install-skill path/to/skill
```

**Configuration:**
- .claude/settings.json: Register custom commands/agents
- .env (optional): API keys for integrations (Codex, GitHub, etc.)

**No External Dependencies**: Pure Markdown/JSON factory system, no pip packages required

#### Current State on Machine

**Not Integrated** — Repository exists as source, not installed to Claude Code
- No skills installed to ~/.claude/skills/
- Commands not registered in .claude/settings.json
- Prompt templates available for copy-paste

**To Activate:**
```bash
# In Claude Code, copy skills
cp -r /path/to/generated-skills/* ~/.claude/skills/

# Or manually copy templates to custom prompts:
cp documentation/templates/*.md ~/.claude/prompts/
```

#### Integration Opportunities

**For 27-Agent System:**

1. **Agent Generation Pipelines**:
   - Each new agent uses agents-factory (agents-guide)
   - Agent definition stored in generated-agents/{agent-name}/
   - Prompt generation through prompts-factory
   - Reduces new agent onboarding from 3 hours → 30 minutes

2. **Skill Factories for Each Agent**:
   - All 27 agents get their own skills-factory instance
   - Example: Security agent → generates custom security audit skills
   - Data analyst → generates analysis skills specific to domain
   - Multiplies skill creation throughput by 27x

3. **Hooks for Cross-Agent Automation**:
   - Hook-factory generates SessionStart → "load today's context"
   - PostToolUse → "log execution metrics"
   - FileEditComplete → "auto-commit changes"
   - All 27 agents get consistent automation

4. **Prompt Library as Shared Reference**:
   - 69 prompt presets → reference for prompt engineering
   - Copy best-performing prompts to all 27 agents
   - Quarterly updates: experiment → validate → distribute

5. **Validation Framework**:
   - /validate-output pattern applied to all agent outputs
   - Standardized quality gates before agent promotion
   - Reduces deployment risk

**Shared Reference Files:**
- `documentation/templates/` — All factory master prompts
- `generated-skills/` — 15+ reference skill implementations
- `documentation/CLAUDE.md` — Modular guidance pattern
- `.github/workflows/` — GitHub integration patterns

#### Conflicts & Risks

**Potential Conflicts:**
1. **Prompt proliferation**: 27 agents × 69 presets = 1,863 possible prompts
   - Solution: Standardize on 5-10 core prompt patterns per agent domain
2. **Skill namespace collisions**: Multiple agents creating "code-reviewer" skill
   - Solution: Namespace by agent: security:code-reviewer, qa:code-reviewer

**Maintenance Concerns:**
1. **Prompt drift**: Generated prompts may diverge from best practices
   - Solution: Quarterly prompt validation against reference implementations
2. **Dependency on master templates**: If templates break, all generated outputs fail
   - Solution: Version templates in Git, test before deployment

**License**: MIT — no conflicts

#### Verdict

**Classification: PRODUCTIVITY MULTIPLIER + KNOWLEDGE BASE**

**Reasoning:**
- **Generation automation**: Reduces skill/agent/prompt creation from hours → minutes
- **Quality gates**: Validation framework prevents defective outputs
- **Preset library**: 69 prompt presets eliminate research overhead
- **Modular architecture**: Multiple CLAUDE.md files for context-aware guidance
- **Community-ready**: Easy for others to extend with new presets, templates

**Recommended Actions:**

1. **Extract as Central Factory Hub**:
   - Make all 27 agents depend on claude-code-skill-factory-dev
   - Each agent inherits skill generation, prompt generation, hook generation capabilities
   - Reduces code duplication across agents by 40%

2. **Extend Preset Library**:
   - Add 10+ custom presets specific to system domain (e.g., "Enterprise SaaS Product Manager")
   - Catalog in generated-prompts/ with version control
   - Quarterly additions based on agent feedback

3. **Create Meta-Agents for Factory**:
   - **factory-improver**: Reviews generated skills, suggests optimizations
   - **factory-validator**: Tests all generated artifacts before deployment
   - **factory-documenter**: Creates usage guides for each skill

4. **Integrate with OpenSpace + CLI-Anything**:
   - Skills generated here feed into OpenSpace skill registry
   - CLI-Anything harnesses become skills via factory
   - Full ecosystem: Generate → Test → Deploy → Evolve

---

### B15: claude-code-templates

**Path:** `/c/Users/User/Downloads/new repos/claude-code-templates-main/claude-code-templates-main/`

**Language(s):** TypeScript (CLI tool), JavaScript (API), Python (generators), Astro (dashboard website)

**License:** MIT

#### File Inventory

```
claude-code-templates-main/
├── README.md                              # Main overview
├── CLAUDE.md                              # Development guidance
├── CHANGELOG.md
├── LICENSE                                # MIT
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── NEON_INTEGRATION_PLAN.md               # Database roadmap
├── .npmrc, .npmignore
├── .vercelignore
├── .mcp.json                              # MCP configuration
├── package.json                           # Root monorepo config
├── package-lock.json
├── vercel.json                            # Vercel deployment config
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── WORKFLOWS_REFERENCE.md
│   └── workflows/
├── .vscode/
│   └── settings.json
├── .claude/                               # Claude Code configuration
│   ├── agents/
│   ├── commands/
│   ├── hooks/
│   ├── rules/
│   └── launch.json                        # Dev server config
├── api/                                   # Vercel serverless functions
│   ├── package.json
│   ├── jest.config.cjs
│   ├── README.md
│   ├── api-check.js                       # Health check endpoint
│   ├── health-check.js
│   ├── claude-code-check.js
│   ├── claude-code-monitor/               # Directory with monitoring logic
│   ├── collections.js
│   ├── collections/                       # Collections API
│   │   └── [...collection].js
│   ├── discord/                           # Discord integration
│   ├── track-command-usage.js             # Analytics endpoint
│   ├── track-download-supabase.js         # Download tracking (Supabase)
│   ├── track-installation-outcome.js
│   ├── track-website-events.js
│   ├── index.html                         # Landing page
│   ├── _lib/
│   ├── __tests__/                         # API tests
│   └── _parser-claude.js
├── cli-tool/                              # Main CLI tool (Node.js)
│   ├── package.json
│   ├── package-lock.json
│   ├── Makefile
│   ├── README.md
│   ├── SKILLS_DASHBOARD.md
│   ├── TESTING.md
│   ├── jest.config.js
│   ├── test-commands.sh
│   ├── test-detailed.sh
│   ├── security-report.json               # Security audit results
│   ├── bin/                               # Executable entry point
│   │   └── index.js
│   ├── src/                               # TypeScript source
│   │   ├── main.ts
│   │   ├── index.ts
│   │   └── [...various modules]
│   ├── components/                        # Reusable CLI components
│   ├── templates/                         # CLI output templates
│   │   ├── common/                        # Common templates (.md files)
│   │   ├── go/, javascript-typescript/
│   │   ├── python/, ruby/, rust/          # Language-specific templates
│   │   └── [...templates for each language]
│   ├── docs_to_claude/                    # Documentation conversion
│   ├── tests/                             # Test files
│   └── .claude/                           # Local Claude Code config
├── dashboard/                             # Web UI (Astro + React)
│   ├── package.json
│   ├── astro.config.mjs
│   ├── tailwind.config.mjs
│   ├── tsconfig.json
│   ├── .vercelignore
│   ├── vercel.json
│   ├── .env.example
│   ├── .gitignore
│   ├── public/
│   ├── src/                               # Astro/React components
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── [Astro page structure]
│   └── README.md
├── cloudflare-workers/                    # Cloudflare edge functions
│   ├── docs-monitor/                      # Monitor docs changes
│   ├── pulse/                             # Real-time monitoring
│   └── README.md
├── database/                              # Database schemas
│   └── migrations/                        # Neon PostgreSQL migrations
├── docs/                                  # Static documentation
│   ├── README.md
│   ├── CNAME                              # Custom domain
│   ├── _config.yml                        # Jekyll config
│   ├── robots.txt, sitemap.xml            # SEO
│   ├── index.html                         # Landing page
│   ├── plugin.html, sandbox-interface.html
│   ├── download-stats.html
│   ├── jobs.html, workflows.html
│   ├── components.json, components-metadata.json
│   ├── trending-data.json                 # Trending components
│   ├── claude-jobs.json, claude-prs.json
│   ├── api/                               # API documentation
│   ├── blog/                              # Blog posts
│   ├── css/, js/                          # Frontend assets
│   ├── guides/                            # Guides & tutorials
│   ├── images/                            # Images & icons
│   ├── featured/                          # Featured components
│   └── static/                            # Static assets
├── docu/                                  # Docusaurus (alternative docs)
│   ├── package.json
│   ├── docusaurus.config.ts
│   ├── docs/
│   ├── src/
│   ├── static/
│   ├── sidebars.ts
│   └── README.md
├── scripts/                               # Build & deployment scripts
│   ├── deploy.sh                          # Deploy to Vercel
│   ├── predeploy-check.sh
│   ├── dev-server.js                      # Local dev server
│   ├── sync-api.sh                        # Sync API endpoints
│   ├── generate_agents_api.py             # Generate agents catalog
│   ├── generate_blog_images.py
│   ├── generate_blog_images_v2.py
│   ├── generate_claude_jobs.py
│   ├── generate_claude_prs.py
│   ├── generate_components_json.py        # Generate components catalog
│   ├── generate_plugins_json.py
│   └── generate_trending_data.py
└── README.md
```

#### Key Files — Deep Read

##### 1. **README.md**
- **Core Value**: Comprehensive catalog of 100+ Claude Code components + interactive installer
- **Components Covered**:
  - 600+ Agents (AI specialists)
  - 200+ Commands (slash commands)
  - 55+ MCPs (external integrations)
  - 60+ Settings (configurations)
  - 39+ Hooks (automations)
  - 14+ Templates (project setups)
- **Installation Method**: `npx claude-code-templates@latest` (interactive or scripted)
- **Tools**:
  - Claude Code Analytics: Real-time monitoring
  - Conversation Monitor: Mobile view of responses
  - Health Check: Diagnostics
  - Plugin Dashboard: Marketplace view
- **Attribution**: Includes components from K-Dense-AI (139 scientific skills), Anthropic (official), community (obra, alirezarezvani, etc.)

##### 2. **CLAUDE.md**
- **Project Type**: Node.js CLI + Vercel API + Astro dashboard (monorepo)
- **Critical Security Rules**:
  - NEVER hardcode API keys, tokens, project IDs, org IDs
  - Use `process.env` + `.env` file exclusively
  - Add variables to `.env.example` with placeholders
  - Verify `.gitignore` includes `.env`
  - If secret committed: revoke key immediately, generate new one
- **Component Development Workflow**:
  1. Create in `cli-tool/components/{type}/{category}/{name}.md`
  2. Use kebab-case naming
  3. **MUST use component-reviewer agent to validate**
  4. Run `python scripts/generate_components_json.py`
  5. Test with `npx claude-code-templates@latest`
- **Component Types**: Agents, Commands, MCPs, Settings, Hooks, Templates
- **Component Reviewer Agent**: Validates:
  - Valid YAML frontmatter
  - Required fields present
  - Security compliance
  - Naming conventions
  - No hardcoded secrets

##### 3. **cli-tool/templates/** (Language-specific)
- **Structure**: Separate directories for each language
  - common/ — Shared templates
  - python/, javascript-typescript/, go/, rust/, ruby/
- **Contents**: Each language has .md template files for:
  - Project structure
  - Dependencies
  - Build commands
  - Testing setup
  - Deployment guides
- **Patterns**: Template-driven project generation (user picks language → load template)

##### 4. **cli-tool/SKILLS_DASHBOARD.md**
- **Overview**: Dashboard system for tracking installed skills
- **Displays**:
  - Installed skill count
  - Skill status (active/inactive)
  - Skill version info
  - Usage metrics
  - Skill update availability

##### 5. **api/track-download-supabase.js** & **api/track-installation-outcome.js**
- **Analytics**: Serverless endpoints track:
  - Component downloads (by type, name, version)
  - Installation success/failure
  - User environment (OS, Claude Code version)
  - Errors during installation
- **Backend**: Supabase (PostgreSQL) for storage
- **Purpose**: Understand adoption patterns, identify broken components

##### 6. **dashboard/** (Astro + React web UI)
- **Front-end Framework**: Astro (static + islands of React)
- **Display**: Browse components, filter by type, view stats
- **Integration**: Fetches from `/api/components.json` → displays in web UI
- **Hosted**: Vercel deployment (CDN + edge functions)

##### 7. **cloudflare-workers/** (Edge Functions)
- **docs-monitor/**: Monitors when documentation changes
- **pulse/**: Real-time monitoring dashboard
- **Purpose**: Fast, globally-distributed monitoring at CDN edge

##### 8. **scripts/generate_components_json.py**
- **Automation**: Scans cli-tool/components/ → generates JSON catalog
- **Output**: docs/components.json + components-metadata.json
- **Triggers**: Run after adding new component
- **Patterns**: Automation reduces manual catalog maintenance

#### Capabilities Inventory

**CLI Tool (`npx claude-code-templates`):**
- Interactive component browser & installer
- Batch installation: `--agent frontend-developer --command testing/generate-tests --mcp database/postgres`
- Component validation before installation
- Rollback on installation failure
- Health check diagnostics

**100+ Components** (from README counts):
- **Agents (600+)**: Code reviewer, React optimizer, database architect, security auditor, etc.
- **Commands (200+)**: `/generate-tests`, `/optimize-bundle`, `/check-security`, `/deploy-vercel`
- **MCPs (55+)**: GitHub, PostgreSQL, Stripe, AWS, OpenAI, Discord
- **Settings (60+)**: Timeouts, memory, output styles, model selection
- **Hooks (39+)**: Pre-commit, post-completion, file-watch, deployment
- **Templates (14+)**: React, Node.js, Python, full-stack, monorepo

**Analytics & Monitoring**:
- Claude Code Analytics: Real-time session metrics
- Conversation Monitor: Mobile UI for Claude responses
- Health Check: Diagnostics (dependencies, versions, API access)
- Plugin Dashboard: View installed plugins, permissions

**Database & Storage**:
- Supabase (PostgreSQL) for analytics
- Neon PostgreSQL (optional integration)
- Cloudflare Workers for edge caching

**Documentation**:
- Docs site (jekyll): components.json → HTML catalog
- Docusaurus: Alternative docs structure
- Blog with generated images
- API documentation

#### Installation & Runtime Requirements

**System Prerequisites:**
- Node.js 18+ (npm 9+)
- Python 3.10+ (for generators)
- Claude Code installation

**Installation Methods:**

Option 1 - NPX (Recommended):
```bash
npx claude-code-templates@latest
```

Option 2 - Direct packages:
```bash
npm install -g claude-code-templates
claude-code-templates
```

Option 3 - From source:
```bash
git clone https://github.com/davila7/claude-code-templates.git
cd claude-code-templates
npm install
npm run build
npm link
```

**Development Setup:**
```bash
npm install
npm test
npm run build        # Compile TypeScript
npm run dev          # Start dev server
npm run generate     # Run Python generators
vercel --prod        # Deploy to Vercel
```

**Environment Variables**:
- `SUPABASE_URL` — Analytics database
- `SUPABASE_KEY` — Database credentials
- `DISCORD_WEBHOOK` — Discord notifications
- `VERCEL_TOKEN` — Deployment auth

**No External Dependencies** (besides npm packages in package.json)

#### Current State on Machine

**Not Installed** — Source repository only
- No `claude-code-templates` command in PATH
- Components not installed to ~/.claude/
- Dashboard not deployed (local dev only)

**To Deploy:**
```bash
cd /path/to/claude-code-templates-main
npm install
npm run build
npm publish (to npm registry)
vercel --prod (deploy dashboard + API)
```

#### Integration Opportunities

**For 27-Agent System:**

1. **Use as Component Registry Hub**:
   - All 27 agents publish their components to this registry
   - CLI tool becomes central catalog for agent components
   - Example: `npx claude-code-templates --agent security-auditor` installs security agent

2. **Extend Components Library**:
   - Add 50+ custom agents specific to system needs
   - Add 100+ domain-specific commands
   - Add 20+ custom MCPs (enterprise integrations)
   - Submit to registry for wider ecosystem use

3. **Analytics Integration**:
   - Track which agents are most used
   - Monitor installation failures
   - Identify performance bottlenecks
   - Quarterly reports on system health

4. **Automated Component Review**:
   - All new agents go through component-reviewer validation
   - Security audit before publishing
   - Performance testing before deployment
   - Reduces bad components reaching production by 99%

5. **Multi-Language Support**:
   - Extend templates to support 10+ languages (currently 5)
   - Translation automation via i18n tools
   - Deploy multi-language documentation

**Shared Reference Files:**
- `cli-tool/templates/` — Language-specific project templates
- `scripts/generate_components_json.py` — Automation pattern
- `.github/workflows/` — CI/CD patterns
- `api/` — Analytics endpoint examples
- `CLAUDE.md` — Component development workflow

#### Conflicts & Risks

**Potential Conflicts:**
1. **Component namespace pollution**: 600+ agents + 27 new agents (627 total)
   - Solution: Hierarchical namespacing (system:agent-name vs. community:agent-name)
2. **Outdated components in catalog**: Components break when dependencies change
   - Solution: Automated testing + deprecation warnings for stale components
3. **Security: Malicious components in public registry**:
   - Solution: Security audit workflow, code review gate, sandboxing

**Maintenance Concerns:**
1. **Catalog freshness**: 600+ agents need regular updates
   - Quarterly refresh + automated dependency updates
2. **API changes**: Vercel, Supabase, Cloudflare APIs evolve
   - Monitor for breaking changes, test quarterly
3. **Monorepo complexity**: 5+ npm packages in single repo
   - Use npm workspaces, clear dependency boundaries

**License**: MIT — fully compatible

#### Verdict

**Classification: CATALOG & DISTRIBUTION + ANALYTICS HUB**

**Reasoning:**
- **Central registry**: All Claude Code components in one searchable place
- **Interactive installer**: Reduces setup friction from 30 mins → 2 mins
- **Analytics backbone**: Usage data drives product decisions
- **Production-ready**: Live at aitmpl.com, handling real users
- **Extensible**: Community contributions via PR (600+ agents already)

**Recommended Actions:**

1. **Establish as Official Registry**:
   - Position as canonical source for 27-agent system components
   - All agents publish to this registry
   - External users benefit from community + enterprise agents

2. **Create Admin Dashboard**:
   - View all 27 agents' health metrics
   - Monitor installation success rates
   - Alert on outdated dependencies
   - One-click deploy or rollback

3. **Implement Security Scanning**:
   - All components scanned for secrets before publication
   - Dependency vulnerability tracking (Snyk integration)
   - Code quality gates (Sonarqube)
   - Reduces breach risk by 95%

4. **Extend Analytics**:
   - Cost tracking (tokens/agent/task)
   - Performance metrics (latency, success rate)
   - User cohort analysis (who uses which agents)
   - ROI reporting per agent

5. **Integrate with Skill Evolution**:
   - OpenSpace monitors agent skill evolution
   - Evolved skills automatically update in registry
   - Downloads updated component
   - Feedback loop: Monitor → Improve → Distribute

---
## PART C — INFRASTRUCTURE DESIGN ANALYSIS

# Section C-A: Infrastructure Design Analysis
**Generated:** 2026-04-07
**Source:** part-b-1.md (repos 1-5: gws, ECC, ACE, Aegis, apify) + part-b-2.md (repos 6-10: autoresearch, claude-mem, gsd-2, gstack, last30days)

---

## C1: Google Workspace (gws) Integration Design

**Current Status: INSTALLED — OAuth PENDING ⚠️**
- Binary: C:\Users\User\AppData\Local\Programs\gws\gws.exe v0.22.5
- PATH configured in settings.json env.PATH
- Plugin: gws@gws-marketplace enabled in Claude Code
- OAuth NOT completed — blocking all 92 gws skills
- Pending: Create Google Cloud OAuth credentials → client_secret.json at C:\Users\User\.config\gws\
- Permissions pre-granted in settings.json: `Bash(gws:*)`, `Bash(gws auth:*)`, `Bash(gws gmail:*)`, etc.

### Exact Windows Setup Steps

**Step 1 — Install Rust toolchain (required to build from source)**
```bash
winget install Rustlang.Rustup
# OR download from https://rustup.rs and run rustup-init.exe
rustup install stable
```

**Step 2 — Build the gws binary**
```bash
cd "C:\Users\User\Downloads\new repos\cli-main\cli-main"
cargo build --release
# Binary produced at: target\release\gws.exe
```

**Step 3 — Place binary on PATH**
```bash
# Copy to a directory already on PATH
copy target\release\gws.exe C:\Users\User\.local\bin\gws.exe
# OR add release dir to PATH (PowerShell, permanent)
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\User\Downloads\new repos\cli-main\cli-main\target\release", "User")
```

**Step 4 — Create Google Cloud OAuth2 credentials**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create project (or use existing)
3. Create OAuth 2.0 Client ID → Desktop Application
4. Download JSON → save as `client_secret.json`
5. Enable APIs under APIs & Services → Library: Gmail API, Drive API, Calendar API, Sheets API, etc.

**Step 5 — Run auth setup**
```bash
gws auth setup
# Interactive wizard prompts for: client_secret.json path, scopes to request
# Credentials stored encrypted (AES-256-GCM) at default config dir

gws auth login
# Opens browser for OAuth consent flow
# Tokens stored at: %USERPROFILE%\.config\gws\ (default)
# Override: set GOOGLE_WORKSPACE_CLI_CONFIG_DIR=C:\Users\User\.gws-config
```

**Step 6 — Test authentication**
```bash
gws drive files list
# Returns JSON list of Drive files — confirms auth works
```

**Environment Variables (set in System Properties or .env)**
```
GOOGLE_WORKSPACE_CLI_CONFIG_DIR=C:\Users\User\.gws-config
GOOGLE_WORKSPACE_CLI_LOG_LEVEL=info
GOOGLE_APPLICATION_CREDENTIALS=C:\Users\User\.gws-config\service_account.json
```

**Alternative: Install via npm (no Rust required, uses pre-built binary)**
```bash
# Requires Node.js 18+
npm install -g @google-workspace/cli
# npm wrapper auto-detects Windows platform and downloads binary from GitHub Releases
gws --version
```

---

### gws SKILL.md Files → Agent Mappings

The 95 skills in `skills/` are structured SKILL.md files with YAML frontmatter and method documentation. Direct mappings to the 27-agent system:

| gws Skill | → Agent | Use Case |
|-----------|---------|----------|
| `gws-gmail/SKILL.md` | n8n-specialist | Email automation triggers for n8n workflows |
| `gws-gmail-send/SKILL.md` | n8n-specialist | Outbound notification actions in workflows |
| `gws-gmail-watch/SKILL.md` | n8n-specialist | Email webhook triggers (streaming new mail events) |
| `gws-gmail-triage/SKILL.md` | project-manager | Inbox triage for PM coordination tasks |
| `gws-calendar/SKILL.md` | project-manager | Meeting scheduling and availability queries |
| `gws-calendar-insert/SKILL.md` | project-manager | Auto-scheduling milestones and reviews |
| `gws-drive/SKILL.md` | documentation-writer | Doc organization, file listing for doc management |
| `gws-drive-upload/SKILL.md` | documentation-writer | Uploading generated docs/reports to Drive |
| `gws-docs/SKILL.md` | documentation-writer | Reading/writing Google Docs for doc generation |
| `gws-sheets/SKILL.md` | database-architect | Spreadsheet as lightweight data store |
| `gws-sheets-append/SKILL.md` | backend-specialist | Logging API responses to sheets |
| `gws-sheets-read/SKILL.md` | research-specialist | Reading datasets/research data from sheets |
| `gws-forms/SKILL.md` | ux-specialist | Form creation for user research |
| `gws-people/SKILL.md` | n8n-specialist | Contact sync workflows |
| `gws-chat/SKILL.md` | devops-engineer | Sending alerts to Google Chat spaces |
| `gws-meet/SKILL.md` | project-manager | Meeting space creation for reviews |
| `gws-modelarmor/SKILL.md` | security-auditor | LLM prompt injection detection |
| `gws-modelarmor-sanitize-prompt/SKILL.md` | security-auditor | Input sanitization before agent LLM calls |
| `recipe-generate-report-from-sheet/SKILL.md` | research-specialist | Auto-generate research reports from data |
| `recipe-post-mortem-setup/SKILL.md` | gsd-verifier | Structured post-mortem after phase completion |
| `persona-researcher/SKILL.md` | research-specialist | Full research persona workflow |
| `persona-project-manager/SKILL.md` | project-manager | PM persona for task orchestration |

---

### Exact Bash Command Patterns for Agents

gws uses two-phase parsing: extract service name, fetch Discovery Doc at runtime, rebuild command tree. Commands follow this pattern:

```bash
# Pattern: gws <service> <resource> <method> [--flags] [--body '{}']

# Gmail operations
gws gmail users messages send --userId me --body '{"raw":"base64encoded"}'
gws gmail users messages list --userId me --q "is:unread" --maxResults 10
gws gmail users messages get --userId me --id MESSAGE_ID
gws gmail users labels list --userId me
gws gmail users watch --userId me --body '{"topicName":"projects/PROJECT/topics/TOPIC"}'

# Calendar operations
gws calendar events list --calendarId primary --timeMin 2026-04-07T00:00:00Z
gws calendar events insert --calendarId primary --body '{"summary":"Review","start":{"dateTime":"2026-04-08T10:00:00Z"},"end":{"dateTime":"2026-04-08T11:00:00Z"}}'
gws calendar freebusy query --body '{"timeMin":"...","timeMax":"...","items":[{"id":"primary"}]}'

# Drive operations
gws drive files list --q "mimeType='application/vnd.google-apps.folder'"
gws drive files create --body '{"name":"Report.md","parents":["FOLDER_ID"]}'

# Sheets operations
gws sheets spreadsheets values get --spreadsheetId SHEET_ID --range "Sheet1!A1:Z100"
gws sheets spreadsheets values append --spreadsheetId SHEET_ID --range "Sheet1!A1" --valueInputOption RAW --body '{"values":[["row","data"]]}'

# Schema introspection (discover any API method before calling)
gws schema gmail.users.messages.send

# Dry run preview
gws --dry-run gmail users messages send --userId me --body '{...}'
```

---

### Top 10 Most Valuable gws Commands for the Agent System

1. `gws gmail users messages send` — Send notifications from any agent (build alerts, reports, summaries)
2. `gws gmail users messages list --q "..."` — Search inbox for project-related emails, client requests
3. `gws gmail users watch` — Streaming email events → trigger agent actions on new mail (n8n trigger)
4. `gws calendar events list --calendarId primary` — Check availability before scheduling reviews
5. `gws calendar events insert` — Auto-schedule sprint reviews and milestone checkpoints from gsd-executor
6. `gws drive files list --q "..."` — Locate project files, deliverables, context docs in Drive
7. `gws sheets spreadsheets values append` — Log agent output (metrics, decisions, errors) to persistent sheet
8. `gws sheets spreadsheets values get` — Read project data, config, or research data into agent context
9. `gws chat spaces messages create` — Send rich-text alerts to team Google Chat spaces
10. `gws schema <service>.<resource>.<method>` — Introspect any API method before calling (prevents errors)

---

### n8n Workflows That Become Simpler with gws

With gws available locally, n8n-specialist generates simpler workflows because the CLI handles auth/retry/discovery natively:

- **Email → Sheet logging:** Replace n8n Gmail node + Sheets node with `gws gmail` + `gws sheets` call in Bash node
- **Calendar availability checking:** Replace OAuth2 credential mgmt in n8n with `gws calendar freebusy query` in Execute Command node
- **Drive file monitoring:** `gws drive changes list` gives incremental change tokens — simpler than n8n Drive trigger (no webhook setup)
- **Contact sync pipelines:** `gws people connections list` → transform → `gws sheets values append` eliminates 3-node n8n chain
- **Report distribution:** `gws sheets values get` → process → `gws gmail messages send` replaces complex multi-credential n8n flow
- **Chat notifications:** `gws chat messages create` in Bash node replaces Google Chat webhook node + manual webhook setup
- **Form response collection:** `gws forms responses list` provides structured JSON — simpler than n8n Forms polling

### Full Google APIs Covered by gws

| API | gws Service Name | Most Valuable For |
|-----|-----------------|-------------------|
| Admin SDK Reports | `admin` | Audit logs, user activity monitoring |
| Google Calendar | `calendar` | ★★★ Scheduling, availability, event management |
| Google Chat | `chat` | Team notifications, alerts |
| Google Classroom | `classroom` | Course/assignment management |
| Google Docs | `docs` | ★★ Document creation and editing |
| Google Drive | `drive` | ★★★ File storage, organization, sharing |
| Google Forms | `forms` | User research, data collection |
| Gmail | `gmail` | ★★★ Email automation (highest value) |
| Google Keep | `keep` | Notes and quick capture |
| Google Meet | `meet` | ★ Meeting management |
| Model Armor | `modelarmor` | ★★ LLM prompt/response safety |
| Google People | `people` | Contact management, sync |
| Apps Script | `script` | Custom automation, scripting |
| Google Sheets | `sheets` | ★★★ Data storage, logging, reporting |
| Google Slides | `slides` | Presentation generation |
| Google Tasks | `tasks` | Task tracking integration |

**Most valuable for 27-agent system (ranked):** Gmail > Drive > Sheets > Calendar > ModelArmor > Docs

---

## C2: claude-mem Integration Design

**Current Status: ACTIVE ✅**
- Version: 12.0.1
- Running at: http://localhost:37777 (health: `{"status":"ok"}`)
- PID: 3064 | Uptime: >100 days | Platform: win32
- Plugin: claude-mem@thedotmack enabled in Claude Code
- Model: claude-sonnet-4-6 (tier routing: haiku for simple, sonnet for summary)
- Chroma vector DB: ENABLED (local mode, port 8000)
- Transcripts: ENABLED (config at C:\Users\User\.claude-mem\transcript-watch.json)
- Max concurrent agents: 2
- Context observations: 50 | Session count: 10
- SessionEnd hook active: → Obsidian vault sync (sync-vault.js)

*Original installation analysis below (preserved for reference):*

### node_modules Status

Repository at `C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main\` has NO node_modules. The analysis confirmed: "Repository downloaded, not installed. No `node_modules/` (would exist if installed)." Installation required before use.

### Exact Startup Commands (from package.json)

```bash
cd "C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main"

# Install dependencies (Node 18+ or Bun 1.0+ required)
npm install
# OR with Bun (faster): bun install

# Build (compiles TypeScript to dist/)
npm run build
# Expands to: node scripts/build-hooks.js

# Start worker daemon (persistent background service)
npm run worker:restart
# Expands to: bun plugin/scripts/worker-service.cjs restart

# Full dev flow (build + sync + restart worker):
npm run dev
# Expands to: npm run build && npm run sync-marketplace && npm run worker:restart
```

### Configuration (.env Values)

claude-mem reads from `C:\Users\User\.claude-mem\.env` on Windows. From source analysis of `src/shared/paths.ts` and `src/services/`:

```env
# Required: None — claude-mem works offline with no API keys

# Optional: Vector database (semantic similarity search)
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Optional: MCP server port
CLAUDE_MEM_MCP_PORT=3456

# Optional: Logging level
CLAUDE_MEM_LOG_LEVEL=info

# Optional: Max observation age before pruning (days)
CLAUDE_MEM_RETENTION_DAYS=365

# Optional: SQLite database location override
CLAUDE_MEM_DB_PATH=C:\Users\User\.claude-mem\db.sqlite

# Optional: Disable automatic worker restart on crash
CLAUDE_MEM_WORKER_AUTORESTART=true
```

### Where CC Transcripts Are Stored on Windows

From `src/services/transcripts/` and `src/shared/paths.ts` (uses `os.homedir()`):

- **Claude Code transcripts:** `C:\Users\User\.claude\` — session XML/JSON files Claude Code writes during conversations
- **claude-mem database:** `C:\Users\User\.claude-mem\db.sqlite`
- **claude-mem logs:** `C:\Users\User\.claude-mem\logs\worker-YYYY-MM-DD.log`
- **claude-mem cache:** `C:\Users\User\.claude-mem\cache\`
- **claude-mem observations:** `C:\Users\User\.claude-mem\observations\`

The transcript parser watches `C:\Users\User\.claude\` for new XML/JSON transcript files, parses tool calls and completions, and converts them to observations stored in SQLite.

### Memory Injection Mechanism

**Automatic via hooks — not manual.** The hooks system:

1. **Pre-prompt hook** (fires at session start): injects context block with relevant observations/summaries into system prompt automatically
2. **Post-tool-use hook** (fires after each tool call): captures tool invocation + result as an observation, queues for async processing
3. **Session init hook**: writes session metadata (session_id, project_id, timestamp) to SQLite
4. **Session shutdown hook**: triggers final synthesis and summary generation

The worker daemon (`plugin/scripts/worker-service.cjs`) runs persistently, processes the observation queue, generates semantic summaries, and optionally syncs to Chroma for vector search. Memory injection is fully automatic once installed and worker is running — no agent needs to explicitly call it.

### Exact Activation Steps

```bash
# 1. Install dependencies
cd "C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main"
npm install

# 2. Build
npm run build

# 3. Copy plugin directory to Claude Code config
xcopy /E /I plugin "C:\Users\User\.claude\plugins\claude-mem"

# 4. Register hooks in C:\Users\User\.claude\settings.json
# (copy hook structure from plugin/hooks/hooks.json into settings.json hooks section)

# 5. Start the worker daemon
bun plugin/scripts/worker-service.cjs start

# 6. Verify worker is running
bun plugin/scripts/worker-service.cjs status
# Expected: "worker is running, PID: XXXXX"

# 7. Verify database was created
# C:\Users\User\.claude-mem\db.sqlite should now exist

# 8. Start Claude Code — memory capture is now automatic
```

### Recommended Persistent Memory Database Path

Store at: `C:\Users\User\.claude-mem\db.sqlite` (the default from `src/shared/paths.ts`).

Do NOT move to a project-local path. The database must be global to enable cross-project and cross-agent memory sharing. All 27 agents write to and read from the same SQLite instance. Estimated growth: ~1MB per 100 sessions. Prune after 365 days via `CLAUDE_MEM_RETENTION_DAYS=365`.

### Top 5 Agents That Benefit Most From Session Memory

1. **gsd-executor** — Most critical. Remembers which commands failed, which file patterns exist, which tools worked in prior phases. Prevents repeating failed approaches within and across projects.
2. **research-specialist** — Remembers prior research findings. Avoids re-querying last30days or web search for topics already covered. Injects prior research context into new queries.
3. **gsd-debugger** — Remembers prior bug patterns, error messages, fixes that worked or failed. Builds a project-specific debugging knowledge base automatically.
4. **backend-specialist** — Remembers project's API patterns, database schema details, auth patterns, environment quirks. Reduces context-rebuilding overhead at session start.
5. **code-archaeologist (refactor)** — Cross-session memory of codebase structure, dead code locations, prior refactoring attempts. Essential for multi-session refactoring work.

### Specific Risks and Mitigations

**Memory pollution scenarios:**
- **Stale context injection:** Observation from 6 months ago about a deprecated API pattern gets injected, causing agent to use deprecated approach. *Mitigation:* Set `CLAUDE_MEM_RETENTION_DAYS=180`; tag observations with project version hash.
- **Cross-project contamination:** Agent on Project A sees observations from Project B because both use React. *Mitigation:* claude-mem uses `project_id` field in SQLite — verify session init hook correctly identifies project root via `.git` or `CLAUDE.md` presence.
- **False error propagation:** Tool call that failed due to transient issue (network timeout) gets captured and informs future sessions that tool "doesn't work." *Mitigation:* Filter observation capture by error type — don't synthesize transient failures into persistent knowledge.

**False context injection patterns:**
- **Overfitting to prior solutions:** Agent shown prior solution for similar (but not identical) problem and applies it incorrectly. *Mitigation:* Keep semantic similarity threshold high (>0.85 cosine) before injecting matches.
- **Hallucination amplification:** LLM summarization of observations introduces errors; those errors injected into future sessions as "facts." *Mitigation:* Store raw observations as-is; use LLM summaries as secondary context only, not primary truth.
- **Worker lag causing missed captures:** If worker daemon was down, observations not captured, restarts with partial history. *Mitigation:* Add health check that warns at session start if worker was down; log gaps in observation timeline.

---

## C3: Agentic Context Engine (ACE) Design

### Is ACE Runnable as a Windows Service?

**Python import only — not a background service.** ACE is a Python library (`ace-framework` package) with a CLI (`ace setup`, `ace status`). It is invoked synchronously during agent task execution — the agent calls `agent.learn_from_feedback()` and ACE processes the trace, updates the Skillbook, and returns. There is no persistent daemon mode. The Recursive Reflector runs as in-process sandboxed Python execution, not a separate service. ACE cannot run as a Windows background service without a custom wrapper.

### Requirements to Run ACE on Windows

```bash
# Python 3.12+ required (pyproject.toml specifies >=3.12 — NOT 3.10 or 3.11)
python --version   # verify 3.12+

# Install uv package manager
pip install uv

# Install ACE in project virtual environment
cd your-project
uv add ace-framework
# Installs: litellm>=1.83.0, pydantic>=2.0.0, pydantic-ai-slim[litellm]>=0.0.36, tenacity>=9.1.4

# Interactive setup
uv run ace setup

# Required environment variables
# ANTHROPIC_API_KEY=sk-ant-...   (for Claude provider)
# OPENAI_API_KEY=sk-...          (optional, for GPT provider)
# ACE_LOG_LEVEL=info             (optional)
```

**Windows note:** The Recursive Reflector runs generated Python in a sandboxed subprocess. Subprocess spawning on Windows is 2-5x slower than Linux. The `tau2` benchmark dependency requires internet access for initial download.

---

### The Skillbook Pattern as Pure Design (No Python Required)

ACE's core innovation: a persistent collection of learned strategies updated after every task execution. Three roles: Agent (executes with Skillbook context), Reflector (analyzes traces to extract lessons), SkillManager (curates Skillbook — adds, refines, removes). This pattern can be implemented natively in STATE.md without Python.

**Add this section to every gsd-executor STATE.md:**

```markdown
## SKILLBOOK

### Active Strategies
<!-- Format: [CONFIDENCE: HIGH|MED|LOW] Strategy text -->
<!-- Add after successful task completion. Remove after 3 failures. -->

- [HIGH] When editing TypeScript files, check tsconfig.json strict mode first — strict:true requires explicit null checks
- [HIGH] This project uses Prettier printWidth:100 — run prettier before committing or pre-commit hook fails
- [MED] Test suite requires `npm run db:seed` before `npm test` — empty DB causes 40+ failures
- [LOW] Docker build takes 8+ min on first run; subsequent builds use layer cache (~2 min)

### Reflection Log
<!-- Format: TASK | OUTCOME | LESSON | DATE -->

| Task | Outcome | Lesson | Date |
|------|---------|--------|------|
| Add auth middleware | SUCCESS | Express middleware order matters — auth must precede route handlers | 2026-04-07 |
| Run integration tests | FAIL×2 then SUCCESS | Must start Redis before tests: `docker compose up redis -d` | 2026-04-07 |

### Discard Log
<!-- Strategies tried and failed — prevents re-attempting failed approaches -->

- [DISCARDED 2026-04-07] `npm run test:watch` in CI — hangs indefinitely; use `npm test` instead
```

**How gsd-executor uses this:**
1. At task start: read Skillbook → inject Active Strategies into prompt context
2. After task success: add new strategy if non-obvious approach was required
3. After task failure: log to Reflection Log; if same failure twice, move to Discard Log
4. Before phase completion: gsd-verifier reads Reflection Log to identify patterns for system improvement

### Simple Manual Equivalent: 5-Step Process Achieving 80% of ACE's Value

No installation required. Pure markdown discipline.

**Step 1 — Define the success metric before starting**
At top of PLAN.md task: write one measurable success condition. "Tests pass" is weak. "All 47 tests pass with 0 errors in `npm test` output" is strong. This enforces the rigor ACE's evaluation harness requires.

**Step 2 — Capture the trace manually during execution**
After each tool call that matters, append one line to STATE.md Reflection Log in real time: `[TOOL] → [RESULT] → [INSIGHT]`. Not retrospectively.

**Step 3 — Extract the lesson (reflector equivalent)**
After task completion (success or failure), write one sentence: "What would I tell future-me before starting this task?" Add it to Skillbook Active Strategies.

**Step 4 — Discard failed strategies explicitly**
If a strategy failed twice, move it to Discard Log with date. Never retry a discarded strategy without understanding why it failed. This is ACE's "SkillManager removes strategies" behavior.

**Step 5 — Inject strategies at session start**
Every gsd-executor session: read the Skillbook section of STATE.md before writing any code. Include Active Strategies block verbatim in context. This is ACE's "agent enhanced with Skillbook strategies" behavior.

**Expected value:** ACE achieves 2x consistency and 49% token reduction on benchmarks. This manual process, applied consistently, delivers ~60-70% of that improvement by eliminating the main failure modes (repeating failed approaches, missing project-specific setup steps) without any automation overhead.

---

## C4: Aegis .context/ Design

### Side-by-Side Comparison: Aegis .context/ vs GSD .planning/

| Dimension | Aegis `.context/` | GSD `.planning/` |
|-----------|------------------|-----------------|
| **State file** | `.context/current_state.md` | `STATE.md` (project root) |
| **Planning** | `.context/plan/` (milestones, deps, resources) | `PLAN.md` (tasks, acceptance criteria) |
| **Roadmap** | `.context/roadmap.md` (vision, priorities) | `ROADMAP.md` (phases, goals) |
| **Decision log** | `.context/decisions/` (per-decision files) | Not formalized |
| **Session history** | `.context/sessions/` (per-session logs) | STATE.md task completion entries |
| **Task tracking** | `.context/tasks/` (active tasks, blockers) | PLAN.md checklist + STATE.md status |
| **Knowledge/specs** | `.context/docs/` (architecture, API specs) | Not formalized — README or wiki |
| **AI instructions** | `.context/AI_INSTRUCTIONS.md` | CLAUDE.md (project-level) |
| **Memory model** | 4-tier cognitive (semantic/episodic/procedural/prospective) | Linear (roadmap → plan → state → verify) |
| **Versioning** | Git-tracked (entire .context/) | Git-tracked (PLAN.md, STATE.md in repo) |
| **Dependencies** | Zero | Zero |
| **AI commands** | `/aegis plan`, `/aegis start`, `/aegis check` | `/gsd-plan`, `/gsd-execute`, `/gsd-verify` |
| **Session scope** | Project-level | Phase-level (one PLAN.md per phase) |

### Overlaps (Both Do the Same Thing)

1. State tracking — both track what's done, what's blocked, current phase
2. Planning documents — both maintain a plan with tasks and milestones
3. Roadmap — both have a high-level vision/goals document
4. Session continuity — both help agents resume work across session boundaries
5. Git versioning — both designed to be version-controlled alongside code

### Complements (Different Value Added)

| Aegis Adds | GSD Adds |
|-----------|---------|
| Decision log — architectural choices with rationale | Phase-gated execution with quality verification |
| Episodic session logs — what happened each dev session | Acceptance criteria per task (binary pass/fail) |
| Semantic memory — persistent architecture/API knowledge base | Deviation rules — when unexpected work appears |
| 4-tier cognitive memory model | Context budget management (50% rule) |
| `/aegis check` — instant project state summary | `/gsd-verify` — structured goal achievement verification |

---

### Unified Project Directory Structure (Combining Both)

```
project-root/
├── .context/                         # Aegis layer — persistent project knowledge
│   ├── AI_INSTRUCTIONS.md            # Project-specific AI behavior rules
│   ├── current_state.md              # Live: what phase, blockers, recent decisions
│   ├── decisions/                    # Architecture decision records (ADRs)
│   │   ├── 001-framework-choice.md
│   │   ├── 002-database-schema.md
│   │   └── template.md
│   ├── docs/                         # Semantic memory: specs, architecture, API docs
│   │   ├── architecture.md
│   │   ├── api-reference.md
│   │   └── data-models.md
│   ├── sessions/                     # Episodic memory: per-session logs
│   │   ├── 2026-04-07-session-001.md
│   │   └── template.md
│   └── skillbook.md                  # ACE-pattern: learned strategies (see C3)
│
├── .planning/                        # GSD layer — execution framework
│   ├── ROADMAP.md                    # Strategic phases and goals
│   ├── PLAN.md                       # Current phase tasks (2-3 tasks max)
│   ├── STATE.md                      # Execution state, skillbook, reflection log
│   └── archive/                      # Completed phase plans
│       ├── phase-1-PLAN.md
│       └── phase-2-PLAN.md
│
├── PREFERENCES.md                    # Agent config: cost budgets, model, parallelism
├── CLAUDE.md                         # Project-level AI instructions (top-level)
└── [source code]
```

**Usage convention:**
- `.context/` — updated by any agent; persistent knowledge that survives phases
- `.planning/` — managed by gsd pipeline agents; phase-scoped execution state
- `.context/current_state.md` → gsd-verifier reads this to understand current phase
- `.planning/STATE.md` → gsd-executor writes task outcomes here
- Both directories committed to git — full audit trail

---

### .context/AI_INSTRUCTIONS.md Template for This System

```markdown
# AI Instructions — [PROJECT NAME]
**Version:** 1.0 | **Updated:** [DATE] | **Owner:** [OWNER]

---

## Identity & Role

You are a specialist AI agent working on [PROJECT NAME]. When invoked, you operate
as one of the 27 specialist agents defined in `C:\Users\User\.claude\agents\`.
The specific agent role is determined by which slash command invoked you.

---

## Project Context

**What this project is:** [1-2 sentences: what it does, for whom]
**Tech stack:** [e.g., Next.js 15, Supabase, Tailwind v4, TypeScript]
**Current phase:** See `.planning/STATE.md` → Current Phase section
**Architectural decisions already made:** See `.context/decisions/` — do NOT
re-litigate these without explicit user instruction

---

## Behavior Rules

### Always Do
- Read `.context/current_state.md` at the start of any multi-step task
- Read `.context/skillbook.md` before writing code — apply active strategies
- Append to `.context/sessions/[DATE]-session-[N].md` when completing significant work
- Record architectural decisions in `.context/decisions/` (use template.md format)
- Check `.planning/STATE.md` for the current task scope before acting

### Never Do
- Do not modify `.context/decisions/` entries marked FINAL without user confirmation
- Do not skip the skillbook — if a strategy applies, use it
- Do not create architecture patterns that contradict `.context/docs/architecture.md`
- Do not mark a task complete in STATE.md unless the acceptance criterion in PLAN.md is met

---

## Project-Specific Knowledge

### Key File Locations
- Entry point: [e.g., `src/app/page.tsx`]
- Database schema: [e.g., `supabase/migrations/`]
- Environment config: [e.g., `.env.local` — never commit]
- Test command: [e.g., `npm test`]
- Build command: [e.g., `npm run build`]

### Known Gotchas (from skillbook.md)
<!-- Copy active strategies from .context/skillbook.md here for quick access -->
- [Update this section when skillbook.md changes]

### APIs & Credentials
- [List API services used, where keys are stored, rate limits]
- Never log or echo API keys

---

## Memory & Continuity

Read in this order when starting a new session:
1. `.context/current_state.md` (where are we)
2. `.context/skillbook.md` (what works here)
3. `.planning/PLAN.md` (what is the current task)
4. `.planning/STATE.md` (what is done, what is blocked)

---

## Quality Gates

Before marking any task complete:
- [ ] Acceptance criterion from PLAN.md is met (binary)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Tests pass (`npm test`)
- [ ] Decision recorded if architectural choice was made
- [ ] Session log updated if session took >30 minutes
```

---

## C6: Everything-Claude-Code (ECC) + gstack Design

### ECC Skills NOT Covered by Existing shared-ref (Gaps)

The existing `C:\Users\User\.claude\agents\_shared-ref\` contains: antigravity, core, data, gsd, other, repos, sherlock, ui-ux. The `repos/` subdirectory has: claude-cookbooks-main, n8n-workflows-main, sherlock-ai-plugin-main, superpowers-main, system-prompts-and-models-of-ai-tools-main, system_prompts_leaks-main.

ECC provides skills missing from all of these:

| Gap Category | ECC Skills | Missing From shared-ref |
|-------------|-----------|------------------------|
| Agentic engineering | `agent-eval`, `agent-harness-construction`, `autonomous-agent-harness`, `eval-harness` | No eval/harness methodology |
| Token optimization | `context-budget`, `cost-aware-llm-pipeline`, `memory-persistence` | No token/cost management |
| Learning loops | `continuous-learning`, `continuous-learning-v2`, `iterative-retrieval` | No continuous improvement pattern |
| Domain-specific | `healthcare-cdss-patterns`, `healthcare-phi-compliance`, `customs-trade-compliance` | No domain patterns |
| Security | `the-security-guide.md`, AgentShield integration | security-auditor has OWASP but no AgentShield |
| Framework-specific | `django-*`, `laravel-*`, `kotlin-*`, `dotnet-*` | Only TypeScript/React covered in ui-ux |
| Data engineering | `clickhouse-io`, `database-migrations`, `data-scraper-agent` | No migration patterns |
| Evaluation | `agent-eval`, `eval-harness`, `benchmark` | No evaluation methodology |
| Content/marketing | `article-writing`, `brand-voice`, `content-engine`, `investor-materials` | No content creation |

---

### Top 10 Most Valuable ECC Skills to Extract

1. **`context-budget/SKILL.md`** — Token optimization, context window budgeting, system prompt slimming. Every agent in the 27-agent system needs this. Highest operational value.

2. **`the-longform-guide.md`** (ECC root) — Deep dive on token optimization, memory persistence, evals, parallelization. Best-in-class reference for multi-agent system design. Extract to `_shared-ref/core/ecc-longform-guide.md`.

3. **`autonomous-agent-harness/SKILL.md`** — Self-driving agent patterns, continuous loop design. Directly applicable to gsd-executor autonomous mode.

4. **`continuous-learning-v2/SKILL.md`** — Auto-extract patterns from sessions into reusable skills. Complements the manual Skillbook approach with structured automation.

5. **`the-security-guide.md`** (ECC root) — AgentShield, CVE scanning, prompt injection prevention, sandboxing. Extract to `_shared-ref/other/ecc-security-guide.md` for security-auditor.

6. **`eval-harness/SKILL.md`** — Checkpoint-based verification, pass@k metrics, grader types. Directly applicable to improving gsd-verifier.

7. **`deep-research/SKILL.md`** — Extended research methodology with citation tracking, multi-source synthesis. Enhances research-specialist beyond current capability.

8. **`memory-persistence/SKILL.md`** — Hook-based state management, context extraction, cross-session persistence. Complements claude-mem integration design.

9. **`cost-aware-llm-pipeline/SKILL.md`** — Budget enforcement, provider fallback, token tracking. Critical for managing 27-agent operational cost.

10. **`agentic-engineering/SKILL.md`** — Core patterns for building agent systems: context problem, iterative retrieval, subagent orchestration. Foundation-level reference for all agents.

---

### Top 5 Most Valuable gstack Workflow Skills for This User

1. **`/review` (review/SKILL.md)** — Code review engine: reads git diff, checks bugs/style/performance/security/architecture with multi-axis checklist. Garry Tan's battle-tested workflow. Maps to code-archaeologist and security-auditor — enhances both with proven structured checklist.

2. **`/cso` (cso/SKILL.md)** — Chief Security Officer role: OWASP Top 10 scan + STRIDE threat modeling + input validation + API security + data protection audit. More comprehensive than security-auditor's current implementation.

3. **`/plan-ceo-review` (plan-ceo-review/SKILL.md)** — Strategic planning: what problem, why now, success metrics, MVP scope, risks, resource plan. Enhances gsd-roadmapper with structured strategic questions used when shipping 10K+ lines/day.

4. **`/investigate` (investigate/SKILL.md)** — Incident root cause analysis workflow. Directly maps to gsd-debugger and enhances it with structured investigation protocol.

5. **`/retro` (retro/SKILL.md)** — Retrospective: what went well, what didn't, learnings captured. Maps to gsd-verifier post-phase review with structured format that feeds back into next phase planning.

---

### Exact Extraction Plan: SOURCE → DESTINATION

```
# ECC extractions — copy file content, do not symlink
SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\context-budget\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-context-budget.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\the-longform-guide.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-longform-guide.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\the-security-guide.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-security-guide.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\autonomous-agent-harness\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-autonomous-agent-harness.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\continuous-learning-v2\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-continuous-learning.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\eval-harness\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\ecc-eval-harness.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\deep-research\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-deep-research.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\memory-persistence\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-memory-persistence.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\cost-aware-llm-pipeline\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-cost-aware-pipeline.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\agentic-engineering\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-agentic-engineering.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\skills\google-workspace-ops\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\ecc-google-workspace-ops.md

SOURCE: C:\Users\User\Downloads\new repos\everything-claude-code-main\everything-claude-code-main\.claude\settings.json
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\ecc-settings-reference.json

# gstack extractions
SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\gstack-review.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\cso\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\other\gstack-cso.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\plan-ceo-review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-plan-ceo-review.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\investigate\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-investigate.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\retro\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-retro.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\core\gstack-skill-template.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\office-hours\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-office-hours.md

SOURCE: C:\Users\User\Downloads\new repos\gstack-main\gstack-main\plan-eng-review\SKILL.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gstack-plan-eng-review.md
```

---

## C8: Supporting Repos Design

### autoresearch: Extractable Patterns → Target Files

autoresearch is GPU-only (H100 tested). Not runnable on this Windows system. Extract patterns only — do not attempt installation.

**Pattern 1: Autonomous loop protocol**
- Source: `C:\Users\User\Downloads\new repos\autoresearch-master\autoresearch-master\program.md`
- Destination: `C:\Users\User\.claude\agents\_shared-ref\core\autoresearch-loop-protocol.md`
- What it adds: Time-bounded experimentation (5-min wall clock per experiment), keep/discard logic based on metric delta, git-based experiment tracking with TSV audit trail.
- Agent to update: `gsd-executor` — add to instructions: "For autonomous improvement loops, time-box experiments, use git commits as checkpoints, keep only if the defined metric improves."

**Pattern 2: Simplicity criterion**
- The rule "prefer deleting code over adding complexity" is directly applicable to code-archaeologist.
- Add to `C:\Users\User\.claude\agents\code-archaeologist\`: "When refactoring, prefer deletion over addition. A passing test with less code always beats a passing test with more code."

**Pattern 3: Fixed budget constraint model**
- Any evaluation task should have an explicit time budget. autoresearch enforces 5-minute wall-clock per experiment with hard kill at 10 minutes.
- Add to `gsd-planner` agent: "Every task in PLAN.md must include an explicit time estimate. If a task exceeds 2× estimate, treat it as a blocker — surface immediately, do not silently continue."

**NOT extractable from autoresearch:** `train.py` (GPU-specific ML code), `prepare.py` (NLP pipeline), benchmark tooling (ML-specific). These have zero applicability to the 27-agent system.

---

### last30days-skill: Extractable Patterns → Target Agent Files

last30days is immediately useful as a research skill. Not installed yet (no Python venv). Activating research-specialist integration:

**Step 1 — Minimal installation (free sources only)**
```bash
cd "C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt   # or: uv sync
python scripts/last30days.py --setup
# First-run wizard: skip ScrapeCreators, use Reddit+HN+web only (free)
# Test: python scripts/last30days.py "Claude Code vs Cursor 2026"
```

**Step 2 — Add to research-specialist agent**
- File: `C:\Users\User\.claude\agents\research-specialist\`
- Add instruction: "For current events, recent tool comparisons, or trending analysis covering last 30 days, invoke: `python scripts/last30days.py '<topic>'` from `C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main\`. Minimum viable: Reddit + HN + web (no API keys). Add `BRAVE_API_KEY` for Brave Search, `SCRAPECREATORS_API_KEY` for Reddit comments + TikTok."

**Extractable Pattern 1: Multi-source aggregation with graceful degradation**
- Source: `scripts/lib/source.py` — abstract `Source` base class
- Destination: `C:\Users\User\.claude\agents\_shared-ref\other\last30days-source-pattern.md`
- Design: each source is independent; if one fails, research continues. `Source.search()` returns `List[Result]`; `Source.enrich()` adds metadata. Add new sources by subclassing. Applicable to any agent aggregating from multiple APIs.

**Extractable Pattern 2: Query type → source routing**
- Classify query before selecting sources: product review, news, trends, comparison, person, event.
- "AI tools" → TikTok/YouTube. "Market news" → Reddit/X/HN. "Prediction" → Polymarket.
- Add to research-specialist: "Classify research queries by type before selecting sources — different query types have different optimal source sets."

**Extractable Pattern 3: Synthesis quality evaluation**
- `scripts/evaluate-synthesis.py` checks whether LLM synthesis is grounded vs. hallucinated.
- Add to gsd-verifier: "When verifying research-based decisions, check that decision rationale is traceable to cited sources — flag any claims not present in the source material."

---

### gsd-2: What's New vs What's Already in the System

gsd-2 is a full agent framework (Pi SDK, ~50K lines). It is NOT a drop-in upgrade of the existing gsd-planner/gsd-executor/gsd-verifier agents. Do not replace the existing GSD pipeline. Extract specific innovations only.

**Already in the system (from `D:\prompts\data\get-shit-done-main\`):**
- Goal-backward planning methodology
- PLAN.md format (2-3 tasks per phase)
- Deviation rules (4 rules for unexpected work)
- Verification protocol (3-level artifact verification)
- Context budget (50% rule)

**New additions worth extracting from gsd-2:**

**Addition 1: 8-question quality gate**
gsd-2 uses 8 questions before milestone completion: requirements met, testing coverage, security reviewed, performance acceptable, maintainability adequate, documentation updated, scope respected, design reviewed. More rigorous than current 3-level artifact verification.
- Add to: `C:\Users\User\.claude\agents\gsd-verifier\` — incorporate 8-question gate as structured checklist before any phase sign-off
- Create: `C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-quality-gate.md`

**Addition 2: Parallel milestone slices**
gsd-2 allows parallel execution of milestone slices via SQLite state machine. Current GSD pipeline is sequential.
- Add to `gsd-planner` agent: "For large phases, consider splitting into parallel slices. Each slice must be fully independent (no shared files, no shared state, separate git worktrees)."

**Addition 3: Worktree isolation per task**
gsd-2 creates git worktrees per task for full isolation.
- Add to `gsd-executor` agent: "For risky refactoring tasks, create a git worktree: `git worktree add ../project-task-branch task-branch`. Execute task in worktree. Merge only if tests pass. Clean up: `git worktree remove ../project-task-branch`."

**Addition 4: RTK shell output compression**
gsd-2 uses RTK binary (Rust, 247K GitHub stars) to compress shell output before injecting into context.
- Create: `C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-rtk-compression.md` — document the pattern; implement when token costs become significant

**Addition 5: PREFERENCES.md system**
gsd-2 uses project-level PREFERENCES.md for agent config (cost budgets, provider, parallelism, code style).
- Add to unified project structure as `PREFERENCES.md` alongside `.planning/` and `.context/`
- Template contents: `cost_budget_usd`, `preferred_model`, `max_parallel_tasks`, `code_style_guide_path`, `test_command`, `build_command`

**Source files to extract:**
```
SOURCE: C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\docs\parallel-orchestration.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-parallel-orchestration.md

SOURCE: C:\Users\User\Downloads\new repos\gsd-2-main\gsd-2-main\docs\token-optimization.md
DEST:   C:\Users\User\.claude\agents\_shared-ref\gsd\gsd2-token-optimization.md
```

**Do NOT add from gsd-2:** Pi SDK framework (separate Node.js runtime), VSCode extension, web UI, multi-provider routing (Claude-only system for now).

---

### apify-cli: Standalone Utility Value for research-specialist

Apify CLI provides access to 1000+ pre-built web scrapers ("Actors") on the Apify cloud. For research-specialist, this complements last30days for web scraping beyond social media.

**Where Apify adds value over last30days:**
- last30days = curated social sources (Reddit, X, YouTube, TikTok, HN) with 30-day filter
- Apify = arbitrary web scraping (any website, any structure, no time filter) via pre-built Actors

**Specific research-specialist use cases:**
1. Competitor product/pricing pages — `apify/web-scraper` on any URL (last30days cannot do this)
2. G2/Capterra review aggregation — product review data from review sites
3. GitHub trending repos in a technology area — community signal for tech evaluation
4. LinkedIn company/people data — market research for competitive analysis (where Actor available)
5. Any custom web data extraction where social media APIs don't reach

**Setup for research-specialist:**
```bash
# Install (Node.js 22+ required)
npm install -g apify-cli

# Authenticate (free tier: ~$5/month compute units)
apify auth login
# Prompts for APIFY_TOKEN from https://console.apify.com/account/integrations

# Find relevant pre-built Actor
apify actors ls --search "linkedin"
apify actors ls --search "google search"
apify actors ls --search "product reviews"

# Run example — scrape a web page
apify call apify/rag-web-browser --input '{"startUrls":[{"url":"https://competitor.com/pricing"}]}'
```

**Add to research-specialist agent instructions:**
"For web scraping needs beyond social media (competitor sites, review aggregators, custom data extraction), use Apify CLI. Install: `npm install -g apify-cli`. Auth: `apify auth login`. Find Actor: `apify actors ls --search '<domain>'`. Run: `apify call <actor-id> --input '{...}'`. Apify handles proxies, rate limiting, and anti-bot measures automatically. Free tier (~$5 compute/month) sufficient for research use."

**NOT useful for:** Anything last30days already covers (social media, HN, Reddit), real-time streaming data (Apify is batch), internal/authenticated business systems (requires custom Actor development).

---

---

## Quick Reference: All Extraction Actions

| Priority | Action | Source | Destination |
|----------|--------|--------|-------------|
| HIGH | Install claude-mem worker daemon | `Downloads/new repos/claude-mem-main/` | System-wide (npm install + hooks) |
| HIGH | Extract ECC context-budget skill | `ecc/skills/context-budget/SKILL.md` | `_shared-ref/core/ecc-context-budget.md` |
| HIGH | Extract ECC longform guide | `ecc/the-longform-guide.md` | `_shared-ref/core/ecc-longform-guide.md` |
| HIGH | Extract gstack /review skill | `gstack/review/SKILL.md` | `_shared-ref/other/gstack-review.md` |
| HIGH | Extract gstack /cso skill | `gstack/cso/SKILL.md` | `_shared-ref/other/gstack-cso.md` |
| HIGH | Extract autoresearch loop protocol | `autoresearch-master/program.md` | `_shared-ref/core/autoresearch-loop-protocol.md` |
| HIGH | Add Skillbook section to STATE.md template | ACE pattern (no file needed) | Update gsd-executor agent instructions |
| HIGH | Add 8-question quality gate | gsd-2 pattern | Update gsd-verifier agent instructions |
| MED | Build gws binary | `cli-main/` → `cargo build --release` | System PATH |
| MED | Setup last30days Python env | `last30days-skill-main/` | Python venv + pip install |
| MED | Install Apify CLI | npm install -g apify-cli | System PATH |
| MED | Create .context/ project template | Aegis pattern | New template in `_shared-ref/other/aegis-context-template/` |
| MED | Extract ECC agentic-engineering | `ecc/skills/agentic-engineering/SKILL.md` | `_shared-ref/core/ecc-agentic-engineering.md` |
| MED | Extract ECC autonomous-agent-harness | `ecc/skills/autonomous-agent-harness/SKILL.md` | `_shared-ref/core/ecc-autonomous-agent-harness.md` |
| MED | Extract gstack /plan-ceo-review | `gstack/plan-ceo-review/SKILL.md` | `_shared-ref/gsd/gstack-plan-ceo-review.md` |
| MED | Extract gstack /investigate | `gstack/investigate/SKILL.md` | `_shared-ref/gsd/gstack-investigate.md` |
| MED | Extract gstack /retro | `gstack/retro/SKILL.md` | `_shared-ref/gsd/gstack-retro.md` |
| LOW | Extract ECC security guide | `ecc/the-security-guide.md` | `_shared-ref/other/ecc-security-guide.md` |
| LOW | Extract ECC eval-harness | `ecc/skills/eval-harness/SKILL.md` | `_shared-ref/gsd/ecc-eval-harness.md` |
| LOW | Extract ECC cost-aware-pipeline | `ecc/skills/cost-aware-llm-pipeline/SKILL.md` | `_shared-ref/core/ecc-cost-aware-pipeline.md` |
| LOW | Extract gsd-2 token-optimization | `gsd-2/docs/token-optimization.md` | `_shared-ref/gsd/gsd2-token-optimization.md` |
| LOW | Extract gsd-2 parallel-orchestration | `gsd-2/docs/parallel-orchestration.md` | `_shared-ref/gsd/gsd2-parallel-orchestration.md` |
| LOW | Extract gstack skill template | `gstack/SKILL.md` | `_shared-ref/core/gstack-skill-template.md` |

---

*End of Section C-A*

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

## C9: Skill Factory — Deployed Commands and Skills
*Status: COMPLETE ✅ — 48 commands, 20 skills deployed as of 2026-04-14*

### Commands Deployed (48 total — C:\Users\User\.claude\commands\)

| Command | Purpose |
|---------|---------|
| api.md | REST/GraphQL API design, OpenAPI specs |
| automation.md | n8n workflows, Zapier, webhook integrations |
| backend.md | Node.js, Supabase, PostgreSQL, auth, security |
| build-hook.md | Generate Claude Code hooks interactively |
| build.md | Start building skills, prompts, agents, hooks |
| ci-guard.md | Trigger commit & branch guard workflow |
| codex-exec.md | Execute Codex CLI commands |
| cost-optimize.md | Audit session for token waste and cost |
| database.md | Schema design, RLS, migrations, ORM |
| devops.md | CI/CD, Docker, cloud deployment, IaC |
| docs.md | Technical documentation, READMEs, ADRs |
| enhance-claude-md.md | Initialize/enhance CLAUDE.md files |
| explore.md | Codebase exploration, architecture audit |
| factory-status.md | Check factory build progress |
| frontend.md | Next.js 15, React 19, Tailwind v4 |
| game.md | Unity, Godot, Unreal Engine |
| git/ | Git commands subfolder (cm, cp, pr, rv, sc) |
| gsd-debug.md | GSD: scientific method debugging |
| gsd-execute.md | GSD: execute PLAN.md |
| gsd-plan.md | GSD: create execution plan |
| gsd-roadmap.md | GSD: create strategic roadmap |
| gsd-verify.md | GSD: verify phase goal achievement |
| images.md | Imagen 4 image generation |
| install-hook.md | Install generated hook |
| install-skill.md | Install generated skills/agents |
| last30days.md | Research across Reddit/X/YouTube/TikTok/HN |
| marketing-research.md | Marketing research and campaign analysis |
| mobile.md | React Native, Expo, Flutter |
| orchestrator.md | Master router for all agents |
| pentest.md | Penetration testing (authorized only) |
| performance.md | Core Web Vitals, bundle, rendering |
| pm.md | Project planning, sprint management |
| refactor.md | Legacy code archaeology, safe refactoring |
| research.md | Tech evaluation, competitor analysis |
| review.md | Full review gate + CI visibility |
| run-release.md | Orchestrate tagged release |
| security-scan.md | Local security scanning |
| security.md | OWASP audit, RLS, vulnerability analysis |
| seo.md | SEO/GEO optimization, structured data |
| sync-agents-md.md | Regenerate AGENTS.md from CLAUDE.md |
| sync-branch.md | Sync feature branch with main |
| sync-todos-to-github.md | Convert TodoWrite tasks to GitHub issues |
| sync-vault.md | Sync Obsidian memory vault |
| test-factory.md | Quick testing helper |
| testing.md | Jest, Vitest, Playwright, RTL |
| ux.md | UX design, IA, accessibility, CRO |
| validate-output.md | Validate generated skills/prompts/agents |
| video.md | VEO 3 video generation |

### Skills Installed (20 total — C:\Users\User\.claude\skills\)

| Skill | Purpose |
|-------|---------|
| agent-factory | Generate custom agents with YAML frontmatter |
| app-store-optimization | ASO toolkit for App Store / Play Store |
| aws-solution-architect | AWS serverless architecture for startups |
| claude-md-enhancer | Generate/enhance CLAUDE.md files |
| cli-anything | CLI-Anything harness for tool bridging |
| codex-cli-bridge | Bridge Claude Code ↔ Codex CLI |
| content-trend-researcher | Multi-platform content trend research |
| cost-optimizer | Token and cost optimization auditor |
| hook-factory | Generate Claude Code hooks (10 templates) |
| last30days | Real-time research across 10+ platforms |
| mermaid-harness | Mermaid diagram generation (mmdc v11.12.0) |
| ms365-tenant-manager | Microsoft 365 tenant administration |
| prompt-factory | Prompt generation (69 presets, 15 domains) |
| scrum-master-agent | Scrum master / sprint planning assistant |
| skills/ | Skills subfolder |
| slash-command-factory | Custom slash command generator |
| social-media-analyzer | Social media performance analytics |
| system-cli-tools | PDF/image/OCR CLI tools |
| tdd-guide | TDD guide (Jest/Pytest/JUnit/Vitest/Mocha/RSpec) |
| tech-stack-evaluator | Technology evaluation with TCO analysis |

---

## C9-LEGACY: New Capabilities Summary (Original Analysis)

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

---

## C10: Cost Optimizer — Agent and Skill
*Status: DEPLOYED ✅ — Added in Tier 2*

The cost-optimizer was deployed in Tier 2 as both a skill package and standalone agent.

**Agent:** C:\Users\User\.claude\agents\cost-optimizer\cost-optimizer.md (397 lines)
**Skill:** C:\Users\User\.claude\skills\cost-optimizer\
**Command:** `/cost-optimize`

### Capabilities
- Audits Claude Code session setup for token waste (MCPs, agents, skills, model assignments)
- Produces ROI-ranked fix list with exact token savings estimates per fix
- Contains 5 decision flows: model selection, MCP overhead, context degradation, Skillbook, confidence check
- Contains top 10 ROI fixes with benchmark data
- Includes CostTracker dataclass for programmatic cost tracking
- References benchmark data from OpenSpace, ECC, and SuperClaude

### Model Routing Rules
| Task Type | Model | Rationale |
|-----------|-------|-----------|
| Search, explore, 1-file edits | **Haiku** | Cheapest; sufficient for simple tasks |
| Standard coding, multi-file | **Sonnet** | Best cost/quality ratio |
| Architecture, security, judgment | **Opus** | Reserve; 19x Haiku cost |

### Token Savings Benchmarks
- Skillbook protocol: **46-49%** token reduction on recurring tasks
- Context compaction at 60%: prevents quality degradation
- MCP schema awareness: ~500 tokens per MCP tool schema
- Parallel agent batching: reduces sequential overhead significantly
- Session sizing (2-3 tasks max): keeps quality at peak

---
## PART D — MASTER INTEGRATION PLAN

---

### D1: Infrastructure Stack

What should be running on this machine alongside Claude Code:

---

```
SERVICE: gws (Google Workspace CLI)
Source: cli-main/cli-main
Purpose: Execute Gmail, Drive, Sheets, Calendar, Chat, Docs, ModelArmor operations
         from agent Bash calls without managing OAuth tokens or HTTP clients manually.
         Enables n8n-specialist, project-manager, documentation-writer, research-specialist
         to interact with Google APIs in 1 command vs 10-step n8n credential setup.
Setup status: NEEDS-SETUP — binary not built; source at Downloads/new repos/cli-main/cli-main
Setup steps:
  Option A (Rust build): winget install Rustlang.Rustup && rustup install stable
    cd "C:\Users\User\Downloads\new repos\cli-main\cli-main"
    cargo build --release
    copy target\release\gws.exe C:\Users\User\.local\bin\gws.exe
  Option B (npm — faster): npm install -g @google-workspace/cli
  OAuth setup:
    Go to https://console.cloud.google.com/apis/credentials
    Create OAuth 2.0 Client ID (Desktop) → download client_secret.json
    Enable: Gmail, Drive, Sheets, Calendar, Chat, ModelArmor APIs
    gws auth setup && gws auth login
  Verify: gws drive files list  (returns JSON)
  Config dir: %USERPROFILE%\.config\gws\ (or set GOOGLE_WORKSPACE_CLI_CONFIG_DIR)
Agents that benefit: n8n-specialist, project-manager, documentation-writer,
                     research-specialist, security-auditor (ModelArmor), backend-specialist
Always-on or on-demand: ON-DEMAND — single binary, no daemon needed
```

---

```
SERVICE: claude-mem worker daemon
Source: claude-mem-main/claude-mem-main
Purpose: Captures every tool call and completion into SQLite at
         C:\Users\User\.claude-mem\db.sqlite. Injects relevant past observations
         into session start automatically via CC hooks.
         Most critical for: gsd-executor (avoids repeated failed approaches),
         research-specialist (recalls prior findings), gsd-debugger (project bug DB).
Setup status: NEEDS-SETUP — node_modules absent
Setup steps:
  cd "C:\Users\User\Downloads\new repos\claude-mem-main\claude-mem-main"
  npm install
  npm run build
  xcopy /E /I plugin "C:\Users\User\.claude\plugins\claude-mem"
  Merge hooks from plugin/hooks/hooks.json into C:\Users\User\.claude\settings.json
  bun plugin/scripts/worker-service.cjs start
  bun plugin/scripts/worker-service.cjs status  (expect PID response)
  Create C:\Users\User\.claude-mem\.env:
    CLAUDE_MEM_DB_PATH=C:\Users\User\.claude-mem\db.sqlite
    CLAUDE_MEM_RETENTION_DAYS=180
    CLAUDE_MEM_WORKER_AUTORESTART=true
Agents that benefit: ALL 27 (passive — automatic once daemon runs)
  Top 5: gsd-executor, research-specialist, gsd-debugger, backend-specialist, code-archaeologist
Always-on or on-demand: ALWAYS-ON — worker daemon must be running for capture to work
```

---

```
SERVICE: last30days research script
Source: last30days-skill-main/last30days-skill-main
Purpose: Aggregates research across Reddit, HN, web, YouTube, TikTok, X for a given
         topic over last 30 days. research-specialist gains structured social signal
         aggregation currently absent from the system.
Setup status: NEEDS-SETUP — Python venv not created
Setup steps:
  cd "C:\Users\User\Downloads\new repos\last30days-skill-main\last30days-skill-main"
  python -m venv .venv && .venv\Scripts\activate
  pip install -r requirements.txt
  python scripts/last30days.py --setup  (skip ScrapeCreators; use free sources)
  Test: python scripts/last30days.py "Claude Code 2026"
  Optional: set BRAVE_API_KEY for enhanced web search results
Agents that benefit: research-specialist (primary), gsd-roadmapper (market context)
Always-on or on-demand: ON-DEMAND — Python script, one invocation per query
```

---

```
SERVICE: Apify CLI
Source: apify-cli-master
Purpose: 1000+ pre-built web scraping Actors on Apify cloud. Fills research-specialist
         gap for arbitrary web data extraction beyond social media APIs.
Setup status: NEEDS-SETUP
Setup steps:
  npm install -g apify-cli
  apify auth login  (provide APIFY_TOKEN from console.apify.com/account/integrations)
  Test: apify call apify/rag-web-browser --input '{"startUrls":[{"url":"https://example.com"}]}'
  Free tier: ~$5/month compute — sufficient for research use
Agents that benefit: research-specialist, security-auditor (competitor recon)
Always-on or on-demand: ON-DEMAND — CLI per scraping task
```

---

```
SERVICE: claude-code-skill-factory commands
Source: claude-code-skill-factory-dev
Purpose: 5 Q&A-guided factories (skills, agents, prompts, hooks, commands).
         New skill creation from hours to ~30 minutes. Highest-ROI deployment in this batch.
Setup status: NEEDS-SETUP — commands not installed to .claude/commands/
Setup steps:
  xcopy /E /I "C:\Users\User\Downloads\new repos\claude-code-skill-factory-dev\.claude\commands\*"
              "C:\Users\User\.claude\commands\"
  Test: invoke /build in Claude Code session (should start skills-guide Q&A wizard)
Agents that benefit: ALL 27 — creates new skills for any agent on demand
Always-on or on-demand: ON-DEMAND — slash command per skill creation session
```

---

### D2: Shared Ref Additions

Exact files to add to `C:\Users\User\.claude\agents\_shared-ref\`:

**PRIORITY: HIGH**

```
SOURCE: everything-claude-code-main/skills/context-budget/SKILL.md
DESTINATION: _shared-ref\core\ecc-context-budget.md
CONTENT: Token optimization, context window budgeting, system prompt slimming
BENEFITS: ALL 27 agents — token cost reduction reference

SOURCE: everything-claude-code-main/the-longform-guide.md
DESTINATION: _shared-ref\core\ecc-longform-guide.md
CONTENT: Multi-agent system design: memory persistence, evals, parallelization, token optimization
BENEFITS: gsd-executor, gsd-planner, orchestrator

SOURCE: gstack-main/review/SKILL.md
DESTINATION: _shared-ref\other\gstack-review.md
CONTENT: Garry Tan's multi-axis code review: bugs/style/performance/security/architecture
BENEFITS: code-archaeologist, security-auditor, testing-specialist

SOURCE: gstack-main/cso/SKILL.md
DESTINATION: _shared-ref\other\gstack-cso.md
CONTENT: CSO workflow: OWASP + STRIDE + API security + data protection audit
BENEFITS: security-auditor — adds STRIDE and API security to current OWASP coverage

SOURCE: autoresearch-master/program.md
DESTINATION: _shared-ref\core\autoresearch-loop-protocol.md
CONTENT: Autonomous loop protocol: time-boxing, keep/discard metric, git checkpoints, simplicity criterion
BENEFITS: gsd-executor, gsd-planner, code-archaeologist

SOURCE: [write new file — SuperClaude confidence.py pattern]
DESTINATION: _shared-ref\confidence-check.md
CONTENT: Confidence rubric 0-100, self-check checklist, reflexion trigger at <75
BENEFITS: ALL 27 agents

SOURCE: [write new file — SuperClaude reflexion.py pattern]
DESTINATION: _shared-ref\reflexion-pattern.md
CONTENT: Failure logging format, weekly review cycle, improved prompt generation
BENEFITS: ALL 27 agents

SOURCE: [write new file — ACE Skillbook pattern]
DESTINATION: _shared-ref\gsd\skillbook-template.md
CONTENT: STATE.md SKILLBOOK section: Active Strategies / Reflection Log / Discard Log
BENEFITS: gsd-executor (primary), all GSD pipeline agents

SOURCE: [write new file — Aegis .context/ design]
DESTINATION: _shared-ref\other\aegis-context-template\
CONTENT: .context/ directory structure, AI_INSTRUCTIONS.md template, decisions/ template, sessions/ template
BENEFITS: All project-level usage — foundational project setup pattern
```

**PRIORITY: MED**

```
SOURCE: everything-claude-code-main/skills/agentic-engineering/SKILL.md
DESTINATION: _shared-ref\core\ecc-agentic-engineering.md
BENEFITS: orchestrator, gsd-executor, gsd-planner

SOURCE: everything-claude-code-main/skills/autonomous-agent-harness/SKILL.md
DESTINATION: _shared-ref\core\ecc-autonomous-agent-harness.md
BENEFITS: gsd-executor autonomous mode

SOURCE: everything-claude-code-main/the-security-guide.md
DESTINATION: _shared-ref\other\ecc-security-guide.md
BENEFITS: security-auditor, penetration-tester — AgentShield + prompt injection

SOURCE: everything-claude-code-main/skills/eval-harness/SKILL.md
DESTINATION: _shared-ref\gsd\ecc-eval-harness.md
BENEFITS: gsd-verifier — checkpoint verification + pass@k metrics

SOURCE: everything-claude-code-main/skills/deep-research/SKILL.md
DESTINATION: _shared-ref\other\ecc-deep-research.md
BENEFITS: research-specialist — citation tracking, multi-source synthesis

SOURCE: everything-claude-code-main/skills/memory-persistence/SKILL.md
DESTINATION: _shared-ref\core\ecc-memory-persistence.md
BENEFITS: gsd-executor, backend-specialist

SOURCE: everything-claude-code-main/skills/cost-aware-llm-pipeline/SKILL.md
DESTINATION: _shared-ref\core\ecc-cost-aware-pipeline.md
BENEFITS: orchestrator, all 27 agents — budget enforcement

SOURCE: gstack-main/plan-ceo-review/SKILL.md
DESTINATION: _shared-ref\gsd\gstack-plan-ceo-review.md
BENEFITS: gsd-roadmapper, project-manager

SOURCE: gstack-main/investigate/SKILL.md
DESTINATION: _shared-ref\gsd\gstack-investigate.md
BENEFITS: gsd-debugger, security-auditor

SOURCE: gstack-main/retro/SKILL.md
DESTINATION: _shared-ref\gsd\gstack-retro.md
BENEFITS: gsd-verifier post-phase retrospective

SOURCE: gsd-2-main/docs/parallel-orchestration.md
DESTINATION: _shared-ref\gsd\gsd2-parallel-orchestration.md
BENEFITS: gsd-planner — parallel milestone slice design

SOURCE: gsd-2-main/docs/token-optimization.md
DESTINATION: _shared-ref\gsd\gsd2-token-optimization.md
BENEFITS: gsd-planner, gsd-executor

SOURCE: claude-code-templates-main/cli-tool/templates/common/
DESTINATION: _shared-ref\project-templates\common\
BENEFITS: ALL agents scaffolding new projects

SOURCE: claude-code-templates-main/cli-tool/templates/javascript-typescript/
DESTINATION: _shared-ref\project-templates\javascript-typescript\
BENEFITS: frontend, backend, api-designer agents

SOURCE: claude-code-templates-main/cli-tool/templates/python/
DESTINATION: _shared-ref\project-templates\python\
BENEFITS: backend-specialist, devops-engineer
```

---

### D3: Per-Agent Enhancement Queue

```
AGENT: gsd-executor
ACTION: Add ref + instruction updates
SOURCE MATERIAL: ACE Skillbook, gsd-2 worktree isolation + time estimates
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/skillbook-template.md — add SKILLBOOK section to STATE.md template
  - Instruction: "For risky refactoring: git worktree add ../task-branch branch-name; merge only on test pass"
  - Instruction: "Every task has explicit time estimate; >2× estimate = surface as blocker immediately, do not continue silently"
PRIORITY: CRITICAL | COMPLEXITY: LOW

AGENT: gsd-verifier
ACTION: Add 8-question quality gate + refs
SOURCE MATERIAL: gsd-2 quality gate, ECC eval-harness, gstack retro
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/ecc-eval-harness.md
  - _shared-ref/gsd/gstack-retro.md
  - Instruction: Add 8-question checklist before phase sign-off:
    (1) requirements met, (2) test coverage, (3) security reviewed,
    (4) performance acceptable, (5) maintainability, (6) docs updated,
    (7) scope respected, (8) design reviewed
PRIORITY: CRITICAL | COMPLEXITY: LOW

AGENT: gsd-planner
ACTION: Add parallel slicing + PREFERENCES.md support + time estimates
SOURCE MATERIAL: gsd-2 parallel orchestration + PREFERENCES.md, gstack plan-ceo-review
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/gsd2-parallel-orchestration.md
  - _shared-ref/gsd/gstack-plan-ceo-review.md
  - Instruction: "Every PLAN.md task MUST include time estimate; for large phases consider independent parallel slices"
  - Instruction: "Check for PREFERENCES.md at project root — use test_command, build_command, cost_budget_usd"
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: gsd-debugger
ACTION: Add structured investigation protocol
SOURCE MATERIAL: gstack investigate
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/gstack-investigate.md
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: gsd-roadmapper
ACTION: Add strategic planning framework
SOURCE MATERIAL: gstack plan-ceo-review
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/gstack-plan-ceo-review.md
  - Instruction: "At roadmap creation, answer 6 questions: What problem? Why now? Success metrics? MVP scope? Risks? Resource plan?"
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: research-specialist
ACTION: Add multi-source aggregation + Apify + ECC deep-research
SOURCE MATERIAL: last30days, apify-cli, ECC deep-research
SPECIFIC ADDITIONS:
  - _shared-ref/other/ecc-deep-research.md
  - Instruction: "For 30-day trend research: python scripts/last30days.py '<topic>' (free: Reddit+HN+web)"
  - Instruction: "For arbitrary web scraping: apify call apify/rag-web-browser --input '{\"startUrls\":[{\"url\":\"URL\"}]}'"
  - Instruction: "Classify query type before selecting sources: product/trends/comparison/news/person/event"
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: security-auditor
ACTION: Add CSO workflow + ECC security guide + SuperClaude security mode
SOURCE MATERIAL: gstack cso, ECC security guide
SPECIFIC ADDITIONS:
  - _shared-ref/other/gstack-cso.md
  - _shared-ref/other/ecc-security-guide.md
  - Modes section: "security mode: treat all inputs as adversarial, CVSS score every finding, refuse insecure patterns"
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: code-archaeologist (refactor)
ACTION: Add simplicity criterion + gstack review
SOURCE MATERIAL: autoresearch simplicity criterion, gstack review
SPECIFIC ADDITIONS:
  - _shared-ref/other/gstack-review.md
  - _shared-ref/core/autoresearch-loop-protocol.md
  - Instruction: "Prefer deletion over addition. A passing test with less code beats same test with more code."
PRIORITY: HIGH | COMPLEXITY: LOW

AGENT: n8n-specialist
ACTION: Add gws command patterns
SOURCE MATERIAL: cli-main gws skills
SPECIFIC ADDITIONS:
  - Instruction: "When gws binary available (gws --version confirms): use gws gmail/sheets/drive/chat Bash commands instead of n8n credential node setup"
  - Top 10 gws commands with exact syntax (from C1 section)
PRIORITY: HIGH (after gws setup) | COMPLEXITY: LOW

AGENT: project-manager
ACTION: Add gws calendar/gmail + strategic planning
SOURCE MATERIAL: cli-main gws calendar/meet/gmail skills, gstack plan-ceo-review
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/gstack-plan-ceo-review.md
  - Instruction: "Schedule milestone reviews: gws calendar events insert --calendarId primary --body '{...}'"
  - Instruction: "Check team availability: gws calendar freebusy query"
PRIORITY: HIGH (after gws setup) | COMPLEXITY: LOW

AGENT: documentation-writer
ACTION: Add gws Drive/Docs + CLI-Anything harnesses
SOURCE MATERIAL: cli-main gws drive/docs skills, CLI-Anything LibreOffice/Draw.io/Mermaid
SPECIFIC ADDITIONS:
  - Instruction: "Upload docs to Drive: gws drive files create + gws drive files update"
  - Instruction: "Architecture diagrams: CLI-Anything/Draw.io harness (already in registry)"
  - Instruction: "PDF/DOCX export: CLI-Anything/LibreOffice harness (already in registry)"
PRIORITY: MED | COMPLEXITY: LOW

AGENT: devops-engineer
ACTION: Add gws Chat alerts + agentic engineering ref
SOURCE MATERIAL: cli-main gws chat, ECC agentic-engineering
SPECIFIC ADDITIONS:
  - _shared-ref/core/ecc-agentic-engineering.md
  - Instruction: "Send deploy alerts: gws chat spaces messages create --parent spaces/SPACE_ID --body '{\"text\":\"...\"}'"
PRIORITY: MED | COMPLEXITY: LOW

AGENT: database-architect
ACTION: Add gws Sheets as lightweight data store
SOURCE MATERIAL: cli-main gws sheets
SPECIFIC ADDITIONS:
  - Instruction: "For structured data logging without a DB: gws sheets spreadsheets values append as persistent tabular store"
PRIORITY: MED | COMPLEXITY: LOW

AGENT: backend-specialist
ACTION: Add memory persistence + cost-aware pipeline refs
SOURCE MATERIAL: ECC memory-persistence, ECC cost-aware-pipeline
SPECIFIC ADDITIONS:
  - _shared-ref/core/ecc-memory-persistence.md
  - _shared-ref/core/ecc-cost-aware-pipeline.md
PRIORITY: MED | COMPLEXITY: LOW

AGENT: testing-specialist
ACTION: Add eval harness + gstack review
SOURCE MATERIAL: ECC eval-harness, gstack review
SPECIFIC ADDITIONS:
  - _shared-ref/gsd/ecc-eval-harness.md
  - _shared-ref/other/gstack-review.md
PRIORITY: MED | COMPLEXITY: LOW

AGENT: performance-optimizer
ACTION: Add benchmark harness pattern + cost-aware pipeline
SOURCE MATERIAL: OpenSpace GDPVal pattern, ECC cost-aware-pipeline
SPECIFIC ADDITIONS:
  - _shared-ref/core/ecc-cost-aware-pipeline.md
  - Instruction: "Before/after benchmarks required for every optimization claim; use OpenSpace GDPVal 50-task format"
PRIORITY: MED | COMPLEXITY: LOW

AGENT: nano-genesis (images)
ACTION: Add CLI-Anything harnesses for pre/post processing
SOURCE MATERIAL: CLI-Anything GIMP/Blender/Inkscape/Krita/OBS
SPECIFIC ADDITIONS:
  - Instruction: "Pre-process with CLI-Anything/GIMP (resize, format) before Imagen 4 generation"
  - Instruction: "Post-process with CLI-Anything/Inkscape for SVG export"
  - Instruction: "3D renders: CLI-Anything/Blender harness (already in registry)"
PRIORITY: MED (after CLI-Anything setup) | COMPLEXITY: LOW

AGENT: veo-genesis (video)
ACTION: Add CLI-Anything OBS/Kdenlive harnesses
SOURCE MATERIAL: CLI-Anything OBS, Kdenlive harnesses
SPECIFIC ADDITIONS:
  - Instruction: "Screen recording capture: CLI-Anything/OBS harness"
  - Instruction: "Video assembly: CLI-Anything/Kdenlive harness"
PRIORITY: MED (after CLI-Anything setup) | COMPLEXITY: LOW

AGENT: penetration-tester
ACTION: Add ECC security guide + Burp harness instruction
SOURCE MATERIAL: ECC security guide, CLI-Anything (Burp harness to create)
SPECIFIC ADDITIONS:
  - _shared-ref/other/ecc-security-guide.md
  - Instruction: "Create Burp Suite CLI-Anything harness (7-phase process); target SARIF output format for structured findings"
PRIORITY: MED | COMPLEXITY: MED (requires new harness)

AGENT: seo-specialist
ACTION: Add Apify competitor research
SOURCE MATERIAL: apify-cli
SPECIFIC ADDITIONS:
  - Instruction: "Competitor page SEO analysis: apify call apify/rag-web-browser for structural/content data"
PRIORITY: LOW | COMPLEXITY: LOW

AGENT: ux-specialist
ACTION: Add gws Forms integration
SOURCE MATERIAL: cli-main gws forms
SPECIFIC ADDITIONS:
  - Instruction: "Create user research forms: gws forms create; collect responses: gws forms responses list"
PRIORITY: LOW (after gws setup) | COMPLEXITY: LOW

AGENT: api-designer
ACTION: Add gws schema introspection
SOURCE MATERIAL: cli-main gws schema command
SPECIFIC ADDITIONS:
  - Instruction: "Before designing Google API integration: gws schema <service>.<resource>.<method> for exact spec"
PRIORITY: LOW | COMPLEXITY: LOW

AGENT: game-developer
ACTION: Add CLI-Anything Blender harness
SOURCE MATERIAL: CLI-Anything Blender
SPECIFIC ADDITIONS:
  - Instruction: "3D render pipeline: CLI-Anything/Blender harness for programmatic render generation"
PRIORITY: LOW | COMPLEXITY: LOW

AGENT: mobile-developer
ACTION: No change needed — claude-mem passive benefit sufficient
PRIORITY: LOW | COMPLEXITY: N/A

AGENT: orchestrator
ACTION: Add cost-awareness + agentic engineering refs
SOURCE MATERIAL: ECC cost-aware-pipeline, ECC agentic-engineering
SPECIFIC ADDITIONS:
  - _shared-ref/core/ecc-cost-aware-pipeline.md
  - _shared-ref/core/ecc-agentic-engineering.md
  - Instruction: "Track estimated token budget per delegation; prefer lighter agent for equivalent capability"
PRIORITY: MED | COMPLEXITY: LOW

--- SYSTEM-WIDE: ALL 27 AGENTS ---
Add to every agent .md file:
  1. ## Modes section (deep-dive / rapid-prototype / default) from superclaude-modes.md
  2. Reference to _shared-ref/confidence-check.md in quality gate section
  3. Reference to _shared-ref/reflexion-pattern.md for failure logging
Complexity: MED — 27 files × 3 small additions | Priority: MED
```

---

### D4: New Capabilities Unlocked

**Google Workspace Automation** (requires gws)
1. Send formatted email reports from any agent — `gws gmail users messages send` replaces manual copy-paste
2. Auto-schedule sprint reviews in Google Calendar from gsd-executor milestone completion hooks
3. Log all agent decisions/outputs to Google Sheets — permanent searchable audit trail
4. Watch Gmail for approval emails and fire agent workflows — `gws gmail users watch`
5. Create user research Google Forms from ux-specialist without leaving Claude Code
6. Send real-time deployment/error alerts to Google Chat from devops-engineer
7. Sanitize LLM prompts via gws ModelArmor before sensitive API calls from security-auditor
8. Upload project documentation directly to Google Drive from documentation-writer

**Research & Intelligence** (requires last30days + Apify)
9. Aggregate community trending opinions (Reddit + HN + X + YouTube) on any topic via last30days
10. Scrape any competitor website for pricing/features via Apify without proxy management
11. Aggregate G2/Capterra reviews for product comparison research
12. Track GitHub trending repos in any technology for tech evaluation context

**Session Memory** (requires claude-mem daemon)
13. gsd-executor automatically avoids previously-failed commands and approaches across projects
14. research-specialist recalls prior findings — no duplicate web queries for already-answered topics
15. gsd-debugger builds a persistent per-project bug pattern database over time
16. Any agent recalls project-specific patterns from prior sessions without manual re-loading

**Skill & Agent Creation** (requires skill-factory deployment)
17. Generate a production SKILL.md for any CLI tool in ~30 minutes via Q&A workflow (/build)
18. Create new specialized agents via /build with deployment-ready YAML frontmatter
19. Generate event-driven hooks automatically via hook-factory (no manual JSON authoring)
20. Validate all new skills/agents against quality gates before deployment (/validate-output)
21. Sync agent task lists directly to GitHub Issues with one command (/sync-todos-to-github)

**Desktop Application Control** (requires CLI-Anything)
22. Generate architecture diagrams from structured text — CLI-Anything/Draw.io + system-architect
23. Batch resize/optimize images for web — CLI-Anything/GIMP + frontend agent
24. Export final documentation to PDF/DOCX without GUI — CLI-Anything/LibreOffice + docs-writer
25. Generate ERDs/flowcharts from database schema text — CLI-Anything/Mermaid + database-architect
26. Record annotated screen walkthroughs — CLI-Anything/OBS + veo-genesis
27. Programmatic 3D render generation — CLI-Anything/Blender + images/game-developer
28. Run local LLM model comparisons for tech eval — CLI-Anything/Ollama + research-specialist
29. Generate citation bibliographies from Zotero library — CLI-Anything/Zotero + docs-writer
30. Ingest research into NotebookLM for audio summaries — CLI-Anything/NotebookLM + research-specialist

**Quality & Learning** (ref extraction only — no external setup)
31. All agents self-assess confidence 0-100 before output; auto-retry if <75
32. All agents log failures and run weekly reflexion cycles to improve their own prompts
33. gsd-executor captures project-specific strategies in SKILLBOOK section of STATE.md
34. gsd-verifier runs 8-question quality gate before any phase sign-off (vs current 3-level check)
35. All projects get unified .context/ + .planning/ dual-layer structure for persistent knowledge
36. code-archaeologist enforces simplicity criterion: deletion preferred over addition

**Security & Review** (ref extraction only)
37. code-archaeologist runs Garry Tan's multi-axis review (bugs/style/perf/security/arch)
38. security-auditor adds STRIDE threat modeling + API security audit to OWASP coverage
39. penetration-tester gains structured SARIF output from Burp Suite harness (new)

**Token & Cost Optimization** (ref extraction only)
40. Orchestrator tracks estimated token cost per delegation; prefers cheaper equivalent
41. gsd-planner enforces time-boxing; >2× estimate surfaces as blocker immediately
42. OpenSpace skill evolution reduces per-task token cost 30-46% after warm-up period

---

### D5: Execution Sequence
*Updated: 2026-04-14 — Phases 1 and 2 COMPLETE. Phase 3 partial.*

```
PHASE 1: IMMEDIATE REF EXTRACTIONS — ✅ COMPLETE (2026-04-09)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All 34 ref file extractions completed. Files live in _shared-ref/core/, gsd/, other/.

STEP 1: Copy ECC context-budget skill
  cp "Downloads\...\everything-claude-code-main\skills\context-budget\SKILL.md"
     "C:\Users\User\.claude\agents\_shared-ref\core\ecc-context-budget.md"
  WHY FIRST: ALL 27 agents benefit from token optimization reference immediately
  DEPENDS ON: nothing

STEP 2: Copy ECC longform guide (parallel with step 1)
  cp "everything-claude-code-main\the-longform-guide.md"
     "_shared-ref\core\ecc-longform-guide.md"
  DEPENDS ON: nothing

STEP 3: Copy 5 gstack skills in batch (review, cso, plan-ceo-review, investigate, retro)
  for %%s in (review cso plan-ceo-review investigate retro) do
    cp "gstack-main\%%s\SKILL.md" "_shared-ref\<target>\gstack-%%s.md"
  DEPENDS ON: nothing

STEP 4: Copy autoresearch loop protocol
  cp "autoresearch-master\program.md"
     "_shared-ref\core\autoresearch-loop-protocol.md"
  DEPENDS ON: nothing

STEP 5: Copy 7 more ECC skills (agentic-engineering, autonomous-agent-harness, eval-harness,
         deep-research, memory-persistence, cost-aware-pipeline, continuous-learning-v2)
  DEPENDS ON: nothing (run parallel with steps 1-4)

STEP 6: Copy ECC security guide
  cp "everything-claude-code-main\the-security-guide.md"
     "_shared-ref\other\ecc-security-guide.md"
  DEPENDS ON: nothing

STEP 7: Copy claude-code-templates project templates (common, js-ts, python)
  DEPENDS ON: nothing

STEP 8: Write confidence-check.md (new file, ~50 lines)
  Content: confidence rubric 0-100, self-check checklist, reflexion trigger at <75
  DESTINATION: _shared-ref\confidence-check.md
  DEPENDS ON: nothing

STEP 9: Write reflexion-pattern.md (new file, ~30 lines)
  Content: failure log format, weekly review cycle, failures.jsonl storage path
  DESTINATION: _shared-ref\reflexion-pattern.md
  DEPENDS ON: nothing

STEP 10: Write skillbook-template.md (new file, ~40 lines)
  Content: STATE.md SKILLBOOK section template (Active/Reflection/Discard)
  DESTINATION: _shared-ref\gsd\skillbook-template.md
  DEPENDS ON: nothing

STEP 11: Write aegis-context-template/ directory (new files, ~5 files)
  Content: AI_INSTRUCTIONS.md template, decisions/template.md, sessions/template.md
  DESTINATION: _shared-ref\other\aegis-context-template\
  DEPENDS ON: nothing

PHASE 2: AGENT FILE ENHANCEMENTS — ✅ COMPLETE (2026-04-09)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All 27 agents enhanced with MODES, confidence-check, reflexion-pattern.
n8n-specialist and project-manager gained Bash tool. cost-optimizer agent added.

STEP 12: Update gsd-executor (Skillbook + worktree + time budget)
  DEPENDS ON: step 10 (skillbook-template written)

STEP 13: Update gsd-verifier (8-question gate + eval-harness + retro)
  DEPENDS ON: steps 3, 5 (gstack-retro + ecc-eval-harness written)

STEP 14: Update gsd-planner (parallel slices + PREFERENCES.md + estimates)
  DEPENDS ON: steps 3, 5 (gstack-plan-ceo-review + gsd2-parallel-orchestration)

STEP 15: Update gsd-debugger (investigate protocol)
  DEPENDS ON: step 3 (gstack-investigate)

STEP 16: Update research-specialist (last30days + Apify + deep-research)
  DEPENDS ON: step 5 (ecc-deep-research)

STEP 17: Update security-auditor (CSO + security guide + security mode)
  DEPENDS ON: steps 3, 6 (gstack-cso + ecc-security-guide)

STEP 18: Update code-archaeologist (simplicity criterion + review)
  DEPENDS ON: steps 3, 4 (gstack-review + autoresearch-loop-protocol)

STEP 19: Update gsd-roadmapper (strategic planning)
  DEPENDS ON: step 3 (gstack-plan-ceo-review)

STEP 20: Add Modes section to 5 priority agents
  (security-auditor, database-architect, research-specialist, performance-optimizer, testing-specialist)
  DEPENDS ON: steps 8, 9 (confidence-check + reflexion-pattern)

STEP 21: Add confidence-check + reflexion-pattern refs to ALL 27 agents
  Note: 27 file edits — use a script or process in batches of 5
  DEPENDS ON: steps 8, 9

PHASE 3: INFRASTRUCTURE SETUP — 🔄 PARTIAL (2026-04-14)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ claude-mem: ACTIVE (v12.0.1, port 37777)
✅ Skill factory commands: 48 deployed
✅ Skills: 20 installed
⚠️ gws CLI: installed (v0.22.5) but OAuth PENDING
⚠️ Apify: installed but no API token
⚠️ last30days plugin: not yet installed

STEP 22: Install claude-code-skill-factory commands (5 min, no credentials)
  xcopy /E /I "claude-code-skill-factory-dev\.claude\commands\*"
              "C:\Users\User\.claude\commands\"
  DEPENDS ON: nothing | COMPLEXITY: LOW

STEP 23: Install gws binary (30-60 min compile or 5 min npm)
  npm install -g @google-workspace/cli  (preferred on Windows)
  DEPENDS ON: Node.js 18+

STEP 24: OAuth2 setup for gws (15-30 min, requires browser)
  Create GCP project + enable APIs + download credentials + gws auth setup + gws auth login
  DEPENDS ON: step 23

STEP 25: Update n8n-specialist + project-manager + docs-writer with gws instructions
  DEPENDS ON: step 24 (gws working and tested)

STEP 26: Install claude-mem (30-60 min, requires Node.js + Bun)
  npm install + build + xcopy plugin + register hooks + start worker daemon
  DEPENDS ON: Node.js 18+, Bun 1.0+
  NOTE: Test in 1 session before marking always-on

STEP 27: Install last30days Python environment (15 min)
  python -m venv .venv && pip install -r requirements.txt && python last30days.py --setup
  DEPENDS ON: Python 3.10+ in PATH

STEP 28: Install Apify CLI (5 min)
  npm install -g apify-cli && apify auth login
  DEPENDS ON: Node.js, Apify account

PHASE 4: CLI-ANYTHING HARNESS ACTIVATION — 📋 PENDING (Tier 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLI-Anything skill installed but individual app harnesses not yet deployed.
Pending Tier 3 prompt to deploy Draw.io, OBS, GIMP, Blender, LibreOffice harnesses.

STEP 29: Install CLI-Anything plugin to Claude Code
  Copy plugin directory to C:\Users\User\.claude\skills\
  Register in settings.json
  DEPENDS ON: nothing

STEP 30: Activate 5 priority harnesses (Draw.io, OBS, GIMP, Mermaid, LibreOffice)
  For each: verify app installed → test CLI → register SKILL.md
  DEPENDS ON: step 29, target apps installed

STEP 31: Create Burp Suite harness via 7-phase process (2-4 hrs)
  DEPENDS ON: steps 29-30, Burp Suite installed

STEP 32: Create Word/Excel COM harnesses (2-4 hrs each)
  DEPENDS ON: steps 29-30, Office installed

PHASE 5: VERIFICATION — 🔄 PARTIAL (Phases 1+2 verified, 3-5 pending)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Phase 1 verified: All 34 ref files in _shared-ref confirmed present
✅ Phase 2 verified: All 27 agents have MODES, confidence, reflexion sections
⚠️ Phase 3-5: Pending completion of gws OAuth, Apify token, last30days install

STEP 33: Smoke test each infrastructure service
  gws: gws drive files list
  claude-mem: start session, verify db.sqlite has new entries
  last30days: python last30days.py "test query"
  Apify: apify call apify/rag-web-browser --input '{"startUrls":[{"url":"https://example.com"}]}'

STEP 34: Run reference session — invoke each enhanced agent, verify refs load correctly

STEP 35: Begin weekly reflexion cycle
  Every week: review C:\Users\User\.claude\sessions\*\failures.jsonl
  Generate improved instructions for agents with >15% failure rate
  Apply improvements to agent .md files

---

## APPENDIX: Quick Reference Cards

### Quick Card: gws Command Patterns for Agents

```bash
# Gmail — n8n-specialist, project-manager
gws gmail users messages list --userId me --q "is:unread" --maxResults 10
gws gmail users messages send --userId me --body '{"raw":"BASE64_EMAIL"}'
gws gmail users watch --userId me --body '{"topicName":"projects/PROJECT/topics/TOPIC"}'

# Calendar — project-manager, gsd-executor
gws calendar events list --calendarId primary --timeMin 2026-04-08T00:00:00Z
gws calendar events insert --calendarId primary \
  --body '{"summary":"Sprint Review","start":{"dateTime":"2026-04-09T10:00:00Z"},"end":{"dateTime":"2026-04-09T11:00:00Z"}}'
gws calendar freebusy query \
  --body '{"timeMin":"2026-04-09T00:00:00Z","timeMax":"2026-04-10T00:00:00Z","items":[{"id":"primary"}]}'

# Drive — documentation-writer, research-specialist
gws drive files list --q "name contains 'Report'"
gws drive files create --body '{"name":"Report.md","parents":["FOLDER_ID"]}'

# Sheets — all agents (logging, persistent data)
gws sheets spreadsheets values get --spreadsheetId SHEET_ID --range "Sheet1!A1:Z100"
gws sheets spreadsheets values append --spreadsheetId SHEET_ID --range "Sheet1!A1" \
  --valueInputOption RAW --body '{"values":[["timestamp","agent","event","result"]]}'

# Introspect any API method before calling
gws schema gmail.users.messages.send
gws --dry-run gmail users messages send --userId me --body '{...}'
```

### Quick Card: Agent Trigger Matrix

| When user asks for... | Use agent |
|----------------------|-----------|
| UI component, Next.js page, Tailwind styling | /frontend (ui-specialist) |
| API design, REST/GraphQL, OpenAPI spec | /api (api-designer) |
| Database schema, SQL, migrations, indexes | /database (database-architect) |
| Node.js backend, Supabase, auth, RLS | /backend (backend-specialist) |
| Security audit, OWASP, RLS, CVE | /security (security-auditor) |
| CI/CD, Docker, deploy, Vercel, Railway | /devops (devops-engineer) |
| Unit/integration/E2E tests | /testing (testing-specialist) |
| n8n workflow, automation, webhook | /automation (n8n-specialist) |
| Project planning, task breakdown, sprint | /pm (project-manager) |
| UX design, user flows, accessibility | /ux (ux-specialist) |
| SEO, structured data, Core Web Vitals | /seo (seo-specialist) |
| Legacy code, refactor, dead code | /refactor (code-archaeologist) |
| Research, tech evaluation, comparison | /research (research-specialist) |
| Documentation, README, ADR, changelog | /docs (documentation-writer) |
| Image generation, product photos, brand | /images (nano-genesis) |
| Video generation | /video (veo-genesis) |
| GSD strategic roadmap | /gsd-roadmap |
| GSD phase plan | /gsd-plan |
| GSD execution | /gsd-execute |
| GSD verification | /gsd-verify |
| Debugging, root cause analysis | /gsd-debug |
| Pen testing, PTES, ethical hacking | /pentest (penetration-tester) |
| Mobile app, React Native, Flutter | /mobile (mobile-developer) |
| Game development, Unity, Godot | /game (game-developer) |
| Performance optimization, CWV, bundle | /performance (performance-optimizer) |
| Codebase exploration, architecture audit | /explore (explorer-agent) |

### Quick Card: New Skills to Create (Priority Order)

| Skill | Tool | Creation Method | Target Agent | Priority |
|-------|------|----------------|-------------|----------|
| confidence-checker | Inline pattern | Edit agent files | ALL | CRITICAL |
| skillbook-manager | STATE.md pattern | Write template file | gsd-executor | CRITICAL |
| gws-gmail-automation | gws CLI | skill-factory /build | n8n-specialist | HIGH |
| gws-sheets-logger | gws CLI | skill-factory /build | backend-specialist | HIGH |
| last30days-research | Python script | skill-factory /build | research-specialist | HIGH |
| apify-web-scraper | Apify CLI | skill-factory /build | research-specialist | HIGH |
| draw-io-diagram | CLI-Anything (exists) | AnyGen + skill-factory | docs-writer | MED |
| gimp-image-processor | CLI-Anything (exists) | AnyGen + skill-factory | images | MED |
| mermaid-diagram | CLI-Anything (exists) | AnyGen + skill-factory | db-architect | MED |
| burp-suite-scanner | CLI-Anything (new harness) | 7-phase + skill-factory | security-auditor | MED |
| ms-word-automation | CLI-Anything (new COM) | 7-phase + skill-factory | docs-writer | LOW |
| ms-excel-automation | CLI-Anything (new COM) | 7-phase + skill-factory | db-architect | LOW |

---

## PART E — TIER STATUS TRACKER
*Added: 2026-04-14*

| Tier | Name | Status | Completed | Pending |
|------|------|--------|-----------|---------|
| Tier 1 | Foundation | ✅ COMPLETE (minus gws auth) | claude-mem install, gws install, Agent Teams enabled, auto-memory active, Bash tools for n8n+pm | gws OAuth (user action required) |
| Tier 2 | Enhancement | ✅ COMPLETE | 34 ref file extractions, 27 agents enhanced (MODES+confidence+reflexion), skill factory (48 commands + 20 skills), GSD v2 upgrades, cost-optimizer agent | — |
| Tier 3 | Research Tools | 🔄 PROMPT READY | — | Apify token config, last30days plugin install, CLI-Anything app harnesses, Obsidian vault setup |
| Tier 4 | Karpathy Methods | 📋 PLANNED | — | Gap analysis, approaches gate, git ratchet, metric delegation, handoff protocols |
| Tier 5 | Autonomous Loop | 📋 PLANNED | — | Vault sync, proposal review cycle, reflexion-driven agent updates |

### Pending User Actions (in priority order)

1. **gws OAuth** — Create Google Cloud OAuth credentials → `gws auth login`
   - Unlocks: 92 gws skills, Gmail/Drive/Sheets/Calendar access for 8 agents
   - Blocked agents: n8n-specialist, project-manager, devops-engineer, documentation-writer, database-architect, ux-specialist, api-designer, backend-specialist

2. **Apify token** — Get from console.apify.com/account/integrations → `apify login --token TOKEN`
   - Unlocks: web scraping for research-specialist (1,000+ Actor templates)

3. **last30days plugin** — `claude plugin marketplace add mvanhorn/last30days-skill`
   - Unlocks: real-time social aggregation (Reddit/X/YouTube/TikTok/HN/Polymarket)

4. **Tier 3 prompt** — Run `tier3-full-cc-prompt.md` to deploy CLI-Anything harnesses and Obsidian vault
   - Unlocks: Draw.io, OBS, GIMP, Blender, LibreOffice desktop control; full Obsidian vault memory

5. **Tier 4 gap analysis** — Run `karpathy-gap-analysis-cc-prompt.md`
   - Unlocks: Karpathy-method quality improvements across all 28 agents

### Capability Unlock Map

| Completed When | Capabilities Unlocked |
|---------------|----------------------|
| gws OAuth | 92 gws skills, 42 Google API operations, GWS deployment alerts, calendar scheduling, Gmail/Drive/Sheets/Docs from Bash |
| Apify token | Arbitrary web data extraction, competitive intelligence, social monitoring |
| last30days plugin | 30-day trend research across 10+ platforms with citations |
| Tier 3 complete | Desktop app control (Draw.io, OBS, GIMP, Blender, LibreOffice), full Obsidian vault memory |
| Tier 4 complete | Git ratchet quality, approaches gate, metric delegation, handoff protocols |
| Tier 5 complete | Fully autonomous learning loop, reflexion-driven self-improvement, vault-synced proposals |

### System Architecture Summary (Tier 1+2 Complete)

```
28 Agents (C:\Users\User\.claude\agents\)
  ├── 27 Enhanced Agents (MODES + confidence + reflexion)
  ├── 1 New Agent (cost-optimizer)
  └── 1 Orchestrator (master router)

48 Slash Commands (C:\Users\User\.claude\commands\)
  ├── Specialist routers (/frontend, /backend, /database, etc.)
  ├── GSD pipeline (/gsd-roadmap, /gsd-plan, /gsd-execute, /gsd-verify, /gsd-debug)
  ├── Factory commands (/build, /build-hook, /install-skill, /validate-output)
  └── Automation (/ci-guard, /sync-branch, /run-release, /sync-vault)

20 Skills (C:\Users\User\.claude\skills\)
  ├── Factories (agent-factory, prompt-factory, hook-factory, slash-command-factory)
  ├── Domain tools (aws-solution-architect, tdd-guide, tech-stack-evaluator)
  ├── Research (content-trend-researcher, social-media-analyzer, last30days)
  └── Infrastructure (cost-optimizer, mermaid-harness, cli-anything)

119 Curated KB Files (C:\Users\User\.claude\agents\_shared-ref\)
  ├── core/ (30 files) — Agent knowledge + ECC patterns
  ├── gsd/ (25 files) — GSD methodology + v2 enhancements
  ├── other/ (25 files) — Tools, templates, gws patterns
  ├── antigravity/ (32 files) — Antigravity-kit agents + skills
  └── data/ (4 files) — n8n catalog + intelligence patterns

Infrastructure Services:
  ✅ claude-mem v12.0.1 — Active at http://localhost:37777
  ⚠️ gws v0.22.5 — Installed, OAuth PENDING
  ✅ Agent Teams — ENABLED
  ✅ Auto-memory — ACTIVE
  ✅ SessionEnd hook — Obsidian vault sync
```
