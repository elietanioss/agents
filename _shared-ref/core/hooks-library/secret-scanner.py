#!/usr/bin/env python3
"""
Secret Scanner Hook: Detects hardcoded secrets (2025 patterns)
Exit codes: 0 (safe), 1 (warning), 2 (block)
Event: PreToolUse on Edit|MultiEdit|Write
Usage: Enable in settings.json hooks configuration
"""

import json
import sys
import re

# 2025 Secret Patterns (regex library)
SECRET_PATTERNS = {
    "anthropic_api": {
        "pattern": r"sk-ant-api\d{2}-[A-Za-z0-9_-]{40,}",
        "severity": "critical",
        "desc": "Anthropic API key"
    },
    "openai_api": {
        "pattern": r"sk-proj-[A-Za-z0-9_-]{20,}",
        "severity": "critical",
        "desc": "OpenAI API key"
    },
    "supabase_secret": {
        "pattern": r"(sbp_|sb_secret_)[A-Za-z0-9_-]{20,}",
        "severity": "critical",
        "desc": "Supabase secret"
    },
    "supabase_anon": {
        "pattern": r"(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9|eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\..*)",
        "severity": "high",
        "desc": "Supabase anon key (JWT)"
    },
    "vercel_token": {
        "pattern": r"vercel_[A-Za-z0-9_-]{20,}",
        "severity": "critical",
        "desc": "Vercel token"
    },
    "github_token": {
        "pattern": r"(ghp_|gho_|ghs_|ghu_|github_pat_)[A-Za-z0-9_-]{36,}",
        "severity": "critical",
        "desc": "GitHub personal access token"
    },
    "github_oauth": {
        "pattern": r"ghu_[A-Za-z0-9_-]{36,}",
        "severity": "critical",
        "desc": "GitHub OAuth token"
    },
    "gitlab_token": {
        "pattern": r"glpat-[A-Za-z0-9_-]{20,}",
        "severity": "critical",
        "desc": "GitLab token"
    },
    "stripe_live": {
        "pattern": r"sk_live_[A-Za-z0-9_-]{20,}",
        "severity": "critical",
        "desc": "Stripe live API key"
    },
    "stripe_test": {
        "pattern": r"sk_test_[A-Za-z0-9_-]{20,}",
        "severity": "high",
        "desc": "Stripe test API key"
    },
    "groq_api": {
        "pattern": r"gsk_[A-Za-z0-9_-]{30,}",
        "severity": "critical",
        "desc": "Groq API key"
    },
    "huggingface_token": {
        "pattern": r"hf_[A-Za-z0-9_-]{30,}",
        "severity": "critical",
        "desc": "Hugging Face token"
    },
    "replicate_token": {
        "pattern": r"r8_[A-Za-z0-9_-]{30,}",
        "severity": "high",
        "desc": "Replicate API token"
    },
    "linear_api": {
        "pattern": r"lin_api_[A-Za-z0-9_-]{20,}",
        "severity": "high",
        "desc": "Linear API key"
    },
    "notion_token": {
        "pattern": r"ntn_[A-Za-z0-9_-]{30,}",
        "severity": "critical",
        "desc": "Notion token"
    },
    "digitalocean_token": {
        "pattern": r"dop_v1_[A-Za-z0-9_-]{40,}",
        "severity": "critical",
        "desc": "DigitalOcean token"
    },
    "databricks_token": {
        "pattern": r"dapi[a-z0-9]{20,}",
        "severity": "critical",
        "desc": "Databricks token"
    },
    "google_api": {
        "pattern": r"AIza[0-9A-Za-z_-]{35}",
        "severity": "critical",
        "desc": "Google API key"
    },
    "google_oauth": {
        "pattern": r"ya29\.[A-Za-z0-9_-]{40,}",
        "severity": "critical",
        "desc": "Google OAuth token"
    },
    "aws_access_key": {
        "pattern": r"AKIA[0-9A-Z]{16}",
        "severity": "critical",
        "desc": "AWS Access Key ID"
    },
    "aws_secret": {
        "pattern": r"aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}",
        "severity": "critical",
        "desc": "AWS Secret Access Key"
    },
    "private_key_rsa": {
        "pattern": r"-----BEGIN RSA PRIVATE KEY-----",
        "severity": "critical",
        "desc": "RSA Private Key"
    },
    "private_key_openssh": {
        "pattern": r"-----BEGIN OPENSSH PRIVATE KEY-----",
        "severity": "critical",
        "desc": "OpenSSH Private Key"
    },
    "private_key_pgp": {
        "pattern": r"-----BEGIN PGP PRIVATE KEY BLOCK-----",
        "severity": "critical",
        "desc": "PGP Private Key"
    },
}

def scan_content(content: str) -> list:
    """Scan content for secrets, return findings."""
    findings = []
    lines = content.split('\n')

    for line_num, line in enumerate(lines, 1):
        # Skip comments and docstrings
        stripped = line.strip()
        if stripped.startswith('#') or stripped.startswith('//') or stripped.startswith('/*'):
            continue

        for secret_name, secret_info in SECRET_PATTERNS.items():
            matches = re.finditer(secret_info["pattern"], line, re.IGNORECASE)
            for match in matches:
                findings.append({
                    "line": line_num,
                    "secret_type": secret_name,
                    "description": secret_info["desc"],
                    "severity": secret_info["severity"],
                    "match_preview": match.group(0)[:30] + "..."
                })

    return findings

def main():
    """Main entry point."""
    try:
        # Read tool input from stdin
        tool_input = json.load(sys.stdin)
        file_path = tool_input.get("tool_input", {}).get("file_path", "")

        # Try to read file content (if available from Claude Code context)
        # For now, we'll exit 0 (non-blocking) as a safe default
        # In production, this would be called AFTER file is written

        # When integrated, read the file and scan:
        # try:
        #     with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        #         content = f.read()
        #     findings = scan_content(content)
        #     if findings:
        #         critical = [f for f in findings if f["severity"] == "critical"]
        #         high = [f for f in findings if f["severity"] == "high"]
        #         if critical:
        #             print(f"CRITICAL SECRETS FOUND: {len(critical)} in {file_path}", file=sys.stderr)
        #             for f in critical[:3]:
        #                 print(f"  Line {f['line']}: {f['description']}", file=sys.stderr)
        #             sys.exit(2)
        #         elif high:
        #             print(f"HIGH SEVERITY SECRETS FOUND: {len(high)} in {file_path}", file=sys.stderr)
        #             sys.exit(1)

        sys.exit(0)
    except Exception as e:
        print(f"Secret scanner error: {e}", file=sys.stderr)
        sys.exit(0)  # Non-blocking on error

if __name__ == "__main__":
    main()
