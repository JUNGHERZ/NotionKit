// Runs as npm's `version` lifecycle hook (after package.json is bumped,
// before npm commits and tags). Keeps the hand-written version header in
// notionkit.css in step, so Verify Build's consistency check cannot fail on
// a routine bump. SKILL.md and notionkit-styles.js are generated and pick
// the version up at build time.
import { readFileSync, writeFileSync } from 'fs';
const { version } = JSON.parse(readFileSync('package.json', 'utf-8'));
const css = readFileSync('notionkit.css', 'utf-8');
const next = css.replace(/(Jungherz GmbH – v)\d+\.\d+\.\d+/, `$1${version}`);
if (next === css && !css.includes(`– v${version}`)) { console.error('sync-version: header not found in notionkit.css'); process.exit(1); }
writeFileSync('notionkit.css', next);
console.log(`✅ notionkit.css header → v${version}`);
if (!readFileSync('CHANGELOG.md', 'utf-8').includes(`## [${version}]`)) {
  console.warn(`⚠️  CHANGELOG.md has no "## [${version}]" entry yet – add one before pushing the tag, the release workflow checks for it.`);
}
