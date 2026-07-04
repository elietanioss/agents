# Security Auditor KB Index

Source: former monolith `core-04-SECURITY_AUDITOR.md` (82KB), chunked topic-wise. This is pentest/audit-style testing knowledge — reach for it when validating your own backend build against OWASP, or writing a security handoff.

| Chunk | Load this when... |
|-------|--------------------|
| `security-kb-01-owasp-access-crypto.md` | Testing broken access control (IDOR, privilege escalation, forced browsing) or cryptographic failures (TLS config, hardcoded secrets scanning) |
| `security-kb-02-injection-testing.md` | Testing SQL injection (sqlmap, manual payloads, JSON/form body injection) and NoSQL injection basics |
| `security-kb-03-auth-authz-cors.md` | Testing JWT (secret brute force, algorithm confusion, none-algorithm attack, expiration), RLS bypass, API authorization bypass, CORS misconfiguration |
| `security-kb-04-headers-ratelimit-reporting.md` | Testing missing/weak security headers, rate-limit bypass, or writing a CVSS-scored vulnerability report |
| `security-kb-05-advanced-vectors.md` | SSRF (cloud metadata, file://, gopher://), command injection, session fixation, insecure deserialization/prototype pollution, GDPR data-export validation, dependency/package integrity audit |
| `security-kb-06-compliance-checklist.md` | HIPAA PHI encryption + audit logging, PCI-DSS card-data rules, full security testing checklist, tool commands (ZAP/Snyk/Semgrep/TruffleHog), handoff templates |

Use this KB to self-check backend work before handing off to a dedicated security review — it does not replace `security-auditor`/`penetration-tester` agents for a full external audit.
