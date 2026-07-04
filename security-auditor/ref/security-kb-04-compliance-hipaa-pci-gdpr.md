# Compliance Testing — HIPAA, PCI-DSS, GDPR

Source: core-04-SECURITY_AUDITOR.md (chunked 2026-07-03). Use when the audit scope explicitly includes a compliance regime — not part of a default OWASP pass.

---

## HIPAA (Protected Health Information)

### PHI encryption at rest (Postgres/pgcrypto)
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- ssn/medical_history/diagnosis/treatment_notes columns as BYTEA, never plaintext
INSERT INTO patient_records (ssn_encrypted, ...) VALUES (pgp_sym_encrypt('123-45-6789', :encryption_key), ...);
SELECT pgp_sym_decrypt(ssn_encrypted, :encryption_key) as ssn FROM patient_records WHERE id = :patient_id;
```
Every decrypt-and-read of PHI must itself be audit-logged (who, when, which fields, business justification) — logging *after* the read is a compliance gap if the process crashes mid-request; log intent before the query executes.

### Test cases
- Any PHI field (`ssn`, `medical_history`, `diagnosis`, `treatment`) returned in plaintext in an API response = CRITICAL, HIPAA Security Rule §164.312(a)(2)(iv).
- No audit-log endpoint / no audit trail for PHI access = HIGH, §164.312(b).
- Any authenticated user able to read another patient's record without an authorization check = CRITICAL, §164.312(a)(1).

## PCI-DSS (Payment Card Data)

**Hard rule: never store full card numbers or CVV, ever** — route all card handling through a PCI-compliant processor (Stripe/PayPal) so card data never touches your server.

### Test cases
- Grep any stored order/payment record for a 13–19 digit run (`\b\d{13,19}\b`) — presence = CRITICAL, PCI-DSS Requirement 3.4.
- Grep for CVV/CVC labels near a 3–4 digit value — presence = CRITICAL, Requirement 3.2.2 (CVV storage is *prohibited*, not just discouraged).
- HTTP requests to the app must redirect to HTTPS (no 200 over plain HTTP) — Requirement 4.1.
- TLS 1.2+ only — reuse the TLS version sweep from security-kb-01/03.

## GDPR

- **Right to portability**: a data-export endpoint must exist and return a complete, machine-readable (JSON/XML) bundle of all the user's data categories (profile, activity, generated content).
- **Right to erasure**: a deletion endpoint must exist AND actually remove access — after calling it, a subsequent authenticated read of the same user's profile must fail (200 after a delete request = CRITICAL, Article 17 violation). Verify hard-delete or irreversible anonymization, not just a `deleted_at` soft-flag that other code paths ignore.

## Dependency / Supply-Chain Hygiene (adjacent to compliance audits)

```bash
npm audit --json > audit-results.json
npm audit --audit-level=high
test -f package-lock.json || echo "CRITICAL: package-lock.json missing"
```
Any critical/high finding in `npm audit` blocks a compliance-scoped release the same way it blocks a normal security release — see the main CVSS response-time table in `security-auditor.md`.
