# The Shorthand Guide to Everything Agentic Security

_everything claude code / research / security_

---

## Attack Vectors / Surfaces

Attack vectors are essentially any entry point of interaction. The more services your agent is connected to the more risk you accrue. Foreign information fed to your agent increases the risk.

### Attack Chain and Nodes / Components Involved

E.g., my agent is connected via a gateway layer to WhatsApp. An adversary knows your WhatsApp number. They attempt a prompt injection using an existing jailbreak. The agent reads the message and takes it as instruction. It executes a response revealing private information. If your agent has root access, or broad filesystem access, or useful credentials loaded, you are compromised.

Email attachments are a massive vector. An attacker sends a PDF with an embedded prompt; your agent reads the attachment as part of the job, and now text that should have stayed helpful data has become malicious instruction.

GitHub PR reviews are another target. Malicious instructions can live in hidden diff comments, issue bodies, linked docs, tool output, even "helpful" review context.

MCP servers are another layer entirely. They can be vulnerable by accident, malicious by design, or simply over-trusted by the client. OWASP now has an MCP Top 10: tool poisoning, prompt injection via contextual payloads, command injection, shadow MCP servers, secret exposure.

Simon Willison's lethal trifecta framing: private data, untrusted content, and external communication. Once all three live in the same runtime, prompt injection stops being funny and starts becoming data exfiltration.

## Claude Code CVEs (February 2026)

**CVE-2025-59536.** Project-contained code could run before the trust dialog was accepted. Affects versions before `1.0.111`.

**CVE-2026-21852.** An attacker-controlled project could override `ANTHROPIC_BASE_URL`, redirect API traffic, and leak the API key before trust confirmation. Manual updaters should be on `2.0.65` or later.

**MCP consent abuse.** Repo-controlled MCP configuration and settings could auto-approve project MCP servers before the user had meaningfully trusted the directory.

## The Risk Quantified

| Stat | Detail |
|------|--------|
| **CVSS 8.7** | Claude Code hook / pre-trust execution issue: CVE-2025-59536 |
| **31 companies / 14 industries** | Microsoft's memory poisoning writeup |
| **3,984** | Public skills scanned in Snyk's ToxicSkills study |
| **36%** | Skills with prompt injection in that study |
| **1,467** | Malicious payloads identified by Snyk |
| **17,470** | OpenClaw-family instances reported as exposed |

## Sandboxing

Root access is dangerous. Broad local access is dangerous. Long-lived credentials on the same machine are dangerous. The answer is isolation. If the agent gets compromised, the blast radius needs to be small.

### Separate the identity first

Do not give the agent your personal Gmail. Create `agent@yourdomain.com`. Do not give it your main Slack. Do not hand it your personal GitHub token. Use a short-lived scoped token or a dedicated bot account. If your agent has the same accounts you do, a compromised agent is you.

### Run untrusted work in isolation

For untrusted repos, attachment-heavy workflows, or anything that pulls lots of foreign content, run it in a container, VM, devcontainer, or remote sandbox.

```yaml
services:
  agent:
    build: .
    user: "1000:1000"
    working_dir: /workspace
    volumes:
      - ./workspace:/workspace:rw
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    networks:
      - agent-internal

networks:
  agent-internal:
    internal: true
```

`internal: true` matters. If the agent is compromised, it cannot phone home unless you deliberately give it a route out.

### Restrict tools and paths

```json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.aws/**)",
      "Read(**/.env*)",
      "Write(~/.ssh/**)",
      "Write(~/.aws/**)",
      "Bash(curl * | bash)",
      "Bash(ssh *)",
      "Bash(scp *)",
      "Bash(nc *)"
    ]
  }
}
```

If a workflow only needs to read a repo and run tests, do not let it read your home directory. If it only needs a single repo token, do not hand it org-wide write permissions.

## Sanitization

Everything an LLM reads is executable context. There is no meaningful distinction between "data" and "instructions" once text enters the context window.

### Hidden Unicode and Comment Payloads

```bash
# zero-width and bidi control characters
rg -nP '[\x{200B}\x{200C}\x{200D}\x{2060}\x{FEFF}\x{202A}-\x{202E}]'

# html comments or suspicious hidden blocks
rg -n '<!--|<script|data:text/html|base64,'

# broad permission changes and outbound commands
rg -n 'curl|wget|nc|scp|ssh|enableAllProjectMcpServers|ANTHROPIC_BASE_URL'
```

### Sanitize attachments before the model sees them

Practical rule:
- extract only the text you need
- strip comments and metadata where possible
- do not feed live external links straight into a privileged agent
- if the task is factual extraction, keep the extraction step separate from the action-taking agent

### Sanitize linked content too

Skills and rules that point at external docs are supply chain liabilities. If a link can change without your approval, it can become an injection source later. If you can inline the content, inline it.

## Approval Boundaries / Least Agency

The model should not be the final authority for shell execution, network calls, writes outside the workspace, secret reads, or workflow dispatch. The safety boundary is the policy that sits BETWEEN the model and the action.

Require approval for:
- unsandboxed shell commands
- network egress
- reading secret-bearing paths
- writes outside the repo
- workflow dispatch or deployment

OWASP's language around least privilege maps cleanly to agents — think of it as **least agency**. Only give the agent the minimum room to maneuver that the task actually needs.

## Observability / Logging

Log at least: tool name, input summary, files touched, approval decisions, network attempts, session/task id.

```json
{
  "timestamp": "2026-03-15T06:40:00Z",
  "session_id": "abc123",
  "tool": "Bash",
  "command": "curl -X POST https://example.com",
  "approval": "blocked",
  "risk_score": 0.94
}
```

## Kill Switches

Know the difference between graceful and hard kills. `SIGTERM` gives the process a chance to clean up. `SIGKILL` stops it immediately. Kill the process group, not just the parent.

```javascript
// kill the whole process group
process.kill(-child.pid, "SIGKILL");
```

For unattended loops, add a heartbeat. If the agent stops checking in every 30 seconds, kill it automatically. Practical dead-man switch: supervisor starts task, task writes heartbeat every 30s, supervisor kills process group if heartbeat stalls, stalled tasks get quarantined for log review.

## Memory

Persistent memory is useful. It is also gasoline. The payload does not have to win in one shot. It can plant fragments, wait, then assemble later.

Keep memory narrow:
- do not store secrets in memory files
- separate project memory from user-global memory
- reset or rotate memory after untrusted runs
- disable long-lived memory entirely for high-risk workflows

## The Minimum Bar Checklist

- separate agent identities from your personal accounts
- use short-lived scoped credentials
- run untrusted work in containers, devcontainers, VMs, or remote sandboxes
- deny outbound network by default
- restrict reads from secret-bearing paths
- sanitize files, HTML, screenshots, and linked content before a privileged agent sees them
- require approval for unsandboxed shell, egress, deployment, and off-repo writes
- log tool calls, approvals, and network attempts
- implement process-group kill and heartbeat-based dead-man switches
- keep persistent memory narrow and disposable
- scan skills, hooks, MCP configs, and agent descriptors like any other supply chain artifact

## Close

Build as if malicious text will get into context. Build as if a tool description can lie. Build as if a repo can be poisoned. Build as if memory can persist the wrong thing. Build as if the model will occasionally lose the argument. Then make sure losing that argument is survivable.

**One rule: never let the convenience layer outrun the isolation layer.**

Scan your setup: [github.com/affaan-m/agentshield](https://github.com/affaan-m/agentshield)
