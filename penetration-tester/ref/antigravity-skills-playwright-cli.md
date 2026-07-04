---
ref-name: playwright-cli
description: Token-efficient browser automation for client-side security testing. 4x fewer tokens than Playwright MCP. Use for XSS, CSRF, clickjacking, DOM vulnerabilities, cookie analysis, and JavaScript-rendered content. All state saved to disk.
allowed-tools: Bash, Read
---

# Playwright CLI — Security Testing Reference

## Why CLI over MCP
- 4x fewer tokens: MCP ~114K tokens/session, CLI ~27K tokens/session
- No schema overhead: MCP loads 26 tool schemas (~3,600 tokens) before first action
- Disk-based state: Snapshots saved as YAML files — agent reads only what it needs
- No session degradation: CLI sessions have no practical length limit
- Microsoft recommendation: "If you are using a coding agent, use CLI+SKILLS instead"

## Installation
```bash
npm install -g @playwright/cli
playwright-cli install chromium
playwright-cli --version
```

## Core Command Reference

```bash
# Navigation
playwright-cli open URL [--headless] [--headed]
playwright-cli navigate URL                    # Navigate in existing session
playwright-cli navigate back
playwright-cli navigate forward
playwright-cli close

# Page state (saves to .playwright-cli/ as YAML — returns file path only)
playwright-cli snapshot                        # Accessibility tree with ref IDs
playwright-cli screenshot                      # PNG saved to disk

# Interaction (use ref IDs from snapshot)
playwright-cli click REF                       # playwright-cli click e8
playwright-cli fill REF "text"                 # playwright-cli fill e12 "payload"
playwright-cli press KEY                       # playwright-cli press Enter
playwright-cli hover REF
playwright-cli check REF                       # Checkbox
playwright-cli uncheck REF
playwright-cli select REF "option"             # Dropdown

# JavaScript execution (returns value inline)
playwright-cli evaluate "EXPRESSION"
playwright-cli evaluate "document.cookie"
playwright-cli evaluate "window.localStorage"
playwright-cli evaluate "document.title"
playwright-cli evaluate "window.location.href"

# Network
playwright-cli network-requests                # Get requests since last snapshot
```

## Security Testing Patterns

### XSS Testing Suite
```bash
# 1. Open target
playwright-cli open https://TARGET/search --headless

# 2. Get element refs
playwright-cli snapshot
# Read: cat ".playwright-cli\page-TIMESTAMP.yml" | grep -A2 "input\|search"

# 3. Inject XSS payload
playwright-cli fill e8 "<script>alert('XSS-PROBE-1337')</script>"
playwright-cli press Enter

# 4. Check reflection
playwright-cli evaluate "document.body.innerHTML.includes('XSS-PROBE-1337')"
# -> true = reflected XSS confirmed

# 5. Capture evidence
playwright-cli screenshot
copy ".playwright-cli\*.png" "evidence\screenshots\finding-NNN-xss.png"
playwright-cli close
```

### CSRF Analysis
```bash
playwright-cli open https://TARGET/transfer --headless
playwright-cli evaluate "document.querySelector('[name=csrf_token],[name=_token],[name=authenticity_token],[name=__RequestVerificationToken]')?.value || 'NO CSRF TOKEN'"
playwright-cli evaluate "[...document.querySelectorAll('meta')].find(m=>m.name.includes('csrf'))?.content || 'No CSRF meta'"
playwright-cli close
```

### Cookie Security Audit
```bash
playwright-cli open https://TARGET --headless
playwright-cli evaluate "document.cookie"
# Note: HttpOnly cookies won't appear here (that's good)
# Check Secure flag requires network inspection
playwright-cli network-requests
playwright-cli close
```

### Security Headers via Browser
```bash
playwright-cli open https://TARGET --headless
playwright-cli evaluate "JSON.stringify({csp: document.querySelector('meta[http-equiv=\"Content-Security-Policy\"]')?.content, referrer: document.referrer, sri_violations: [...document.querySelectorAll('script[src]:not([integrity]),link[rel=stylesheet]:not([integrity])')].length})"
playwright-cli close
```

### JavaScript State Extraction
```bash
playwright-cli open https://TARGET --headless
playwright-cli evaluate "JSON.stringify({nextData: !!window.__NEXT_DATA__, reduxState: !!window.__REDUX_STATE__, apolloState: !!window.__APOLLO_STATE__, nuxtData: !!window.__NUXT__})"
playwright-cli evaluate "JSON.stringify(Object.keys(window).filter(k=>k.startsWith('__')||k.startsWith('_wp')||k.startsWith('Drupal')))"
playwright-cli close
```

### Authenticated Testing Flow
```bash
# 1. Login
playwright-cli open https://TARGET/login --headless
playwright-cli snapshot
# Read snapshot to find form field refs
playwright-cli fill e8 "USER@EMAIL.COM"
playwright-cli fill e12 "PASSWORD"
playwright-cli click e15

# 2. Verify auth
playwright-cli evaluate "window.location.href"
playwright-cli evaluate "document.cookie"

# 3. Test authenticated endpoint
playwright-cli navigate https://TARGET/profile
playwright-cli evaluate "document.body.innerHTML"
playwright-cli screenshot
playwright-cli close
```

## Evidence Management
```bash
# Screenshots auto-save to .playwright-cli\ with timestamps
# Copy to evidence directory after each capture:
copy ".playwright-cli\page-*.png" "evidence\screenshots\"
copy ".playwright-cli\page-*.yml" "evidence\recon\"  # Snapshots for analysis
```

## Token Budget Rules
1. Never read full snapshot into context unless you need it — use grep first
2. Evaluate over click when possible — one evaluate replaces 3-5 interactions
3. Close sessions promptly — don't leave browser open between findings
4. Screenshot then close — evidence captured, session freed
