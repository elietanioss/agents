## PART A — AGENT SYSTEM ANALYSIS

### A1: Agent Roster Overview

| Agent Name | File Path | Line Count | Depth Score | Ref Count |
|------------|-----------|------------|-------------|-----------|
| api-designer | /c/Users/User/.claude/agents/api-designer/api-designer.md | 301 | 3 | 2 |
| backend-specialist | /c/Users/User/.claude/agents/backend-specialist/backend-specialist.md | 265 | 4 | 5 |
| code-archaeologist | /c/Users/User/.claude/agents/code-archaeologist/code-archaeologist.md | 180 | 3 | 3 |
| database-architect | /c/Users/User/.claude/agents/database-architect/database-architect.md | 166 | 4 | 7 |
| devops-engineer | /c/Users/User/.claude/agents/devops-engineer/devops-engineer.md | 142 | 3 | 5 |
| documentation-writer | /c/Users/User/.claude/agents/documentation-writer/documentation-writer.md | 150+ | 2 | 4 |
| explorer-agent | /c/Users/User/.claude/agents/explorer-agent/explorer-agent.md | 195 | 3 | 2 |
| game-developer | /c/Users/User/.claude/agents/game-developer/game-developer.md | 185 | 3 | 3 |
| gsd-roadmapper | /c/Users/User/.claude/agents/gsd-roadmapper/gsd-roadmapper.md | 172 | 3 | 3 |
| gsd-planner | /c/Users/User/.claude/agents/gsd-planner/gsd-planner.md | 148 | 3 | 3 |
| gsd-executor | /c/Users/User/.claude/agents/gsd-executor/gsd-executor.md | 155 | 3 | 3 |
| gsd-verifier | /c/Users/User/.claude/agents/gsd-verifier/gsd-verifier.md | 172 | 3 | 2 |
| gsd-debugger | /c/Users/User/.claude/agents/gsd-debugger/gsd-debugger.md | 171 | 4 | 2 |
| mobile-developer | /c/Users/User/.claude/agents/mobile-developer/mobile-developer.md | 211 | 3 | 5 |
| n8n-specialist | /c/Users/User/.claude/agents/n8n-specialist/n8n-specialist.md | 247 | 3 | 4 |
| nano-genesis | /c/Users/User/.claude/agents/nano-genesis/nano-genesis.md | 153 | 2 | 2 |
| orchestrator | /c/Users/User/.claude/agents/orchestrator/orchestrator.md | 226+ | 4 | 4 |
| penetration-tester | /c/Users/User/.claude/agents/penetration-tester/penetration-tester.md | 200+ | 3 | 4 |
| performance-optimizer | /c/Users/User/.claude/agents/performance-optimizer/performance-optimizer.md | 227 | 4 | 4 |
| project-manager | /c/Users/User/.claude/agents/project-manager/project-manager.md | 197 | 3 | 3 |
| research-specialist | /c/Users/User/.claude/agents/research-specialist/research-specialist.md | 247 | 3 | 6 |
| security-auditor | /c/Users/User/.claude/agents/security-auditor/security-auditor.md | 156 | 4 | 7 |
| seo-specialist | /c/Users/User/.claude/agents/seo-specialist/seo-specialist.md | 204 | 3 | 2 |
| testing-specialist | /c/Users/User/.claude/agents/testing-specialist/testing-specialist.md | 330 | 4 | 5 |
| ui-specialist | /c/Users/User/.claude/agents/ui-specialist/ui-specialist.md | 199+ | 4 | 10+ |
| ux-specialist | /c/Users/User/.claude/agents/ux-specialist/ux-specialist.md | 199+ | 3 | 4 |
| veo-genesis | /c/Users/User/.claude/agents/veo-genesis/veo-genesis.md | 151 | 2 | 2 |

---

### A2: Individual Agent Profiles

# CLAUDE CODE AGENT SYSTEM — COMPREHENSIVE ANALYSIS

**Analysis Date:** April 7, 2026
**Total Agents:** 27 specialist agents + 1 orchestrator
**Total Skill Files:** 30+ core skills
**Total Shared References:** 3,029 files across 8 knowledge domains
**Status:** Complete system mapping

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
**Main file:** /c/Users/User/.claude/agents/veo-genesis/veo-genesis.md | 151 lines

**Ref files:**
- Full VEO generation guide (ref\core\08-VEO_GENESIS.md)
- Pairs with nano-genesis for visual consistency

**Tools declared:** Read, Write, Edit, Bash, Glob, Grep

**Model:** inherit

**Trigger keywords:** generate video, create video, product demo video, brand video, social media video, Reel, TikTok video, video ad, animation, motion, VEO, video content

**What it actually does:**
Video generation via Google VEO 3 (Vertex AI). Product demo videos, brand cinematics, social media videos (Reels, TikTok, Stories, YouTube). Prompt engineering: scene description, camera movement, lighting, style/mood, technical specs. Handles aspect ratios by platform (16:9 YouTube, 9:16 Stories, 1:1 Instagram).

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

### A3: System Health Matrix

| Agent | Lines | Ref Count | Depth (1-5) | Model | Biggest Gap | Priority |
|-------|-------|-----------|-------------|-------|-------------|----------|
| api-designer | 301 | 2 | 3 | inherit | SDK/client design sparse | Medium |
| backend-specialist | 265 | 5 | 4 | inherit | Message queues minimal | Medium |
| code-archaeologist | 180 | 3 | 3 | inherit | Multi-language patterns limited | Low |
| database-architect | 166 | 7 | 4 | inherit | Vector DB patterns limited | Medium |
| devops-engineer | 142 | 5 | 3 | inherit | K8s networking sparse | Medium |
| documentation-writer | 150+ | 4 | 2 | inherit | Video docs minimal | Low |
| explorer-agent | 195 | 2 | 3 | inherit | Performance analysis missing | Low |
| game-developer | 185 | 3 | 3 | inherit | AR/VR limited | Low |
| gsd-debugger | 171 | 2 | 4 | inherit | Distributed systems missing | Low |
| gsd-executor | 155 | 3 | 3 | inherit | Context compaction limited | Low |
| gsd-planner | 148 | 3 | 3 | inherit | Re-planning triggers missing | Low |
| gsd-roadmapper | 172 | 3 | 3 | inherit | Post-launch planning sparse | Low |
| gsd-verifier | 172 | 2 | 3 | inherit | Multi-platform verification limited | Low |
| mobile-developer | 211 | 5 | 3 | inherit | AR/VR integration minimal | Low |
| n8n-specialist | 247 | 4 | 3 | inherit | Performance optimization sparse | Low |
| nano-genesis | 153 | 2 | 2 | inherit | Batch generation missing | Low |
| orchestrator | 226+ | 4 | 4 | inherit | Dynamic re-routing limited | Medium |
| penetration-tester | 200+ | 4 | 3 | inherit | Wireless pentesting minimal | Medium |
| performance-optimizer | 227 | 4 | 4 | inherit | HTTP/2-3 specific patterns minimal | Medium |
| project-manager | 197 | 3 | 3 | inherit | Stakeholder management limited | Low |
| research-specialist | 247 | 6 | 3 | inherit | Bias analysis missing | Low |
| security-auditor | 156 | 7 | 4 | inherit | Runtime behavior testing missing | Medium |
| seo-specialist | 204 | 2 | 3 | inherit | Local SEO minimal | Low |
| testing-specialist | 330 | 5 | 4 | inherit | Visual regression missing | Medium |
| ui-specialist | 199+ | 10+ | 4 | inherit | CSS-in-JS alternatives sparse | Low |
| ux-specialist | 199+ | 4 | 3 | inherit | Micro-interaction design minimal | Low |
| veo-genesis | 151 | 2 | 2 | inherit | Video editing workflows missing | Low |

**Legend:**
- **Lines:** Approximate line count of main agent file
- **Ref Count:** Number of reference files the agent actively uses
- **Depth:** Implementation depth 1-5 (1=shallow, 5=deep)
- **Biggest Gap:** Most significant knowledge gap or missing pattern
- **Priority:** Enhancement priority (High/Medium/Low)

---

### A4: Shared Reference Inventory

#### Location
`/c/Users/User/.claude/agents/_shared-ref/`

#### Total Files
3,029 files across 8 knowledge domains

#### Domain Structure

1. **antigravity/** (skill modules + agent sources)
   - agents/ — Source files for code-archaeologist, database-architect, devops-engineer, documentation-writer, explorer-agent, game-developer, mobile-developer, penetration-tester, performance-optimizer, seo-specialist (10 agent sources)
   - skills/ — 20+ domain skill modules (api-patterns, bash-linux, clean-code, code-review-checklist, database-design, deployment-procedures, documentation-templates, frontend-design, game-development, geo-fundamentals, mobile-design, nextjs-react-expert, nodejs-best-practices, performance-profiling, powershell-windows, red-team-tactics, seo-fundamentals, server-management, tailwind-patterns, vulnerability-scanner)

2. **core/** — 9 full specialist agent guides + enrichment CSVs
   - 02-BACKEND_SPECIALIST.md, 03-FRONTEND_SPECIALIST.md, 04-SECURITY_AUDITOR.md, 06-TESTING_SPECIALIST.md, 07-NANO_GENESIS.md, 08-VEO_GENESIS.md, 09-WORKFLOW_AUTOMATION.md, 10-PROJECT_MANAGER.md
   - skills-enrichment.csv (16 antigravity skills with methodology/workflow patterns)
   - Multiple domain CSVs for enrichment data

3. **data/** — Structured knowledge assets
   - n8n/ — catalog.csv (479 workflows), integrations.md (188 integrations)
   - intelligence/ — patterns.md (orchestration & coordination decisions)
   - GSD methodology files
   - Master catalog index

4. **gsd/** — Goal-Driven Specification pipeline
   - agents/ — 11 GSD sub-agents (gsd-codebase-mapper, gsd-debugger, gsd-executor, gsd-integration-checker, gsd-phase-researcher, gsd-plan-checker, gsd-planner, gsd-project-researcher, gsd-research-synthesizer, gsd-roadmapper, gsd-verifier)
   - data/ — context-budget.md, deviation-rules.md, and methodology files

5. **other/** — Non-agent reference materials
   - NANO_GENESIS_Commercial.txt (prompt library for image generation)
   - Agentic design book (agentic_book.pdf)
   - Various specialized guides

6. **repos/** — Public repositories indexed as reference
   - sherlock-ai-plugin-main
   - superpowers-main
   - claude-cookbooks-main
   - system-prompts-and-models-of-ai-tools-main
   - system_prompts_leaks-main
   - n8n-workflows-main

7. **sherlock/** — Research sub-agents and skills
   - 5 skill modules: deep-research, paper2code, visual-architect, paper-analyzer, paper-comic
   - OODA loop and source quality assessment

8. **ui-ux/** — Design system and component data assets
   - data/ — 12 CSV files: colors.csv, styles.csv, typography.csv, icons.csv, charts.csv, landing.csv, products.csv, web-interface.csv, ui-reasoning.csv, ux-guidelines.csv, react-performance.csv, plus stack-specific CSVs (react, nextjs, shadcn, vue, nuxtjs, etc.)
   - scripts/ — search.py for BM25-ranked CSV querying

#### Key Data Assets Referenced by Agents

**UI/UX Design Data:**
- colors.csv — color tokens, palettes, semantic mappings
- styles.csv — spacing scale, border radius, shadow tokens
- typography.csv — font scale, line height, letter spacing
- ux-guidelines.csv — usability heuristics, accessibility rules
- Stack-specific CSVs — React, Next.js, shadcn, Vue, Nuxt, Svelte, Astro, Flutter, React Native, SwiftUI, Jetpack Compose

**Automation Data:**
- n8n catalog.csv — 479 pre-built workflows (CRITICAL: check before building any n8n workflow)
- n8n integrations.md — 188 integrations list

**GSD Methodology:**
- context-budget.md — 50% context quality degradation point
- deviation-rules.md — auto-fix vs ask rules
- Phase researcher, plan checker, integration checker

#### Most Referenced Domains
1. **antigravity/skills** — All agents reference 2-5 skill modules each
2. **core/** — Backend specialist, security auditor, testing specialist, frontend specialist most active
3. **gsd/** — Used only by GSD agents (roadmapper, planner, executor, verifier, debugger)
4. **data/n8n** — Critical for n8n-specialist; should be checked before any n8n workflow build
5. **ui-ux/** — UI specialist and UX specialist use 10+ CSV files for design system data

#### Agents NOT Sufficiently Leveraging Shared Ref
- Game developer — Could use more patterns from ref\data\ and ref\repos\
- Mobile developer — Could integrate more UI/UX data assets
- Nano genesis — Could benefit from brand consistency guidelines in UI/UX data
- Veo genesis — Could expand video platform data assets

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
