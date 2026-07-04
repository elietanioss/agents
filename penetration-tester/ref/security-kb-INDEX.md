# Security KB INDEX — Enterprise Security Auditor Reference (Chunked)

This replaces the former monolithic `core-04-security-auditor.md` (83.5KB, 2814 lines) and its `core-04-security-auditor-catalog.md` companion, both now deleted. Content is preserved in full across 6 purpose-scoped chunks below — same directory, flat, no subfolders. Read this INDEX first, then open only the chunk(s) relevant to the objective at hand.

This is a security-auditor-style deep reference (OWASP Testing Guide style test cases with automated scripts) — broader and more code-heavy than the pentest-specific ref files (`web-owasp-llm-testing.md`, `cvss-wstg-reporting.md`, etc.) that the sub-agents use day-to-day. Reach for these chunks when you need a full worked test script (Python/TypeScript/SQL) rather than just the curl one-liner.

## Chunk Index

| Chunk | Covers | Read When |
|-------|--------|-----------|
| `security-kb-01-owasp-access-crypto-injection.md` | OWASP A01 Broken Access Control (IDOR, vertical/horizontal escalation, forced browsing), A02 Cryptographic Failures (TLS config, hardcoded secrets, weak hashing), A03 Injection intro, full JWT auth testing (secret brute force, algorithm confusion, none-alg, expiration), RLS/API authorization bypass | OBJ-005/OBJ-007 (auth + access control): need a full scripted test, not just a curl example |
| `security-kb-02-injection-sqli-nosqli-cmdi.md` | Full SQL injection (sqlmap automation, manual payloads, Python tester class), MongoDB/NoSQL operator injection, command injection (basic + blind time-based) | OBJ-006 (injection testing): building or validating an automated injection test script |
| `security-kb-03-cors-headers-ratelimit-ssrf.md` | CORS misconfiguration (wildcard, reflected origin, null origin), security headers (Helmet.js 13-header checklist), rate limit bypass (brute force, IP rotation), SSRF (internal service discovery, cloud metadata AWS/GCP/Azure, protocol smuggling), session fixation, insecure deserialization/prototype pollution | OBJ-004/OBJ-007 (config + access control): CORS/headers/SSRF deep dive beyond the orchestrator's inline curl commands |
| `security-kb-04-reporting-template-cvss.md` | Full narrative markdown report template with two worked findings (SQLi, IDOR) written out in prose, remediation timeline table, testing methodology appendix | OBJ-015 (reporting): need the fuller narrative prose style in addition to `cvss-wstg-reporting.md`'s structured template |
| `security-kb-05-compliance-gdpr-hipaa-pci.md` | GDPR data export/deletion testing, npm package integrity audit, HIPAA PHI encryption (pgcrypto SQL) + audit logging middleware + test cases, PCI-DSS never-store-card-data pattern (Stripe integration) + test cases, PCI DSS 4.0.1 2025 update notes | Compliance-scoped engagements (healthcare, payments, EU-data clients) |
| `security-kb-06-mindset-checklist-tools-handoffs.md` | Agent identity/mindset, ALWAYS/NEVER critical rules, master security checklist (6 categories, checkbox format), tool/command reference table, success metrics, handoff templates, activation trigger phrases | Quick-reference checklist pass at engagement start or end; onboarding context for the security-auditor mindset |

## When to use this KB vs. the primary pentest ref files

- **Primary pentest ref files** (`web-owasp-llm-testing.md`, `hexstrike-tool-matrix.md`, `cvss-wstg-reporting.md`, `recon-fingerprint.md`, `postexploit-phase-sequence.md`, `binary-exploitation-advanced.md`, `iteration-context-persistence.md`) are the day-to-day operational references for the pentest-recon/web/exploit/postexploit/analyst sub-agents — terse, curl/bash-first, built for the OPPLAN objective flow.
- **This security-kb-* series** is the deeper OWASP-Testing-Guide-style material: full scripted Python/TypeScript test classes, SQL patterns, and compliance implementation code. Reach for it when a finding needs a complete automated test script or when a compliance requirement (HIPAA/PCI/GDPR) is explicitly in scope.

## Grep cheatsheet (search across all 6 chunks at once)

```bash
grep -rn "A0[0-9]:2021" security-kb-*.md          # OWASP Top 10 categories
grep -rln "sqlmap\|UNION SELECT" security-kb-*.md  # SQL injection
grep -rln "JWT\|jsonwebtoken" security-kb-*.md      # JWT testing
grep -rln "CORS\|Access-Control" security-kb-*.md   # CORS
grep -rln "SSRF\|169.254" security-kb-*.md          # SSRF
grep -rln "HIPAA\|PHI\|pgcrypto" security-kb-*.md   # HIPAA
grep -rln "PCI-DSS\|Stripe" security-kb-*.md        # PCI-DSS
grep -rln "GDPR" security-kb-*.md                   # GDPR
grep -rln "CVSS" security-kb-*.md                   # CVSS scoring references
```
