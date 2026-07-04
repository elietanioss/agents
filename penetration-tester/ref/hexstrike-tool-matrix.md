# HexStrike-AI Tool Matrix & Agent Taxonomy
**Source**: HexStrike-AI v6.0 (42 files, 150+ tools, 12+ agents)
**Generated**: 2026-07-02
**Authority**: Live MCP server with real-time intelligent decision engine

---

## 150+ Penetration Testing Tool Catalog

Comprehensive taxonomy across 8 major categories, integrated with HexStrike intelligent parameter routing and agent dispatch logic.

### Network Reconnaissance (11+ tools)
Passive and active network scanning, enumeration, asset discovery.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `nmap` | Port Scan | Full SYN scan with service detection | `-sV -sC -O -p- --min-rate 5000` | Service versions, OS guess | `nmap-full.txt` |
| `rustscan` | Port Scan | Fast async port scanner | `-a TARGET -b 5000` | Open ports | `rustscan-quick.txt` |
| `masscan` | Port Scan | Extreme-speed IP scanner | `--rate 10000 -p0-65535` | Raw socket results | `masscan-sweep.txt` |
| `autorecon` | Framework | Automated reconnaissance orchestrator | `-t TARGET --only-scans` | Multi-tool results | `autorecon/` (dir) |
| `amass` | Domain Enum | Passive subdomain discovery | `enum -d TARGET -o subdomains.txt` | FQDNs, DNS records | `amass-subdomains.txt` |
| `subfinder` | Domain Enum | Multi-source subdomain finder | `-d TARGET -silent -o subs.txt` | Subdomains | `subfinder-subs.txt` |
| `fierce` | DNS Enum | DNS zone transfer + brute-force | `-dns TARGET` | NS records, A records | `fierce-dns.txt` |
| `dnsenum` | DNS Enum | Full DNS enumeration | `-d TARGET` | All DNS records | `dnsenum-all.txt` |
| `theharvester` | OSINT | Email + domain harvesting | `-d TARGET -l 500` | Emails, subdomains | `harvester-emails.txt` |
| `netexec` | Post-Exploit | Network credential bruteforce | `-u USER -p PASS -M smb_check` | Access results | `netexec-smb.txt` |
| `enum4linux` | ENUM | SMB share and user enumeration | `-a TARGET` | Shares, users, groups | `enum4linux-smb.txt` |

### Web Application Security (14+ tools)
Directory discovery, vulnerability scanning, protocol analysis, XSS/SQLi/SSTI testing.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `gobuster` | Content Disc | Fast directory/DNS brute-forcer | `dir -u http://TARGET -w wordlist.txt` | Directories (200/301/etc) | `gobuster-dirs.txt` |
| `feroxbuster` | Content Disc | Recursive content discovery | `-u http://TARGET -w wordlist.txt -d 2` | Full tree | `feroxbuster-tree.txt` |
| `ffuf` | Content Disc | Fast fuzzer (FUZZ keyword) | `-w wordlist.txt -u http://TARGET/FUZZ` | Sorted by status | `ffuf-results.txt` |
| `dirb` | Content Disc | Simple directory scanner | `http://TARGET -w wordlist.txt` | Found directories | `dirb-dirs.txt` |
| `httpx` | Protocol Probe | HTTP service probing + screening | `-l targets.txt -title -status` | HTTP status, titles | `httpx-probe.txt` |
| `katana` | Crawler | Fast web crawler + parser | `-u http://TARGET -d 2` | URLs, parameters | `katana-urls.txt` |
| `nuclei` | Vuln Scan | Massive template library (4000+) | `-u http://TARGET -t ./nuclei-templates/http/` | CRITICAL/HIGH findings | `nuclei-findings.txt` |
| `nikto` | Vuln Scan | CGI/plugin scanner | `-h http://TARGET -p 80,443` | Plugin issues, headers | `nikto-scan.txt` |
| `dalfox` | XSS Testing | XSS-specific scanner + PoC | `-u http://TARGET -b http://BURP` | XSS vectors | `dalfox-xss.txt` |
| `sqlmap` | SQLi Testing | Automated SQL injection | `-u "http://TARGET?id=1" -p id` | Injectable params | `sqlmap-results.txt` |
| `wpscan` | CMS Scan | WordPress-specific scanner | `--url http://TARGET -e ap,at,u` | Plugins, themes, users | `wpscan-wp.txt` |
| `arjun` | Param Disc | Parameter discovery (forms/URLs) | `-u http://TARGET` | Hidden parameters | `arjun-params.txt` |
| `paramspider` | Param Disc | Parameter mining from web archives | `-d TARGET` | Common parameters | `paramspider-params.txt` |
| `x8` | Hidden Params | Hidden parameter fingerprinting | `-u http://TARGET` | Cache-based params | `x8-params.txt` |

### Advanced Web Testing (8+ tools)
SSL/TLS analysis, custom signature testing, JWT/GraphQL, command injection, template SSTI.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `testssl` | SSL/TLS | Comprehensive TLS assessment | `--full http://TARGET` | Cipher suites, cert chain | `testssl-full.txt` |
| `sslscan` | SSL/TLS | Quick SSL/TLS scan | TARGET:443 | Certificate, ciphers | `sslscan-certs.txt` |
| `sslyze` | SSL/TLS | Advanced TLS/STARTTLS testing | --regular TARGET:443 | Full protocol support | `sslyze-tls.txt` |
| `whatweb` | Fingerprint | Website technology fingerprinter | http://TARGET -a 3 | CMS, server, frameworks | `whatweb-tech.txt` |
| `jaeles` | Custom Sigs | Custom vulnerability signatures | scan -s profile.yaml -u http://TARGET | Signature matches | `jaeles-custom.txt` |
| `commix` | CmdInjection | Command injection testing | -u "http://TARGET?cmd=id" | Injection vectors | `commix-cmd.txt` |
| `nosqlmap` | NoSQL Inject | NoSQL injection tester | -u "http://TARGET?user=*" | Injection techniques | `nosqlmap-nosql.txt` |
| `tplmap` | SSTI Testing | Template injection detection | -u "http://TARGET?t={{7*7}}" | Template engines | `tplmap-ssti.txt` |
| `jwt-tool` | JWT Analysis | JWT token cryptanalysis + fuzzing | -t "TOKEN" -b | Algorithm flaws | `jwt-tool-analysis.txt` |
| `graphql-voyager` | GraphQL | GraphQL schema introspection | -u http://TARGET/graphql | Full schema | `graphql-schema.json` |

### Password Attacks (6+ tools)
Credential brute-force, hash cracking, spray attacks.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `hydra` | Brute-Force | Fast credential sprayer (multi-protocol) | -L users.txt -P pass.txt http-post-form://TARGET | Cracked credentials | `hydra-creds.txt` |
| `john` | Hash Crack | Multi-format offline password cracker | --wordlist=wordlist.txt hashes.txt | Cracked hashes | `john-cracked.txt` |
| `hashcat` | GPU Crack | GPU-accelerated hash cracking | -m 1000 -a 0 hashes.txt wordlist.txt | Plaintext passwords | `hashcat-cracked.txt` |
| `medusa` | Brute-Force | Protocol-agnostic credential tester | -h TARGET -u admin -P wordlist.txt -M ssh | Service-specific results | `medusa-ssh.txt` |
| `patator` | Brute-Force | Flexible modular brute-forcer | http_fuzz url=http://TARGET user=FILE0 -x ignore:code=404 | All protocol attempts | `patator-results.txt` |
| `crackmapexec` | Spray | SMB/LDAP/WinRM credential spray | smb -u admin -p PASSWORD TARGET | Domain access attempts | `crackmapexec-smb.txt` |

### Binary & Reverse Engineering (11+ tools)
Executable analysis, debugging, exploit primitive discovery, memory forensics.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `gdb` | Debugger | GNU Debugger (Linux ELF) | gdb ./binary | Interactive session | Session log |
| `radare2` | Reverse Eng | Interactive binary analysis framework | r2 ./binary | Code/data sections | `r2-analysis.txt` |
| `binwalk` | File Extraction | Firmware extraction + entropy analysis | -e firmware.bin | Extracted files | `binwalk-extract/` |
| `ghidra` | Reverse Eng | NSA reverse engineering tool (GUI/CLI) | analyzeHeadless . PROJECT -process binary | Decompilation output | `ghidra-decompile.c` |
| `checksec` | Security | Binary hardening assessment | ./binary | ASLR/NX/Canary/RelRO status | `checksec-report.txt` |
| `strings` | Info Leak | Extract printable strings | -a ./binary | Hardcoded strings | `strings-leak.txt` |
| `objdump` | Disasm | Disassemble object files | -d ./binary | Assembly code | `objdump-asm.txt` |
| `volatility` | Forensics | Memory dump analysis (Windows) | -f dump.mem imageinfo | Process list, modules | `volatility-mem.txt` |
| `pwntools` | Exploit Dev | Python exploit development library | (used in custom scripts) | Custom exploit code | Varies |
| `angr` | Symbolic Exec | Symbolic execution + program analysis | (used in custom scripts) | Path constraints, solutions | Varies |
| `ropper` | ROP Gadgets | ROP gadget finder + builder | --file ./binary --search "pop rdi" | Gadget addresses | `ropper-gadgets.txt` |

### Cloud Security (6+ tools)
AWS/Azure/GCP security configuration auditing, container scanning.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `prowler` | AWS Audit | AWS security best-practice scanner | -g cis_aws -r us-east-1 | CIS benchmark results | `prowler-cis.txt` |
| `scout-suite` | Multi-Cloud | Azure/AWS/GCP security auditor | --azure --tenant-id TENANT | Risk assessment report | `scoutsuite-results.html` |
| `trivy` | Container | Vulnerability scanner for images/repos | image --severity CRITICAL IMAGE | CVE list | `trivy-vulns.txt` |
| `kube-hunter` | Kubernetes | K8s penetration testing | --pod | Network issues, RBAC gaps | `kube-hunter-report.txt` |
| `kube-bench` | Kubernetes | CIS K8s Benchmark checker | run --targets master,node | Compliance failures | `kube-bench-cis.txt` |
| `docker-bench-security` | Docker | CIS Docker Benchmark | | Container config issues | `docker-bench-cis.txt` |

### CTF & Forensics (7+ tools)
Forensic artifact parsing, steganography, hash cracking, cipher tools.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `volatility3` | Forensics | Modern memory forensics framework | -f dump.mem windows.pslist | Process timeline | `volatility3-procs.txt` |
| `foremost` | Carving | File carving from disk/image | -i drive.img -o extracted/ | Recovered files | `foremost-carved/` |
| `steghide` | Steganography | Embed/extract hidden data in images | extract -sf image.jpg | Hidden file content | Varies |
| `exiftool` | Metadata | Extract/edit image/video metadata | image.jpg | EXIF, GPS, camera info | `exiftool-meta.txt` |
| `john` | Hash Crack | Multi-format password cracker (see above) | --wordlist=wordlist.txt hashes.txt | Plaintext | `john-ctf-cracked.txt` |
| `hashcat` | GPU Crack | (see above) | -m 1000 -a 0 ctf-hashes.txt | Plaintext | `hashcat-ctf-cracked.txt` |
| `cipher-tools` | Crypto | Caesar, Vigenère, ROT13, XOR | (various) | Decrypted plaintext | Varies |

### OSINT & Bug Bounty (10+ tools)
Passive reconnaissance, asset discovery, source code leaks, bug bounty workflow.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `amass` | Subdomain | (see above) | enum -d TARGET | Subdomains | Varies |
| `subfinder` | Subdomain | (see above) | -d TARGET -silent | Subdomains | Varies |
| `hakrawler` | Web Crawl | hakrawler crawler for URL collection | -url http://TARGET | All discovered URLs | `hakrawler-urls.txt` |
| `httpx` | Probing | (see above) | -l targets.txt -title | Live hosts | Varies |
| `paramspider` | Param Disc | (see above) | -d TARGET | Parameters | Varies |
| `aquatone` | Screenshotting | Web screenshot aggregator | -d TARGET | HTML screenshots report | `aquatone-report.html` |
| `subjack` | Subdomain TakO | CNAME/DNS takeover checker | -w subdomains.txt -t 100 | Vulnerable subdomains | `subjack-takeover.txt` |
| `theHarvester` | Email Harvest | (see above) | -d TARGET | Emails, contacts | Varies |
| `sherlock` | Username Enum | Social media username search | -u USERNAME | Platform matches | `sherlock-accounts.txt` |
| `social-analyzer` | OSINT Profile | Social network enumeration | -u USERNAME -m fast | Profile links | `social-analyzer-profiles.txt` |

### Browser Automation & LLM Testing (1 advanced tool)
Client-side vulnerability testing, DOM analysis, JavaScript execution, AI/LLM endpoint testing.

| Tool | Category | Purpose | Key Flags | Output | Evidence File |
|------|----------|---------|-----------|--------|---|
| `Playwright CLI` | Automation | Headless browser automation, screenshot, network capture | `codegen http://TARGET` | Element locators, XPath, event recording | `playwright-recording.txt` |
| Headless Chrome | Rendering | JavaScript execution, DOM snapshot | `--disable-gpu --dump-dom file://page.html` | Full rendered HTML | `chrome-dom.html` |
| `Selenium` | Automation | WebDriver-based browser testing | (Python/Java bindings) | Element interaction results | Varies |

**TOTAL**: 150+ tools across 8 categories. Each tool has automated parameter routing by HexStrike intelligent decision engine based on target profile, network conditions, and prior findings.

---

## HexStrike-AI 12+ Agent Taxonomy

Breakdown of 12+ specialized agents within HexStrike MCP server, with tool assignments and dispatch logic.

### Core Penetration Testing Agents

| Agent | Specialization | Primary Tools | When Dispatched | Output |
|-------|---|---|---|---|
| **Reconnaissance Agent** | Passive & active recon | nmap, amass, subfinder, whatweb, httpx | Phase 1 before exploitation | targets-inventory.json |
| **Web Vulnerability Agent** | OWASP Top 10 testing | nuclei, dalfox, sqlmap, nikto, arjun | Phase 2 on web apps | web-findings.json |
| **Network Exploitation Agent** | CVE exploitation | metasploit, searchsploit, custom PoCs | Phase 3 after recon complete | exploitation-results.json |
| **Cryptography Agent** | Crypto analysis, hash cracking | hashcat, john, tlsfuzzer | Phase 4 on encrypted traffic | crypto-findings.json |
| **API Security Agent** | REST/GraphQL/gRPC testing | httpx, arjun, jwt-tool, graphql-voyager | Phase 2 sub-phase on APIs | api-findings.json |

### Specialized Red Team Agents

| Agent | Specialization | Primary Tools | When Dispatched | Output |
|-------|---|---|---|---|
| **C2 Infrastructure Agent** | Command-and-control setup | Sliver, Havoc, Empire, Cobalt Strike profiles | Post-exploitation phase | c2-config.yaml |
| **Post-Exploitation Agent** | Privilege escalation, persistence | mimikatz, empire, linpeas, winpeas | After initial access | postexploit-evidence.json |
| **Lateral Movement Agent** | Network pivoting, trust relationships | bloodhound, crackmapexec, impacket | Post-exploitation phase 2 | lateral-movement-paths.json |
| **Evasion Agent** | Defense evasion, obfuscation | Veil, msfvenom, obfuscated payloads | Throughout engagement | evasion-tactics.json |

### Intelligence & Reporting Agents

| Agent | Specialization | Primary Tools | When Dispatched | Output |
|-------|---|---|---|---|
| **Threat Intelligence Agent** | CVE research, OSINT | shodan, censys, MISP, threat feeds | Continuous during engagement | threat-intel.json |
| **Vulnerability Correlator** | Finding deduplication, CVSS scoring | custom correlation engine | End of each phase | deduplicated-findings.json |
| **Report Generator** | CVSS v3.1 + WSTG coverage | report templates, markdown rendering | Final phase | pentest-report.pdf |
| **Flag Detector** | CTF/engagement flag capture** | regex engine (flag{}, FLAG{}, HTB{}, etc) | Throughout exploitation | flags-found.json |

---

## Intelligent Parameter Routing Logic

HexStrike dispatch algorithm selects tools and parameters dynamically based on:

1. **Target Profile** (web app vs infrastructure vs cloud vs OT)
2. **Network Conditions** (latency, rate limits, firewall detection)
3. **Prior Findings** (skip already-tested vectors)
4. **Time Budget** (aggressive vs time-limited scans)
5. **Risk Tolerance** (intrusive vs stealth)

Example: If target is web app + ecommerce category + requires HIPAA compliance:
- Route to Web Vulnerability Agent with `nuclei -tags payment,auth,hipaa`
- Disable aggressive DDOS-like fuzzers (gobuster rate)
- Prioritize findings categorized as HIPAA-relevant (data exposure, crypto weakness)
- Skip post-exploitation (not in scope for compliance audit)

---

## Tool Selection Checklist (Agent Decision Gate)

Before dispatching a tool, the intelligent engine verifies:

- [ ] Tool is approved for the target platform
- [ ] Tool output format is parseable (JSON/CSV/text)
- [ ] Tool output is saved to evidence file immediately
- [ ] No tool output exceeds 50 lines (redirect excess to file)
- [ ] Tool does not violate authorization scope (IP range, timeframe, protocol)
- [ ] Tool findings are logged to findings-index.json before next tool dispatches

---

## Integration with Penetration-Tester Orchestrator

When `penetration-tester.md` dispatches `pentest-web` sub-agent for OBJ-006 (Injection testing):

1. Orchestrator passes context packet: target URL, prior findings, scope, RoE
2. `pentest-web` reads this file to select tool subset (nuclei templates only for this finding type)
3. Sub-agent runs tools in sequence, captures output to `evidence/web/`
4. Sub-agent logs each finding to `findings/findings-{tool}.json`
5. Sub-agent returns `PASSED [N findings, M critical]` with evidence paths
6. Orchestrator updates OPPLAN.md and injects prior findings into next agent task

---

## References
- **HexStrike-AI README**: https://github.com/[hexstrike-repo]/README.md (lines 260–471, tool taxonomy)
- **HexStrike-AI MCP Server**: Real-time intelligent parameter routing via FastMCP
- **Tool Documentation**: Each tool's man page + HexStrike-AI examples in `/mcp/hexstrike_mcp.py`
