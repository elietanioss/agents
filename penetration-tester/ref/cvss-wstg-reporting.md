# CVSS v3.1 & WSTG Coverage Reporting Framework
**Source**: HexStrike-AI v6.0 + PentestGPT (USENIX 2024)
**Generated**: 2026-07-03
**Authority**: Industry-standard CVSS/WSTG methodologies + real pentest report templates

---

## CVSS v3.1 Scoring Framework

### Base Score Calculation

CVSS v3.1 base score formula:

```
CVSS:3.1/AV:N/PR:N/UI:N/S:U/C:H/I:H/A:H = 9.8 CRITICAL
```

Each metric is expressed as a vector string component. Simplified formula:

```
If Scope Unchanged:
  BaseScore = min(10, 3.6 × Impact + 3.44 × Exploitability)

If Scope Changed:
  BaseScore = min(10, (3.6 × Impact + 3.44 × Exploitability - 0.029) × 1.084)

Where:
  Impact = 1 - ((1 - Confidentiality Impact) × (1 - Integrity Impact) × (1 - Availability Impact))
  Exploitability = 8.22 × AttackVector × AttackComplexity × PrivilegesRequired × UserInteraction
```

### Metric Definitions & Extraction

| Metric | Values | Extraction Method | Risk Analyst Responsibility |
|--------|--------|---|---|
| **Attack Vector (AV)** | Network (N=0.85), Adjacent (A=0.62), Local (L=0.55), Physical (P=0.2) | From pentest evidence: "Remote exploit via HTTP?" → N; "Requires local shell?" → L; "Requires physical access?" → P | Interview target sysadmin & check if vuln requires network access |
| **Attack Complexity (AC)** | Low (L=0.77), High (H=0.44) | Consistency of exploit: "Exploit works every time?" → L; "Requires special conditions?" → H | Review PoC reliability; test on multiple instances |
| **Privileges Required (PR)** | None (N=0.85 unchanged / 0.68 changed), Low (L=0.62 unchanged / 0.68 changed), High (H=0.27 unchanged / 0.50 changed) | Auth check: "No auth needed?" → N; "Regular user auth?" → L; "Admin auth?" → H | Check if service requires authentication |
| **User Interaction (UI)** | None (N=0.85), Required (R=0.62) | Social eng test: "Exploit requires user click?" → R; "Fully automated?" → N | Review PoC: does target user need to do anything? |
| **Scope (S)** | Unchanged (U=1.0), Changed (C=1.53) | Impact isolation: "Vuln affects only itself?" → U; "Affects other components?" → C | Determine if vuln can cascade beyond component |
| **Confidentiality (C)** | None (0), Low (0.22), High (0.56) | Data exposure scope: "No data leak?" → 0; "Some data exposed?" → 0.22; "All data exposed?" → 0.56 | Quantify: How much sensitive data is at risk? |
| **Integrity (I)** | None (0), Low (0.22), High (0.56) | Data modification scope: "Can attacker modify data?" → High if yes, Low if partial | Test: Can attacker inject/modify records? |
| **Availability (A)** | None (0), Low (0.22), High (0.56) | Service impact: "Service fully down?" → 0.56; "Performance degraded?" → 0.22; "No impact?" → 0 | Document: Can attacker crash/slow service? |

### CVSS Severity Bands

| Band | Score Range | Response Time | Example Vulnerabilities |
|------|---|---|---|
| **CRITICAL** | 9.0–10.0 | 24–48 hours | Remote code execution, SQL injection w/ data access, authentication bypass |
| **HIGH** | 7.0–8.9 | 1–2 weeks | Privilege escalation, CSRF on sensitive operations, XSS with user impact |
| **MEDIUM** | 4.0–6.9 | 4 weeks | Information disclosure, weak encryption, configuration error |
| **LOW** | 0.1–3.9 | Best effort | Typos, minor UI issues, defense evasion (low practical impact) |
| **INFO** | 0.0 | None | Informational only; no remediation deadline |

### Scoring Examples

#### Example 1: SQL Injection in Login Form
```
Vulnerability: SQL injection in /login?email=X endpoint

Extraction:
- AV: Network (user submits via web form) = 0.85
- AC: Low (exploit works consistently) = 0.77
- PR: None (no auth required to reach endpoint) = 0.85
- UI: None (fully automated exploitation) = 0.85
- S: Changed (attacker gains database access, scope beyond login component) = 1.53
- C: High (full database exposure) = 0.56
- I: High (attacker can modify/delete records) = 0.56
- A: High (attacker can delete critical data, causing outage) = 0.56

Impact = 1 - ((1-0.56) × (1-0.56) × (1-0.56)) = 1 - 0.085 = 0.915
Exploitability = 8.22 × 0.85 × 0.77 × 0.85 × 0.85 = 3.86
BaseScore = (3.86 + (3.6 × 0.915)) × 1.084 = 9.2 CRITICAL
```

#### Example 2: Reflected XSS in Search Box
```
Vulnerability: Reflected XSS in /search?q=X

Extraction:
- AV: Network = 0.85
- AC: Low = 0.77
- PR: None = 0.85
- UI: Required (user must click attacker's link or visit malicious site) = 0.62
- S: Changed (attacker can steal session cookies, access other apps via SSO) = 1.53
- C: High (session cookie leakage) = 0.56
- I: Low (XSS can modify form contents, but not persistent) = 0.22
- A: None = 0

Impact = 1 - ((1-0.56) × (1-0.22) × (1-0)) = 0.67
Exploitability = 8.22 × 0.85 × 0.77 × 0.85 × 0.62 = 2.37
BaseScore = (2.37 + (3.6 × 0.67)) × 1.084 = 6.5 MEDIUM (note: UI:R reduces score)
```

#### Example 3: Weak SSH Cipher Configuration
```
Vulnerability: Server allows DES/3DES (weak ciphers) on SSH

Extraction:
- AV: Network = 0.85
- AC: High (requires crypto knowledge + specific network position) = 0.44
- PR: None = 0.85
- UI: None = 0.85
- S: Unchanged (affects only SSH communication, not other services) = 1.0
- C: High (attacker can decrypt SSH traffic, steal credentials) = 0.56
- I: None = 0 (attacker can only eavesdrop, not modify)
- A: None = 0

Impact = 1 - ((1-0.56) × (1-0) × (1-0)) = 0.56
Exploitability = 8.22 × 0.85 × 0.44 × 0.85 × 0.85 = 2.14
BaseScore = 3.6 × 0.56 + 3.44 × 2.14 = 9.08... wait, recalculate:
BaseScore = min(10, 3.6 × 0.56 + 3.44 × 2.14) = min(10, 2.02 + 7.36) = 5.4 MEDIUM
```

---

## WSTG Coverage Matrix (OWASP Web Security Testing Guide)

Checklist of 13 WSTG categories tested during penetration test. Mark each as **Tested** / **Untested** / **N/A**.

| # | WSTG Category | Subtopics Covered | Tool Used | Result | Coverage |
|---|---|---|---|---|---|
| **01** | Information Gathering | Fingerprinting web server, SSL/TLS enumeration, DNS, comments in HTML | whatweb, testssl, nmap, httpx | Found: Apache 2.4.41, OpenSSL 1.1.1c, 3 subdomains | ✅ TESTED |
| **02** | Configuration and Deployment Management | Cookie attributes (Secure, HttpOnly), security headers (CSP, X-Frame-Options), directory listing | curl -I, nuclei (security-headers), gobuster | Missing: X-Frame-Options, weak CSP | ✅ TESTED |
| **03** | Identity Management | Username enumeration, user registration, account provisioning, password reset | Custom scripts, burp repeater, hydra wordlist | Registration allows info disclosure on existing users | ✅ TESTED |
| **04** | Authentication | Credential handling, multi-factor auth, session management, password policy | Burp, custom auth tests, hashcat | No MFA enforced, weak password policy (4 char min) | ✅ TESTED |
| **05** | Authorization | Access control testing, privilege escalation, IDOR, business logic | Burp Intruder, custom IDOR test script, sqlmap | IDOR in /user/profile?id=X — can access others' data | ✅ TESTED |
| **06** | Session Management | Cookie handling, session timeout, fixation, hijacking | Cookie editor, httpx -H cookies, timeline analysis | No session timeout, predictable JSESSIONID | ✅ TESTED |
| **07** | Input Validation | SQLi, XSS, command injection, path traversal, XXE, SSTI | sqlmap, dalfox, commix, tplmap | SQLi in search box, XSS in comments field | ✅ TESTED |
| **08** | Error Handling & Logging | Information disclosure, stack traces, error messages, debug mode | Manual testing, error trigger scripts, grep logs | Detailed stack traces in error pages | ✅ TESTED |
| **09** | Cryptography | Encryption at rest, TLS usage, key management, algorithm strength | testssl, openssl, custom scripts | Weak ciphers allowed, no HSTS | ✅ TESTED |
| **10** | Business Logic | Workflow bypass, state machine issues, transaction logic | Manual testing, API sequence testing | Price manipulation via direct API calls | ✅ TESTED |
| **11** | File Upload | File type validation, MIME type, executable upload, path traversal | Custom upload test, fileupload scanner | Can upload .php, execute as code | ✅ TESTED |
| **12** | API Testing | REST/GraphQL/gRPC security, authentication, rate limiting, versioning | httpx, arjun, jwt-tool, custom scripts | API lacks rate limiting, no API key versioning | ✅ TESTED |
| **13** | Client-side Testing | DOM-based XSS, CORS misconfiguration, local storage secrets, CSRF tokens | Playwright, chrome devtools, burp | Stored XSS in localstorage, weak CSRF tokens | ✅ TESTED |

### Coverage Gap Analysis

| Missing Area | Why Untested | Recommendation | Priority |
|---|---|---|---|
| Wireless security | Not in scope | Request expansion if applicable | LOW |
| Physical security | Not in scope | Separate assessment | LOW |
| Supply chain | Out of scope | Coordinate with vendor security team | MEDIUM |
| API versioning depth | Time constraint | Recommend follow-up assessment | MEDIUM |

### Coverage Summary
**13/13 WSTG categories tested** = 100% coverage
**3/6 critical findings identified** = 50% critical remediation rate

---

## Finding Deduplication & Root Cause Analysis

### Problem: Duplicate Findings

A single SQL injection vulnerability might be reported by:
- nuclei (template match)
- sqlmap (parameter-level confirmation)
- manual tester (PoC via Burp)

**Solution**: Group findings by root cause (CVE, CWE, vulnerability class).

### Deduplication Process

```json
{
  "finding-001": {
    "title": "SQL Injection in /login",
    "root_cause": "CWE-89: Improper Neutralization of Special Elements in SQL",
    "cve": "CVE-2025-XXXXX",
    "cvss": "9.2",
    "severity": "CRITICAL",
    "tools_that_found_it": ["sqlmap", "nuclei", "manual"],
    "evidence_files": ["findings/web/sqlmap-login.txt", "findings/web/nuclei-sql.json"],
    "parent_finding": null,
    "child_findings": ["finding-003", "finding-007"],
    "duplicates": [],
    "status": "OPEN"
  },
  
  "finding-003": {
    "title": "SQL Injection in /search",
    "root_cause": "CWE-89",
    "cve": "CVE-2025-XXXXX",
    "cvss": "8.1",
    "parent_finding": "finding-001",
    "status": "DUPLICATE of finding-001"
  }
}
```

### Finding Schema (JSON)

```json
{
  "id": "finding-NNN",
  "title": "Vulnerability Title",
  "description": "Detailed description of vulnerability, impact, and exploitation method",
  "cvss_vector": "CVSS:3.1/AV:N/PR:N/UI:N/S:C/C:H/I:H/A:H",
  "cvss_score": "9.2",
  "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFO",
  "cve": "CVE-2025-XXXXX",
  "cwe": "CWE-89",
  "wstg_category": "07-Input-Validation",
  "tools_used": ["sqlmap", "nuclei"],
  "evidence_url": "findings/web/sqlmap-login.txt",
  "poc_command": "sqlmap -u 'http://target/login?email=test' -p email",
  "poc_screenshot": "findings/screenshots/sql-injection-poc.png",
  "recommendation": "Use parameterized queries or prepared statements",
  "remediation_deadline": "2026-07-10",
  "status": "OPEN | RESOLVED | DUPLICATE",
  "parent_finding": null,
  "child_findings": [],
  "duplicates": [],
  "last_updated": "2026-07-03T15:30:00Z"
}
```

---

## Penetration Test Report Template

### Executive Summary (1 page)

```
# Penetration Test Report — [Target Name] [Date Range]

## Executive Summary

This penetration test was authorized and conducted by [Firm] on [target] from [date] to [date].

### Risk Rating: CRITICAL

### Finding Summary by Severity:
- CRITICAL: 3 findings
- HIGH: 7 findings
- MEDIUM: 12 findings
- LOW: 8 findings
- INFO: 5 findings
- **Total: 35 findings**

### Top 3 Recommendations (for immediate action):
1. **CWE-89 SQL Injection** — Remediate via prepared statements (24-hour deadline)
2. **Privilege Escalation via sudo misconfiguration** — Review sudo rules and remove overly permissive entries (48-hour deadline)
3. **Missing X-Frame-Options header** — Add clickjacking defense headers to all responses (1-week deadline)

### Key Metrics:
- **Testing Duration**: 40 hours
- **WSTG Coverage**: 13/13 categories (100%)
- **Exploitation Success Rate**: 85% (initial access gained on 85% of identified attack vectors)
- **Estimated Risk if Unpatched**: $500K+ in potential data breach costs (per FAIR model)
```

### Detailed Findings Section (one per page)

```
## Finding 1: SQL Injection in Login Form (finding-001)

### Vulnerability Details
- **Title**: SQL Injection in /login
- **CVSS v3.1 Score**: 9.2 (CRITICAL)
- **CVSS Vector**: CVSS:3.1/AV:N/PR:N/UI:N/S:C/C:H/I:H/A:H
- **CWE**: CWE-89 (Improper Neutralization of Special Elements in SQL)
- **CVE**: CVE-2025-XXXXX (if applicable)

### Description
The login endpoint at https://target.com/login accepts user input without proper sanitization.
An attacker can inject SQL metacharacters (', --, /*) to bypass authentication or extract database contents.

### Impact
- Attacker gains unauthorized access to user accounts and administrative functions
- Full database disclosure (customer records, payment info, credentials)
- Potential for remote code execution (if database user has FILE privileges)
- Estimated data at risk: 500K customer records × $500/record = $250M exposure

### Proof of Concept
```bash
# Using sqlmap
sqlmap -u "https://target.com/login" \
  --data "email=test@test.com&password=test" \
  -p email \
  --batch \
  -v 2 \
  -o /evidence/web/sqlmap-poc.txt

# Result: Database identification (MySQL 5.7.30), version extraction, table enumeration
```

**Manual PoC via Burp**:
1. Intercept POST to /login
2. Modify email parameter to: `admin' OR '1'='1`
3. Submit; authentication bypass achieved (redirects to dashboard without password)

### Tools & Evidence
- **Tools Used**: sqlmap, nuclei (template: http/sqli-blind-time-based.yaml)
- **Evidence Files**:
  - `/findings/web/sqlmap-login.txt` (full sqlmap output)
  - `/findings/web/nuclei-sql-injection.json` (nuclei JSON findings)
  - `/findings/screenshots/sql-injection-dashboard.png` (post-auth screenshot)

### Remediation
**Recommended Fix**: Implement parameterized queries (prepared statements)

```java
// VULNERABLE (current implementation)
String query = "SELECT * FROM users WHERE email = '" + userEmail + "'";
ResultSet rs = stmt.executeQuery(query);

// SAFE (recommended)
String query = "SELECT * FROM users WHERE email = ?";
PreparedStatement pstmt = conn.prepareStatement(query);
pstmt.setString(1, userEmail);
ResultSet rs = pstmt.executeQuery();
```

**Other Mitigations**:
- Input validation: Whitelist email format, reject special characters
- Web Application Firewall (WAF): Deploy ModSecurity with OWASP CRS
- Database hardening: Restrict database user privileges (no FILE, no LOAD_FILE)

### Remediation Deadline: 2026-07-04 (24 hours)

### Verification Steps
After remediation, re-test using:
```bash
sqlmap -u "https://target.com/login" --data "email=admin' OR '1'='1&password=test" --batch
# Expected result: "Target URL does not seem to be vulnerable to SQL injection attacks"
```
```

### Coverage Analysis Section

```
## OWASP WSTG Coverage Analysis

### Tested Categories (13/13 = 100%)
| Category | Tested | Finding Count | Status |
|---|---|---|---|
| 01 Information Gathering | ✅ | 5 | All subdomains and services identified |
| 02 Configuration Management | ✅ | 3 | Security headers missing |
| 03 Identity Management | ✅ | 2 | Username enumeration enabled |
| 04 Authentication | ✅ | 4 | Weak password policy, no MFA |
| 05 Authorization | ✅ | 3 | IDOR and privilege escalation |
| 06 Session Management | ✅ | 2 | Predictable session IDs |
| 07 Input Validation | ✅ | 8 | SQLi, XSS, SSTI, path traversal |
| 08 Error Handling | ✅ | 2 | Information disclosure in errors |
| 09 Cryptography | ✅ | 3 | Weak ciphers, no HSTS |
| 10 Business Logic | ✅ | 1 | Price manipulation API |
| 11 File Upload | ✅ | 2 | Unrestricted file upload, PHP execution |
| 12 API Testing | ✅ | 4 | Rate limiting, authentication gaps |
| 13 Client-side Testing | ✅ | 3 | DOM XSS, CORS bypass, CSRF weakness |

### Untested Areas (Gap Analysis)
- **Wireless Security**: Not in scope for this engagement
- **Physical Penetration**: Separate assessment recommended
- **Supply Chain**: Out of scope; recommend vendor security review

### Coverage Recommendation
Current 100% WSTG coverage is comprehensive for web application security.
Recommend follow-up assessment for API rate-limiting evasion and advanced CSRF patterns.
```

### Appendix: Raw Scan Logs

```
## Appendix A: Raw nmap Output (excerpt)

PORT      STATE    SERVICE         VERSION
22/tcp    open     ssh             OpenSSH 7.4 (protocol 2.0)
80/tcp    open     http            Apache httpd 2.4.6
443/tcp   open     https           Apache httpd 2.4.6
3306/tcp  filtered mysql           (firewall blocking)
5432/tcp  open     postgresql      PostgreSQL 10.6

| ssh-brute: 
|_  No credentials found
| ssl-enum-ciphers: 
|_  Weak ciphers: DES-CBC3-SHA (deprecated)

## Appendix B: nuclei Template Matches (excerpt)

[nuclei] Title: "SQL Injection Detected"
[nuclei] Severity: CRITICAL
[nuclei] Template: http/sqli-blind-time-based.yaml
[nuclei] URL: https://target.com/login
[nuclei] Matched: email parameter responds to time-based injection

## Appendix C: Glossary

- **SQL Injection (SQLi)**: Insertion of malicious SQL code into input fields
- **CVSS**: Common Vulnerability Scoring System v3.1
- **WSTG**: OWASP Web Security Testing Guide
- **IDOR**: Insecure Direct Object Reference (authorization bypass)
- **XSS**: Cross-Site Scripting (client-side injection)
- **RCE**: Remote Code Execution
```

---

## Priority Timeline Matrix

| Severity | Score Range | Response Time | Example Actions |
|---|---|---|---|
| CRITICAL | 9.0–10.0 | 24–48 hours | Immediate workaround; patch/remediation in 24h or take service offline |
| HIGH | 7.0–8.9 | 1–2 weeks | Assign to senior engineer; plan full fix within 1 week; interim controls if needed |
| MEDIUM | 4.0–6.9 | 4 weeks | Standard bug fix; include in next sprint or release cycle |
| LOW | 0.1–3.9 | No deadline | Backlog item; fix if time permits; prioritize other issues first |
| INFO | 0.0 | None | Informational only; no remediation required; document for historical records |

---

## References

- **CVSS v3.1 Specification**: https://www.first.org/cvss/v3.1/specification-document
- **OWASP WSTG**: https://owasp.org/www-project-web-security-testing-guide/
- **OWASP Testing Guide 4.1**: https://owasp.org/www-project-web-security-testing-guide/v41/
- **PentestGPT USENIX Paper**: https://arxiv.org/abs/2406.xxxxx
- **HexStrike-AI Tool Registry**: HexStrike-AI MCP server (150+ tool reference)
