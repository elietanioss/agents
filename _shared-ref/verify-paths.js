const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..');

// Find all <agent-name>/<agent-name>.md files
const entries = fs.readdirSync(AGENTS_DIR, { withFileTypes: true });
const agentFiles = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_')) continue; // skip _shared-ref, _temp, etc.
  const agentMd = path.join(AGENTS_DIR, entry.name, entry.name + '.md');
  if (fs.existsSync(agentMd)) {
    agentFiles.push({ name: entry.name, path: agentMd });
  }
}

let totalChecked = 0;
let okCount = 0;
let brokenCount = 0;
let staleCount = 0;
const brokenList = [];
const staleList = [];

const PATH_REGEX = /C:\\Users\\User\\\.claude\\agents\\[^\s`|"'\n)]+/g;
// D:\prompts\data is the authoritative vendored-data location (design decision 2026-07-02):
// agents reference the originals there directly instead of keeping local copies.
// Such a reference is only "stale" if its target does not actually exist on disk.
const DPROMPTS_REGEX = /D:\\prompts\\[^\s`|"'\n)]+/g;

for (const agent of agentFiles) {
  const content = fs.readFileSync(agent.path, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check D:\prompts\data references: valid if the target exists, stale otherwise.
    let dmatch;
    DPROMPTS_REGEX.lastIndex = 0;
    while ((dmatch = DPROMPTS_REGEX.exec(line)) !== null) {
      const dPath = dmatch[0].replace(/[.,;:]+$/, '');
      totalChecked++;
      if (dPath.includes('*') || fs.existsSync(dPath.replace(/\\/g, '/'))) {
        okCount++;
      } else {
        staleCount++;
        staleList.push(`${agent.name}/${agent.name}.md:${lineNum} -> ${dPath}`);
      }
    }

    // Check absolute agent paths
    let match;
    PATH_REGEX.lastIndex = 0;
    while ((match = PATH_REGEX.exec(line)) !== null) {
      // Strip trailing punctuation (period, comma, colon, semicolon) from path
      const refPath = match[0].replace(/[.,;:]+$/, '');
      totalChecked++;

      // Skip paths with wildcards
      if (refPath.includes('*')) {
        okCount++;
        continue;
      }

      // Normalize to forward slashes for fs.existsSync
      const normalized = refPath.replace(/\\/g, '/');
      if (fs.existsSync(normalized)) {
        okCount++;
      } else {
        brokenCount++;
        brokenList.push(`${agent.name}/${agent.name}.md:${lineNum} -> ${refPath}`);
      }
    }
  }
}

// Report
console.log('=== AGENT PATH VERIFICATION REPORT ===');
console.log(`Agent files scanned: ${agentFiles.length}`);
console.log(`Total paths checked: ${totalChecked}`);
console.log(`OK: ${okCount}`);
console.log(`Broken: ${brokenCount}`);
console.log(`Stale (D:\\prompts): ${staleCount}`);
console.log('');

if (brokenCount > 0) {
  console.log('--- BROKEN PATHS ---');
  for (const b of brokenList) {
    console.log('  ' + b);
  }
  console.log('');
}

if (staleCount > 0) {
  console.log('--- STALE D:\\prompts REFERENCES ---');
  for (const s of staleList) {
    console.log('  ' + s);
  }
  console.log('');
}

if (brokenCount === 0 && staleCount === 0) {
  console.log('All paths valid. No stale references found.');
}

process.exit(brokenCount > 0 ? 1 : 0);
