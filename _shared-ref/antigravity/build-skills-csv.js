const fs = require('fs');
const path = require('path');

// ── Skills to process (16 total, excluding doc.md) ──
const SKILL_DIRS = [
  'app-builder',
  'architecture',
  'behavioral-modes',
  'brainstorming',
  'i18n-localization',
  'intelligent-routing',
  'lint-and-validate',
  'mcp-builder',
  'parallel-agents',
  'plan-writing',
  'python-patterns',
  'systematic-debugging',
  'tdd-workflow',
  'testing-patterns',
  'web-design-guidelines',
  'webapp-testing',
];

const SKILLS_ROOT = 'C:\\Users\\User\\.claude\\agents\\_shared-ref\\antigravity\\skills';
const OUTPUT_CSV = path.join(__dirname, 'skills-enrichment.csv');

// ── Tech keyword dictionary (from convert-to-csv.js) ──
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
  // Additional for these skills
  'MCP', 'i18n', 'pytest', 'unittest', 'mypy', 'ruff', 'black', 'flake8',
  'ESLint', 'Prettier', 'TDD', 'BDD', 'Selenium', 'Puppeteer',
  'FastAPI', 'Django', 'Flask', 'asyncio', 'pydantic',
  'gettext', 'ICU', 'CLDR', 'RTL',
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

// ── Extract skill name from content ──
function extractSkillName(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // # Heading
    if (/^# /.test(trimmed)) {
      return trimmed.replace(/^# /, '').trim();
    }
  }
  // Fallback: first non-empty, non-frontmatter line
  let inFrontmatter = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '---') {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (!inFrontmatter && trimmed) {
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
  if (/template/i.test(combined)) return 'pattern';
  if (/workflow|process|phase|step/i.test(combined)) return 'framework';
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

// ── Main ──
function main() {
  const csvHeader = 'source,skill_name,section,subsection,type,tags,content';
  const csvRows = [csvHeader];
  let totalChunks = 0;

  console.log(`Processing ${SKILL_DIRS.length} skill files\n`);
  console.log('Skill'.padEnd(30) + 'Chunks'.padEnd(10) + 'Coverage');
  console.log('-'.repeat(55));

  for (const skillDir of SKILL_DIRS) {
    const filePath = path.join(SKILLS_ROOT, skillDir, 'SKILL.md');

    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${filePath} not found`);
      continue;
    }

    let raw = fs.readFileSync(filePath, 'utf-8');
    raw = raw.replace(/\r\n/g, '\n');

    // Extract human-readable skill name
    const skillName = extractSkillName(raw);

    // Parse into chunks
    const chunks = parseMarkdown(raw);
    totalChunks += chunks.length;

    // Build CSV rows
    for (const chunk of chunks) {
      const type = classifyType(chunk);
      const tags = extractTags(chunk.content);
      csvRows.push([
        escapeCSV(skillDir),
        escapeCSV(skillName),
        escapeCSV(chunk.section),
        escapeCSV(chunk.subsection),
        escapeCSV(type),
        escapeCSV(tags),
        escapeCSV(chunk.content),
      ].join(','));
    }

    // Coverage check
    const sourceLines = raw.split('\n').map(l => l.trim()).filter(l => l && !/^#{1,3} /.test(l) && !/^---$/.test(l));
    const allContent = chunks.map(c => c.content).join('\n');
    const missingLines = sourceLines.filter(l => !allContent.includes(l.trim()));
    const coverage = sourceLines.length > 0
      ? ((sourceLines.length - missingLines.length) / sourceLines.length * 100).toFixed(1)
      : '100.0';

    console.log(`${skillDir.padEnd(30)}${String(chunks.length).padEnd(10)}${coverage}%`);
  }

  // Write CSV with BOM
  const csvContent = '\uFEFF' + csvRows.join('\n');
  fs.writeFileSync(OUTPUT_CSV, csvContent, 'utf-8');

  console.log('-'.repeat(55));
  console.log(`\nTotal chunks: ${totalChunks}`);
  console.log(`Total rows (excl header): ${csvRows.length - 1}`);
  console.log(`Output: ${OUTPUT_CSV}`);
  console.log('Done!');
}

main();
