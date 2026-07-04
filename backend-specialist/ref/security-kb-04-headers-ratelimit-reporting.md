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
- ✅ DO: Check all 13 Helmet.js security headers
- ✅ DO: Verify HSTS max-age >= 1 year (31536000 seconds)
- ✅ DO: Ensure CSP is restrictive (no 'unsafe-inline')
- ✅ DO: Check X-Frame-Options is DENY or SAMEORIGIN
- ❌ DON'T: Rely on deprecated headers (X-XSS-Protection)
- ❌ DON'T: Use permissive CSP (script-src * is vulnerable)

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
- ✅ DO: Test rate limiting on authentication endpoints
- ✅ DO: Attempt IP spoofing with X-Forwarded-For
- ✅ DO: Test with rapid successive requests
- ✅ DO: Verify rate limits reset after time window
- ✅ DO: Test rate limiting on API endpoints (not just auth)
- ❌ DON'T: Trust client-provided IP headers
- ❌ DON'T: Set rate limits too high (defeats purpose)

---

## VULNERABILITY REPORTING

### Report Template with CVSS Scoring

**Source:** Research-added (industry standard reporting)

**Markdown Report Template:**

```markdown
# Security Audit Report

## Executive Summary

- **Target:** api.example.com
- **Date:** 2025-01-08
- **Auditor:** Security Team
- **Scope:** Web Application, REST API, Database
- **Total Vulnerabilities:** 12
  - Critical: 3
  - High: 5
  - Medium: 3
  - Low: 1

## Critical Findings

### 1. SQL Injection in User Search Endpoint

**CVSS Score:** 9.8 (Critical)
**CVSS Vector:** CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

**Vulnerability Type:** CWE-89: SQL Injection

**Affected Component:** `/api/users/search?query=`

**Description:**
The user search endpoint is vulnerable to SQL injection through the `query` parameter. An attacker can execute arbitrary SQL commands, leading to unauthorized data access, modification, or deletion.

**Proof of Concept:**
```bash
curl -X GET "https://api.example.com/api/users/search?query=test' UNION SELECT email,password_hash FROM users--"
```

**Evidence:**
```json
{
  "users": [
    {"email": "admin@example.com", "password_hash": "$2b$10$..."},
    {"email": "user@example.com", "password_hash": "$2b$10$..."}
  ]
}
```

**Impact:**
- Complete database compromise
- User credential theft
- Data modification/deletion
- Potential server takeover

**Recommendation:**
1. **Immediate:** Use parameterized queries/prepared statements
2. Implement input validation with allowlist
3. Apply principle of least privilege to database user
4. Enable database query logging and monitoring

**Remediation Code:**
```typescript
// BEFORE (Vulnerable)
const query = `SELECT * FROM users WHERE name LIKE '%${req.query.query}%'`;
const results = await db.query(query);

// AFTER (Secure)
const query = `SELECT * FROM users WHERE name LIKE $1`;
const results = await db.query(query, [`%${req.query.query}%`]);
```

**References:**
- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection
- CWE-89: https://cwe.mitre.org/data/definitions/89.html

---

### 2. Broken Access Control - IDOR in User Profile

**CVSS Score:** 9.1 (Critical)
**CVSS Vector:** CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N

**Vulnerability Type:** CWE-639: Insecure Direct Object Reference

**Affected Component:** `/api/users/:userId/profile`

**Description:**
Users can access and modify other users' profiles by changing the userId parameter in the URL.

**Proof of Concept:**
```bash
# User A's token accessing User B's profile
curl -X GET "https://api.example.com/api/users/user-b-id/profile" \
  -H "Authorization: Bearer <user-a-token>"
# Returns User B's private profile data
```

**Impact:**
- Unauthorized access to sensitive user data
- Privacy violations
- Data modification by unauthorized users

**Recommendation:**
1. Implement resource ownership validation
2. Use Row-Level Security (RLS) policies
3. Never trust client-provided IDs
4. Implement proper authorization checks

**Remediation Code:**
```typescript
// BEFORE (Vulnerable)
app.get('/api/users/:userId/profile', authenticate, async (req, res) => {
  const profile = await db.users.findOne({ id: req.params.userId });
  res.json(profile);
});

// AFTER (Secure)
app.get('/api/users/:userId/profile', authenticate, async (req, res) => {
  // Verify ownership
  if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const profile = await db.users.findOne({ id: req.params.userId });
  res.json(profile);
});
```

---

## Remediation Timeline

| Severity | Remediation Deadline |
|----------|---------------------|
| Critical | 24-48 hours |
| High | 1 week |
| Medium | 1 month |
| Low | Next maintenance window |

## Appendix A: Testing Methodology

### Tools Used
- sqlmap 1.7.2
- Burp Suite Professional 2024.1
- OWASP ZAP 2.14.0
- Postman
- Custom Python scripts

### Testing Phases
1. Reconnaissance
2. Vulnerability Scanning (Automated)
3. Manual Testing
4. Exploitation (Proof of Concept)
5. Reporting

## Appendix B: CVSS Scoring Guide

**CVSS 3.1 Severity Ratings:**
- 9.0-10.0: Critical
- 7.0-8.9: High
- 4.0-6.9: Medium
- 0.1-3.9: Low

**CVSS Calculator:** https://www.first.org/cvss/calculator/3.1
```

**Best Practices:**
- ✅ DO: Include CVSS scores for all vulnerabilities
- ✅ DO: Provide proof-of-concept code
- ✅ DO: Include remediation code examples
- ✅ DO: Specify remediation timelines
- ✅ DO: Reference CWE and OWASP documentation
- ✅ DO: Include executive summary for management
- ❌ DON'T: Include actual production data in reports
- ❌ DON'T: Provide weaponized exploits

---

