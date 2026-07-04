# Vulnerability Reporting Template, Checklist & Tool Reference

Source: core-04-SECURITY_AUDITOR.md (chunked 2026-07-03). Use this as the structural skeleton when producing the final audit deliverable; `security-auditor.md`'s FINDING FORMAT (JSON) is the per-finding schema, this is the full-report envelope.

---

## Full Report Skeleton

```markdown
# Security Audit Report
## Executive Summary
- Target / Date / Auditor / Scope
- Total Vulnerabilities: N (Critical / High / Medium / Low counts)

## Critical Findings
### 1. <Title>
CVSS Score + Vector, Vulnerability Type (CWE), Affected Component
Description / Proof of Concept / Evidence / Impact
Recommendation (immediate + defense-in-depth layers)
Remediation Code (before/after)
References (OWASP, CWE)
---
(repeat per finding, ordered Critical → High → Medium → Low)

## Remediation Timeline
| Severity | Deadline |
|---|---|
| Critical | 24-48 hours |
| High | 1 week |
| Medium | 1 month |
| Low | Next maintenance window |

## Appendix A: Testing Methodology (tools used, phases: recon → automated scan → manual → PoC → report)
## Appendix B: CVSS Scoring Guide
```

Never include real production data (extracted rows, real PII) in the report — proof-of-concept evidence should be redacted or use synthetic data. Never hand over a weaponized, ready-to-run exploit — the report proves the vulnerability, it doesn't operationalize it.

## Full Security Testing Checklist (by category)

**Authentication:** SQLi in login fields, brute-force rate limiting (lock after 5 attempts), weak password rejection, session timeout (15-30 min idle), session regeneration after login, logout invalidates session, password-reset tokens expire ≤1hr, password reset doesn't leak whether an email exists, MFA bypass attempts.

**Authorization:** horizontal/vertical escalation, IDOR via resource-ID tampering, missing function-level access control, JWT manipulation/signature bypass, role tampering in JWT payload, API key scope bypass.

**Input validation:** SQLi/XSS/command injection in every field, stored XSS in profiles/comments, path traversal (`../../etc/passwd`), file upload abuse (wrong extension, oversized, null bytes), HTTP header injection, CRLF injection.

**Security configuration:** headers grade (securityheaders.com), HTTP→HTTPS redirect, default credentials changed, directory listing disabled, error messages don't leak stack traces/DB type, debug mode off in prod, unnecessary HTTP methods (TRACE/OPTIONS) disabled.

**Data exposure:** API returns only necessary fields (no over-fetching), no sensitive data in URLs/logs, no card data stored, encryption at rest for sensitive fields, no PII in error messages, proper log masking.

**Compliance:** see `security-kb-04-compliance-hipaa-pci-gdpr.md` for the full HIPAA/PCI/GDPR test cases this checklist references.

## Session Fixation & Deserialization (quick reference)

Session fixation test: capture the session cookie *before* login, authenticate, capture the session cookie *after* — if they're identical, the session ID was never regenerated (HIGH, CVSS 8.1); an attacker who fixes a victim's pre-auth session ID (e.g. via a crafted login link) inherits their authenticated session. Also check whether a session ID can be *set* via URL parameter and accepted (`?sessionId=attacker-chosen`) — that alone is a critical design flaw regardless of the fixation-after-login result.

Prototype pollution / unsafe deserialization payloads and fixes are covered in `security-kb-01-injection-testing.md`.

## Tool Reference

| Tool | Purpose | Example |
|------|---------|---------|
| sqlmap | SQL injection automation | `sqlmap -u "url?id=1" --batch --level=5 --risk=3` |
| OWASP ZAP | Web app scanner | `zap-baseline.py -t https://example.com` |
| Nikto | Web server scanner | `nikto -h https://example.com` |
| Nmap | Network/TLS scanning | `nmap --script ssl-enum-ciphers -p 443 host` |
| jwt_tool | JWT testing | `jwt_tool <token> -T` |
| ffuf | Fuzzing | `ffuf -u url/FUZZ -w wordlist.txt` |
| TruffleHog | Secret scanning (incl. git history) | `trufflehog git file://. --json --regex --entropy=True` |
| Semgrep | Static analysis | `semgrep --config=p/security-audit ./src` |
| npm audit / Snyk | Dependency CVEs | `npm audit --audit-level=high`, `npx snyk test` |

Use ZAP/sqlmap/Nikto/Nmap for live target verification (the penetration-tester agent's territory) — security-auditor itself is static/Read-only and should reach for these only when explicitly asked to verify exploitability, saving output to a file and reading the summary rather than dumping raw tool output into context.
