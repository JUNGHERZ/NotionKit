// DoD 3: every .nk-* class the library defines must appear in showcase.html
// and docs.html, so the documentation cannot silently fall behind the CSS.
import { readFileSync } from 'fs';

const css = readFileSync('notionkit.css', 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
const defined = new Set([...css.matchAll(/\.(nk-[a-z0-9-]+)/g)].map(m => m[1]));

const used = file => {
  const html = readFileSync(file, 'utf-8');
  const set = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach(c => c && set.add(c));
  // classes that only appear inside escaped code samples still count as documented
  for (const m of html.matchAll(/(nk-[a-z0-9-]+)/g)) set.add(m[1]);
  return set;
};

let bad = 0;
for (const file of ['showcase.html', 'docs.html', 'de/showcase.html', 'de/docs.html']) {
  const u = used(file);
  const missing = [...defined].filter(c => !u.has(c)).sort();
  const rendered = new Set();
  for (const m of readFileSync(file, 'utf-8').matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach(c => c && rendered.add(c));
  const notRendered = [...defined].filter(c => !rendered.has(c)).sort();
  console.log(`${missing.length === 0 ? '✅' : '❌'} ${file.padEnd(18)} ${defined.size - missing.length}/${defined.size} dokumentiert` +
              (notRendered.length ? `  ·  nur als Code-Beispiel: ${notRendered.join(', ')}` : ''));
  if (missing.length) { bad++; console.log('   fehlt:', missing.join(', ')); }
}
// Every catalog id doubles as the heading class `.id` – it must exist in the CSS.
const { CATALOG } = await import('./catalog.mjs');
const badIds = CATALOG.map(c => c.id).filter(id => !defined.has(id));
if (badIds.length) { bad++; console.log('❌ Katalog-IDs ohne CSS-Klasse:', badIds.join(', ')); }
else console.log('✅ alle Katalog-IDs sind CSS-Klassen');
process.exit(bad ? 1 : 0);
