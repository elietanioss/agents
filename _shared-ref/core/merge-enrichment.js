const fs = require('fs');
const path = require('path');

// ── Tech keyword dictionary for tag extraction (same as convert-to-csv.js) ──
const TECH_KEYWORDS = [
  // Languages & Runtimes
  'TypeScript', 'JavaScript', 'Python', 'SQL', 'Node.js', 'Deno', 'Bun', 'HTML', 'CSS', 'GraphQL', 'Bash',
  // Frameworks
  'Next.js', 'React', 'Express', 'Fastify', 'Hono', 'Remix', 'Astro', 'Svelte', 'Vue', 'Angular', 'Nuxt',
  'React Native', 'Flutter', 'Expo', 'Electron',
  // CSS & UI
  'Tailwind', 'shadcn', 'Framer Motion', 'Radix', 'Headless UI', 'Material UI', 'Chakra',
  // Databases & ORM
  'PostgreSQL', 'Supabase', 'Prisma', 'Drizzle', 'MongoDB', 'Redis', 'SQLite', 'MySQL',
  'DynamoDB', 'Firebase', 'Neon', 'PlanetScale',
  // Auth & Security
  'JWT', 'OAuth', 'OWASP', 'XSS', 'CSRF', 'bcrypt', 'RLS', 'CORS', 'Helmet',
  'HIPAA', 'PCI-DSS', 'SOX', 'GDPR', 'AES', 'TLS', 'SSL', 'pgcrypto',
  'NextAuth', 'Auth.js', 'Clerk', 'Supabase Auth',
  // Testing
  'Jest', 'Vitest', 'Playwright', 'Cypress', 'RTL', 'React Testing Library',
  'MSW', 'axe-core', 'Lighthouse', 'k6', 'Artillery',
  // DevOps & Infra
  'Docker', 'Kubernetes', 'Vercel', 'AWS', 'GCP', 'Azure', 'Railway', 'Fly.io',
  'GitHub Actions', 'CI/CD', 'Terraform', 'Nginx', 'PM2', 'Caddy',
  // Logging & Monitoring
  'Winston', 'Pino', 'Sentry', 'Datadog', 'Grafana', 'Prometheus', 'OpenTelemetry',
  // Packages & Tools
  'Zod', 'tRPC', 'Axios', 'SWR', 'React Query', 'TanStack', 'Zustand', 'Jotai',
  'Sharp', 'Multer', 'Stripe', 'Resend', 'Upstash',
  // Concepts
  'rate limiting', 'authentication', 'authorization', 'encryption', 'middleware',
  'API', 'REST', 'GraphQL', 'WebSocket', 'SSR', 'SSG', 'ISR', 'RSC',
  'Server Components', 'Server Actions', 'App Router', 'Pages Router',
  'WCAG', 'accessibility', 'responsive', 'SEO', 'Core Web Vitals',
  'INP', 'LCP', 'CLS', 'FCP', 'TTFB',
  // Image & Media
  'Imagen', 'VEO', 'Vertex AI', 'FFmpeg', 'ImageMagick',
  // Workflow & Automation
  'n8n', 'Zapier', 'webhook', 'cron', 'queue', 'pub/sub',
  // Architecture
  'microservices', 'monolith', 'serverless', 'edge functions',
  'connection pooling', 'query optimization', 'caching',
];

// Build lowercase lookup map
const KEYWORD_MAP = new Map();
for (const kw of TECH_KEYWORDS) {
  const lower = kw.toLowerCase();
  if (!KEYWORD_MAP.has(lower)) {
    KEYWORD_MAP.set(lower, kw);
  }
}

// ── CSV escaping (RFC 4180) ──
function escapeCSV(value) {
  const str = String(value);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

// ── Extract agent name from content ──
function extractAgentName(content) {
  const lines = content.split('\n');
  for (const line of lines.slice(0, 20)) {
    const trimmed = line.trim();
    if (/^# [A-Z]/.test(trimmed)) {
      return trimmed.replace(/^# /, '').trim();
    }
    if (/^# /.test(trimmed)) {
      return trimmed.replace(/^# /, '').trim();
    }
  }
  return 'Unknown';
}

// ── Line-by-line state machine parser ──
function parseMarkdown(content) {
  const lines = content.split('\n');
  const chunks = [];

  let currentSection = 'PREAMBLE';
  let currentSubsection = '';
  let currentContent = [];
  let insideCodeBlock = false;

  function flushChunk() {
    const text = currentContent.join('\n').trim();
    if (text) {
      chunks.push({
        section: currentSection,
        subsection: currentSubsection,
        content: text,
      });
    }
    currentContent = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Track code block state
    if (trimmed.startsWith('```')) {
      insideCodeBlock = !insideCodeBlock;
      currentContent.push(line);
      continue;
    }

    // Only detect headings outside code blocks
    if (!insideCodeBlock) {
      if (/^## /.test(trimmed)) {
        flushChunk();
        currentSection = trimmed.replace(/^## /, '').trim();
        currentSubsection = '';
        continue;
      }
      if (/^### /.test(trimmed)) {
        flushChunk();
        currentSubsection = trimmed.replace(/^### /, '').trim();
        continue;
      }
    }

    currentContent.push(line);
  }

  flushChunk();
  return chunks;
}

// ── Classify chunk type ──
function classifyType(chunk) {
  const { section, subsection, content } = chunk;
  const combined = `${section} ${subsection}`.toLowerCase();

  if (content.includes('```')) return 'code';
  if (/- \[[ x]\]/i.test(content)) return 'checklist';
  if (/config|setup|environment|\.env/i.test(combined)) return 'config';
  if (/pattern/i.test(combined)) return 'pattern';
  if (/(^|\n)\s*(MUST|NEVER|ALWAYS|CRITICAL|REQUIRED)\b/.test(content) ||
      /rule|principle|requirement|guardrail/i.test(combined)) return 'rule';
  if (/framework|methodology|architecture|strategy/i.test(combined)) return 'framework';
  if (/philosophy|identity|mission|core|role/i.test(combined)) return 'philosophy';
  return 'reference';
}

// ── Extract tech tags from content ──
function extractTags(content) {
  const lower = content.toLowerCase();
  const found = new Set();

  for (const [key, original] of KEYWORD_MAP) {
    const idx = lower.indexOf(key);
    if (idx !== -1) {
      const before = idx > 0 ? lower[idx - 1] : ' ';
      const after = idx + key.length < lower.length ? lower[idx + key.length] : ' ';
      const boundaryChars = /[\s\n\r.,;:!?()[\]{}<>'"\/\\`|#@$%^&*+=~\-_]/;
      if ((boundaryChars.test(before) || idx === 0) &&
          (boundaryChars.test(after) || idx + key.length === lower.length)) {
        found.add(original);
      }
    }
  }

  return [...found].sort().join(', ');
}

// ── Strip YAML frontmatter from markdown ──
function stripFrontmatter(content) {
  const trimmed = content.trim();
  if (trimmed.startsWith('---')) {
    const endIdx = trimmed.indexOf('---', 3);
    if (endIdx !== -1) {
      return trimmed.substring(endIdx + 3).trim();
    }
  }
  return content;
}

// ── Main ──
function main() {
  const ANTIGRAVITY_BASE = 'D:\\prompts\\data\\antigravity-kit-main\\antigravity-kit-main\\.agent\\agents';
  const CSV_BASE = 'C:\\Users\\User\\.claude\\agents\\ref\\core';

  // Mapping: [source .md, target .csv, mode ('append' or 'create')]
  const mappings = [
    ['backend-specialist.md', '02-BACKEND_SPECIALIST.csv', 'append'],
    ['security-auditor.md', '04-SECURITY_AUDITOR.csv', 'append'],
    ['frontend-specialist.md', '03-FRONTEND_SPECIALIST.csv', 'append'],
    ['qa-automation-engineer.md', '06-TESTING_SPECIALIST.csv', 'append'],
    ['test-engineer.md', '06-TESTING_SPECIALIST.csv', 'append'],
    ['debugger.md', '06-TESTING_SPECIALIST.csv', 'append'],
    ['product-manager.md', '10-PROJECT_MANAGER.csv', 'append'],
    ['project-planner.md', '10-PROJECT_MANAGER.csv', 'append'],
    ['orchestrator.md', '01-ORCHESTRATOR.csv', 'create'],
  ];

  const stats = [];

  for (const [srcFile, csvFile, mode] of mappings) {
    const srcPath = path.join(ANTIGRAVITY_BASE, srcFile);
    const csvPath = path.join(CSV_BASE, csvFile);

    // Read source .md
    let raw;
    try {
      raw = fs.readFileSync(srcPath, 'utf-8');
    } catch (err) {
      console.error(`ERROR: Cannot read ${srcPath}: ${err.message}`);
      continue;
    }

    // Normalize line endings
    raw = raw.replace(/\r\n/g, '\n');

    // Strip YAML frontmatter
    const stripped = stripFrontmatter(raw);

    // Extract agent name
    const agentName = extractAgentName(stripped);

    // Parse into chunks
    const chunks = parseMarkdown(stripped);

    // Build CSV rows (no header)
    const sourceLabel = `${srcFile} [antigravity]`;
    const newRows = [];

    for (const chunk of chunks) {
      const type = classifyType(chunk);
      const tags = extractTags(chunk.content);
      newRows.push([
        escapeCSV(sourceLabel),
        escapeCSV(agentName),
        escapeCSV(chunk.section),
        escapeCSV(chunk.subsection),
        escapeCSV(type),
        escapeCSV(tags),
        escapeCSV(chunk.content),
      ].join(','));
    }

    if (mode === 'create') {
      // Create new CSV with BOM + header + rows
      const csvHeader = 'source,agent,section,subsection,type,tags,content';
      const csvContent = '\uFEFF' + csvHeader + '\n' + newRows.join('\n');
      fs.writeFileSync(csvPath, csvContent, 'utf-8');
    } else {
      // Append to existing CSV
      let existing;
      try {
        existing = fs.readFileSync(csvPath, 'utf-8');
      } catch (err) {
        console.error(`ERROR: Cannot read existing CSV ${csvPath}: ${err.message}`);
        continue;
      }

      // Ensure existing content ends with newline
      const separator = existing.endsWith('\n') ? '' : '\n';
      const appended = existing + separator + newRows.join('\n');
      fs.writeFileSync(csvPath, appended, 'utf-8');
    }

    // Coverage stats
    const sourceLines = stripped.split('\n').map(l => l.trim()).filter(l => l && !/^#{1,3} /.test(l));
    const allContent = chunks.map(c => c.content).join('\n');
    const missingLines = sourceLines.filter(l => !allContent.includes(l.trim()));
    const coverage = sourceLines.length > 0
      ? ((sourceLines.length - missingLines.length) / sourceLines.length * 100).toFixed(1)
      : '100.0';

    const stat = {
      source: srcFile,
      target: csvFile,
      mode,
      agent: agentName,
      chunks: chunks.length,
      sourceLines: sourceLines.length,
      coverage: `${coverage}%`,
      newRows: newRows.length,
      missingCount: missingLines.length,
    };
    stats.push(stat);

    console.log(`[${mode.toUpperCase()}] ${srcFile} -> ${csvFile}`);
    console.log(`  Agent: ${agentName}`);
    console.log(`  Chunks: ${chunks.length} | Source lines: ${sourceLines.length} | Coverage: ${coverage}%`);
    console.log(`  Rows added: ${newRows.length}`);
    if (missingLines.length > 0 && missingLines.length <= 5) {
      console.log(`  Missing lines (${missingLines.length}):`);
      for (const ml of missingLines) {
        console.log(`    - "${ml.substring(0, 80)}"`);
      }
    } else if (missingLines.length > 5) {
      console.log(`  Missing lines: ${missingLines.length} (showing first 3):`);
      for (const ml of missingLines.slice(0, 3)) {
        console.log(`    - "${ml.substring(0, 80)}"`);
      }
    }
    console.log('');
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Processed: ${stats.length} files`);
  console.log(`Total rows added: ${stats.reduce((s, x) => s + x.newRows, 0)}`);
  console.log('');
  for (const s of stats) {
    console.log(`  ${s.source} -> ${s.target} [${s.mode}] ${s.chunks} chunks, ${s.coverage} coverage`);
  }
  console.log('\nDone!');
}

main();
