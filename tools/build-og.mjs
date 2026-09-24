// ============================================================
// NotionKit – Social card
//
// Renders tools/assets/og-card.html to og.png (1200×630) and, at half the
// size, covers/notionkit-og.jpg – the preview the demo's bookmark shows.
// The size tag is the gzipped notionkit.min.css, measured as check-size.mjs
// measures it. Run after npm run build, before a release that changes the
// size or the look: npm run build:og
// ============================================================
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const min = readFileSync('notionkit.min.css', 'utf-8').replace(/\/\*# sourceMappingURL=.*?\*\/\s*$/, '');
const gzip = `${Math.round(gzipSync(min, { level: 9 }).length / 1024)} KB gzip`;

const srv = spawn('node', ['test/server.mjs', '4195'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 800));
const browser = await chromium.launch();
try {
  for (const [scale, path, type] of [[1, 'og.png', 'png'], [0.5, 'covers/notionkit-og.jpg', 'jpeg']]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: scale });
    await page.route('**/esm.sh/**', r => r.abort());   // no editor in the preview
    await page.goto('http://127.0.0.1:4195/tools/assets/og-card.html');
    await page.evaluate(text => { document.getElementById('gz').textContent = text; }, gzip);
    await page.waitForTimeout(1500);
    await page.screenshot({ path, type, ...(type === 'jpeg' ? { quality: 82 } : {}) });
    await page.close();
  }
} finally {
  await browser.close();
  srv.kill();
}
console.log(`✅ og.png (1200×630) and covers/notionkit-og.jpg (600×315) rendered – ${gzip}`);
