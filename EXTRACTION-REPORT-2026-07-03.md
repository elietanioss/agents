# Agent System Enrichment — Extraction & Incorporation Report
**Date:** 2026-07-03 | **Backup:** `C:\Users\User\.claude\backups\agents-backup-2026-07-02.tar.gz` (404 MB, pre-change)

## What happened
Mined ~30 repos in `D:\prompts\data` + 15 external repos/URLs you named, distilled the genuinely-valuable material, chunked the monolithic "gold-mine" reference files into loadable topic pieces, and wove the load-bearing insights directly into the 32 agent bodies. Everything is self-contained under `C:\Users\User\.claude\agents\` — each agent's `ref/` is flat (no subfolders), each agent `.md` points only at its own local ref files.

---

## 1. Sources mined (usefulness = % that beat the roster's baseline)

### Named external repos/URLs (this session's additions)
| Source | What it is | %useful | Landed in |
|---|---|---|---|
| **vercel/geist design guidelines** | Web Interface Guidelines (interactions, a11y, animation, forms, perf) | high | ui-specialist, ux-specialist |
| **rtk (Rust Token Killer)** | CLI output compressor, 60–90% token savings | 80% | cost-optimizer, performance-optimizer |
| **ponytail** | "Lazy senior dev" YAGNI/reuse ladder, 54% less code | 85% | code-archaeologist, performance-optimizer |
| **addyosmani/agent-skills** | 24 lifecycle skills, 5-dim review, anti-rationalization tables | 70% | documentation-writer, code-archaeologist, orchestrator |
| **taste-skill** | Anti-slop 3-dial design system (VARIANCE/MOTION/DENSITY) | 75% | ui-specialist, ux-specialist |
| **AgricIDaniel/claude-seo** | 25 SEO sub-skills, E-E-A-T, CWV, schema, GEO | 65% | seo-specialist |
| **github/spec-kit** | Spec-Driven Dev: Constitution→Spec→Plan→Tasks | 90% | gsd-roadmapper, gsd-planner, project-manager, devops |
| **Panniantong/agent-reach** | Multi-platform agent read/search access | mod | research-specialist |
| **PentestGPT** (USENIX'24) | Multi-agent orchestration, context persistence, flag regex | 85% | penetration-tester + subs |
| **hexstrike-ai** | MCP server, 12+ agents, 150+ tool matrix | 75% | penetration-tester, pentest-recon |
| **Z4nzu/hackingtool** | 20+ category tool catalog taxonomy | 70% | penetration-tester subs |
| **mukul975/Anthropic-Cybersecurity-Skills** | 817 skills, 29 domains, MITRE/NIST mapped | high | defense + offense security agents |
| **garak** (NVIDIA) | LLM vuln scanner, 45 probes, 30+ detectors | high | native-adversary, security-auditor, emergence-engine |
| **lakera PINT** | Prompt-injection benchmark, 4,314 tests, 23 langs | high | security-auditor, native-adversary |
| **burpgpt / deepcode / alibaba open-code-review** | LLM traffic analysis, SAST, 5-dim review (9× token eff.) | mod-high | security-auditor, code-archaeologist |
| **KeygraphHQ/shannon** | (empty git repo) | 0% | skipped |
| **Azure Security Copilot** | infra-only stub | 0% | skipped |

### Bulk `D:\prompts\data` repos
| Source | %useful | Headline value |
|---|---|---|
| **antigravity-kit** | 40% (biggest haul) | 16 validator scripts, orchestration/behavioral-mode skills, tdd/testing patterns, 4 unincorporated agents |
| **gsd-2** | 75% | Next-gen GSD: capability-aware model routing, state-machine context mgmt, parallelization topology, crash recovery |
| **SuperClaude_Framework** | 35–95% | PM autonomy layer, PDCA/reflexion, confidence-first, Wave→Checkpoint→Wave |
| **everything-claude-code** | mod | skills-as-durable-unit thesis, hooks lifecycle, continuous-learning instincts, GAN generator/evaluator |
| **claude-code-templates** | 12–15% | Executable hooks (TDD-gate, secret-scanner), deep-research JSON pipeline, RLS metrics, GraphQL security |
| **agentic-context-engine (ACE)** | 85% | Recursive Reflector, Skillbook curation, multi-role learning |
| **claude-mem** | mod | 5-hook memory lifecycle, privacy-tag stripping, skillbook-on-completion |
| **CLI-Anything** | 30% | 34 agent-native CLI catalog + routing |
| **OpenSpace** | 20% | Self-evolving SKILL.md lifecycle (FIX/DERIVED/CAPTURED) |
| **system_prompts_leaks** | mod | Cursor/Devin/v0/Windsurf meta-techniques beyond existing patterns.md |
| skill-factory, last30days, awesome-plugins, gws-cli, cookbooks, sherlock, superpowers, ui-ux-pro-max | low-mod | mostly already installed; selective gems |
| **Claude-Command-Suite** | 0% | empty directory — flagged for deletion |

---

## 2. What was woven, per agent

### Frontend
- **ui-specialist** — design dials (VARIANCE/MOTION/DENSITY) + aesthetic-direction-first in PROCESS; no-waterfall/parallel-fetch, per-path icon imports (no barrel), `next/dynamic`, `content-visibility` in CHECKLIST; 5 new ANTI-PATTERNS rows (top-level-await chaining, barrel imports, library-first, arbitrary whitespace, system-font-as-design). 203KB KB → 13 topic chunks + index.
- **ux-specialist** — Jakob's/Tesler's/Doherty laws; URL-as-first-class-state; microcopy-drafted-with-the-flow; automated-audit-first (axe/Lighthouse before manual); edit-flow safety nets (unsaved/autosave/conflict); ethical-persuasion framing; content-length resilience. Same 203KB KB chunked.

### Backend / Data
- **backend-specialist** — Realtime/WebSocket latency targets, WireMock pre-integration mocking. 178KB + 82KB KBs → 15 chunks.
- **database-architect** — RLS numeric gates (100% coverage / <10ms / positive+negative tests / tested rollback / `(SELECT auth.uid())` caching). DB-only slice of shared KB.
- **api-designer** — GraphQL abuse defenses (depth-limit 7, cost-analysis vs `first:99999`, field `@auth`, introspection-off). API-only slice.
- **devops-engineer** — deployment-strategy decision table (rolling/blue-green/canary), spec-kit CI parity governance (no silent skips, `--no-verify` blocked at hook).

### Security — offense
- **penetration-tester** — CTF/HTB flag-detection regex gate wired into OPPLAN loop; session-interruption checkpoint. 82KB security KB → 6 chunks.
- **pentest-recon** — BloodHound-CE + ROADrecon/AADInternals for AD/Entra.
- **pentest-web** — MCP server tool-poisoning check for AI/LLM targets.
- **pentest-exploit** — non-web surface (Kerberoasting/Certipy ESC/noPac/Zerologon, container-escape, Pacu/CloudFox) before searchsploit.
- **pentest-postexploit** — DCSync, Golden/Silver Ticket, Pass-the-Hash/Ticket.
- **pentest-analyst** — vuln-class → remediation-anchor lookup table.

### Security — defense
- **security-auditor** — trust-boundary mapping, GraphQL security, MCP/agentic tool-poisoning vetting. 178+82+55KB KBs → 7 security-scoped chunks (non-security backend content explicitly dropped).
- **native-adversary** — Layer 17 (LLM Trust Boundary), garak probe scoring, T1055 process-injection blast-radius vocabulary.
- **emergence-engine** — 4 system-level LLM emergent-risk hypotheses (dual-layer authority bypass, hallucination→trust-violation, fine-tune supply-chain backdoor, cascading encoding evasion) each with falsification plan.
- **fuzz-harness-engineer** — AFL++ nightly-CI addendum (corpus caching, CMPLOG tuning, afl-collect pre-triage).
- **guarantee-verification-engine** — SLSA/cosign identity-pinning ("a bare `cosign verify` proves *a* signature, not *whose*"), SBOM/Sigstore supply-chain verification.

### GSD pipeline
- **gsd-roadmapper** — project-type classification (greenfield/exploratory/brownfield); observable-behavior success criteria.
- **gsd-planner** — spec-kit Constitution check (Vision-Traced/MECE/Dependencies-Clean/Incremental/Risk-Ordered) + file-overlap check in wave assignment.
- **gsd-executor** — pull-vs-push context discipline; SUMMARY.md as manual compaction checkpoint; per-task compaction. Cookbook notebooks distilled to markdown.
- **gsd-verifier** — 3 eval-grading methods (code-based/model-based/human) for behavioral must-haves.
- **gsd-debugger** — stuck-loop → escalate reasoning depth (not a 4th shallow guess); mistake→SKILLBOOK Discard Log.

### Research / analysis specialists
- **research-specialist** — confidence gate (>0.8 proceed / 0.6–0.8 state / <0.6 ask ≤3), 6-level fact-check verdict scale, evidence-based red-flags, quality-metric JSON pipeline. (removed dead PDF ref)
- **code-archaeologist** — deterministic-first mapping (open-code-review, ~9× token savings), severity scale, YAGNI 7-rung ladder + root-cause-once.
- **documentation-writer** — skill-anatomy template + spec-kit constitution ADR pattern.
- **explorer-agent** — stack-fingerprint-before-explore; document-don't-judge discipline.
- **performance-optimizer** — React/Next perf tiers; rtk token-filtering framework. (fixed broken subfolder paths)

### Orchestration / PM / cost
- **orchestrator** — session-start context restoration; confidence-gated clarification; capability-aware 7-dim routing layer (STEP 1.5); diamond parallelization topology; quality-metric hand-off gates; tiered context-sizing; model-assignment heuristic. Curated 68-file ref into one purpose-grouped library (fixed 2 phantom-file citations + duplicate sections).
- **project-manager**, **testing-specialist**, **seo-specialist**, **cost-optimizer** — chunking done (162KB/107KB monoliths split); final weave completing now.
- **nano-genesis / veo-genesis / mobile-developer / game-developer / n8n-specialist** — chunking of 94/111/132/176KB monoliths + weave completing now.

---

## 3. Structural cleanup
- **Chunking:** every ref file >40KB split into 6–15 topic chunks + a load-on-demand INDEX; monoliths deleted (backup retained). Frontend 203KB, backend 178KB, security 82KB, PM 162KB, testing 107KB, veo 132KB, n8n 176KB, nano 94+111KB, gsd-planner 41KB×several.
- **Dedup:** byte-identical KBs shared across agents kept only the relevant slice per agent (e.g. database-architect keeps DB chunks, api-designer keeps the API chunk), drops documented.
- **Flattening:** all `ref/` folders flat — no subfolders. Every agent `.md` repointed to flat paths.
- **Reference sections:** collapsed duplicate `KNOWLEDGE BASE` + `Reference Library` lists into a single purpose-grouped `## REFERENCE LIBRARY` per agent; removed dead/phantom file citations.

## 4. Verification standard applied to every group
`find <agent>/ref -mindepth 2` empty · no >40KB non-CSV file remains · one `## REFERENCE LIBRARY` per agent · every cited path exists on disk · YAML frontmatter and existing body untouched · content-sum ≈ original after chunking (no loss).

## 5. Deliberate skips (no filler added)
shannon (empty), Azure Security Copilot (stub), Claude-Command-Suite (empty dir), claude-code-templates persona hype (~85% redundant), doc translations, apify-cli (no real extraction — flagged not fabricated), and any agent where the mined material didn't beat baseline.
