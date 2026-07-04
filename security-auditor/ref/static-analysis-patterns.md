---
ref-name: static-analysis-patterns
description: SAST tools, Semgrep rules, and grep patterns for TypeScript/JavaScript security code review. Read before starting any audit.
---

# Static Analysis Patterns

## TOOL PRIORITY
1. Semgrep — taint analysis, cross-function vulns (redirect output to file, never dump to context)
2. grep — fast pattern matching, secrets hunting
3. npm audit — dependency CVE scanning
4. Bearer CLI — PII and data flow detection

## SEMGREP

### Install
```
pip install semgrep --break-system-packages
# OR npx (no install):
npx semgrep scan --config "p/owasp-top-ten" src/
```

### Key Rulesets
```
# Save results to files — never let Semgrep flood the context window
semgrep scan --config "p/owasp-top-ten" --severity ERROR --json --output /tmp/sg-owasp.json src/
semgrep scan --config "p/javascript" --config "p/typescript" --json --output /tmp/sg-js.json src/
semgrep scan --config "p/secrets" --json --output /tmp/sg-secrets.json .
semgrep scan --config "p/jwt" --json --output /tmp/sg-jwt.json src/
semgrep scan --config "p/supply-chain" --json --output /tmp/sg-supply.json .

# Parse results — extract only ERROR/WARNING
python3 -c "
import json,sys
with open('/tmp/sg-owasp.json') as f: d=json.load(f)
for r in d.get('results',[]):
    s=r['extra']['severity']
    if s in ['ERROR','WARNING']:
        print(s,'|',r['check_id'],'|',r['path']+':'+str(r['start']['line']))
        print('  ',r['extra']['message'][:100])
"
```

### Custom YAML Rules (save as custom-rules.yaml)
```yaml
rules:
  - id: sqli-template-literal
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
      - pattern: req.params.$X
    pattern-sinks:
      - pattern: db.$M(`...${...}...`)
      - pattern: $DB.query(`...${...}...`)
      - pattern: $DB.execute(`...${...}...`)
    message: "SQL injection via template literal with user input"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-89, owasp: "A05:2025"}

  - id: dom-xss
    mode: taint
    pattern-sources:
      - pattern: window.location
      - pattern: location.hash
      - pattern: location.search
      - pattern: document.URL
    pattern-sinks:
      - pattern: $X.innerHTML = ...
      - pattern: document.write(...)
      - pattern: eval(...)
    message: "DOM XSS: location data flows to dangerous sink"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-79}

  - id: jwt-hardcoded-secret
    patterns:
      - pattern-either:
          - pattern: jwt.sign($P, "$S", ...)
          - pattern: jwt.verify($T, "$S", ...)
      - pattern-not:
          - pattern: jwt.sign($P, process.env.$V, ...)
          - pattern: jwt.verify($T, process.env.$V, ...)
    message: "Hardcoded JWT secret — use process.env.JWT_SECRET"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-798}

  - id: jwt-no-algorithms
    pattern: jwt.verify($T, $S)
    pattern-not: jwt.verify($T, $S, {algorithms: [...]})
    message: "jwt.verify() without algorithms — algorithm confusion attack possible"
    languages: [javascript, typescript]
    severity: WARNING
    metadata: {cwe: CWE-327}

  - id: command-injection-shell
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
    pattern-sinks:
      - pattern: exec($C, {shell: true})
      - pattern: spawn($C, $A, {shell: true})
      - pattern: execSync($C, {shell: true})
    message: "Command injection: user input with shell:true"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-78}

  - id: ssrf-fetch
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
      - pattern: req.params.$X
    pattern-sinks:
      - pattern: fetch($URL)
      - pattern: axios.get($URL)
      - pattern: axios.post($URL)
      - pattern: got($URL)
    message: "SSRF: user-controlled URL in server-side HTTP request"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-918}

  - id: path-traversal
    mode: taint
    pattern-sources:
      - pattern: req.params.$X
      - pattern: req.query.$X
      - pattern: req.body.$X
    pattern-sinks:
      - pattern: fs.readFile($P, ...)
      - pattern: fs.readFileSync($P, ...)
      - pattern: path.join($B, $USER_INPUT)
    message: "Path traversal: user input in filesystem path"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-22}

  - id: mass-assignment
    patterns:
      - pattern-either:
          - pattern: $DB.$T.create({...req.body})
          - pattern: $DB.$T.create({data: {...req.body}})
          - pattern: $DB.$T.update({data: {...req.body}})
          - pattern: new $M({...req.body})
    message: "Mass assignment: req.body spread into DB operation"
    languages: [javascript, typescript]
    severity: WARNING
    metadata: {cwe: CWE-915}

  - id: prototype-pollution
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
    pattern-sinks:
      - pattern: $OBJ[$KEY] = $VAL
    message: "Prototype pollution: user input as object key"
    languages: [javascript, typescript]
    severity: WARNING
    metadata: {cwe: CWE-1321}

  - id: redos
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
    pattern-sinks:
      - pattern: new RegExp($X)
    message: "ReDoS: user-controlled RegExp"
    languages: [javascript, typescript]
    severity: WARNING
    metadata: {cwe: CWE-400}

  - id: rce-eval
    mode: taint
    pattern-sources:
      - pattern: req.body.$X
      - pattern: req.query.$X
    pattern-sinks:
      - pattern: eval($X)
      - pattern: new Function($X)
      - pattern: vm.runInNewContext($X)
      - pattern: vm.runInThisContext($X)
    message: "RCE: user input in code execution"
    languages: [javascript, typescript]
    severity: ERROR
    metadata: {cwe: CWE-94}

  - id: supabase-service-role-client
    patterns:
      - pattern-either:
          - pattern: createBrowserClient($U, process.env.SUPABASE_SERVICE_ROLE_KEY)
          - pattern: createClient($U, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
    message: "Supabase service role key in browser client — bypasses ALL RLS"
    languages: [javascript, typescript]
    severity: ERROR
```

## GREP PATTERNS

Run from project root. Save to /tmp files. Read summary only.

```bash
# SQL injection
grep -rn --include="*.ts" --include="*.js" \
  -E "(\`SELECT|\`INSERT|\`UPDATE|\`DELETE).{0,100}\$\{" src/ > /tmp/audit-sqli.txt
grep -rn --include="*.ts" --include="*.js" \
  -E '"SELECT.*("+|\+).*WHERE' src/ >> /tmp/audit-sqli.txt

# XSS
grep -rn --include="*.tsx" --include="*.ts" --include="*.js" \
  "dangerouslySetInnerHTML\|\.innerHTML\s*=\|document\.write\(" src/ > /tmp/audit-xss.txt

# Command injection
grep -rn --include="*.ts" --include="*.js" \
  -E "\b(exec|execSync|spawn|spawnSync)\s*\(|shell:\s*true" src/ > /tmp/audit-cmdi.txt

# eval/RCE
grep -rn --include="*.ts" --include="*.js" \
  -E "\beval\s*\(|new\s+Function\s*\(|vm\.(run|compile)" src/ > /tmp/audit-eval.txt

# Path traversal
grep -rn --include="*.ts" --include="*.js" \
  -E "fs\.(readFile|writeFile|unlink|readdir)\s*\([^,)]*\b(req\.|params\.|query\.|body\.)" \
  src/ > /tmp/audit-path.txt

# SSRF
grep -rn --include="*.ts" --include="*.js" \
  -E "(fetch|axios\.(get|post)|got)\s*\([^)]*\b(req\.|params\.|query\.|body\.)" \
  src/ > /tmp/audit-ssrf.txt

# Mass assignment
grep -rn --include="*.ts" --include="*.js" \
  -E "\.\.(req\.body|req\.params|req\.query)" src/ > /tmp/audit-mass.txt

# Prototype pollution
grep -rn --include="*.ts" --include="*.js" \
  -E "__proto__|Object\.assign\s*\([^)]*req\.|merge\s*\([^)]*req\." src/ > /tmp/audit-proto.txt

# Auth — unprotected routes
grep -rn --include="*.ts" --include="*.js" \
  -E "(router|app)\.(get|post|put|patch|delete)\s*\(" src/ \
  | grep -v "auth\|protect\|guard\|middleware\|require" > /tmp/audit-routes.txt

# JWT
grep -rn --include="*.ts" --include="*.js" \
  -E "jwt\.verify\s*\([^)]+\)" src/ | grep -v "algorithms" > /tmp/audit-jwt-noalg.txt
grep -rn --include="*.ts" --include="*.js" \
  "jwt\.decode\b" src/ > /tmp/audit-jwt-decode.txt
grep -rn --include="*.tsx" --include="*.ts" --include="*.js" \
  -E "localStorage\.(setItem|getItem)\s*\(['\"][^'\"]*[Tt]oken" src/ > /tmp/audit-localstorage.txt

# Secrets
grep -rn --include="*.ts" --include="*.js" \
  -E "(password|secret|api_key|apikey|jwt_secret)\s*[:=]\s*['\"][^'\"]{8,}" \
  src/ > /tmp/audit-hardcoded.txt

# Supply chain — dangerous npm scripts
python3 -c "
import json
d=json.load(open('package.json'))
for s in ['postinstall','preinstall','prepare']:
    if s in d.get('scripts',{}): print('RISKY SCRIPT',s,':',d['scripts'][s])
" 2>/dev/null > /tmp/audit-supply.txt
npm audit --json 2>/dev/null | python3 -c "
import json,sys
d=json.load(sys.stdin)
for n,v in d.get('vulnerabilities',{}).items():
    if v.get('severity') in ['critical','high']: print(v['severity'].upper(),n)
" >> /tmp/audit-supply.txt

# Git history secrets
git log --all -p 2>/dev/null \
  | grep -E "AKIA[0-9A-Z]{16}|sk_live_|ghp_|password\s*=\s*['\"][^'\"]{8}" \
  | head -20 > /tmp/audit-git-secrets.txt

echo "Audit grep complete. Check /tmp/audit-*.txt"
```

## BEARER CLI (PII detection)
```bash
npm install -g @bearer/bearer
bearer scan src/ --format json --output /tmp/bearer.json 2>/dev/null
python3 -c "
import json
for f in json.load(open('/tmp/bearer.json')).get('findings',[]):
    if f.get('severity') in ['critical','high']:
        print(f['severity'].upper(),'|',f.get('check_id'),'|',f.get('filename'))
"
```
