# Supply Chain Verification & SBOM Validation

**Source:** Anthropic Cybersecurity Skills (new-N4), SPDX/CycloneDX standards  
**Date:** 2026-07-03  
**Scope:** Software Bill of Materials (SBOM), SLSA framework, Sigstore/cosign signing, binary provenance

---

## SBOM Parsing & Validation

### Supported Formats
- **CycloneDX** (XML, JSON) — OWASP standard, component-centric
- **SPDX** (JSON, RDF/XML) — Linux Foundation standard, relationship-rich

### CycloneDX Parsing (JSON Example)
```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "serialNumber": "urn:uuid:abc123...",
  "version": 1,
  "components": [
    {
      "type": "library",
      "name": "lodash",
      "version": "4.17.21",
      "purl": "pkg:npm/lodash@4.17.21",
      "hashes": [{
        "alg": "SHA-1",
        "content": "abc123..."
      }],
      "licenses": [{
        "license": { "id": "MIT" }
      }],
      "vulnerabilities": [{
        "ref": "CVE-2021-23337",
        "ratings": [{
          "severity": "HIGH",
          "score": 7.8
        }]
      }]
    }
  ]
}
```

### SPDX Parsing (JSON Example)
```json
{
  "spdxVersion": "SPDX-2.3",
  "dataLicense": "CC0-1.0",
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "Application",
  "packages": [
    {
      "SPDXID": "SPDXRef-lodash",
      "name": "lodash",
      "versionInfo": "4.17.21",
      "downloadLocation": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "filesAnalyzed": false,
      "externalRefs": [{
        "referenceCategory": "PACKAGE-MANAGER",
        "referenceType": "purl",
        "referenceLocator": "pkg:npm/lodash@4.17.21"
      }]
    }
  ]
}
```

### Validation Checklist

- [ ] **Format valid:** JSON/XML schema compliance
- [ ] **Serial number present:** Unique identifier for traceability
- [ ] **All dependencies listed:** Compare `npm list` vs SBOM component count
- [ ] **Versions pinned:** No floating/wildcard versions
- [ ] **Hash verification:** Each component has SHA-1/SHA-256 hash
- [ ] **License compliance:** All licenses reviewed (permissive vs copyleft)
- [ ] **Known vulnerabilities:** Cross-check with NVD/CVE database
- [ ] **Build reproducibility:** Same SBOM generated on re-build? (Yes = supply chain integrity)

---

## SLSA Framework (Supply-chain Levels for Software Artifacts)

**4-level graduated framework for build integrity:**

### Level 1: Provenance (Minimal)
- **Build system generates provenance metadata** (what was built, when, by whom)
- **Metadata:** builder identity, build inputs/outputs, timestamps
- **Verification:** consumer can retrieve and inspect provenance
- **Example tool:** GitHub Actions with github.run_id in SBOM

### Level 2: Build Integrity (Monitored)
- **Level 1 + source/build platform hardening**
- **Platform enforces:** build script must be in version control, no external secrets, build container is ephemeral
- **Verification:** cryptographic proof of platform compliance
- **Example tool:** GitHub Actions (pre-SLSA-3; does most controls)

### Level 3: Build Integrity + Availability (Fully Resilient)
- **Level 2 + additional isolation, hermetic builds**
- **Platform enforces:** builds are fully offline (no network except artifact fetches), no shared state between builds, build environment is read-only
- **Verification:** platform proof + audit logs
- **Example tool:** Google Cloud Build, Hermetic build systems (Bazel + hermeticity)

### Level 4: Hermetic + Auditable (Advanced)
- **Level 3 + complete build environment isolation + cryptographic attestations**
- **Platform enforces:** Nix/Bazel-style full reproducibility, all dependencies pinned, build outputs bit-identical across runs
- **Verification:** reproducible build + full audit trail
- **Example tool:** Nix, Bazel with hermetic mode

### Mapping to GlyphPDF / Product Context

For a C++ Qt 6 application:
- **Current (GlyphPDF v1.2.1):** Level 2 (GitHub Actions CI, pinned dependencies via vcpkg, MSI signed but no reproducible builds yet)
- **Target (v1.3+):** Level 3 (isolated build environment, no network except artifact fetch, audit logging)
- **Future:** Level 4 (Bazel hermetic builds, reproducible MSI/ZIP)

---

## Sigstore & cosign: Code Signing & Verification

### cosign Installation & Setup
```bash
# Install cosign
curl -sSL https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 -o /usr/local/bin/cosign
chmod +x /usr/local/bin/cosign

# Generate key pair (ECDSA P-256)
cosign generate-key-pair

# Produces:
# - cosign.key (private key, store in Vault)
# - cosign.pub (public key, publish in SBOM/README)
```

### Signing an Artifact
```bash
# Sign a file (creates .sig detached signature)
cosign sign-blob --key cosign.key glyph-pdf-v1.2.1.msi > glyph-pdf-v1.2.1.msi.sig

# Sign a container image (OCI format)
cosign sign --key cosign.key us-central1-docker.pkg.dev/project/glyph-pdf:v1.2.1

# Outputs cosign signatures as OCI image attestations
```

### Verification by Consumer
```bash
# Verify file signature
cosign verify-blob \
  --key cosign.pub \
  --signature glyph-pdf-v1.2.1.msi.sig \
  glyph-pdf-v1.2.1.msi

# Output: Verified OK or error

# Verify container image
cosign verify \
  --key cosign.pub \
  us-central1-docker.pkg.dev/project/glyph-pdf:v1.2.1
```

### Keyless Signing (OIDC Integration)
```bash
# No key file; use OIDC identity (GitHub Actions, Google Cloud IAM)
# In CI/CD (e.g., GitHub Actions):
- name: Sign with cosign
  uses: sigstore/cosign-installer@v3
  with:
    cosign-release: 'v2.2.0'

- name: Sign artifact
  env:
    COSIGN_EXPERIMENTAL: 1  # Enable keyless signing
  run: |
    cosign sign-blob \
      --oidc-issuer https://token.actions.githubusercontent.com \
      --oidc-client-id ${{ secrets.OIDC_CLIENT_ID }} \
      glyph-pdf-v1.2.1.msi

# Produces: Rekor entry (public ledger) with OIDC attestation
```

---

## SBOM Supply Chain Verification Checklist

When auditing software supply chain for guarantee-verification:

### Pre-Build Phase
- [ ] **Dependency pinning:** All direct + transitive dependencies have exact versions (no `*`, `^`, `~`)
- [ ] **Lock files present:** package-lock.json / yarn.lock / Cargo.lock committed
- [ ] **Dependency sources trusted:** npm/PyPI/Maven Central only (no arbitrary git repos)
- [ ] **License audit:** No GPL/AGPL in non-GPL products (permissive: MIT, Apache 2.0, BSD)

### Build Phase
- [ ] **SBOM generated:** CycloneDX or SPDX produced during CI/CD
- [ ] **SBOM includes hashes:** Each component has SHA-256
- [ ] **Build artifact signed:** cosign signature over binary/MSI
- [ ] **Build log retained:** GitHub Actions logs available for audit (configure retention)

### Release Phase
- [ ] **SBOM published:** Included in release notes or as separate file
- [ ] **Hash published:** SHA-256 of binary published alongside binary
- [ ] **Signature published:** cosign .sig file or public key available
- [ ] **Provenance attestation:** SLSA-level metadata published (builder identity, inputs, outputs)

### Consumer Verification
- [ ] **Hash validation:** Consumer computes SHA-256, compares to published hash
- [ ] **Signature verification:** Consumer runs `cosign verify-blob --key <public-key> <artifact>`
- [ ] **SBOM inspection:** Consumer scans SBOM for known CVEs (using OWASP Dependency-Check, Snyk, etc.)
- [ ] **License compliance:** Consumer confirms licenses align with their policy

---

## Vulnerability Scanning (SBOM-based)

### Tools for SBOM Analysis
| Tool | Format | Output | Use Case |
|------|--------|--------|----------|
| OWASP Dependency-Check | CycloneDX, SPDX | HTML, JSON, XML reports | Free, comprehensive CVE coverage |
| Snyk | CycloneDX, SPDX | JSON, HTML, SARIF | CI/CD integration, remediation guidance |
| Trivy | CycloneDX, SPDX | JSON, SARIF, table | Fast, minimal dependencies |
| Grype | CycloneDX, SPDX | JSON, table | Sylos vulnerability DB |

### Example: OWASP Dependency-Check
```bash
# Install Dependency-Check
curl -sSL https://github.com/jeremylong/DependencyCheck_v.../download/dependency-check.sh | bash

# Scan directory for CVEs
dependency-check.sh --scan ./src --out sbom.xml --format JSON

# Output: CVE entries with CVSS scores
# High severity → blocks release or triggers incident response
```

### Example: Scanning CycloneDX SBOM
```bash
# Using Snyk (requires API token)
snyk test --sbom sbom.json --severity-threshold=high

# Output: Vulnerabilities with remediation guidance
# Exit code: 0 (pass) or 1 (fail with high/critical CVEs)
```

---

## Continuous Supply Chain Monitoring

### Post-Release Vulnerability Patches
- [ ] **Subscribe to CVE feeds:** NVD, OSV, Snyk advisories
- [ ] **Monitor SBOM dependencies:** If CVE found in deployed dependency, trigger:
  - [ ] Update dependency version
  - [ ] Re-build and re-sign artifact
  - [ ] Issue patch release
  - [ ] Notify customers of available update
- [ ] **Time-to-patch SLA:** e.g., critical CVEs within 48 hours

### Reproducibility Validation
- [ ] **Rebuild from source:** Same commit, same build environment → same hash?
- [ ] **If hashes don't match:** Investigate non-determinism
  - [ ] Timestamps in binary? (Locale-specific dates, build time)
  - [ ] Floating dependencies? (Transitive dep version changed)
  - [ ] Non-hermetic build environment? (System libraries vary)

---

## GlyphPDF Specific: v1.2.1 → v1.3 Roadmap

### Current State (v1.2.1)
- **SBOM:** Generated via CMake (partial; vcpkg dependencies listed)
- **Signing:** MSI signed with EV certificate (when available)
- **SLSA Level:** 2 (GitHub Actions, CI logs retained)
- **Reproducibility:** Not yet (floating PaddleOCR version in CI)

### Phase 1 (v1.3.0)
- [ ] **Full CycloneDX SBOM:** All transitive deps (vcpkg + PDFium + PaddleOCR) with exact versions
- [ ] **Hash publication:** SHA-256 for MSI, ZIP, AppX on release page
- [ ] **Cosign signing:** Keyless cosign in GitHub Actions (OIDC integration)
- [ ] **SLSA Level 3:** Hermetic build container, no network (except artifact download), audit logs

### Phase 2 (v1.3.5)
- [ ] **Reproducible builds:** Same source commit → same binary hash (Bazel migration candidate)
- [ ] **Dependency pinning:** vcpkg freeze exact package versions (add lockfile to repo)
- [ ] **Continuous monitoring:** Subscribe to PaddleOCR, PDFium CVE feeds; auto-patch on critical findings
- [ ] **SLSA Level 4:** Full hermetic + reproducibility

---

## References

- SBOM standards: SPDX (spdx.dev), CycloneDX (cyclonedx.org)
- SLSA framework: slsa.dev (Supply-chain Levels for Software Artifacts)
- cosign: sigstore.dev/cosign
- OWASP Dependency-Check: owasp.org/www-project-dependency-check
- NVD (National Vulnerability Database): nvd.nist.gov
