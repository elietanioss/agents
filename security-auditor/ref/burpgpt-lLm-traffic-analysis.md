# BurpGPT: LLM-Powered Traffic Analysis Patterns

## Overview
BurpGPT integrates Burp Suite's passive scanner with LLM analysis for vulnerability detection across HTTP traffic. The framework enables dynamic prompt templating to inject HTTP context (request/response data) into LLM queries, making it useful for domain-specific vulnerability discovery.

## Placeholder Templating System

BurpGPT supports these dynamic placeholders in custom prompts:

| Placeholder | Content | Example |
|---|---|---|
| `{REQUEST}` | Full HTTP request (method, path, headers, body) | POST /api/auth HTTP/1.1 |
| `{URL}` | Request URL only | https://api.example.com/login |
| `{METHOD}` | HTTP method | POST, GET, PUT, DELETE |
| `{REQUEST_HEADERS}` | Request headers dict | Accept: application/json |
| `{REQUEST_BODY}` | Request body (raw) | {"user":"admin","pass":"x"} |
| `{RESPONSE}` | Full HTTP response (status, headers, body) | HTTP/1.1 200 OK |
| `{RESPONSE_HEADERS}` | Response headers dict | Content-Type: application/json |
| `{RESPONSE_BODY}` | Response body (raw) | {"token":"xyz"} |
| `{IS_TRUNCATED_PROMPT}` | Boolean flag | true if request/response truncated |

**Implementation pattern**: Each placeholder is replaced before sending to LLM. The `{IS_TRUNCATED_PROMPT}` flag signals whether the injection point data was truncated due to max-token size, enabling the auditor to note "incomplete analysis" for large payloads.

## Severity Standardization

- **Output format**: All findings are standardized to "Informational" severity level at the Burp Scanner integration point
- **Downstream triage**: A separate triage layer consumes findings and escalates them based on domain context (crypto, auth, serverless, etc.)
- **Rationale**: Separates LLM analysis signal (potential issues) from severity judgment (context-aware risk ranking)

## Use Cases & Example Prompts

### Cryptographic Library CVE Detection
```
You are a security auditor analyzing HTTP traffic for cryptographic vulnerabilities.
Examine this request:

{REQUEST}

And this response:

{RESPONSE_BODY}

Look for:
1. Deprecated crypto libraries (MD5, SHA1, RC4, DES)
2. Hardcoded keys or secrets in responses
3. Weak key exchange patterns

Report any findings as JSON: [{"issue": "...", "cwe": "CWE-XXX", "severity": "HIGH"}]
```

### Biometric Authentication Flow Analysis
```
Analyze this sequence of requests for biometric auth bypass:

Request 1: {REQUEST}
Response 1: {RESPONSE}

Request 2: {REQUEST}
Response 2: {RESPONSE}

Check for:
1. Biometric token reuse across sessions
2. Missing time-based validation
3. Fingerprint bypass patterns (e.g. returning success before actual verification)
```

### Serverless Function Security
```
This request invokes a serverless function:

{REQUEST}

Response indicates: {RESPONSE_BODY}

Test for:
1. Privilege escalation via function role assumption
2. Environment variable exposure in error messages
3. Code injection in function parameters
```

### Single-Page Application (SPA) Security
```
SPA API endpoint analysis:

{URL}
{METHOD}
Body: {REQUEST_BODY}

Response headers: {RESPONSE_HEADERS}

Check for:
1. Missing CSRF tokens in state-changing operations
2. Insufficient CORS policy (Access-Control-Allow-Origin: *)
3. XSS via response injection
```

## Integration with Security Auditor

When using BurpGPT patterns in security-auditor audits:

1. **Define domain** - select specialized prompts for the target domain (crypto, auth, serverless, SPA)
2. **Template configuration** - inject actual HTTP request/response data via placeholders
3. **Max prompt size tuning** - set a token limit to avoid truncation; use `{IS_TRUNCATED_PROMPT}` to track incomplete analyses
4. **Triage layer** - consume "Informational" findings and re-score based on business context + OWASP Top 10 mapping
5. **Report normalization** - consolidate findings into standard auditor format with CWE references

## Limitations & Caveats

- **LLM hallucination risk** - LLM may invent vulnerabilities not actually present. Cross-validate findings with automated tools (Burp active scanner, static linters).
- **Encoding handling** - Base64/URL-encoded payloads are passed verbatim to LLM; consider pre-decoding for readability.
- **Stateful analysis** - Single request/response pair may miss multi-step vulnerabilities (e.g., CSRF chains). Prompt structure should request correlation analysis when full request sequence is provided.

## References

- **Source**: `D:\prompts\data\_new-2026-07\burpgpt\README.md` lines 93-175
- **Burp Suite Passive Scanner**: https://portswigger.net/burp/documentation/desktop/scanning
