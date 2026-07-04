# Security KB 04 — Vulnerability Reporting Template + CVSS Worked Examples

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 1552-1731). Full markdown report template with two worked findings (SQL injection, IDOR), remediation timeline, and testing methodology appendix. Complements `cvss-wstg-reporting.md` (the primary CVSS/WSTG reference — read that one first for scoring formulas; this file is the fuller narrative report template with worked prose).

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
- DO: Include CVSS scores for all vulnerabilities
- DO: Provide proof-of-concept code
- DO: Include remediation code examples
- DO: Specify remediation timelines
- DO: Reference CWE and OWASP documentation
- DO: Include executive summary for management
- DON'T: Include actual production data in reports
- DON'T: Provide weaponized exploits
