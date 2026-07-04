# Security KB Index — chunked from core-02/04/05 monoliths (2026-07-03)

This is the entry point for the live-test / remediation knowledge chunked out of the three former monoliths (`core-02-BACKEND_SPECIALIST.md` 178KB, `core-04-SECURITY_AUDITOR.md` 83KB, `core-05-SECURITY_REMEDIATION.md` 55KB — all deleted after chunking, full backup at `C:\Users\User\.claude\backups\agents-backup-2026-07-02.tar.gz`). Load a specific chunk on demand; don't load all seven for a routine audit.

| Chunk | Load this when... |
|---|---|
| `security-kb-01-injection-testing.md` | Testing/reporting on SQLi, NoSQLi, command injection, SSRF, or prototype pollution — live payload lists + CVSS anchors |
| `security-kb-02-auth-jwt-rls.md` | Live-testing JWT (secret brute force, alg confusion, none-alg, expiration) or Supabase RLS bypass — complements the static patterns in `auth-code-review.md`/`supabase-security.md` |
| `security-kb-03-network-config-testing.md` | Testing CORS misconfig, security headers, rate-limit bypass, or SSRF allowlisting |
| `security-kb-04-compliance-hipaa-pci-gdpr.md` | Audit scope explicitly includes HIPAA, PCI-DSS, or GDPR compliance testing |
| `security-kb-05-remediation-patterns.md` | Writing the "fix" field of a finding — before/after code for SQLi, XSS, JWT, access control, RLS, CORS, prototype pollution |
| `security-kb-06-encryption-audit-secrets.md` | Auditing field-level encryption (pgcrypto/AES), security-event logging schema, or env/secrets validation — also documents what was DROPPED from the backend monolith as duplicate |
| `security-kb-07-reporting-and-tools.md` | Producing the final audit report skeleton, running the full testing checklist, or picking a live-verification tool |

All seven chunks are flat in this `ref/` folder alongside the other existing reference files (no subfolders).
