# Orchestrator Iteration & Context Persistence Patterns

Source: PentestGPT (USENIX 2024) + HexStrike-AI v6.0

## Context Persistence Loop

The orchestrator maintains engagement state across multiple sub-agent iterations. Each iteration:

1. **Load prior context**: Read `pentestgpt_context.md` (plain text, structured):
   - Current objective (OBJ-NNN)
   - Target details (hostname, IP, scope)
   - Rules of Engagement (RoE)
   - Prior findings summary (tool counts, CVE candidates)
   - Evidence path (base directory for all outputs)

2. **Inject into task**: Append context to sub-agent task prompt:
   ```
   ## Prior Context
   - Target: example.com (in-scope, web app, finance sector)
   - Prior findings: 12 open ports, 8 web tech identified, 3 CVE candidates
   - Evidence path: /evidence/
   ```

3. **Execute phase**: Sub-agent runs, returns PASSED/BLOCKED + summary

4. **Update context**: Append phase results to `pentestgpt_context.md`:
   ```
   [2026-07-02 14:30] OBJ-002: Recon PASSED (nmap: 847 results, web fingerprint: Nginx 1.18)
   ```

5. **Fallback mode**: If context file missing, use truncated output from prior iteration (last 3000 tokens)

## Flag Detection Regex Patterns

Compile all patterns into a list for `.scan_complete()` gate after each phase:

```
flag\{[^\}]+\}          # CTF standard
FLAG\{[^\}]+\}          # Uppercase variant
HTB\{[^\}]+\}           # HackTheBox format
CTF\{[^\}]+\}           # CTF variant
[A-Za-z0-9_]+\{[^\}]+\} # Generic {braces}
[a-f0-9]{32}            # 32-char hex (user/root hash HTB)
```

Apply grepping after exploitation phases (OBJ-011+) to capture flags automatically.

## Event-Driven Architecture

Decouple output handlers from core loop using pub/sub events:

| Event Type | Fired When | Subscribers |
|---|---|---|
| STATE_CHANGED | Phase status updates (IDLE→RUNNING→PAUSED→COMPLETED→ERROR) | State logger, OPPLAN updater |
| MESSAGE | Sub-agent returns output | Console output, file log, timestamp appender |
| TOOL | Tool execution (nmap, curl, nuclei, etc.) | Evidence collector, command logger |
| FLAG_FOUND | Regex match on flag patterns | Flag aggregator, alerter |

Each subscriber handles its own concerns — logging, evidence organization, notifications — without coupling to the orchestrator loop.

## 5-State Lifecycle

```
IDLE ──task_dispatch──> RUNNING ──pause_signal──> PAUSED ──resume──> RUNNING
                           │                                              │
                           └──error_encountered──> ERROR                  │
                                                                          │
                           ┌──completion──────────────────────────────────┘
                           │
                        COMPLETED
```

At message boundaries (before sub-agent returns), accept pause signal with async handler. Resume injects fresh instructions into orchestrator without re-dispatching.

## Session Persistence & Resumption

Save all state to filesystem:

```
~/.pentestgpt/sessions/
├── engagement-{id}/
│   ├── pentestgpt_context.md      # Iteration state
│   ├── opplan.md                  # Phase status log
│   ├── findings/
│   │   ├── findings-001.json
│   │   ├── findings-002.json
│   └── evidence/
│       ├── recon/
│       ├── web/
│       ├── exploit/
│       └── postexploit/
```

On resumption, load context file → inject into new task → continue from last objective. No work is lost.

## Orchestrator Inputs (Context Packet)

Before dispatch, assemble the context packet with these mandatory fields:

```json
{
  "target": {
    "hostname": "example.com",
    "ip": "10.0.0.5",
    "port_range": "1-65535"
  },
  "scope": {
    "in_scope": ["example.com", "*.example.com", "10.0.0.0/24"],
    "out_of_scope": ["internal.example.com", "demo.example.com"]
  },
  "roe": {
    "start_date": "2026-07-02",
    "end_date": "2026-07-30",
    "authorized_by": "CISO Name",
    "authorization_source": "email, PO, legal agreement"
  },
  "evidence_path": "/home/pentester/evidence/",
  "prior_findings": {
    "findings_index_file": "/home/pentester/findings-index.json",
    "summary": "12 open ports, 8 web tech, 3 CVE candidates from prior scan"
  }
}
```

## OPPLAN Loop

For each objective in the operational plan:

1. **Set status**: Write `OBJ-NNN: IN_PROGRESS` to OPPLAN.md + timestamp
2. **Read priors**: Load all `findings/findings-*.json` files
3. **Dispatch**: Call Task tool with sub-agent (pentest-recon, pentest-web, etc.) + context packet
4. **Parse return**: Expect `PASSED [summary with counts]` or `BLOCKED [reason]`
5. **Update OPPLAN**: Write result + phase duration (elapsed time) + finding count delta
6. **Append log**: Timestamped entry to engagement log with context handoff note

Example OPPLAN entry:

```
## OBJ-001: Initial Reconnaissance
- Status: COMPLETED
- Duration: 47 minutes
- Return: PASSED (nmap: 847 open/closed ports, web: Nginx 1.18.0, Python 3.9)
- Findings: +5 new (3 high-risk ports, 1 EOL software, 1 weak cipher)
```

## Parallelism Rules

Define objective dependencies in OPPLAN.md frontmatter:

```yaml
objectives:
  - id: OBJ-001
    name: "Passive Recon"
    depends_on: []                    # no deps, run immediately
  - id: OBJ-002
    name: "Active Scanning"
    depends_on: [OBJ-001]             # wait for recon
  - id: OBJ-004
    name: "Web App Testing"
    depends_on: [OBJ-001]             # parallelizable with OBJ-002
  - id: OBJ-011
    name: "Exploit"
    depends_on: [OBJ-002, OBJ-004]    # wait for all scanning
  - id: OBJ-012
    name: "Privilege Escalation"
    depends_on: [OBJ-011]             # blocks if OBJ-011 fails
```

Dispatch OBJ-001 + OBJ-002 in parallel after OBJ-001 completes; OBJ-004–OBJ-009 after OBJ-001; OBJ-011 after both scanning phases; OBJ-012–OBJ-014 cascade (stop on first failure).

## Session Timeout & Cleanup

If orchestrator or sub-agent loses connection mid-task:

1. **Write checkpoint**: Save current OPPLAN state to disk (atomic write)
2. **Wait grace period**: 30 seconds for reconnect signal
3. **Escalate**: If no reconnect, mark objective as INTERRUPTED (not COMPLETED)
4. **Resume handoff**: Next session reads INTERRUPTED marker, re-dispatches with full context

This ensures no phase is silently abandoned.
