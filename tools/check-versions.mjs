// ============================================================
// NotionKit – Version Consistency Check
//
// Every place that names the release must say what package.json says:
// the CSS header, the README badges and its pinned CDN example, the
// generated pages (nav badge, landing kicker), SKILL.md and llms.txt.
// Each reference is anchored on surrounding markup so historical prose
// ("since 1.1.0", changelog entries) is never touched.
//
// Usage:  npm run check:versions   (after npm run build)
// ============================================================
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync('package.json', 'utf-8')).version;

const html = dir => existsSync(dir) ? readdirSync(dir).filter(n => n.endsWith('.html')).map(n => `${dir}/${n}`) : [];
const FILES = ['notionkit.css', 'README.md', 'SKILL.md', 'llms.txt', ...html('.'), ...html('de')].filter(existsSync);

const LABELS = [
  ['CSS header',            /Jungherz GmbH – v(\d+\.\d+\.\d+)/g],
  ['shields badge',         /badge\/(?:version|changelog)-v?(\d+\.\d+\.\d+)/g],
  ['site version label',    /class="site-version">v(\d+\.\d+\.\d+)/g],
  ['landing kicker',        /(?:component library|Komponentenbibliothek) · v(\d+\.\d+\.\d+)/g],
  ['SKILL.md description',  /library \(v(\d+\.\d+\.\d+)\)/g],
  ['SKILL.md footer',       /\*NotionKit v(\d+\.\d+\.\d+) ·/g],
  ['pinned CDN example',    /@jungherz-de\/notionkit@(\d+\.\d+\.\d+)\//g],
];

const problems = [];
let found = 0;
for (const file of FILES) {
  const lines = readFileSync(file, 'utf-8').split('\n');
  for (const [name, pattern] of LABELS) {
    for (const [i, line] of lines.entries()) {
      for (const match of line.matchAll(pattern)) {
        found++;
        if (match[1] !== VERSION) problems.push(`${file}:${i + 1} – ${name} says ${match[1]}, expected ${VERSION}`);
      }
    }
  }
}

// The changelog's newest entry must be this version.
const newest = readFileSync('CHANGELOG.md', 'utf-8').match(/^## \[(\d+\.\d+\.\d+)\]/m)?.[1];
if (newest !== VERSION) problems.push(`CHANGELOG.md – newest entry is ${newest}, expected ${VERSION}`);

if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  console.error(`\n✗ ${problems.length} version reference(s) out of step (package v${VERSION})`);
  process.exit(1);
}
console.log(`✅ ${found} version references agree (package v${VERSION})`);
