const fs = require('fs');
const path = require('path');

const agentDir = path.join(__dirname, '..');
const agents = fs.readdirSync(agentDir).filter(f => f.endsWith('.md') && fs.statSync(path.join(agentDir, f)).isFile());

let ok = 0, broken = 0, brokenList = [];

for (const a of agents) {
  const lines = fs.readFileSync(path.join(agentDir, a), 'utf-8').split('\n');
  for (const line of lines) {
    if (!line.includes('agents\\ref\\')) continue;
    const start = line.indexOf('C:\\Users');
    if (start === -1) continue;
    let end = line.length;
    for (let i = start + 20; i < line.length; i++) {
      if (' `|"\n)'.includes(line[i])) { end = i; break; }
    }
    const raw = line.substring(start, end);
    const fwd = raw.replace(/\\/g, '/');
    if (fwd.includes('*')) { ok++; continue; }
    if (fs.existsSync(fwd)) {
      ok++;
    } else {
      broken++;
      brokenList.push(a + ' -> ' + raw);
    }
  }
}

console.log('Paths checked: ' + (ok + broken));
console.log('OK: ' + ok);
console.log('Broken: ' + broken);
brokenList.forEach(b => console.log('  ' + b));
