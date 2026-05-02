const fs = require('fs');
const path = require('path');

// ── Tech keyword dictionary for tag extraction ──
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

// Build lowercase lookup map for efficient matching
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

// ── Detect Style B (=== separator format) ──
function isStyleB(content) {
  const lines = content.split('\n');
  return lines.length > 0 && /^={3,}$/.test(lines[0].trim());
}

// ── Normalize Style B to Style A ──
// Style B uses === separator lines to wrap section titles:
//   ===
//   TITLE TEXT
//   ===
//   content (with ## X.X subsections)
//   ===
//   NEXT TITLE
//   ===
// Strategy: split by === lines, then classify each segment:
//   - Short segments (<=4 non-empty lines, no code blocks) = section titles -> ## heading
//   - Long segments = content (## X.X -> ### X.X)
function normalizeStyleB(content) {
  const lines = content.split('\n');
  const isSep = (line) => /^={3,}$/.test((line || '').trim());

  // Split into segments delimited by === lines
  const segments = [];
  let current = [];
  for (const line of lines) {
    if (isSep(line)) {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) segments.push(current);

  // Classify each segment and build result
  const result = [];
  for (const seg of segments) {
    const nonEmpty = seg.map(l => l.trim()).filter(l => l);
    const hasCode = seg.some(l => l.trim().startsWith('```'));

    // Title segment: short, no code blocks, no markdown formatting indicators
    if (nonEmpty.length <= 4 && !hasCode && !nonEmpty.some(l => l.startsWith('- ') || l.startsWith('**') || l.startsWith('|'))) {
      const title = nonEmpty.join(' - ');
      if (title) result.push(`## ${title}`);
    } else {
      // Content segment: convert ## X.X to ### X.X
      for (const line of seg) {
        if (/^## \d/.test(line.trim())) {
          result.push(line.replace(/^## /, '### '));
        } else {
          result.push(line);
        }
      }
    }
  }

  return result.join('\n');
}

// ── Extract agent name from content ──
function extractAgentName(content) {
  const lines = content.split('\n');
  for (const line of lines.slice(0, 20)) {
    const trimmed = line.trim();
    // Style A: # HEADING
    if (/^# [A-Z]/.test(trimmed)) {
      return trimmed.replace(/^# /, '').trim();
    }
    // Style B: plain text between === lines
    if (trimmed && !/^[=#\-*]/.test(trimmed) && !trimmed.startsWith('Version')) {
      return trimmed;
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

  // Flush remaining content
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
    // Word boundary check: ensure keyword isn't part of a larger word
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

// ── Main ──
function main() {
  const dir = __dirname;
  const mdFiles = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && /^\d{2}-/.test(f))
    .sort();

  if (mdFiles.length === 0) {
    console.log('No matching .md files found in', dir);
    return;
  }

  console.log(`Found ${mdFiles.length} .md files to convert\n`);

  for (const file of mdFiles) {
    const filePath = path.join(dir, file);
    let raw = fs.readFileSync(filePath, 'utf-8');

    // Normalize line endings
    raw = raw.replace(/\r\n/g, '\n');

    // Extract agent name from original content
    const agentName = extractAgentName(raw);

    // Normalize Style B if needed
    const styleB = isStyleB(raw);
    const content = styleB ? normalizeStyleB(raw) : raw;

    // Parse into chunks
    const chunks = parseMarkdown(content);

    // Build CSV rows
    const csvHeader = 'source,agent,section,subsection,type,tags,content';
    const csvRows = [csvHeader];

    for (const chunk of chunks) {
      const type = classifyType(chunk);
      const tags = extractTags(chunk.content);
      csvRows.push([
        escapeCSV(file),
        escapeCSV(agentName),
        escapeCSV(chunk.section),
        escapeCSV(chunk.subsection),
        escapeCSV(type),
        escapeCSV(tags),
        escapeCSV(chunk.content),
      ].join(','));
    }

    // Write CSV with BOM
    const csvPath = filePath.replace(/\.md$/, '.csv');
    const csvContent = '\uFEFF' + csvRows.join('\n');
    fs.writeFileSync(csvPath, csvContent, 'utf-8');

    // Verify: check source line coverage
    const sourceLines = raw.split('\n').map(l => l.trim()).filter(l => l && !/^#{1,3} /.test(l) && !/^={3,}$/.test(l));
    const allContent = chunks.map(c => c.content).join('\n');
    const missingLines = sourceLines.filter(l => !allContent.includes(l.trim()));
    const coverage = ((sourceLines.length - missingLines.length) / sourceLines.length * 100).toFixed(1);

    console.log(`${styleB ? '[Style B]' : '[Style A]'} ${file}`);
    console.log(`  Agent: ${agentName}`);
    console.log(`  Chunks: ${chunks.length} | Source lines: ${sourceLines.length} | Coverage: ${coverage}%`);
    if (missingLines.length > 0 && missingLines.length <= 10) {
      console.log(`  Missing lines (${missingLines.length}):`);
      for (const ml of missingLines) {
        console.log(`    - "${ml.substring(0, 80)}"`);
      }
    } else if (missingLines.length > 10) {
      console.log(`  Missing lines: ${missingLines.length} (showing first 5):`);
      for (const ml of missingLines.slice(0, 5)) {
        console.log(`    - "${ml.substring(0, 80)}"`);
      }
    }
    console.log(`  Output: ${path.basename(csvPath)}\n`);
  }

  console.log('Done!');
}

main();
