# Deployment Patterns (from everything-claude-code & misc-repos)

**Source**: everything-claude-code → ECC skills/deployment-patterns + spec-kit Constitution patterns

## Deployment Strategy Decision Table

Choose your strategy based on your risk tolerance and infrastructure:

| Strategy | Rollback | Downtime | 2x Infra | Best For |
|----------|----------|----------|----------|----------|
| **Rolling** | Slow (roll back gradually) | 0 (gradual) | No | Default choice, backward-compatible changes |
| **Blue-Green** | Instant (switch traffic) | 0 (instant) | Yes | Zero-tolerance services, instant rollback |
| **Canary** | Fast (route away traffic) | 0 | No | Risky changes, measurable errors |

### Rolling Deployment (Default)
- Requirements: **Backward-compatible changes** (two versions coexist briefly)
- Process:
  1. Instance 1: deploy new version (v2)
  2. Instance 2: deploy new version (v2)
  3. Instance 3: deploy new version (v2)
  4. All traffic on v2
- Rollback: Deploy previous version rolling
- When: Most changes, API versioning, gradual rollout

### Blue-Green Deployment
- Requirements: Separate infrastructure for current (blue) and next (green) versions
- Process:
  1. Deploy v2 to green environment (idle)
  2. Run smoke tests on green
  3. Switch all traffic blue → green (instant)
  4. Keep blue as instant rollback
- Rollback: Switch traffic green → blue (instant)
- When: Critical services, zero-tolerance downtime, easy rollback

### Canary Deployment
- Requirements: Traffic splitting capability, error rate monitoring
- Process:
  1. Deploy v2 to 5% of traffic
  2. Monitor error rates, latency
  3. If healthy: 50% traffic
  4. If healthy: 100% traffic
- Rollback: Route remaining traffic away from canary
- When: Risky changes, need to measure impact, gradual validation

## CI/CD Governance: Constitution + Parity Invariants (from spec-kit)

**Principle II: Test-Backed Change (NON-NEGOTIABLE)**

Every deployment MUST pass:

### Platform Matrix Testing
```yaml
# GitHub Actions matrix example
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    python: ['3.11', '3.12', '3.13']
    node: ['18', '20']

jobs:
  test:
    runs-on: ${{ matrix.os }}
    steps:
      - run: python -m pytest
      - run: npm test
```

Verify: **Deployed artifact behaves identically on all platforms**

### Parity Invariants
- OS-specific code (file paths: `/` vs `\\`, line endings: CRLF vs LF)
- Environment variables (case-sensitive on Linux, not on Windows)
- Locale/timezone differences
- Floating-point precision variations

**Testing parity**:
```typescript
// Test that behavior is consistent across platforms
describe('File operations', () => {
  it('should handle paths correctly on all platforms', () => {
    const path = joinPaths('dir', 'file.txt')
    expect(path).toBe(process.platform === 'win32' ? 'dir\\file.txt' : 'dir/file.txt')
  })

  it('should produce identical results on all OS', () => {
    const result = calculateChecksum('test data')
    // SHA256 must be identical regardless of platform
    expect(result).toBe('9f86d081884c7d6582ef8c38e7f3898e2e5fe5e5c0c5e5e5e5e5e5e5e5e5e5e')
  })
})
```

### Smoke Tests on Deployment Target

```typescript
// smoke-test.ts - Run AFTER deployment to actual environment
import request from 'supertest'

async function runSmokeTests() {
  const app = await import('../dist/app.js')
  
  const tests = [
    { method: 'GET', path: '/health', expected: 200 },
    { method: 'GET', path: '/api/users', expected: 200 },
    { method: 'POST', path: '/api/auth/login', expected: 400 }, // Bad request
  ]
  
  for (const test of tests) {
    const res = await request(app)[test.method.toLowerCase()](test.path)
    if (res.status !== test.expected) {
      throw new Error(`Smoke test failed: ${test.path} returned ${res.status}`)
    }
  }
  
  console.log('All smoke tests passed')
}
```

## Parallel Deployment Waves (SuperClaude Pattern)

Structure deployments as parallel phases with checkpoints:

```
Wave 1 [Parallel]: Deploy to canary regions
├─ Deploy to us-west-1 (5% traffic)
├─ Deploy to eu-west-1 (5% traffic)
└─ Deploy to ap-southeast-1 (5% traffic)

Checkpoint: Smoke tests pass, error rates normal
├─ Check application logs for errors
├─ Verify database queries succeed
└─ Monitor CPU/memory/disk metrics

Wave 2 [Parallel]: Roll out to remaining regions
├─ Deploy to us-east-1 (50% traffic)
├─ Deploy to eu-central-1 (50% traffic)
├─ Deploy to ap-northeast-1 (50% traffic)
└─ All other regions (100% traffic)
```

## Build Error Resolution (Incremental)

Never batch-fix build errors. Analyze and fix incrementally:

```bash
# Step 1: Understand
npm run build 2>&1 | head -50
# Error: Cannot find module 'lodash/pick'

# Step 2: Fix one issue
npm install lodash

# Step 3: Verify
npm run build
# New error: Type 'string' is not assignable to type 'number'

# Step 4: Fix next issue
# Edit the TypeScript file

# Step 5: Verify again
npm run build
# Build succeeded
```

## CI/CD Hook Ideas

### Pre-Commit Quality Gate
```bash
#!/bin/bash
# .husky/pre-commit: Lint + format + secrets check

npx lint-staged                    # Lint staged files
git commit --amend --no-edit       # Amend if linting modified files

npx secretlint                     # Detect secrets
if [ $? -ne 0 ]; then
  echo "Secrets detected in commit. Aborting."
  exit 1
fi

# Check for console.log, debugger
git diff --cached | grep -E "console\.(log|error|warn|debug)|debugger"
if [ $? -eq 0 ]; then
  echo "Found console.log/debugger in commit. Remove before committing."
  exit 1
fi
```

### Block --no-verify on Git Commands
```typescript
// .claude/hooks/pre-bash-block-no-verify.js
// Hook that prevents agents from bypassing pre-commit/pre-push hooks

export default {
  hooks: ['pre:bash:*'],
  handler: (input) => {
    if (input.command.includes('--no-verify')) {
      throw new Error(
        'Pre-commit/pre-push hooks cannot be bypassed with --no-verify. ' +
        'These hooks ensure code quality and security. ' +
        'Fix the underlying issue instead (lint errors, secrets, etc.)'
      )
    }
  }
}
```

## Migration Safety

**Rule: Forward-only in production**
```bash
# GOOD: New migration for rollback
# deploy v2.0 with new schema + code
# Later if needed:
# Create 001_rollback_v2.0.sql (new forward migration)
# Deploy rollback migration

# BAD:
# DELETE migration file 001_add_column.sql
# git push --force (destroys history)
```

## Diagnostic Commands

```bash
# Container health
docker ps -a | grep -v healthy

# Check deployment status
kubectl get deployments --show-labels

# View recent changes
git log --oneline -n 20

# Check application logs
pm2 logs app-name | tail -100

# Monitor resource usage
top -b -n 1 | head -20
```

## Reference
- Source: `D:\prompts\data\everything-claude-code-main\everything-claude-code-main\skills\deployment-patterns\SKILL.md`
- spec-kit Constitution: `D:\prompts\data\spec-kit\spec-kit-constitution.md`
- SuperClaude parallel patterns: `D:\prompts\data\SuperClaude_Framework-master\PLANNING.md`
