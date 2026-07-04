---
ref-name: continuous-learning-v2
description: Instinct-based learning system that observes sessions via hooks, creates atomic instincts with confidence scoring, and evolves them into skills/commands/agents. v2.1 adds project-scoped instincts to prevent cross-project contamination.
origin: ECC
version: 2.1.0
---

# Continuous Learning v2.1 - Instinct-Based Architecture

An advanced learning system that turns Claude Code sessions into reusable knowledge through atomic "instincts" — small learned behaviors with confidence scoring.

**v2.1** adds **project-scoped instincts** — React patterns stay in your React project, Python conventions stay in your Python project, and universal patterns are shared globally.

## What's New in v2.1

| Feature | v2.0 | v2.1 |
|---------|------|------|
| Storage | Global (~/.claude/homunculus/) | Project-scoped (projects/<hash>/) |
| Scope | All instincts apply everywhere | Project-scoped + global |
| Detection | None | git remote URL / repo path |
| Promotion | N/A | Project → global when seen in 2+ projects |
| Commands | 4 | 6 (+promote/projects) |
| Cross-project | Contamination risk | Isolated by default |

## The Instinct Model

An instinct is a small learned behavior:

```yaml
---
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: "code-style"
scope: project
project_id: "a1b2c3d4e5f6"
---
# Prefer Functional Style
## Action
Use functional patterns over classes when appropriate.
## Evidence
- Observed 5 instances of functional pattern preference
```

**Properties:**
- **Atomic** — one trigger, one action
- **Confidence-weighted** — 0.3 = tentative, 0.9 = near certain
- **Domain-tagged** — code-style, testing, git, debugging, workflow
- **Evidence-backed** — tracks what observations created it
- **Scope-aware** — `project` (default) or `global`

## Project Detection

1. `CLAUDE_PROJECT_DIR` env var (highest priority)
2. `git remote get-url origin` — hashed to create portable project ID
3. `git rev-parse --show-toplevel` — fallback using repo path
4. Global fallback — if no project detected, instincts go to global scope

## Quick Start

### 1. Enable Observation Hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{"matcher": "*", "hooks": [{"type": "command", "command": "~/.claude/skills/continuous-learning-v2/hooks/observe.sh"}]}],
    "PostToolUse": [{"matcher": "*", "hooks": [{"type": "command", "command": "~/.claude/skills/continuous-learning-v2/hooks/observe.sh"}]}]
  }
}
```

### 2. Use the Instinct Commands

| Command | Description |
|---------|-------------|
| `/instinct-status` | Show all instincts (project-scoped + global) with confidence |
| `/evolve` | Cluster related instincts into skills/commands |
| `/instinct-export` | Export instincts (filterable by scope/domain) |
| `/instinct-import <file>` | Import instincts with scope control |
| `/promote [id]` | Promote project instincts to global scope |
| `/projects` | List all known projects and their instinct counts |

## Scope Decision Guide

| Pattern Type | Scope | Examples |
|-------------|-------|---------|
| Language/framework conventions | **project** | "Use React hooks", "Follow Django REST patterns" |
| Code style | **project** | "Use functional style", "Prefer dataclasses" |
| Security practices | **global** | "Validate user input", "Sanitize SQL" |
| General best practices | **global** | "Write tests first", "Always handle errors" |
| Tool workflow preferences | **global** | "Grep before Edit", "Read before Write" |

## Confidence Scoring

| Score | Meaning | Behavior |
|-------|---------|----------|
| 0.3 | Tentative | Suggested but not enforced |
| 0.5 | Moderate | Applied when relevant |
| 0.7 | Strong | Auto-approved for application |
| 0.9 | Near-certain | Core behavior |

## Why Hooks vs Skills for Observation?

Hooks fire **100% of the time**, deterministically — every tool call is observed, no patterns are missed, learning is comprehensive.
