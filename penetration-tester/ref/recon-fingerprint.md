# Reconnaissance Target Complexity Fingerprinting

Source: PentestGPT pentestgpt/core/controller.py + HexStrike-AI tool taxonomy

## Pre-Scan Complexity Baseline

Before launching intensive scanning, establish target classification via lightweight baseline commands:

### Single Ping (Network Reachability)
```bash
docker exec kali-pentest bash -c "ping -c 1 TARGET 2>&1 | tail -3"
```
Output patterns:
- Success: `1 packets transmitted, 1 received, 0% packet loss`
- Unreachable: `100% packet loss` → BLOCKED (authorization check required)
- No response: Possible firewall filtering → proceed with TCP/HTTP probing

### HTTP Banner Grab (Web Presence)
```bash
docker exec kali-pentest bash -c "curl -s -I --max-time 5 https://TARGET 2>&1 | head -20"
```
Look for:
- HTTP status (2xx/3xx/4xx/5xx)
- Server header (Apache, Nginx, IIS, Python, etc.)
- X-Powered-By, X-AspNet-Version (tech stack hints)
- Redirect chain (security appliance indicator)

## Target Classification

Based on baseline + scope info, classify target into one of four archetypes (impacts scan depth):

| Classification | Indicators | Scan Strategy |
|---|---|---|
| **Web App** | HTTP 200–404 responses, web framework headers (Django, Rails, Laravel) | Focus: web testing (nuclei, sqlmap, dalfox), API endpoints, form discovery |
| **Infrastructure** | Server headers only (Nginx, Apache), no web app responses, SSH/RDP open | Focus: network services (nmap vuln script, searchsploit), privilege escalation paths |
| **Active Directory** | Kerberos (port 88), LDAP (389), DNS (53), NetBIOS (139) detected | Focus: domain enumeration (BloodHound, enum4linux), Kerberoasting, ADCS |
| **Cloud** | AWS/Azure metadata endpoints, S3 URL patterns, Entra ID endpoints | Focus: cloud IAM (pacu, prowler), storage (bucket enum), secrets scanning |

## DNS Enumeration Workflow

Full DNS sweep before active scanning:

```bash
# Query all record types
docker exec kali-pentest bash -c "dig +short TARGET ANY 2>&1"

# MX records (email infrastructure)
docker exec kali-pentest bash -c "dig +short TARGET MX 2>&1"

# NS records + zone transfer attempt
docker exec kali-pentest bash -c "dig axfr TARGET @$(dig +short NS TARGET 2>&1 | head -1) 2>&1"
```

Save raw output to `evidence/recon/dns-{target}.txt`.

## Subdomain Discovery Strategy

### Passive First (non-intrusive)
```bash
docker exec kali-pentest bash -c "subfinder -d TARGET -silent -o /evidence/recon/subdomains-passive.txt"
```
Uses OSINT data from Certificate Transparency, DNS resolvers, web archives.

### Active DNS Brute (intrusive, requires authorization)
```bash
docker exec kali-pentest bash -c "gobuster dns -d TARGET -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -q -o /evidence/recon/subdomains-active.txt"
```
Wordlist options:
- `subdomains-top1million-5000.txt` — balanced speed/coverage
- `subdomains-top250k.txt` — larger wordlist, slower
- Custom wordlist from prior recon or target-specific keywords

## Port Scanning Paradigm

### Full TCP Scan (all ports)
```bash
docker exec kali-pentest bash -c "nmap -sV -sC -O -p- --min-rate 5000 -oA /evidence/recon/nmap-full TARGET"
```
Flags:
- `-sV` — service version detection
- `-sC` — default scripts (OS fingerprint, banner grab)
- `-O` — OS detection
- `-p-` — all 65535 ports
- `--min-rate 5000` — aggressive speed (tune down if target drops packets)

### Vulnerability Script Scan
```bash
docker exec kali-pentest bash -c "nmap --script vuln -oN /evidence/recon/vuln-scan.txt TARGET"
```
Extract CVE candidates:
```bash
docker exec kali-pentest bash -c "grep -i 'VULNERABLE\|CVE' /evidence/recon/vuln-scan.txt | head -30"
```

### UDP Scan (optional, slower)
```bash
docker exec kali-pentest bash -c "nmap -sU --top-ports 1000 -oN /evidence/recon/nmap-udp.txt TARGET"
```

## Service Enumeration Detail

For each open port, enumerate service-specific details:

| Port | Service | Command | Logs |
|---|---|---|---|
| 22 | SSH | `ssh -v TARGET 2>&1 \| head -20` | ssh-version, key exchange, OS fingerprint |
| 80/443 | HTTP(S) | `curl -Iv https://TARGET 2>&1` | server, versions, redirects |
| 445 | SMB | `smbclient -L //TARGET -U "" 2>&1` | shares, OS, workgroup |
| 389 | LDAP | `ldapsearch -h TARGET -x -s base 2>&1` | domain info, FQDN |
| 3306 | MySQL | `mysql -h TARGET -u root --password="" 2>&1` | version, user enumeration |

Save each enumeration output to `evidence/recon/enum-{service}-{port}-{target}.txt`.

## Technology Fingerprinting

Use WhatWeb for automated tech detection:

```bash
docker exec kali-pentest bash -c "whatweb -a 4 https://TARGET 2>&1 | tee /evidence/recon/whatweb-{target}.txt"
```

Output includes:
- CMS/Framework (WordPress, Joomla, Django)
- JavaScript libraries (jQuery, React, Angular versions)
- Cookies, meta tags, headers
- Interesting parameters (admin paths, API versions)

## Evidence File Naming Conventions

Organize all raw outputs by tool and phase:

```
evidence/recon/
├── ping-{target}.txt              # Basic connectivity
├── http-banner-{target}.txt       # HTTP headers
├── dns-{target}.txt               # Full DNS sweep
├── subdomains-passive-{target}.txt
├── subdomains-active-{target}.txt
├── nmap-full-{target}.txt
├── nmap-udp-{target}.txt
├── vuln-scan-{target}.txt
├── enum-ssh-22-{target}.txt
├── enum-smb-445-{target}.txt
├── enum-ldap-389-{target}.txt
├── whatweb-{target}.txt
└── searchsploit-candidates-{target}.txt
```

## Return Signal Format

After all recon completes, return PASSED or BLOCKED:

```
PASSED [Recon Complete]
- Targets: 3 hosts (1 web app, 2 infrastructure)
- Ports: 24 open (10 web, 8 SSH, 6 SMB)
- CVE candidates: 7 identified (3 high-risk: OpenSSL CVE-2023-XXXX, nginx vuln, WordPress plugin)
- Evidence: /evidence/recon/ (12 files, ~450 KB)
- Duration: 34 minutes
```

or

```
BLOCKED [Authorization constraint]
Reason: Target 10.0.0.5 outside of authorized scope (scope: 10.0.0.0/24 with exceptions 10.0.0.5–10.0.0.10)
Action required: Obtain written authorization update before proceeding
```

## Evidence Preservation

CRITICAL: All raw output is evidence. Never truncate or sanitize before saving:

```bash
# BAD: loses tool output detail
nmap TARGET | head -100 | tee evidence.txt

# GOOD: capture full output, truncate only for human review
nmap TARGET -oN /evidence/recon/nmap-full.txt
head -200 /evidence/recon/nmap-full.txt  # for reading only
```

Uploaded evidence files are read-only after writing (supports chain-of-custody requirements).
