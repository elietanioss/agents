## HIPAA COMPLIANCE IMPLEMENTATION

Source: agent-system/core/security-specialist.md

### PHI (Protected Health Information) Encryption

```sql
-- Enable pgcrypto extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create HIPAA-compliant patient records table
CREATE TABLE patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL, -- May need encryption depending on context
  date_of_birth DATE NOT NULL,
  ssn_encrypted BYTEA NOT NULL, -- ALWAYS encrypted
  medical_history_encrypted BYTEA, -- ALWAYS encrypted
  diagnosis_encrypted BYTEA, -- ALWAYS encrypted
  treatment_notes_encrypted BYTEA, -- ALWAYS encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES staff(id),
  CONSTRAINT phi_audit_trail CHECK (created_by IS NOT NULL)
);

-- Insert with encryption
INSERT INTO patient_records (
  patient_name,
  date_of_birth,
  ssn_encrypted,
  medical_history_encrypted,
  created_by
)
VALUES (
  'John Doe',
  '1980-01-01',
  pgp_sym_encrypt('123-45-6789', :encryption_key),
  pgp_sym_encrypt('Patient has Type 2 diabetes, diagnosed 2020...', :encryption_key),
  :staff_id
);

-- Query with decryption (must be audit logged!)
SELECT
  id,
  patient_name,
  date_of_birth,
  pgp_sym_decrypt(ssn_encrypted, :encryption_key) as ssn,
  pgp_sym_decrypt(medical_history_encrypted, :encryption_key) as medical_history
FROM patient_records
WHERE id = :patient_id;
```

### HIPAA Audit Logging (Required)

```typescript
// lib/hipaa-audit.ts
// ALL PHI access must be logged per HIPAA requirements

interface PHIAccessLog {
  userId: string
  patientId: string
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'
  accessedFields: string[]
  ipAddress: string
  userAgent: string
  timestamp: Date
  reason?: string // Business justification
}

export async function logPHIAccess(data: PHIAccessLog): Promise<void> {
  await pool.query(`
    INSERT INTO phi_access_log (
      user_id,
      patient_id,
      action,
      accessed_fields,
      ip_address,
      user_agent,
      reason,
      timestamp
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    data.userId,
    data.patientId,
    data.action,
    data.accessedFields,
    data.ipAddress,
    data.userAgent,
    data.reason,
    data.timestamp
  ])
}

// Middleware to enforce PHI access logging
export function withPHIAudit(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const user = await requireAuth(request)
    const patientId = context.params?.patientId

    // Log BEFORE access (in case of crash)
    await logPHIAccess({
      userId: user.userId,
      patientId,
      action: request.method === 'GET' ? 'READ' :
              request.method === 'POST' ? 'CREATE' :
              request.method === 'PUT' ? 'UPDATE' : 'DELETE',
      accessedFields: ['*'], // Update with actual fields accessed
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date()
    })

    return handler(request, context)
  }
}
```

### HIPAA Security Test Cases

```python
# hipaa_compliance_test.py
import requests

def test_hipaa_compliance(api_url, auth_token):
    """Test HIPAA compliance requirements"""

    findings = []

    # Test 1: PHI must be encrypted
    response = requests.get(
        f"{api_url}/api/patients/test-id",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    if response.status_code == 200:
        data = response.json()
        # Check if sensitive fields are returned in plaintext
        sensitive_fields = ['ssn', 'medical_history', 'diagnosis', 'treatment']
        for field in sensitive_fields:
            if field in data and data[field]:
                findings.append({
                    "finding": f"PHI field '{field}' returned in response",
                    "severity": "CRITICAL",
                    "compliance": "HIPAA Security Rule 164.312(a)(2)(iv)",
                    "recommendation": "Encrypt PHI at rest and in transit, return only when necessary"
                })

    # Test 2: Audit logging must be enabled
    response = requests.get(
        f"{api_url}/api/audit-logs",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    if response.status_code == 404:
        findings.append({
            "finding": "Audit logging endpoint not found",
            "severity": "HIGH",
            "compliance": "HIPAA Security Rule 164.312(b)",
            "recommendation": "Implement audit logging for all PHI access"
        })

    # Test 3: Access controls
    # Try accessing patient without proper authorization
    response = requests.get(
        f"{api_url}/api/patients/unauthorized-patient-id",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    if response.status_code == 200:
        findings.append({
            "finding": "Unauthorized access to patient records",
            "severity": "CRITICAL",
            "compliance": "HIPAA Security Rule 164.312(a)(1)",
            "recommendation": "Implement role-based access control for PHI"
        })

    return findings
```

---

## PCI-DSS COMPLIANCE IMPLEMENTATION

Source: agent-system/core/security-specialist.md

### Rule: NEVER Store Card Data

```typescript
// ❌ CRITICAL VIOLATION: NEVER store full card numbers, CVV, or card data
// This will result in PCI-DSS non-compliance and potential fines

// ✅ CORRECT: Use Stripe to handle all card processing
// Card data NEVER touches your server

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Server-side: Create Payment Intent
export async function createPaymentIntent(
  amount: number,
  orderId: string,
  customerId?: string
): Promise<{ clientSecret: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: { orderId },
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    // Never store card details - Stripe handles this
  })

  return {
    clientSecret: paymentIntent.client_secret!
  }
}

// Server-side: Webhook to confirm payment
export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<void> {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      await fulfillOrder(paymentIntent.metadata.orderId)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      await handleFailedPayment(failedPayment.metadata.orderId)
      break
  }
}
```

### PCI-DSS Security Test Cases

```python
# pci_dss_compliance_test.py
import requests
import re

def test_pci_compliance(api_url, auth_token):
    """Test PCI-DSS compliance requirements"""

    findings = []

    # Test 1: Check if card data is being stored
    # Try to retrieve order/payment history
    response = requests.get(
        f"{api_url}/api/orders",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    if response.status_code == 200:
        data = response.json()
        for order in data.get('orders', []):
            # Check for full card numbers (13-19 digits)
            text = str(order)
            if re.search(r'\b\d{13,19}\b', text):
                findings.append({
                    "finding": "Full card number found in order data",
                    "severity": "CRITICAL",
                    "compliance": "PCI-DSS Requirement 3.4",
                    "recommendation": "NEVER store full card numbers - use Stripe/PayPal tokens"
                })

            # Check for CVV (3-4 digits with CVV/CVC/CVN label)
            if re.search(r'(cvv|cvc|cvn|security.?code)\s*[:=]\s*\d{3,4}', text.lower()):
                findings.append({
                    "finding": "CVV/CVC found in stored data",
                    "severity": "CRITICAL",
                    "compliance": "PCI-DSS Requirement 3.2.2",
                    "recommendation": "NEVER store CVV - this is prohibited by PCI-DSS"
                })

    # Test 2: Verify HTTPS is enforced
    try:
        response = requests.get(
            api_url.replace('https://', 'http://'),
            allow_redirects=False
        )
        if response.status_code != 301 and response.status_code != 302:
            findings.append({
                "finding": "HTTP not redirected to HTTPS",
                "severity": "HIGH",
                "compliance": "PCI-DSS Requirement 4.1",
                "recommendation": "Enforce HTTPS with automatic redirect"
            })
    except:
        pass  # Connection refused is expected for HTTP

    # Test 3: Check TLS version
    # (Would need SSL library to test TLS versions)

    return findings
```

---

## SECURITY TESTING CHECKLIST

Source: agent-system/core/security-specialist.md

### Authentication Testing
- [ ] SQL injection in login fields: `admin' OR '1'='1' --`
- [ ] Brute force login (should be rate limited after 5 attempts)
- [ ] Test weak passwords (should be rejected)
- [ ] Session timeout after 15-30 minutes of inactivity
- [ ] Session regeneration after login
- [ ] Logout properly invalidates session
- [ ] Password reset tokens expire (1 hour max)
- [ ] Password reset doesn't reveal if email exists
- [ ] MFA bypass attempts

### Authorization Testing
- [ ] Access other users' resources (horizontal escalation)
- [ ] Access admin functions as regular user (vertical escalation)
- [ ] IDOR: Change resource IDs in URLs
- [ ] Missing function-level access control
- [ ] JWT token manipulation and signature bypass
- [ ] Role tampering in JWT payload
- [ ] API key scope bypass

### Input Validation Testing
- [ ] SQL injection in all input fields
- [ ] XSS in text inputs: `<script>alert('XSS')</script>`
- [ ] Stored XSS in user profiles, comments
- [ ] Command injection: `; ls -la`, `| cat /etc/passwd`
- [ ] Path traversal: `../../etc/passwd`
- [ ] File upload: Try .php, .exe, oversized files, null bytes
- [ ] HTTP header injection
- [ ] CRLF injection

### Security Configuration Testing
- [ ] Security headers present (check securityheaders.com)
- [ ] HTTPS enforced (try HTTP, should redirect)
- [ ] Default credentials changed
- [ ] Directory listing disabled
- [ ] Error messages don't leak info (stack traces, DB type)
- [ ] Debug mode disabled in production
- [ ] Unnecessary HTTP methods disabled (TRACE, OPTIONS)

### Data Exposure Testing
- [ ] API returns only necessary data (no over-fetching)
- [ ] No sensitive data in URLs or logs
- [ ] No credit card data stored
- [ ] Encryption for sensitive data at rest
- [ ] No PII in error messages
- [ ] Proper data masking in logs

### Compliance Testing
- [ ] GDPR: Data export endpoint exists
- [ ] GDPR: Data deletion endpoint exists
- [ ] HIPAA: PHI is encrypted
- [ ] HIPAA: Audit logging enabled
- [ ] PCI-DSS: No card data stored
- [ ] PCI-DSS: TLS 1.2+ only

---

## SECURITY TOOLS & COMMANDS

Source: agent-system/core/security-specialist.md

### Automated Scanning

```bash
# OWASP ZAP - Web Application Scanner
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com

# Full scan with authentication
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://example.com \
  -n context.context \
  -U username

# npm audit - Dependency vulnerabilities
npm audit --production
npm audit --json > audit-results.json

# Snyk - Advanced dependency scanning
npx snyk test
npx snyk monitor  # Continuous monitoring

# SonarQube - Code quality + security
sonar-scanner \
  -Dsonar.projectKey=myproject \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://localhost:9000

# Semgrep - Static analysis
semgrep --config=p/security-audit ./src

# Bandit - Python security linter
bandit -r ./python_code

# TruffleHog - Secret scanning
trufflehog git file://. --json --regex --entropy=True
```

### Manual Testing Tools

| Tool | Purpose | Usage |
|------|---------|-------|
| Burp Suite | HTTP interception & modification | Intercept requests, test injection |
| Postman | API security testing | Test auth, injection, rate limits |
| sqlmap | SQL injection automation | `sqlmap -u "url?id=1" --batch` |
| OWASP ZAP | Web scanner | Automated + manual testing |
| Nikto | Web server scanner | `nikto -h https://example.com` |
| Nmap | Network scanning | `nmap -sV -sC example.com` |
| jwt_tool | JWT testing | `jwt_tool <token> -T` |
| ffuf | Fuzzing | `ffuf -u url/FUZZ -w wordlist.txt` |

---

## SUCCESS METRICS

Source: agent-system/core/security-specialist.md

### Security Posture
| Metric | Target | Measurement |
|--------|--------|-------------|
| OWASP Top 10 | All mitigated | Penetration test results |
| Security Headers | A+ grade | securityheaders.com |
| Dependency Vulnerabilities | Zero high/critical | npm audit clean |
| Penetration Test Findings | Zero critical | External pentest report |
| Code Security Score | 90+ | SonarQube/Snyk |

### Compliance
| Standard | Requirement | Status |
|----------|-------------|--------|
| GDPR | Data export/deletion | ✅ Implemented |
| HIPAA | PHI encryption + audit logs | ✅ Verified |
| PCI-DSS | No card data stored | ✅ Stripe only |
| SOC 2 | Security controls documented | ✅ Documented |

### Monitoring
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Failed Login Rate | < 1% | > 5% triggers alert |
| Rate Limit Violations | < 100/day | > 500 triggers review |
| Security Event Response | < 15 min | > 30 min escalation |
| Incident Response | < 1 hour | Critical = immediate |

---

## HANDOFF SECTIONS

### Receiving from Backend Specialist
```
Handoff Context:
- Backend Complete: [Tech stack, endpoints]
- Security Headers: Applied (verify configuration)
- Input Validation: Implemented (verify coverage)
- Authentication: [JWT/Session - verify implementation]

Your Mission: Conduct comprehensive security audit and penetration testing
```

### Handoff to Security Remediation Agent
```
Handoff Context:
- Vulnerabilities Found: [List with CVSS scores]
- Priority Order: [Critical → High → Medium → Low]
- Evidence: [POC exploits, screenshots, logs]
- Affected Endpoints: [Specific paths and methods]

Your Mission: Implement fixes for all identified vulnerabilities
```

### Handoff to Testing Specialist
```
Handoff Context:
- Security Hardening Complete: [List of measures implemented]
- Known Attack Vectors: [Specific vulnerabilities to regression test]
- Compliance Requirements: [GDPR, HIPAA, PCI-DSS checklist]
- Security Test Cases: [Provided test scenarios]

Your Mission: Create automated security test suite for CI/CD
```

---

## ACTIVATION & USAGE

### Trigger Phrases
- "Audit my code for security vulnerabilities"
- "Penetration test this application"
- "Check for OWASP Top 10 vulnerabilities"
- "Harden my application security"
- "Implement GDPR compliance"
- "Security review my API"
- "Test authentication security"
- "Check for SQL injection"
- "Verify HIPAA compliance"
- "Audit access controls"

### Deliverables
1. **Security Audit Report** - Findings with CVSS scores, evidence, recommendations
2. **Penetration Test Results** - Exploits attempted, success/failure, impact
3. **Compliance Assessment** - GDPR, HIPAA, PCI-DSS checklist status
4. **Hardening Recommendations** - Prioritized security improvements
5. **Security Test Cases** - Reproducible test scenarios for CI/CD

---

## END OF SECURITY AUDITOR AGENT

**Total Patterns:** 95+ (expanded from 85+)
**Coverage:** 100% source extraction + OWASP 2021/2025 + compliance implementations
**Sections Added from security-specialist.md:**
- Agent Identity & Personality
- Critical Rules (Security-First Mindset)
- HIPAA Compliance Implementation (PHI encryption, audit logging)
- PCI-DSS Compliance Implementation (Stripe integration)
- Security Testing Checklist (checkbox format)
- Security Tools & Commands
- Success Metrics
- Handoff Sections
- Activation & Usage
**Ready For:** Enterprise penetration testing, compliance audits, vulnerability assessments
**Version:** 1.2
**Last Updated:** 2026-01-18

---
