# Claude Code Hooks Library — Drop-In Patterns

**Source:** claude-code-templates, everything-claude-code extractions  
**Last Updated:** 2026-07-02

This file contains canonical hook patterns for quality gates, security scanning, and process enforcement.

---

## 1. TDD-Gate (Blocking Hook)

**Purpose:** Block edits to production code unless a corresponding test file exists.  
**Trigger:** PreToolUse on Edit|MultiEdit|Write  
**Exit Code:** 2 (blocks) | 0 (pass)

```bash
#!/bin/bash
# ~/.claude/hooks/tdd-gate.sh
# TDD-gate: Block production code edits without test files

read_hook_json() {
  # Reads JSON from stdin: {"tool_name", "tool_input": {"file_path": "..."}}
  local file_path
  file_path=$(python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('tool_input', {}).get('file_path', ''))" 2>/dev/null)
  echo "$file_path"
}

FILE_PATH=$(read_hook_json)

# Skip non-production files
[[ $FILE_PATH =~ \.(d\.ts|json|md|yml|yaml|toml|sh)$ ]] && exit 0
[[ $FILE_PATH =~ (test|spec|fixture|mock|\.test\.|\.spec\.) ]] && exit 0
[[ $FILE_PATH =~ (migrations|config|Program\.cs|Startup\.cs) ]] && exit 0

# Production code extensions
[[ $FILE_PATH =~ \.(cs|py|ts|tsx|js|jsx|go|rs|rb|php|java|kt|swift|dart)$ ]] || exit 0

# Search for test file
search_test_file() {
  local base_name base_dir test_name
  base_name=$(basename "$FILE_PATH" | sed 's/\.[^.]*$//')
  base_dir=$(dirname "$FILE_PATH")
  
  # Check sibling directories
  for dir in "$base_dir" "$base_dir/../test" "$base_dir/../tests" "$base_dir/__tests__"; do
    [[ ! -d "$dir" ]] && continue
    for pattern in "*${base_name}Test.*" "*.test.*" "*.spec.*" "test_${base_name}.*"; do
      [[ -f "$dir/$pattern" ]] && return 0
    done
  done
  
  return 1
}

if ! search_test_file; then
  echo "❌ TDD-GATE BLOCKED: Edit to $FILE_PATH without corresponding test file" >&2
  echo "   Create test file first (patterns: *Test.*, *.test.*, *.spec.*)" >&2
  exit 2
fi

exit 0
```

---

## 2. Plan-Gate (Warn-Only Hook)

**Purpose:** Warn if production code is edited without a recent `.spec.md` file.  
**Trigger:** PreToolUse on Edit|MultiEdit|Write  
**Exit Code:** Always 0 (never blocks)

```bash
#!/bin/bash
# ~/.claude/hooks/plan-gate.sh
# Plan-gate: Warn if code edited without recent spec

read_hook_json() {
  python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('tool_input', {}).get('file_path', ''))" 2>/dev/null
}

FILE_PATH=$(read_hook_json)

# Skip non-production files
[[ $FILE_PATH =~ \.(d\.ts|json|md|yml|yaml)$ ]] && exit 0
[[ $FILE_PATH =~ (test|spec|fixture) ]] && exit 0

# Check for .spec.md modified in last 14 days
if [[ -f ".spec.md" ]]; then
  last_mod=$(find . -name ".spec.md" -mtime -14 2>/dev/null | wc -l)
  if [[ $last_mod -eq 0 ]]; then
    echo "⚠️  Plan-gate: .spec.md not updated in 14 days. Consider spec-before-code." >&2
  fi
fi

exit 0
```

---

## 3. Dangerous-Command-Blocker (Tiered)

**Purpose:** Block catastrophic and critical-path shell commands.  
**Trigger:** PreToolUse on Bash tool  
**Exit Code:** 2 (block L1/L2) | 0 (pass/warn L3)

```python
#!/usr/bin/env python3
# ~/.claude/hooks/dangerous-command-blocker.py
# Tiered blocking of dangerous Bash commands

import sys
import json
import re

def read_hook_json():
    """Read {"tool_input": {"command": "..."}} from stdin"""
    try:
        data = json.load(sys.stdin)
        return data.get("tool_input", {}).get("command", "")
    except:
        return ""

def check_dangerous(cmd):
    """Return (severity, reason) or (None, None) if safe"""
    
    # L1: Always-block catastrophic
    catastrophic = [
        r"rm\s+.*(/|~|\*).*",  # rm on root, home, wildcard
        r"rm\s+-rf\s+.*[*]",   # rm -rf with wildcards
        r"\bdd\b",             # disk dump
        r"mkfs",               # filesystem format
        r":/\(\)\s*{\s*:|:&\s*}",  # fork bomb
        r">/dev/sd[a-z]",      # write to disk device
        r"chmod\s+777\s+/",    # chmod 777 root
    ]
    
    # L2: Critical-path protection
    critical = [
        r"rm\s+.*\.claude",
        r"rm\s+.*\.git",
        r"rm\s+.*node_modules",
        r"rm\s+.*\.env",
        r"rm\s+.*\.(lock|yaml|json)$",
        r"mv\s+.*\.claude",
        r"mv\s+.*\.git",
    ]
    
    for pattern in catastrophic:
        if re.search(pattern, cmd, re.IGNORECASE):
            return ("L1", f"Catastrophic command blocked: {pattern}")
    
    for pattern in critical:
        if re.search(pattern, cmd, re.IGNORECASE):
            return ("L2", f"Critical-path command blocked: {pattern}")
    
    return (None, None)

cmd = read_hook_json()
severity, reason = check_dangerous(cmd)

if severity in ("L1", "L2"):
    print(f"❌ BLOCKED ({severity}): {reason}", file=sys.stderr)
    sys.exit(2)

sys.exit(0)
```

---

## 4. Secret-Scanner Hook (2025 Patterns)

**Purpose:** Detect hardcoded API keys and secrets before commit.  
**Trigger:** PreToolUse on Write|Edit before commit  
**Exit Code:** 2 (block) | 0 (pass)

```python
#!/usr/bin/env python3
# ~/.claude/hooks/secret-scanner.py
# Scan staged files for 2025-era secrets

import sys
import re
from pathlib import Path

SECRET_PATTERNS = {
    "Anthropic API key": r"sk-ant-api\d{2}-[a-zA-Z0-9]{60,}",
    "OpenAI API key": r"sk-proj-[a-zA-Z0-9]{20,}",
    "OpenAI old key": r"sk-[a-zA-Z0-9]{40,}",
    "Supabase secret": r"sbp_[a-zA-Z0-9]{32}",
    "Supabase anon": r"sb_secret_[a-zA-Z0-9]{20,}",
    "Supabase publishable": r"sb_publishable_[a-zA-Z0-9]{20,}",
    "Vercel token": r"vercel_[a-zA-Z0-9]{20,}",
    "GitHub PAT (new)": r"ghp_[a-zA-Z0-9]{36}",
    "GitHub PAT (fine-grain)": r"github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}",
    "GitHub OAuth": r"gho_[a-zA-Z0-9]{36}",
    "GitHub App": r"ghs_[a-zA-Z0-9]{36}",
    "GitLab PAT": r"glpat-[a-zA-Z0-9]{20}",
    "Stripe live": r"sk_live_[a-zA-Z0-9]{20,}",
    "Stripe restricted": r"rk_live_[a-zA-Z0-9]{20,}",
    "Groq API": r"gsk_[a-zA-Z0-9]{20,}",
    "HuggingFace": r"hf_[a-zA-Z0-9]{30,}",
    "Replicate": r"r8_[a-zA-Z0-9]{40,}",
    "Linear API": r"lin_api_[a-zA-Z0-9]{40}",
    "Notion": r"ntn_[a-zA-Z0-9]{50,}",
    "DigitalOcean": r"dop_v1_[a-zA-Z0-9]{40,}",
    "Databricks": r"dapi[a-z0-9]{20,}",
    "Google API": r"AIza[0-9A-Za-z\-_]{35}",
    "Google OAuth": r"ya29\.[0-9A-Za-z\-_]{20,}",
    "AWS Access Key": r"AKIA[0-9A-Z]{16}",
    "Slack Bot": r"xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]{24}",
    "Slack App": r"xoxp-[0-9]+-[0-9]+-[0-9]+-[a-zA-Z0-9]{32}",
    "Private RSA": r"-----BEGIN RSA PRIVATE KEY-----",
    "Private EC": r"-----BEGIN EC PRIVATE KEY-----",
}

def scan_file(path):
    """Scan single file for secrets"""
    try:
        content = Path(path).read_text(errors="ignore")
    except:
        return []
    
    findings = []
    for secret_type, pattern in SECRET_PATTERNS.items():
        if re.search(pattern, content):
            findings.append((secret_type, path))
    
    return findings

if __name__ == "__main__":
    findings = []
    
    # Scan staged files (argv contains file paths)
    for file_path in sys.argv[1:]:
        findings.extend(scan_file(file_path))
    
    if findings:
        print("❌ SECRET-SCANNER: Secrets detected", file=sys.stderr)
        for secret_type, path in findings:
            print(f"   {secret_type}: {path}", file=sys.stderr)
        sys.exit(2)
    
    sys.exit(0)
```

---

## 5. Scope-Guard (Warn-Only)

**Purpose:** Warn when edits fall outside `.spec.md` scope.  
**Trigger:** PreToolUse on Edit|Write  
**Exit Code:** Always 0 (never blocks)

```bash
#!/bin/bash
# ~/.claude/hooks/scope-guard.sh
# Scope-guard: Warn if edits exceed spec scope

# Find most recent .spec.md (modified <60 min ago)
SPEC_FILE=$(find . -name ".spec.md" -mmin -60 -print -quit 2>/dev/null)

if [[ -z "$SPEC_FILE" ]]; then
  exit 0  # No recent spec; can't guard
fi

# Extract declared files from "## In Scope" section
DECLARED_FILES=$(grep -A 100 "## In Scope" "$SPEC_FILE" | grep "^-" | sed 's/^- //' | head -20)

# Compare against git diff
MODIFIED_FILES=$(git diff --name-only 2>/dev/null | sort)

for file in $MODIFIED_FILES; do
  if ! echo "$DECLARED_FILES" | grep -q "$file"; then
    echo "⚠️  Scope-guard: $file not declared in .spec.md" >&2
  fi
done

exit 0
```

---

## 6. Format-Check Hook

**Purpose:** Auto-fix formatting (optional, warn-only).  
**Trigger:** PreCommit  
**Exit Code:** 0 (always pass after formatting)

```bash
#!/bin/bash
# ~/.claude/hooks/format-check.sh

# Prettier for JS/TS/JSON
prettier --write --cache "**/*.{js,ts,tsx,json}" 2>/dev/null || true

# Black for Python
black . 2>/dev/null || true

# Go fmt
go fmt ./... 2>/dev/null || true

exit 0
```

---

## Hook Installation

Add to `~/.claude/settings.json`:

```json
{
  "hooks": [
    {
      "event": "pre-tool-use",
      "tool": "Edit|Write|MultiEdit",
      "command": "bash ~/.claude/hooks/tdd-gate.sh",
      "description": "Require test file for production code edits"
    },
    {
      "event": "pre-tool-use",
      "tool": "Bash",
      "command": "python3 ~/.claude/hooks/dangerous-command-blocker.py",
      "description": "Block catastrophic shell commands"
    },
    {
      "event": "pre-commit",
      "command": "python3 ~/.claude/hooks/secret-scanner.py $(git diff --cached --name-only)",
      "description": "Scan for hardcoded secrets"
    }
  ]
}
```

---

## References

- Claude Code hooks documentation: ~/.claude/documentation/hooks.md
- Pre-commit framework: https://pre-commit.com/
- TDD discipline: Growing Object-Oriented Software Guided by Tests (Freeman, Pryce)
