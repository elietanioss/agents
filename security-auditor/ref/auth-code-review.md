---
name: auth-code-review
description: JWT, OAuth 2.0, session management, and password handling code review patterns. Exact vulnerable vs safe code for each antipattern. jsonwebtoken and jose library specific patterns.
---

# Auth Code Review Reference

## JWT — jsonwebtoken LIBRARY

### Critical Antipatterns

```typescript
// ❌ CRITICAL — jwt.decode() does NOT verify signature
import jwt from 'jsonwebtoken'
const payload = jwt.decode(token)  // Anyone can forge this!
const userId = payload.sub          // NEVER trust decoded-only payload

// ✅ SAFE — jwt.verify() checks signature AND expiry
const payload = jwt.verify(token, process.env.JWT_SECRET!, {
  algorithms: ['HS256']  // Always specify — prevents algorithm confusion
})

// ❌ CRITICAL — missing algorithms parameter (algorithm confusion)
// Attacker can change alg to 'none' or RS256→HS256 attack
jwt.verify(token, secret)  // No algorithms specified

// ✅ SAFE
jwt.verify(token, secret, { algorithms: ['HS256'] })

// ❌ VULNERABLE — hardcoded secret
const token = jwt.sign({ userId }, 'my-secret-key')

// ✅ SAFE — environment variable, never hardcoded
const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
  expiresIn: '15m',       // Short-lived access tokens
  issuer: 'yourapp.com',
  audience: 'yourapp.com'
})

// ❌ VULNERABLE — no expiry
jwt.sign({ userId }, secret)  // Token valid forever

// ❌ VULNERABLE — sensitive data in payload (visible to anyone who decodes)
jwt.sign({
  userId,
  password: user.passwordHash,  // NEVER
  creditCard: user.cardNumber,  // NEVER
  ssn: user.ssn                 // NEVER
}, secret)

// ❌ VULNERABLE — fail-open error handling
function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret)
  } catch {
    return null  // Caller might not check null → access granted
  }
}

// ✅ SAFE — fail closed, always throw
function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret, { algorithms: ['HS256'] })
  } catch (err) {
    logger.warn('JWT verification failed', { error: err.message })
    throw new UnauthorizedError('Invalid or expired token')
  }
}

// ❌ VULNERABLE — JWT stored in localStorage (XSS-accessible)
localStorage.setItem('token', jwtToken)

// ✅ SAFE — httpOnly cookie (XSS cannot read)
// Set server-side:
res.setHeader('Set-Cookie', serialize('token', jwtToken, {
  httpOnly: true,   // Not accessible via JS
  secure: true,     // HTTPS only
  sameSite: 'lax',  // CSRF protection
  maxAge: 60 * 15,  // 15 minutes
  path: '/'
}))
```

### Detection Grep Commands
```bash
# jwt.decode (no verification)
grep -rn --include="*.ts" --include="*.js" "jwt\.decode\b" src/

# jwt.verify without algorithms
grep -rn --include="*.ts" --include="*.js" \
  "jwt\.verify\s*\([^)]+\)" src/ | grep -v "algorithms"

# JWT in localStorage
grep -rn --include="*.ts" --include="*.js" --include="*.tsx" \
  "localStorage.*[Tt]oken\|localStorage.*[Jj][Ww][Tt]" src/

# Hardcoded JWT secret
grep -rn --include="*.ts" --include="*.js" \
  -E "jwt\.(sign|verify)\s*\([^,]+,\s*['\"][^'\"]{4,}['\"]" src/
```

---

## JWT — jose LIBRARY (2025 Modern Approach)

```typescript
// ❌ VULNERABLE — missing expiry in jose
import { SignJWT } from 'jose'
const jwt = await new SignJWT({ userId })
  .setProtectedHeader({ alg: 'HS256' })
  // Missing .setExpirationTime() → token never expires
  .sign(secret)

// ✅ SAFE — jose with full security options
const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
const jwt = await new SignJWT({ userId, role: user.role })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setIssuer('yourapp.com')
  .setAudience('yourapp.com')
  .setExpirationTime('15m')
  .sign(secret)

// ✅ SAFE — jose verification with algorithm enforcement
const { payload } = await jwtVerify(token, secret, {
  algorithms: ['HS256'],
  issuer: 'yourapp.com',
  audience: 'yourapp.com'
})
```

---

## OAUTH 2.0 ANTIPATTERNS

```typescript
// ❌ VULNERABLE — missing state parameter (CSRF on OAuth flow)
const authUrl = `https://provider.com/oauth/authorize?` +
  `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`
// Attacker can initiate OAuth flow and steal the code

// ✅ SAFE — state parameter prevents CSRF
const state = crypto.randomBytes(32).toString('hex')
req.session.oauthState = state
const authUrl = `https://provider.com/oauth/authorize?` +
  `client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}` +
  `&response_type=code&state=${state}`

// In callback:
if (req.query.state !== req.session.oauthState) {
  throw new Error('State mismatch — possible CSRF attack')
}

// ❌ VULNERABLE — open redirect via redirect_uri
const redirectUri = req.query.redirect_uri  // Attacker sends to evil.com

// ✅ SAFE — allowlist redirect URIs
const ALLOWED_REDIRECT_URIS = [
  'https://yourapp.com/auth/callback',
  'https://app.yourapp.com/auth/callback'
]
if (!ALLOWED_REDIRECT_URIS.includes(req.query.redirect_uri)) {
  return res.status(400).json({ error: 'Invalid redirect_uri' })
}

// ❌ VULNERABLE — implicit flow (deprecated, token in URL fragment)
// response_type=token  // Token in URL → appears in browser history, Referer headers

// ✅ SAFE — authorization code flow + PKCE
// response_type=code
// code_challenge=SHA256(code_verifier)
// code_challenge_method=S256
```

---

## SESSION MANAGEMENT

```typescript
// ❌ VULNERABLE — cookie without security flags
res.cookie('session', sessionId)

// ✅ SAFE — all security flags
res.cookie('session', sessionId, {
  httpOnly: true,    // Not accessible via document.cookie
  secure: true,      // HTTPS only (set false in dev only)
  sameSite: 'lax',   // Protects against CSRF, allows normal navigation
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
  path: '/'
})

// ❌ VULNERABLE — session fixation (same ID before and after login)
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body)
  req.session.userId = user.id  // Same session ID! Pre-login session reused
  res.json({ ok: true })
})

// ✅ SAFE — regenerate session ID after login
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body)
  req.session.regenerate((err) => {  // New session ID issued
    req.session.userId = user.id
    res.json({ ok: true })
  })
})

// ❌ VULNERABLE — session token in URL query parameter
// GET /dashboard?session=abc123 — appears in logs, browser history, Referer

// ✅ SAFE — always use cookies for session tokens, never URLs
```

---

## PASSWORD HANDLING

```typescript
// ❌ CRITICAL — MD5 for passwords
const hash = crypto.createHash('md5').update(password).digest('hex')

// ❌ CRITICAL — SHA1 for passwords (both broken for passwords)
const hash = crypto.createHash('sha1').update(password).digest('hex')

// ❌ WEAK — bcrypt with insufficient rounds (< 12 for 2025)
const hash = await bcrypt.hash(password, 10)  // Too fast to brute-force

// ✅ SAFE — bcrypt minimum 12 rounds (2025 standard)
const hash = await bcrypt.hash(password, 12)

// ✅ BETTER — Argon2id (recommended over bcrypt for new systems)
import argon2 from 'argon2'
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MB
  timeCost: 3,
  parallelism: 4
})

// ❌ VULNERABLE — timing attack via === comparison
if (resetToken === storedToken)  // Length of operation reveals if match

// ✅ SAFE — timing-safe comparison
import { timingSafeEqual } from 'crypto'
const a = Buffer.from(resetToken)
const b = Buffer.from(storedToken)
if (a.length !== b.length || !timingSafeEqual(a, b)) {
  throw new Error('Invalid token')
}

// ❌ VULNERABLE — password reset token: short, predictable, no expiry
const resetToken = Math.random().toString(36)  // Predictable!

// ✅ SAFE — cryptographically random, long, time-limited
const resetToken = crypto.randomBytes(32).toString('hex')  // 64 hex chars
const expiresAt = new Date(Date.now() + 60 * 60 * 1000)    // 1 hour max
await db.passwordResets.create({
  token: await bcrypt.hash(resetToken, 12),  // Hash the token too
  userId: user.id,
  expiresAt
})
// Send resetToken to user, store hash in DB
```

### Detection Grep
```bash
# Weak hashing
grep -rn --include="*.ts" --include="*.js" \
  "createHash\(['\"]md5\|createHash\(['\"]sha1" src/

# bcrypt rounds too low
grep -rn --include="*.ts" --include="*.js" \
  -E "bcrypt\.hash\s*\([^,]+,\s*([1-9])\s*\)" src/ \
  | grep -E ",\s*[1-9][^0-9]" | grep -v ",\s*1[0-9]"

# Direct comparison of tokens (timing attack)
grep -rn --include="*.ts" --include="*.js" \
  -E "(token|secret|password)\s*===\s*(token|secret|stored)" src/

# Math.random for security tokens
grep -rn --include="*.ts" --include="*.js" \
  "Math\.random()" src/ | grep -i "token\|secret\|key\|nonce"
```

---

## AUTH CODE REVIEW CHECKLIST

```
CRITICAL:
[ ] jwt.verify() used (not jwt.decode())
[ ] algorithms: ['HS256'] or explicit algorithm always specified
[ ] JWT secrets from process.env (never hardcoded strings)
[ ] JWT has expiresIn (never omitted)
[ ] JWT stored in httpOnly cookie (never localStorage)
[ ] Sensitive data NOT in JWT payload (passwords, cards, SSNs)
[ ] Fail-closed error handling (auth errors always throw, never return null)

HIGH:
[ ] OAuth: state parameter generated and validated
[ ] OAuth: redirect_uri validated against allowlist
[ ] Session: httpOnly + Secure + SameSite cookie flags
[ ] Session: ID regenerated after login (no fixation)
[ ] Passwords: bcrypt >=12 rounds or argon2id
[ ] Password reset tokens: crypto.randomBytes(32), expire in <=1 hour
[ ] Token comparison: timingSafeEqual (never ===)

MEDIUM:
[ ] OAuth: PKCE for public clients
[ ] Passwords: not logged, not in error messages
[ ] Sessions: invalidated on logout (server-side)
[ ] Rate limiting on login, register, password reset endpoints
```
