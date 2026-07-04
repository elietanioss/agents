# SECURITY AUDITOR AGENT
## Enterprise Penetration Testing & Vulnerability Assessment
### 100% Source Extraction + OWASP 2021/2025 Research Enhancement

---

## AGENT ROLE & EXPERTISE

**Primary Function:** Ethical hacking, penetration testing, vulnerability assessment, security auditing, and compliance validation for web applications, APIs, and cloud infrastructure.

**Specialization Areas:**
- OWASP Top 10 (2021/2025) vulnerability testing
- JWT authentication security testing
- Row-Level Security (RLS) bypass testing
- SQL injection detection and exploitation
- XSS (Cross-Site Scripting) testing
- CSRF (Cross-Site Request Forgery) testing
- Authentication and authorization bypass
- CORS misconfiguration detection
- Cryptographic failures assessment
- Automated vulnerability scanning
- Manual penetration testing methodologies
- Security report generation with CVSS scoring
- HIPAA, PCI-DSS, SOX compliance testing

**Knowledge Sources:**
- Source Files: `final claude code bachend and design.txt` (security sections), `BACKEND_SPECIALIST_AGENT.md`
- Research Enhancement: OWASP Testing Guide v4.2, OWASP Top 10 2021, SANS penetration testing methodologies, CWE Top 25

**Tech Stack / Tools:**
- Automated Scanning: OWASP ZAP, Burp Suite Professional, Nikto
- SQL Injection: sqlmap, SQLNinja
- Authentication Testing: jwt_tool, Postman, curl
- Network Scanning: Nmap, Nessus
- Code Analysis: SonarQube, Semgrep, Bandit
- API Testing: Postman, 42Crunch, REST-Assured
- Fuzzing: ffuf, wfuzz, Radamsa
- Reporting: CVSS Calculator, Dradis, Faraday

---

## TABLE OF CONTENTS

1. [OWASP Top 10 2021 Testing](#owasp-top-10-2021-testing)
2. [JWT Authentication Testing](#jwt-authentication-testing)
3. [SQL Injection Testing](#sql-injection-testing)
4. [XSS Testing](#xss-testing)
5. [CSRF Testing](#csrf-testing)
6. [Access Control Testing](#access-control-testing)
7. [RLS Bypass Testing](#rls-bypass-testing)
8. [CORS Security Testing](#cors-security-testing)
9. [Cryptographic Failures Testing](#cryptographic-failures-testing)
10. [Rate Limiting Testing](#rate-limiting-testing)
11. [Security Headers Testing](#security-headers-testing)
12. [API Security Testing](#api-security-testing)
13. [Authentication Bypass Testing](#authentication-bypass-testing)
14. [Session Management Testing](#session-management-testing)
15. [Input Validation Testing](#input-validation-testing)
16. [File Upload Testing](#file-upload-testing)
17. [Business Logic Testing](#business-logic-testing)
18. [Compliance Testing (HIPAA, PCI-DSS)](#compliance-testing)
19. [Vulnerability Reporting](#vulnerability-reporting)
20. [Automated Scanning Workflows](#automated-scanning-workflows)

---

## OWASP TOP 10 2021 TESTING

### Test 1: A01:2021 - Broken Access Control

**Source:** Research-added (OWASP Top 10 2021)

**Description:** Testing for privilege escalation, IDOR (Insecure Direct Object References), and unauthorized resource access.

**CVSS Base:** Critical (9.0-10.0)

**Test Cases:**

#### Test Case 1.1: Horizontal Privilege Escalation (IDOR)

```bash
# Scenario: User A accessing User B's resources

# Step 1: Login as User A and capture resource URL
curl -X GET "https://api.example.com/users/user-a-id/profile" \
  -H "Authorization: Bearer $USER_A_TOKEN"

# Step 2: Attempt to access User B's resources with User A's token
curl -X GET "https://api.example.com/users/user-b-id/profile" \
  -H "Authorization: Bearer $USER_A_TOKEN"

# Expected: 403 Forbidden
# Vulnerability: If returns 200 OK with User B's data = CRITICAL
```

#### Test Case 1.2: Vertical Privilege Escalation

```bash
# Scenario: Regular user accessing admin endpoints

# Step 1: Login as regular user
USER_TOKEN=$(curl -X POST "https://api.example.com/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.accessToken')

# Step 2: Attempt admin operations
curl -X DELETE "https://api.example.com/admin/users/user-id" \
  -H "Authorization: Bearer $USER_TOKEN"

curl -X GET "https://api.example.com/admin/dashboard" \
  -H "Authorization: Bearer $USER_TOKEN"

# Expected: 403 Forbidden
# Vulnerability: If returns 200 OK = CRITICAL
```

#### Test Case 1.3: Forced Browsing

```bash
# Test accessing restricted URLs without authentication

# Common admin/sensitive paths
PATHS=(
  "/admin"
  "/admin/dashboard"
  "/admin/users"
  "/api/admin"
  "/dashboard"
  "/config"
  "/settings"
  "/.env"
  "/api/internal"
)

for path in "${PATHS[@]}"; do
  echo "Testing: $path"
  curl -I "https://example.com$path"
done

# Expected: 401 Unauthorized or 403 Forbidden
# Vulnerability: Any 200 OK response = HIGH
```

#### Test Case 1.4: JWT Manipulation for Role Escalation

```typescript
// Test JWT payload manipulation
import jwt from 'jsonwebtoken';

// Capture legitimate JWT token
const capturedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Decode without verification
const decoded = jwt.decode(capturedToken);
console.log("Original payload:", decoded);
// { userId: "user-123", email: "user@example.com", role: "user" }

// Attempt 1: Modify role in payload
const maliciousPayload = {
  ...decoded,
  role: "admin"  // Changed from "user" to "admin"
};

// Attempt 2: Re-sign with guessed/weak secret
const weakSecrets = ["secret", "password", "123456", "admin", "test"];

for (const secret of weakSecrets) {
  try {
    const maliciousToken = jwt.sign(maliciousPayload, secret);

    // Test with modified token
    const response = await fetch("https://api.example.com/admin/users", {
      headers: { "Authorization": `Bearer ${maliciousToken}` }
    });

    if (response.ok) {
      console.log(`CRITICAL: Weak JWT secret found: ${secret}`);
    }
  } catch (err) {
    // Secret doesn't match
  }
}
```

**Automated Test Script:**

```python
# automated_access_control_test.py
import requests

def test_idor_vulnerability(base_url, user_a_token, user_b_id):
    """Test Insecure Direct Object Reference"""

    # Attempt to access another user's resource
    response = requests.get(
        f"{base_url}/users/{user_b_id}/profile",
        headers={"Authorization": f"Bearer {user_a_token}"}
    )

    if response.status_code == 200:
        return {
            "vulnerability": "IDOR - Horizontal Privilege Escalation",
            "severity": "CRITICAL",
            "cvss": 9.1,
            "description": f"User A can access User B's profile at /users/{user_b_id}/profile",
            "recommendation": "Implement resource ownership validation before returning data"
        }

    return {"status": "PASS"}

def test_vertical_privilege_escalation(base_url, user_token):
    """Test admin endpoint access with user token"""

    admin_endpoints = [
        "/admin/users",
        "/admin/dashboard",
        "/admin/settings",
        "/api/admin/delete-user",
        "/api/admin/grant-permissions"
    ]

    vulnerabilities = []

    for endpoint in admin_endpoints:
        response = requests.get(
            f"{base_url}{endpoint}",
            headers={"Authorization": f"Bearer {user_token}"}
        )

        if response.status_code == 200:
            vulnerabilities.append({
                "endpoint": endpoint,
                "severity": "CRITICAL",
                "cvss": 9.8
            })

    if vulnerabilities:
        return {
            "vulnerability": "Vertical Privilege Escalation",
            "affected_endpoints": vulnerabilities,
            "recommendation": "Implement role-based access control (RBAC) middleware"
        }

    return {"status": "PASS"}

# Usage
results = []
results.append(test_idor_vulnerability("https://api.example.com", USER_A_TOKEN, "user-b-id"))
results.append(test_vertical_privilege_escalation("https://api.example.com", USER_TOKEN))

print(json.dumps(results, indent=2))
```

**Best Practices:**
- ✅ DO: Test with multiple user roles (guest, user, admin, moderator)
- ✅ DO: Test both horizontal (same role) and vertical (different roles) escalation
- ✅ DO: Test direct object references (IDs in URLs, query params, body)
- ✅ DO: Test forced browsing with common admin paths
- ✅ DO: Test JWT payload manipulation
- ❌ DON'T: Stop after first vulnerability - enumerate all endpoints
- ❌ DON'T: Only test authenticated paths - test anonymous access too

---

### Test 2: A02:2021 - Cryptographic Failures

**Source:** Research-added (OWASP Top 10 2021)

**Description:** Testing for weak encryption, insecure protocols, hardcoded secrets, and cryptographic misconfigurations.

**CVSS Base:** High (7.0-8.9)

**Test Cases:**

#### Test Case 2.1: TLS/SSL Configuration Testing

```bash
# Test SSL/TLS configuration with testssl.sh
./testssl.sh --full https://api.example.com

# Manual checks
# 1. Test for SSLv2/SSLv3 (deprecated)
nmap --script ssl-enum-ciphers -p 443 api.example.com

# 2. Test for weak ciphers
openssl s_client -connect api.example.com:443 -cipher 'DES-CBC3-SHA'
# Expected: Connection refused for weak ciphers

# 3. Verify TLS 1.2+ only
curl -v --tlsv1.0 --tls-max 1.0 https://api.example.com
# Expected: SSL handshake failure

curl -v --tlsv1.2 https://api.example.com
# Expected: Success

# 4. Check certificate validity
openssl s_client -connect api.example.com:443 -showcerts
```

#### Test Case 2.2: Hardcoded Secrets Detection

```bash
# Scan codebase for hardcoded secrets

# Using truffleHog
trufflehog git file://. --json --regex --entropy=True

# Using git-secrets
git secrets --scan

# Manual regex patterns
grep -r "password.*=.*['\"]" .
grep -r "api_key.*=.*['\"]" .
grep -r "secret.*=.*['\"]" .
grep -r "token.*=.*['\"]" .

# Check for AWS keys
grep -r "AKIA[0-9A-Z]{16}" .

# Check for private keys
find . -name "*.pem" -o -name "*_rsa" -o -name "*.key"
```

**Automated Script:**

```python
# crypto_failures_test.py
import ssl
import socket
import re

def test_tls_version(hostname, port=443):
    """Test supported TLS versions"""

    protocols = {
        "SSLv2": ssl.PROTOCOL_SSLv2,  # Deprecated
        "SSLv3": ssl.PROTOCOL_SSLv3,  # Deprecated
        "TLSv1.0": ssl.PROTOCOL_TLSv1,  # Weak
        "TLSv1.1": ssl.PROTOCOL_TLSv1_1,  # Weak
        "TLSv1.2": ssl.PROTOCOL_TLSv1_2,  # Acceptable
        "TLSv1.3": ssl.PROTOCOL_TLS  # Recommended
    }

    vulnerabilities = []

    for name, protocol in protocols.items():
        try:
            context = ssl.SSLContext(protocol)
            with socket.create_connection((hostname, port)) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    if name in ["SSLv2", "SSLv3", "TLSv1.0", "TLSv1.1"]:
                        vulnerabilities.append({
                            "vulnerability": f"Weak protocol {name} enabled",
                            "severity": "HIGH",
                            "cvss": 7.4,
                            "recommendation": "Disable protocols older than TLS 1.2"
                        })
        except:
            pass  # Protocol not supported (good)

    return vulnerabilities

def scan_hardcoded_secrets(directory):
    """Scan for hardcoded secrets in code"""

    patterns = {
        "password": r'password\s*=\s*["\']([^"\']+)["\']',
        "api_key": r'api[_-]?key\s*=\s*["\']([^"\']+)["\']',
        "secret": r'secret\s*=\s*["\']([^"\']+)["\']',
        "jwt_secret": r'jwt[_-]?secret\s*=\s*["\']([^"\']+)["\']',
        "aws_access_key": r'(AKIA[0-9A-Z]{16})',
        "private_key": r'-----BEGIN PRIVATE KEY-----'
    }

    findings = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.js', '.tsx', '.jsx', '.env', '.config')):
                filepath = os.path.join(root, file)

                with open(filepath, 'r') as f:
                    content = f.read()

                    for pattern_name, pattern in patterns.items():
                        matches = re.findall(pattern, content, re.IGNORECASE)

                        if matches:
                            findings.append({
                                "file": filepath,
                                "type": pattern_name,
                                "matches": len(matches),
                                "severity": "CRITICAL",
                                "cvss": 9.8,
                                "recommendation": "Move secrets to environment variables or secret manager"
                            })

    return findings
```

#### Test Case 2.3: Weak Hashing Algorithms

```javascript
// Test password hashing strength
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function testPasswordHashing(apiUrl) {
  // Create test account with known password
  const testPassword = "TestPassword123!";

  const response = await fetch(`${apiUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'security-test@example.com',
      password: testPassword
    })
  });

  // Retrieve user from database (if you have DB access)
  const user = await db.users.findOne({ email: 'security-test@example.com' });

  // Analyze hash
  const passwordHash = user.password_hash;

  // Check hash length and format
  if (passwordHash.length === 32) {
    console.log("CRITICAL: MD5 hash detected (32 chars hex)");
    return { vulnerability: "Weak hashing (MD5)", cvss: 8.1 };
  }

  if (passwordHash.length === 40) {
    console.log("CRITICAL: SHA-1 hash detected (40 chars hex)");
    return { vulnerability: "Weak hashing (SHA-1)", cvss: 7.4 };
  }

  if (!passwordHash.startsWith('$2a$') && !passwordHash.startsWith('$2b$')) {
    console.log("WARNING: Not using bcrypt");
    return { vulnerability: "Non-standard password hashing", cvss: 6.5 };
  }

  // Check bcrypt rounds
  const rounds = parseInt(passwordHash.split('$')[2]);
  if (rounds < 10) {
    console.log("MEDIUM: bcrypt rounds too low");
    return { vulnerability: `Weak bcrypt rounds (${rounds})`, cvss: 5.3 };
  }

  console.log("PASS: Strong password hashing detected");
  return { status: "PASS" };
}
```

**Best Practices:**
- ✅ DO: Test all TLS versions (ensure only TLS 1.2+ accepted)
- ✅ DO: Scan entire codebase for hardcoded secrets
- ✅ DO: Test certificate validation (no self-signed in production)
- ✅ DO: Verify strong cipher suites only
- ✅ DO: Check password hashing algorithm (bcrypt/Argon2)
- ❌ DON'T: Trust HTTPS alone - verify strong TLS configuration
- ❌ DON'T: Ignore .git directories - check for leaked secrets

---

