# Deepcode CLI: SAST Integration Reference

## Overview
Deepcode is a Python-based SAST (Static Application Security Testing) tool with AI-backed bug detection across JavaScript, TypeScript, Python, Java, and C++. It provides severity-stratified findings and multi-format output suitable for integration into security auditor workflows.

## Severity Levels

Deepcode classifies findings into three levels:

| Severity | Exit Code | Use Case |
|---|---|---|
| `info` | 0 (pass) | Informational findings, code quality suggestions |
| `warning` | 1 (issues) | Medium-risk issues requiring review |
| `critical` | 1 (issues) | High-risk security vulnerabilities requiring remediation |

**Exit Code Behavior:**
- **0**: No issues found
- **1**: Issues found (warning or critical severity)
- **2**: User interrupt (e.g., Ctrl+C during analysis)
- **3**: Execution error (e.g., invalid config, missing dependencies)

**Filtering**: Use the `--severity` flag to set a minimum severity level:
```bash
deepcode analyze --severity warning    # Skip info-level findings
deepcode analyze --severity critical   # Report critical only
```

## Language Coverage

| Language | Format | Support |
|---|---|---|
| JavaScript | .js | Full |
| TypeScript | .ts, .tsx | Full |
| Python | .py | Full |
| Java | .java | Full |
| C++ | .cpp, .h | Full |

## Output Formats

### JSON (Default)
REST API schema-compliant JSON output. Suitable for programmatic consumption and CI/CD integration:

```bash
deepcode analyze --output json > findings.json
```

**Schema fields:**
```json
{
  "issues": [
    {
      "id": "...",
      "title": "...",
      "severity": "critical|warning|info",
      "cwe": "CWE-XXX",
      "file": "path/to/file.py",
      "line": 42,
      "message": "...",
      "remediation": "..."
    }
  ]
}
```

### Text Output
Human-readable format for reports and console display:

```bash
deepcode analyze --result-text > findings.txt
```

**Format:**
```
[CRITICAL] CWE-89: SQL Injection
  File: src/database.py:42
  Message: User input concatenated into SQL query
  Remediation: Use parameterized queries
```

## Configuration & Setup

### Environment Variables
```bash
# Required for analysis
export DEEPCODE_API_KEY="your-api-key"

# Optional: configure API endpoint
export DEEPCODE_API_URL="https://api.deepcode.com"

# Optional: set max request timeout
export DEEPCODE_REQUEST_TIMEOUT="30"
```

### Installation
```bash
# Python 3.6+ required
python3 -m pip install deepcode-cli

# Or with Poetry
poetry add deepcode-cli
poetry run deepcode --version
```

### Typical Invocation
```bash
# Analyze current directory with warnings/critical only
deepcode analyze --severity warning

# Analyze specific path with text output
deepcode analyze --path ./src --result-text

# Linter integration (optional)
deepcode analyze --with-linters
```

## Integration into Security Auditor Workflow

1. **Pre-analysis**: Collect codebase snapshot (or git diff for incremental scan)
2. **Run SAST**: Execute `deepcode analyze --output json --severity warning`
3. **Parse output**: Convert JSON to auditor-standard finding format
4. **Severity re-scoring**: Map Deepcode severity to OWASP Top 10 / CVSS as needed
5. **Deduplicate**: Merge findings from other tools (Semgrep, bandit, sonarqube) by CWE
6. **Report**: Present consolidated findings with remediation guidance per CWE

## CWE Mapping Examples

Deepcode findings are tagged with CWE numbers, enabling consistent tracking across tools:

- **CWE-89** (SQL Injection) - `SELECT * FROM users WHERE id = ${id}` (unparameterized query)
- **CWE-79** (XSS) - `${user_input}` rendered in HTML without escaping
- **CWE-78** (OS Command Injection) - `os.system(f"ls {user_path}")` (shell expansion)
- **CWE-798** (Hardcoded Secrets) - API keys in source code or config files
- **CWE-327** (Weak Crypto) - MD5, SHA1, DES usage

## Linter Integration

When `--with-linters` is enabled, Deepcode also runs language-specific linters:

- **Python**: pylint, flake8
- **JavaScript/TypeScript**: ESLint
- **Java**: CheckStyle

Linter findings are reported separately from SAST findings, allowing you to distinguish between security issues (Deepcode) and style/quality issues (linters).

## Limitations

- **Language restrictions**: Does not support Go, Rust, Ruby, PHP natively
- **Framework coverage**: Best accuracy on common frameworks (Django, Express, Spring); less reliable on custom/niche frameworks
- **False positives**: Approximates 8-12% false positive rate depending on language and codebase complexity
- **Context blindness**: Cannot infer business logic (e.g., why a query is intentionally dynamic); requires manual review for edge cases

## References

- **Source**: `D:\prompts\data\_new-2026-07\deepcode-cli\README.md` lines 75-98
- **CLI Documentation**: Poetry run `deepcode --help`
