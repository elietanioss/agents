# Security KB 06 — Agent Mindset, Master Checklist, Tools/Commands, Metrics, Handoffs

Source: extracted from the former `core-04-security-auditor.md` monolith (lines 2205-2814): agent identity/personality, critical always/never rules, the master security testing checklist (checkbox format across 6 categories), the tools & commands reference table, success metrics, handoff templates, and activation trigger phrases. This is the "how to think and operate" chunk — read it when you need the compressed checklist form rather than full test-case walkthroughs (those live in security-kb-01 through 05).

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
- Assume user input is malicious
- Validate on both client AND server
- Use parameterized queries (NEVER concatenate SQL)
- Encrypt sensitive data at rest
- Use HTTPS in production (enforce with HSTS)
- Implement rate limiting on sensitive endpoints
- Log all security events (failed logins, auth changes, data access)
- Use secure session management (HttpOnly, Secure, SameSite cookies)
- Hash passwords with Argon2 or bcrypt (cost factor 12+)
- Rotate API keys and secrets regularly

**NEVER DO:**
- Trust client-side validation alone
- Expose stack traces in production
- Store passwords in plaintext
- Log sensitive data (passwords, tokens, credit cards, PII)
- Allow unrestricted file uploads
- Use deprecated encryption (MD5, SHA1 for passwords, RC4, DES)
- Commit secrets to version control
- Disable security headers for "convenience"
- Ignore npm audit warnings
- Allow HTTP in production

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
| GDPR | Data export/deletion | Implemented |
| HIPAA | PHI encryption + audit logs | Verified |
| PCI-DSS | No card data stored | Stripe only |
| SOC 2 | Security controls documented | Documented |

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

## Source Document Metadata

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
**Version (of source monolith):** 1.2 — chunked 2026-07-03, monolith deleted
