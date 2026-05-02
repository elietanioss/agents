---
name: cso
preamble-tier: 2
version: 2.0.0
description: |
  Chief Security Officer mode. Infrastructure-first security audit: secrets archaeology,
  dependency supply chain, CI/CD pipeline security, LLM/AI security, skill supply chain
  scanning, plus OWASP Top 10, STRIDE threat modeling, and active verification.
  Two modes: daily (zero-noise, 8/10 confidence gate) and comprehensive (monthly deep
  scan, 2/10 bar). Trend tracking across audit runs.
  Use when: "security audit", "threat model", "pentest review", "OWASP", "CSO review". (gstack)
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Write
  - Agent
  - WebSearch
  - AskUserQuestion
source: gstack
---

# cso (gstack)

Chief Security Officer mode. Infrastructure-first security audit.

## Two Modes

### Daily Mode (zero-noise, 8/10 confidence gate)
- Only report issues with 80%+ confidence
- Focus on high-impact, low-noise findings
- Quick scan: secrets, auth, recent changes
- Report only: CRITICAL and HIGH severity

### Comprehensive Mode (monthly deep scan, 2/10 bar)
- Report everything with 20%+ confidence
- Full OWASP Top 10 check
- STRIDE threat modeling
- Dependency supply chain audit
- CI/CD pipeline security

## Audit Dimensions

### Secrets Archaeology
```bash
git log --all --full-history -- "*.env" "*.key" "*.pem"
grep -r "api_key\|secret\|password\|token" --include="*.py,*.js,*.ts" .
```
- Hardcoded secrets in code or git history
- Secrets in environment files committed to git
- API keys in test files

### Dependency Supply Chain
- Known CVEs in dependencies (`npm audit`, `pip-audit`, `cargo audit`)
- Unmaintained packages with recent activity drop
- Packages with excessive permissions
- Typosquatting risks

### Authentication and Authorization
- Missing auth checks on endpoints
- Broken object-level authorization (BOLA/IDOR)
- JWT validation issues
- Session management flaws

### OWASP Top 10 Scan
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, Command, LDAP)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Software Integrity Failures
9. Logging Failures
10. SSRF

### LLM/AI Security
- Prompt injection vectors in user-facing inputs
- LLM output used as executable input without sanitization
- Training data exfiltration risks
- Model supply chain (where are weights coming from?)

## Output Format

```markdown
## Security Audit: [Date] — [daily/comprehensive]

### CRITICAL (fix immediately)
- **[Finding]**: [File:line] — [Impact]
  Fix: [Specific action]

### HIGH (fix this sprint)
- **[Finding]**: [Location] — [Impact]

### MEDIUM (fix next sprint)

### LOW / INFORMATIONAL

### Trend
Compared to last audit: [N new issues, N resolved, N unchanged]
```
