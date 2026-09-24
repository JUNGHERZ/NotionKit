// ============================================================
// NotionKit – Package Contents
//
// Checks what `npm pack` would publish: the entry points of
// package.json, the documents the README sends a reader to
// (SKILL.md, CHANGELOG.md), and the source map a shipped file
// names. 1.7.1 to 1.11.0 published notionkit.min.css without the
// notionkit.min.css.map it names – a 404 on the CDN.
//
// Usage:  npm run check:package   (after npm run build)
// ============================================================
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { posix } from 'node:path';

const REQUIRED = [
  'package.json', 'README.md', 'LICENSE', 'CHANGELOG.md', 'SKILL.md',
  'notionkit.css', 'notionkit.min.css', 'notionkit.min.css.map', 'notionkit-styles.js', 'theme-override.css',
];

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const [{ files }] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf-8' }));
const shipped = new Set(files.map(f => f.path));
const problems = [];

for (const file of new Set([...REQUIRED, pkg.main, pkg.style].filter(Boolean))) {
  if (!shipped.has(file.replace(/^\.\//, ''))) problems.push(`${file} is not in the package`);
}

// A source map comment points next to its file, so the map has to ship too.
for (const file of shipped) {
  if (!/\.(css|js)$/.test(file)) continue;
  for (const [, url] of readFileSync(file, 'utf-8').matchAll(/[#@] sourceMappingURL=([^\s*]+)/g)) {
    if (!shipped.has(posix.join(posix.dirname(file), url))) problems.push(`${file} names ${url}, which is not in the package`);
  }
}

console.log(`${pkg.name}@${pkg.version}: ${shipped.size} files`);
if (problems.length) {
  for (const p of problems) console.error(`::error::${p}`);
  process.exit(1);
}
console.log('✅ the package carries every file it points to');
