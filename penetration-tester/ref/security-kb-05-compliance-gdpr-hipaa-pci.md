# Security KB 05 — Compliance Testing: GDPR, HIPAA, PCI-DSS, Package Integrity

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 2087-2204, 2277-2586). GDPR data export/deletion validation, HIPAA PHI encryption + audit logging (with pgcrypto SQL patterns), PCI-DSS card-data-never-stored pattern (with Stripe integration), and npm dependency integrity auditing.

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
// CRITICAL VIOLATION: NEVER store full card numbers, CVV, or card data
// This will result in PCI-DSS non-compliance and potential fines

// CORRECT: Use Stripe to handle all card processing
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

## PCI DSS 4.0.1 NOTE (2025 UPDATE)

Key changes worth checking for on any client engagement that touches payment flows (e.g. e-commerce work):
- MFA now required for **all** access to the cardholder data environment (CDE), not just admin accounts.
- "Customized approach" validation lets an org design its own control to meet a requirement's intent, subject to assessor sign-off — check whether the client is using this path before assuming standard controls apply.
- Authenticated internal vulnerability scanning is now required (previously unauthenticated scans were acceptable).
- Anti-phishing controls are an explicit requirement, not just a recommendation.
- Automated log review is expected — manual log sampling is no longer sufficient for larger scopes.
