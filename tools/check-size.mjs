// ============================================================
// NotionKit – Size Budget
//
// The stylesheet is render-blocking, and most pages load it over a
// connection of its own (a CDN). A new TCP connection delivers about 14 KB
// in its first round trip, so the gzipped file stays under 14 KiB – the
// "14 KB rule". The minified budget is set so it never binds before the
// gzip budget does. When a release gets close, the budget is a decision,
// not a rule to game.
//
// The script also keeps the size claims in README.md true: the gzip badge
// and the "raw / minified / gzipped" line must match the built files.
//
// Usage:  npm run check:size   (after npm run build)
// ============================================================
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET = { gzip: 14 * 1024, min: 75 * 1024 };

const raw = readFileSync('notionkit.css');
const min = readFileSync('notionkit.min.css', 'utf-8')
  .replace(/\/\*# sourceMappingURL=.*?\*\/\s*$/, '');          // the map comment is not payload
const size = {
  raw: raw.length,
  min: Buffer.byteLength(min),
  gzip: gzipSync(min, { level: 9 }).length,
};
const kib = (n, digits = 0) => (n / 1024).toFixed(digits);
const problems = [];

if (size.gzip > BUDGET.gzip) problems.push(`gzip ${size.gzip} B exceeds the ${BUDGET.gzip} B budget (14 KB rule)`);
if (size.min > BUDGET.min) problems.push(`minified ${size.min} B exceeds the ${BUDGET.min} B budget`);

const readme = readFileSync('README.md', 'utf-8');
const claim = { raw: kib(size.raw), min: kib(size.min), gzip: kib(size.gzip, 1) };
const badge = readme.match(/badge\/gzip-([\d.]+)%20KB/)?.[1];
const line = readme.match(/(\d+) KB raw \/ (\d+) KB minified \/ ([\d.]+) KB gzipped/);
if (badge !== claim.gzip) problems.push(`README badge says gzip ${badge} KB, the build is ${claim.gzip} KB`);
if (!line) problems.push('README: the "… KB raw / … KB minified / … KB gzipped" line is missing');
else if (line[1] !== claim.raw || line[2] !== claim.min || line[3] !== claim.gzip)
  problems.push(`README says ${line[1]} / ${line[2]} / ${line[3]} KB, the build is ${claim.raw} / ${claim.min} / ${claim.gzip} KB`);

console.log(`notionkit.css ${size.raw} B · minified ${size.min} B (budget ${BUDGET.min}) · gzip ${size.gzip} B (budget ${BUDGET.gzip}, ${Math.round(size.gzip / BUDGET.gzip * 100)} %)`);
if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  process.exit(1);
}
console.log('✅ size budget kept, README claims current');
