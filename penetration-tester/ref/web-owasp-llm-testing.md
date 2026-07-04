# Web Application Testing Matrix — OWASP Top 10 + LLM Top 10

Source: HexStrike-AI v6.0 + OWASP 2025

## Tool Taxonomy by Category

### Directory & Content Discovery (9 tools)
```bash
# High-speed file discovery (Rust, 5x+ faster than older tools)
gobuster dir -u https://TARGET -w /usr/share/wordlists/dirbuster/big.txt -q

# Content filtering (404 code, size, regex) avoids false positives
feroxbuster -u https://TARGET -w /usr/share/wordlists/common.txt --quiet --status 200,301,302,401,403

# Fuzzer (FFUF) — customizable response filtering
ffuf -u "https://TARGET/FUZZ" -w wordlist.txt -mc 200,301,302 -v

# Old-school but reliable (dirb, nikto for small scopes)
dirb https://TARGET /usr/share/dirb/wordlists/common.txt -o evidence/dirb-results.txt

# JavaScript and comment scraping (hakrawler, gau)
hakrawler -url https://TARGET -d 2 | grep -i "api\|admin\|user" | tee evidence/hakrawler.txt
```

### Vulnerability Scanning (14+ tools)
```bash
# Template-driven scanning (4000+ templates, modular)
nuclei -target https://TARGET -t /root/nuclei-templates/ -json -o evidence/nuclei-findings.json

# CMS-specific (WordPress plugin/theme vulns)
wpscan --url https://TARGET --api-token API_KEY --json -o evidence/wpscan.json

# Legacy HTTP server vulns
nikto -h https://TARGET -o evidence/nikto.txt -Format txt

# XSS-focused fuzzer with reflex (DOM-aware filtering)
dalfox url https://TARGET --model xss -o evidence/dalfox-xss.txt

# SQL injection automation
sqlmap -u "https://TARGET/login" --data "user=*&pass=test" -p user --batch --json-file evidence/sqlmap.json

# NoSQL injection
nosqlmap -u "https://TARGET/api/user" -d "{'id':1}" -t json
```

### Protocol Analysis (4 tools)
```bash
# TLS/SSL assessment with cipher strength scoring
testssl.sh https://TARGET --json > evidence/testssl.json

# TLS config details
sslscan https://TARGET --no-failed --json > evidence/sslscan.json

# HTTP response analysis and header validation
httpx -u https://TARGET -follow-redirects -status-code -header -json -o evidence/httpx.json

# Tech fingerprinting (CMS, framework, JS libs, versions)
whatweb -a 4 https://TARGET -v --log-json evidence/whatweb.json
```

### Advanced / Specialized (6 tools)
```bash
# Signature-based scanner (custom YAML rules)
jaeles -l https://TARGET -s /root/jaeles/signatures/ -j -o evidence/jaeles.json

# Command injection testing
commix -u "https://TARGET/search?q=test" -p q --json-file evidence/commix.json

# Template injection (SSTI, Jinja2, Handlebars)
tplmap -u "https://TARGET/render?template=test" --batch --json -o evidence/tplmap.json

# API fuzzer (parameter discovery, method testing)
wfuzz -u "https://TARGET/api/v1/FUZZ" -w /usr/share/wordlists/fuzz/http-methods.txt --hc 404,405

# JWT token tools (HS256/RS256 bypass, algorithm confusion)
jwt-tool -t "EYJABC..." -C -a HS256 -k secret.txt -o evidence/jwt-analysis.txt

# GraphQL introspection + query fuzzing
graphql-voyager --schema https://TARGET/graphql --json -o evidence/graphql-schema.json
```

### Browser Automation (1 category, 3 tools)
```javascript
// Headless Chrome for DOM analysis, network monitoring, CSP validation
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Capture network requests (detect API endpoints)
page.on('response', response => {
  console.log(`${response.request().url()} - ${response.status()}`);
});

// Form detection and security headers
await page.goto('https://TARGET');
const forms = await page.$$('form');
const headers = await page.evaluate(() => 
  Object.fromEntries(
    document.documentElement.outerHTML.match(/<meta[^>]+>/g).map(m => [m.match(/name="([^"]+)"/)?.[1], m.match(/content="([^"]+)"/)?.[1]])
  )
);
```

## OWASP Top 10 (2025) Testing Checklist

| Rank | Vulnerability | Test Method | Tools | Evidence File |
|---|---|---|---|---|
| A1 | Broken Access Control (IDOR, privilege bypass) | Enumerate object IDs, test other-user access, role toggle | burp-suite, python script | evidence/access-control.md |
| A2 | Cryptographic Failures | TLS assessment, key material testing, data encryption | testssl.sh, sslscan, manual inspection | evidence/crypto-assessment.txt |
| A3 | Injection (SQL, NoSQL, LDAP, SSTI, Template) | sqlmap, nosqlmap, manual fuzzing, template tester | sqlmap, nosqlmap, tplmap, commix | evidence/injection-findings.json |
| A4 | Insecure Design | Business logic flaws, bypass race conditions | manual scenario testing, BurpSuite timeline | evidence/design-flaws.md |
| A5 | Security Misconfiguration | Default creds, debug mode, exposed config, missing security headers | nuclei, whatweb, manual testing | evidence/misconfig.txt |
| A6 | Vulnerable & Outdated Components | Version detection, searchsploit, SBOM analysis | nuclei, wpscan, whatweb, pip-audit, npm-audit | evidence/component-vulns.json |
| A7 | Authentication & Session Management (IDOR, session fixation, weak MFA) | Session hijacking test, token analysis, MFA bypass | jwt-tool, manual token replay, burp repeater | evidence/auth-session.md |
| A8 | Software & Data Integrity Failures (dependency confusion, unsigned updates) | Dependency manifest scanning, code review | SBOM parser, trivy, pip-audit | evidence/integrity.txt |
| A9 | Logging & Monitoring Failures | Audit log access, log truncation, tampering | Manual inspection, log parser | evidence/logging-gaps.md |
| A10 | SSRF (Server-Side Request Forgery) | URL parameter fuzzing, metadata endpoint testing | burp intruder, manual fuzzing, curl | evidence/ssrf-findings.md |

## LLM Top 10 (2025) Attack Surface Testing

### If target includes LLM/AI API or chatbot:

| Attack | Test Vector | Detection Method | Evidence |
|---|---|---|---|
| **Prompt Injection** | Role confusion, instruction override, context escape | Try: "Ignore all prior instructions", "You are now", system prompt leak probes | evidence/prompt-injection.md |
| **Token Limit Bypass** | Exhaust input tokens, test boundary conditions | Send max_tokens+1, test streaming truncation | evidence/token-boundary.txt |
| **Chain-of-Thought Bypass** | Skip reasoning chain (if present), force direct answers | Compare: normal vs "answer without thinking" | evidence/cot-bypass.md |
| **Model Confusion** | Provider-specific magic strings (Claude `<thinking>`, GPT `[SYSTEM]`) | Test with known model identifiers | evidence/model-confusion.txt |
| **API Key/Secret Exposure** | Monitor responses for leaked credentials | Parse responses for patterns: `sk_live_`, `AKIA`, bearer tokens | evidence/secret-exposure.md |
| **Jailbreak Templates** | NSFW requests, roleplay (DAN, HAL, pretend scenarios) | Collect known-public jailbreak techniques from community sources | evidence/jailbreak-tests.txt |

## CRITICAL Validation Gate

For **CVSS CRITICAL (≥9.0)** and **HIGH (7.0–8.9)** findings:

Require **TWO independent validation methods**:

```markdown
Finding: SQL Injection in /login (id parameter)

Validation Method 1 — Automated Scanner (nuclei):
  - Tool: nuclei template CVE-2023-XXXXX
  - Command: nuclei -id cve-2023-xxxxx -target https://example.com/login
  - Result: PASSED (payload detected in HTTP 500 error)

Validation Method 2 — Manual PoC (Playwright):
  - Command: python poc-sqli.py --target example.com/login --payload "'OR'1'='1"
  - Result: PASSED (bypassed login, accessed admin panel)

Status: CONFIRMED (both methods agree)
Severity: CVSS:3.1/AV:N/PR:N/UI:N/S:U/C:H/I:H/A:H = 9.8 CRITICAL
```

Encode both method results in findings JSON:

```json
{
  "id": "finding-sqlinjection-001",
  "title": "SQL Injection in /login (id parameter)",
  "cvss": "9.8",
  "severity": "CRITICAL",
  "tool": ["nuclei", "manual-playwright"],
  "validation": {
    "method_1": { "tool": "nuclei", "passed": true, "command": "nuclei -id cve-2023-xxxxx" },
    "method_2": { "tool": "playwright", "passed": true, "command": "python poc-sqli.py" }
  },
  "status": "CONFIRMED"
}
```

## Return Signal Format

After all web testing completes:

```
PASSED [Web Testing Complete]
- Targets: 3 web apps (e.g. /admin, /api/v1, /portal)
- Findings by severity: CRITICAL: 1, HIGH: 3, MEDIUM: 5, LOW: 12, INFO: 8
  - CRITICAL (1): SQL injection in /login
  - HIGH (3): XSS in /profile, CSRF in /transfer, IDOR in /user/{id}
- Testing coverage: OWASP A1–A6 complete, A7–A10 partial (auth limits prevent full session testing)
- LLM surface: 0 LLM endpoints detected (N/A)
- Evidence: /evidence/web/ (18 findings JSON, 4 nuclei scan logs, 2 burp reports)
- Duration: 52 minutes
```

## Evidence Organization

```
evidence/web/
├── gobuster-{target}.txt
├── feroxbuster-{target}.txt
├── nuclei-findings.json
├── sqlmap-findings.json
├── dalfox-xss.txt
├── testssl-{target}.json
├── whatweb-{target}.txt
├── findings/
│   ├── finding-001-sqli.json
│   ├── finding-002-xss.json
│   └── finding-003-idor.json
└── manual-tests/
    ├── jwt-analysis.md
    └── prompt-injection-tests.md
```
