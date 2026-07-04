# SAST Tool Integration & LLM-Driven Analysis

**Source:** burpgpt (Burp Suite LLM integration), deepcode-cli, open-code-review threat modeling  
**Date:** 2026-07-02  
**Scope:** Static code analysis patterns, SAST output parsing, trust boundaries

---

## burpgpt: LLM-Powered Traffic Analysis Templates

### Placeholder Templating System

Burp passive scanner integration uses dynamic prompt placeholders for LLM-assisted vulnerability detection.

**Available placeholders:**
- `{REQUEST}` — entire HTTP request (method, URI, headers, body)
- `{URL}` — request URL
- `{METHOD}` — HTTP method (GET, POST, etc.)
- `{REQUEST_HEADERS}` — request headers as string
- `{REQUEST_BODY}` — request body (POST/PUT)
- `{RESPONSE}` — entire HTTP response
- `{RESPONSE_HEADERS}` — response headers
- `{RESPONSE_BODY}` — response body
- `{IS_TRUNCATED_PROMPT}` — boolean flag; true if prompt hit size limit (enable graceful degradation)

**Actionable pattern for prompt design:**
```
Example prompt template:
"Analyze this HTTP request for security issues:
REQUEST: {REQUEST}
RESPONSE: {RESPONSE}

Focus on: authentication bypass, injection flaws, sensitive data exposure.
If this analysis is truncated ({IS_TRUNCATED_PROMPT}), flag incomplete areas."
```

**Tuning guidance:**
- Set max prompt size to keep LLM response <2000 tokens (avoid truncation)
- Standardize severity output to match downstream triage (e.g., "Informational" for low-confidence findings)
- Include `{IS_TRUNCATED_PROMPT}` in output so analysts know confidence boundaries

---

## deepcode-cli: SAST Exit Codes & Severity Schema

**Tool:** Python-based AI-backed static analysis (JavaScript, TypeScript, Python, Java, C++)

### Exit Codes (correct mapping)
| Code | Meaning |
|------|---------|
| 0 | No issues found |
| 1 | Issues found (may be errors, warnings, or info) |
| 2 | User interrupted execution |
| 3 | Execution error (environmental or tool failure) |

### Severity Levels
- `info` — informational finding, low priority
- `warning` — potential issue, medium priority  
- `critical` — exploitable vulnerability, high priority

Filter via `--severity info|warning|critical` (configurable minimum)

### Output Formats
- **JSON (default)** — REST API schema compliant, machine-parseable
  ```bash
  poetry run deepcode analyze --json > findings.json
  ```
- **Text** — human-readable via `--result-text` flag
  ```bash
  poetry run deepcode analyze --result-text > findings.txt
  ```

### Linter Integration
Optional separate scan via `--with-linters` (toggles linter findings in output)

### Language Coverage
- JavaScript, TypeScript, Python, Java, C++
- Exports file path, line number, rule ID, message

**Actionable audit checklist:**
- [ ] Run deepcode against repo: `poetry run deepcode analyze`
- [ ] Parse JSON output for `severity: "critical"` items
- [ ] Separate SAST findings from linter findings (if enabled)
- [ ] Cross-reference CWE IDs with OWASP Top 10
- [ ] Output to report in standard format (file:line, rule, severity, remediation)

---

## open-code-review: Trust Boundary Threat Model

**Source:** Alibaba's production-grade AI code review system  
**Pattern:** Deterministic engineering (hard constraints) + LLM agent (dynamic decisions)

### 7-Threat Taxonomy for Code Review Systems

| Threat | Vector | Mitigation | Test Case |
|--------|--------|-----------|-----------|
| **T1** | Command injection via crafted diff | Hardcoded `git` commands, no shell expansion, `--end-of-options` flag injection prevention | Inject `git <flags> --end-of-options malicious.sh` in diff, verify not executed |
| **T2** | API key leakage | Env-var-only reads, never logged/output, HTTPS-only transmission | Grep for API keys in logs; verify no creds in stdout |
| **T3** | Path traversal via LLM suggestions | `pathutil.WithinBase()` validates pre- and post-symlink-resolution | Inject `../../../etc/passwd` path in LLM response, verify rejection |
| **T4** | DNS rebinding on local viewer | Host-header allowlist, configurable via `OCR_VIEWER_ALLOWED_HOSTS` | Request viewer with malicious Host header, verify rejection |
| **T5** | MITM on API | TLS 1.2+ enforced, no InsecureSkipVerify | Test with mitmproxy, verify no cleartext API calls |
| **T6** | Malicious LLM response | JSON schema validation, line-number bounds checking | Inject out-of-bounds line numbers in LLM output, verify validation |
| **T7** | Dependency vulns | govulncheck CI, Dependabot, go.sum integrity | Run `govulncheck ./...` in CI, block on findings |

### Mapping to Design Principles (Saltzer & Schroeder)

Map each threat to security principles:
- **Least Privilege:** T2 (API keys env-only), T3 (sandboxed file access)
- **Fail-Safe Defaults:** T4 (host-header allowlist denies by default)
- **Complete Mediation:** T1 (all git operations hardcoded), T6 (schema validation on all LLM output)
- **Economy of Mechanism:** T5 (TLS 1.2+ enforced, no custom SSL logic)
- **Open Design:** T7 (govulncheck, public Dependabot)
- **Separation of Privilege:** T2 (API keys separate from code), T3 (LLM suggestions don't directly modify files)
- **Least Common Mechanism:** T6 (LLM response validated independently of any prior responses)

---

## SAST Integration Checklist for security-auditor

When auditing a codebase with SAST tools:

1. **Inventory SAST tools already in CI/CD:**
   - [ ] npm audit (JavaScript/Node.js)
   - [ ] Semgrep (multi-language, OWASP/CWE rules)
   - [ ] deepcode (if Python/JS/TS project)
   - [ ] Checkmarx / Snyk / SonarQube (enterprise)

2. **Run automated scans:**
   - [ ] Collect output in JSON format (parseable)
   - [ ] Deduplicate findings by CWE ID + file:line
   - [ ] Score by severity (critical > high > medium > low > info)

3. **Trust boundary analysis (T1-T7 model):**
   - [ ] Identify all trust boundaries in the system
   - [ ] Audit API key storage (T2 — env-var only?)
   - [ ] Audit file access patterns (T3 — path traversal defended?)
   - [ ] Audit network calls (T5 — TLS enforced?)

4. **LLM-assisted analysis (if using burpgpt pattern):**
   - [ ] Design prompt template with all required placeholders
   - [ ] Set max prompt size to avoid truncation
   - [ ] Verify LLM output does not exceed severity boundaries (no false "critical")
   - [ ] Cross-validate LLM findings with Semgrep patterns (if high-value)

5. **Report generation:**
   - [ ] Group findings by OWASP category
   - [ ] Assign CVSS v3.1 scores
   - [ ] Include remediation guidance (per CWE)
   - [ ] Flag incomplete coverage (e.g., "deepcode did not cover shell scripts")

---

## References

- burpgpt README: prompt templating patterns (https://github.com/aadhar-agarwal/burpgpt)
- deepcode-cli docs: severity levels & output formats
- open-code-review ASSURANCE_CASE.md: Saltzer & Schroeder threat model alignment
