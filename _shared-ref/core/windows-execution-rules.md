# WINDOWS EXECUTION RULES — this machine

Windows 11 Pro, PowerShell 5.1 (default shell), Git Bash available, Python 3.12/3.13 in PATH. These rules are extracted from a year of session failures (183 PowerShell errors, 137 Bash errors, 11+ WebFetch failures). This file has NO frontmatter on purpose.

## PowerShell (5.1 — NOT PowerShell 7)
- NO `&&` / `||` pipeline chains → use `A; if ($?) { B }`
- NO ternary `?:`, null-coalescing `??`, or `?.` → use `if/else`, explicit `$null -eq`
- `Out-File`/`Set-Content` default to UTF-16 → always pass `-Encoding utf8` for files other tools read
- Avoid `2>&1` on native exes (wraps stderr lines in ErrorRecords, corrupts `$?`)
- `Select-String` on node_modules paths hits unreadable files — scope the path or `-ErrorAction SilentlyContinue` inside try/catch
- Destructive cmdlets prompt → add `-Confirm:$false` when the action is intended

## Git Bash
- Backslash paths get mangled (`cd C:UsersUser...` = the #1 recurring failure). ALWAYS quote paths AND prefer forward slashes: `cd "C:/Users/User/Projects/x"`
- `rmdir /s /q` is cmd.exe, not bash. `wc -l` PowerShell idioms (`.Lines`) don't exist in bash. Pick ONE shell dialect per command.
- Never mix Windows `copy`/`cat "state\file.json"` backslash forms inside bash blocks

## Python
- Command is `python`, NEVER `python3` (does not exist in PATH)

## Network
- WebFetch is 403-blocked for many sites on this machine → use `curl.exe` (native, not the PS alias) locally
- git push: credential-manager issues recur — use `gh` CLI when available; verify pushes with `git ls-remote` (pushes have failed silently before)

## File tools contract
- Read a file BEFORE Edit/Write (hard requirement — 50+ historical violations)
- Read `.txt` files via a text tool, not Desktop Commander (returns JSON metadata)
- Stage vendored DLLs before dependency-closure scans (see deploy.ps1 rule in memory)
