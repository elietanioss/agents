---
name: secret-detection
description: Complete regex library for detecting hardcoded secrets in TypeScript/JavaScript/Node.js codebases. Patterns for AWS, GitHub, Stripe, Supabase, OpenAI, Anthropic, database URLs, private keys, and git history scanning.
---

# Secret Detection Reference

## COMPLETE REGEX PATTERN LIBRARY

Run all at once:
```bash
SECRET_SCAN() {
  TARGET="${1:-.}"
  echo "=== Scanning $TARGET for secrets ==="

  # AWS Access Key ID
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "AKIA[0-9A-Z]{16}" "$TARGET" | tee -a /tmp/secrets-found.txt

  # AWS Secret Access Key (high entropy near AKIA)
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "aws_secret_access_key\s*[=:]\s*[A-Za-z0-9/+]{40}" "$TARGET" | tee -a /tmp/secrets-found.txt

  # GitHub tokens
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" --include="*.yml" \
    -E "ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82}|gho_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36}" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # Stripe live keys
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "sk_live_[a-zA-Z0-9]{24,99}|rk_live_[a-zA-Z0-9]{24,99}|whsec_[a-zA-Z0-9]{32,99}" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # OpenAI API key
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "sk-[a-zA-Z0-9]{48}" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # Anthropic API key
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "sk-ant-[a-zA-Z0-9_-]{20,}" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # Database URLs with credentials embedded
  grep -rn --include="*.ts" --include="*.js" --include="*.env*" \
    -E "(postgres|postgresql|mysql|mongodb(\+srv)?|redis|rediss)://[^:@\s]+:[^@\s]+@[^\s]+" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # Private keys
  grep -rn --include="*.ts" --include="*.js" --include="*.pem" --include="*.key" \
    -E "-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # JWT hardcoded secret (string literal not process.env)
  grep -rn --include="*.ts" --include="*.js" \
    -E "jwt\.(sign|verify)\s*\([^)]+,\s*['\"][^'\"]{8,}['\"]" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # Generic high-value secret variable assignments
  grep -rn --include="*.ts" --include="*.js" \
    -E "(SECRET|TOKEN|API_KEY|PRIVATE_KEY|ACCESS_KEY|CLIENT_SECRET)\s*[=:]\s*['\"][^'\"]{16,}" \
    "$TARGET" | grep -v "process\.env\|getenv\|os\.environ\|example\|placeholder\|your_" \
    | tee -a /tmp/secrets-found.txt

  # Supabase service role key (JWT format with high entropy)
  grep -rn --include="*.ts" --include="*.js" --include="*.tsx" --include="*.env*" \
    -E "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  # NEXT_PUBLIC prefixed secrets (exposed to browser)
  grep -rn --include=".env*" \
    -E "^NEXT_PUBLIC_(SECRET|SERVICE_ROLE|STRIPE_SECRET|OPENAI|ANTHROPIC|PRIVATE)" \
    "$TARGET" | tee -a /tmp/secrets-found.txt

  COUNT=$(wc -l < /tmp/secrets-found.txt)
  echo "=== Found $COUNT potential secret exposures. Review /tmp/secrets-found.txt ==="
}
```

## GIT HISTORY SCANNING

No external tools needed — pure git commands:

```bash
# Search all commits for secret patterns
git log --all -p 2>/dev/null | grep -E \
  "AKIA[0-9A-Z]{16}|sk_live_|ghp_[a-zA-Z]{36}|sk-ant-|password\s*=\s*['\"][^'\"]{8}" \
  | head -50 > /tmp/git-secret-history.txt

# Find deleted .env files in history
git log --all --full-history -- "**/.env" "**/.env.local" "**/.env.production" \
  2>/dev/null | head -20 >> /tmp/git-secret-history.txt

# Show content of deleted .env file from specific commit
# git show COMMIT_HASH:.env

# Check if .gitignore properly excludes secrets
grep -E "\.env$|\.env\." .gitignore 2>/dev/null \
  || echo "WARNING: .env not in .gitignore"

# List all .env files ever committed
git log --all --name-only --format="" 2>/dev/null \
  | grep -E "\.env|\.env\." | sort -u
```

## .ENV FILE AUDIT

```bash
# Find all .env files
find . -name ".env*" -not -path "*/node_modules/*" -not -name ".env.example" \
  | while read f; do
    echo "=== $f ==="
    # Show non-template values (lines that aren't comments, empty, or obvious placeholders)
    grep -v "^#\|^$\|=your_\|=xxx\|=example\|=change_me\|=REPLACE\|=<\|=$" "$f" \
      | head -20
  done

# Check .env.example for accidentally included real values
if [ -f .env.example ]; then
  grep -E "AKIA|sk_live_|ghp_|sk-ant-|eyJhbGci" .env.example \
    && echo "CRITICAL: .env.example contains real secrets!"
fi

# Verify .gitignore excludes .env files
cat .gitignore 2>/dev/null | grep "\.env"
```

## ENTROPY-BASED DETECTION

Python script to find high-entropy strings (likely secrets):

```python
# Save as /tmp/entropy-scan.py, run: python3 /tmp/entropy-scan.py src/
import os, math, re, sys

def entropy(s):
    if not s: return 0
    counts = {}
    for c in s: counts[c] = counts.get(c, 0) + 1
    return -sum((v/len(s)) * math.log2(v/len(s)) for v in counts.values())

def scan_file(path):
    try:
        with open(path) as f: content = f.read()
    except: return
    # Find quoted strings 20+ chars
    for match in re.finditer(r"['\"]([A-Za-z0-9+/=_\-]{20,})['\"]", content):
        s = match.group(1)
        e = entropy(s)
        if e > 4.2:  # High entropy threshold
            line = content[:match.start()].count('\n') + 1
            print(f"HIGH ENTROPY ({e:.2f}): {path}:{line} — {s[:40]}...")

target = sys.argv[1] if len(sys.argv) > 1 else 'src'
for root, dirs, files in os.walk(target):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.next']]
    for file in files:
        if file.endswith(('.ts', '.js', '.tsx', '.jsx', '.env', '.env.local')):
            scan_file(os.path.join(root, file))
```

## WHAT EACH TOOL CATCHES

| Pattern Type | grep | Semgrep p/secrets | Entropy scan |
|---|---|---|---|
| Known key prefixes (AKIA, sk_live_) | ✅ | ✅ | ✅ |
| High-entropy random strings | ❌ | ❌ | ✅ |
| JWT hardcoded in code | ✅ | ✅ | ❌ |
| Secrets in git history | ✅ (git log) | ❌ | ❌ |
| PII in logs | ❌ | ❌ | ❌ (use Bearer) |
| Secrets in comments | ✅ | ✅ | ❌ |
