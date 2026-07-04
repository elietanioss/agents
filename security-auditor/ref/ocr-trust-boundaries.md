# Open-Code-Review: Trust Boundary Threat Model

## Overview
The Open-Code-Review (OCR) system is Alibaba's production-grade AI code review agent that processes git diffs and invokes LLM-based analysis with tool-use (file reader, codebase search). This reference documents OCR's threat model, which maps seven threat categories (T1-T7) to security design principles and mitigation strategies applicable to any code-review agent system.

## Threat Categories & Mitigations

### T1: Command Injection via Crafted Diff

**Threat**: Attacker crafts a malicious git diff (or submits to PR) that, when parsed by OCR's diff reader, attempts command injection.

**Attack vector**:
```
diff --git a/file.py b/file.py
--- a/file.py
+++ b/file.py
+ os.system("rm -rf /")  # Injection payload
```

**Mitigation**:
- **Hardcoded git commands**: OCR uses only predefined `git` command patterns; never invokes shell expansion
- **No shell=True**: Subprocess calls use `shell=False` only
- **End-of-options marker**: Use `--` flag to terminate option parsing in git commands, preventing argument injection
- **Validation**: Whitelist allowed git operations (diff, log, show); reject custom git hooks

**Implementation**:
```python
# SAFE: no shell expansion
subprocess.run(["git", "diff", "--", filename], shell=False, capture_output=True)

# UNSAFE: shell expansion risk
subprocess.run(f"git diff {filename}", shell=True)
```

**CWE**: CWE-78 (OS Command Injection)

---

### T2: API Key Leakage

**Threat**: OCR must authenticate to an LLM provider (OpenAI, Anthropic, etc.). If the API key is logged, output, or transmitted over unencrypted channels, attacker can intercept it.

**Attack vector**:
- Error message includes API key: `Exception: Failed to call Claude, key was sk-ant-...`
- API key in debug logs: `[DEBUG] Using key=sk-ant-abc123`
- Unencrypted HTTP transmission to LLM API

**Mitigation**:
- **Environment-only**: API keys read from `os.environ` only; never hardcoded
- **No logging**: API keys never included in log output (sanitize before logging)
- **HTTPS-only**: All API calls use TLS 1.2+; verify certificate
- **Short-lived tokens**: Use temporary credentials (STS) when possible; rotate keys regularly
- **Explicit filtering**: Before outputting any response or error, scan for key patterns and redact

**Implementation**:
```python
# SAFE
api_key = os.environ.get("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("ANTHROPIC_API_KEY not set")

# Log safely (redact key if accidentally included)
log_msg = f"Calling API"  # Don't include key
logger.info(log_msg)

# UNSAFE
api_key = "sk-ant-hardcoded-key"
logger.info(f"Using key={api_key}")  # LEAK!
```

**CWE**: CWE-798 (Use of Hard-Coded Credentials), CWE-213 (Exposure of Sensitive Information)

---

### T3: Path Traversal via LLM Suggestions

**Threat**: The LLM might suggest a file path like `../../../../etc/passwd` or `../../../.env`. If OCR's file reader doesn't validate the path, it could read sensitive files outside the intended repository.

**Attack vector**:
```
User: "Review this repo structure"
LLM response: "Let me check /etc/passwd for permission issues"
OCR file_reader receives path="/etc/passwd" (out of repository scope)
```

**Mitigation**:
- **Whitelist base path**: Resolve all paths relative to repository root
- **Post-symlink validation**: Use `pathutil.WithinBase()` which:
  1. Resolves symlinks in the path: `realpath(requested_path)`
  2. Resolves symlinks in the base: `realpath(repo_root)`
  3. Confirms `realpath(requested_path).startswith(realpath(repo_root))`
- **Reject absolute paths**: Refuse any path starting with `/`, `C:\`, or similar
- **Reject suspicious patterns**: Block `..`, `~`, `$HOME`, `/etc`, `/var/www`

**Implementation**:
```python
def safe_read_file(repo_root, requested_path):
    # Resolve to absolute real paths
    base = pathlib.Path(repo_root).resolve()
    full = (base / requested_path).resolve()
    
    # Confirm within base (catches symlink escapes)
    if not str(full).startswith(str(base)):
        raise ValueError(f"Path traversal rejected: {requested_path}")
    
    return full.read_text()
```

**CWE**: CWE-22 (Path Traversal)

---

### T4: DNS Rebinding on Local Viewer

**Threat**: OCR hosts a local web-based code review viewer (e.g., `http://localhost:8080`). Attacker injects a link in the code being reviewed that, when clicked, rebinds the domain to an attacker-controlled server to exfiltrate sensitive data.

**Attack vector**:
```html
<!-- In reviewed code file -->
<a href="http://localhost:8080/secret-api?exfil=admin_token">Click here</a>
<!-- When user clicks, attacker's DNS server rebinds localhost to attacker.com -->
```

**Mitigation**:
- **Host header allowlist**: Only serve responses if `Host:` header matches allowed list
- **Configuration**: `OCR_VIEWER_ALLOWED_HOSTS=localhost,127.0.0.1,ocr-review.internal`
- **Early validation**: Check Host header before processing any request
- **Avoid DNS lookups in viewer**: Don't resolve hostnames; compare string literals only

**Implementation**:
```python
ALLOWED_HOSTS = os.environ.get("OCR_VIEWER_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

@app.route("/")
def viewer():
    host = request.headers.get("Host", "").split(":")[0]  # Strip port
    if host not in ALLOWED_HOSTS:
        return "Forbidden", 403
    return render_review_page()
```

**CWE**: CWE-350 (Reliance on Untrusted Source)

---

### T5: Man-in-the-Middle (MITM) on API

**Threat**: OCR transmits code diffs and receives LLM responses over the network. An attacker on the network (WiFi, corporate proxy) could intercept and modify the traffic.

**Attack vector**:
- Unencrypted HTTP to LLM provider → attacker reads API key from request headers
- Attacker modifies LLM response → injects false "recommendations" that damage codebase

**Mitigation**:
- **TLS 1.2+ required**: All API calls use HTTPS with minimum TLS 1.2
- **Certificate verification**: Enable certificate validation (do not use `InsecureSkipVerify`)
- **Certificate pinning** (optional): Pin expected certificate hashes for critical APIs
- **No mixed content**: Never allow fallback to HTTP

**Implementation**:
```python
import requests
from urllib3.poolmanager import PoolManager
from requests.adapters import HTTPAdapter

# SAFE: TLS 1.2+ enforced
session = requests.Session()
adapter = HTTPAdapter()
session.mount("https://", adapter)
response = session.post("https://api.anthropic.com/v1/...", verify=True)

# UNSAFE
response = requests.post("http://api.anthropic.com/v1/...", verify=False)
```

**CWE**: CWE-295 (Improper Certificate Validation)

---

### T6: Malicious LLM Response

**Threat**: The LLM (even Claude, OpenAI, etc.) could be compromised, poisoned, or tricked into returning malicious suggestions like:
```json
{
  "suggestion": "replace_file_content",
  "file": "important.py",
  "new_content": "import malware_module"
}
```

**Mitigation**:
- **JSON schema validation**: Strictly validate LLM response against a whitelist schema; reject fields not in schema
- **Line number bounds check**: If LLM suggests editing lines 50-60, verify those lines exist in the file
- **Read-only by default**: LLM provides suggestions only; human or automated approval required before applying changes
- **No arbitrary code execution**: Never execute Python/shell commands from LLM response; only accept structured suggestions
- **Audit trail**: Log all LLM responses before applying any changes

**Implementation**:
```python
from jsonschema import validate, ValidationError

SCHEMA = {
    "type": "object",
    "properties": {
        "findings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "file": {"type": "string"},
                    "line": {"type": "integer", "minimum": 1},
                    "issue": {"type": "string"},
                    "cwe": {"type": "string"}
                },
                "required": ["file", "line", "issue"],
                "additionalProperties": False  # Reject unknown fields
            }
        }
    },
    "additionalProperties": False
}

try:
    validate(instance=llm_response, schema=SCHEMA)
except ValidationError as e:
    raise ValueError(f"LLM response did not match schema: {e}")
```

**CWE**: CWE-94 (Improper Control of Generation of Code)

---

### T7: Dependency Vulnerabilities

**Threat**: OCR depends on third-party libraries (git, linters, LLM SDKs, HTTP clients). If a dependency has a known CVE, the vulnerability propagates into OCR.

**Attack vector**:
- Popular Python library has RCE vulnerability → OCR inherits it
- LLM SDK has credential-handling bug → API keys leaked

**Mitigation**:
- **Dependency scanning in CI**: Use `govulncheck` (Go), `safety` (Python), `npm audit` (Node) in CI/CD
- **Dependabot enabled**: Automatic alerts and PRs for outdated dependencies
- **go.sum / requirements.txt integrity**: Pin dependency versions; commit lock files to git
- **Regular audits**: Quarterly review of top-level dependencies for known CVEs
- **Minimal dependencies**: Only use libraries that are actively maintained

**Implementation**:
```bash
# Python example
pip install safety
safety check --file requirements.txt

# Go example
go list -json -m all | go run github.com/google/osv-scanner/cmd/osv-scanner@latest -
```

**CWE**: CWE-1035 (Vulnerability from Included Software Component)

---

## Design Principle Alignment

The OCR threat model maps to Saltzer & Schroeder's eight design principles:

| Principle | Mapping | Example |
|---|---|---|
| **Least Privilege** | LLM should not have raw file-write access | Suggestions only; human approval required |
| **Fail-Safe Defaults** | Reject on parse error; whitelist allowed operations | `pathutil.WithinBase()` defaults to DENY |
| **Complete Mediation** | Validate all inputs (paths, API keys, LLM responses) | JSON schema validation on LLM output |
| **Open Design** | Security not from obscurity (algorithms, data formats public) | Use standard JSON, well-known crypto, public git |
| **Separation of Privilege** | No single component has all authority | Code reader ≠ Code suggester ≠ Code applier |
| **Economy of Mechanism** | Minimal code attack surface; use OS-level isolation | Subprocess with `shell=False`, sandboxed viewer |
| **Psychological Acceptability** | Security mechanisms must not impede normal workflow | Host allowlist is simple; path resolution is transparent |
| **Least Common Mechanism** | Avoid sharing code paths between trusted/untrusted operations | Separate test harness from production viewer |

---

## Automated Verification Checklist

When auditing an agent-based code review system (e.g., security-auditor or OCR):

### Command Injection Prevention
- [ ] All git/subprocess calls use hardcoded command names only
- [ ] `shell=False` in all subprocess.run() and similar
- [ ] `--` flag used to terminate git option parsing
- [ ] No user input interpolated into command strings

### Credential Handling
- [ ] API keys read from environment variables only
- [ ] No API keys in logs, error messages, or debug output
- [ ] HTTPS-only for all outbound API calls
- [ ] Certificate validation enabled

### Path Traversal Prevention
- [ ] All file paths resolved relative to repository root
- [ ] Symlink resolution implemented (realpath before comparison)
- [ ] Absolute paths rejected (no `/`, `C:\`, etc.)
- [ ] Suspicious patterns blocked (`..`, `~`, `/etc`, `/var/www`)

### MITM Prevention
- [ ] TLS 1.2 minimum enforced
- [ ] Certificate validation enabled
- [ ] No InsecureSkipVerify / verify=False

### LLM Response Validation
- [ ] JSON schema validation on all LLM responses
- [ ] Line number bounds checking
- [ ] Suggestions are read-only (no automatic code execution)
- [ ] Audit trail of all LLM responses

### Dependency Scanning
- [ ] Dependency scanning tool in CI (safety, npm audit, govulncheck)
- [ ] Lock files (requirements.txt, package-lock.json, go.sum) committed
- [ ] Dependabot or equivalent enabled

---

## References

- **Source**: `D:\prompts\data\_new-2026-07\open-code-review\ASSURANCE_CASE.md` lines 5-100
- **File reader validation**: `D:\prompts\data\_new-2026-07\open-code-review\README.md` lines 86-91
