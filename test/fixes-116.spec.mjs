// 1.16.0: LearnHub's findings 5, 8 and 15 and Auxdesk's 25 in the stylesheet
// – a wide progress bar in a flex column, a list row without a target, the
// outer margins of blocks in a column with a gap, a stretched button's label.
import { test, expect } from '@playwright/test';

const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const BLOCKS = {
  props: '<dl class="nk-props"><div class="nk-prop"><dt class="p-name">Status</dt><dd class="p-value">Open</dd></div></dl>',
  callout: '<div class="nk-callout"><div class="c-icon">💡</div><div>Callout</div></div>',
  bookmark: '<a class="nk-bookmark" href="#"><span class="bm-body"><span class="bm-title">Bookmark</span></span></a>',
  toggle: '<details class="nk-toggle"><summary>Toggle</summary></details>',
  divider: '<hr class="nk-divider">',
  quote: '<blockquote class="nk-quote">Quote</blockquote>',
  code: '<pre class="nk-code">code</pre>',
  database: '<div class="nk-database">Database</div>',
  danger: '<div class="nk-danger-zone">Danger</div>',
  gallery: '<div class="nk-gallery-grid"><div class="nk-g-item">Item</div></div>',
  template: '<button class="nk-template-btn">Template</button>',
  synced: '<div class="nk-synced">Synced</div>',
  banner: '<div class="nk-banner info">Banner</div>',
  panels: '<div class="nk-panels"><div class="nk-panel">Panel</div></div>',
  skeleton: '<div class="nk-skeleton" style="height:12px"></div>',
  steps: '<ol class="nk-steps"><li class="nk-step"><span class="st-mark">1</span><span>Step</span></li></ol>',
  comments: '<div class="nk-comments">Comments</div>',
  host: '<div class="nk-block-host">Block</div>',
  model: '<div class="nk-model-card">Model</div>',
  ai: '<div class="nk-ai-input-row">Ask</div>',
};
const margins = page => page.evaluate(() => [...document.querySelectorAll('#col > *')].map(el => { const cs = getComputedStyle(el); return [el.className.split(' ')[0], cs.marginTop, cs.marginBottom]; }));

test('--nk-block-space: 0 on a column drops the outer margin of every block inside; headings keep theirs', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div id="col" style="display:flex;flex-direction:column;gap:14px;width:600px">${Object.values(BLOCKS).join('')}<h2 class="nk-heading">Heading</h2></div>`);
  const before = await margins(page);
  expect(before.find(m => m[0] === 'nk-callout')).toEqual(['nk-callout', '16px', '16px']);
  expect(before.find(m => m[0] === 'nk-database')).toEqual(['nk-database', '12px', '8px']);
  await page.evaluate(() => document.getElementById('col').style.setProperty('--nk-block-space', '0'));
  await settle(page);
  const after = await margins(page);
  for (const [cls, top, bottom] of after.filter(m => m[0] !== 'nk-heading')) expect([cls, top, bottom]).toEqual([cls, '0px', '0px']);
  expect(after.find(m => m[0] === 'nk-heading')).toEqual(['nk-heading', '32px', '10px']);
  // The comments keep their indent on the left.
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('#col .nk-comments')).marginLeft)).toBe('8px');
});

test('.flush drops the outer margin of one block and leaves the others', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div id="col">${BLOCKS.callout.replace('nk-callout', 'nk-callout flush')}${BLOCKS.quote}${BLOCKS.database.replace('nk-database', 'nk-database flush')}</div>`);
  expect(await margins(page)).toEqual([['nk-callout', '0px', '0px'], ['nk-quote', '16px', '16px'], ['nk-database', '0px', '0px']]);
});

test('a wide progress bar stays 6px tall in a flex column and fills a flex row beside its label', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-panel" style="width:300px;height:220px"><h3>Progress</h3><span class="nk-progress wide" id="c"><i style="width:40%"></i></span></div>
    <div style="display:flex;align-items:center;width:300px"><span class="nk-progress wide" id="r"><i style="width:40%"></i></span><span class="nk-progress-label" id="l">40 %</span></div>`);
  const m = await page.evaluate(() => { const r = id => document.getElementById(id).getBoundingClientRect(); return { column: Math.round(r('c').height), row: Math.round(r('r').height), rowWidth: Math.round(r('r').width), labelBeside: Math.round(r('l').left) >= Math.round(r('r').right) }; });
  expect(m).toMatchObject({ column: 6, row: 6, labelBeside: true });
  expect(m.rowWidth).toBeGreaterThan(200);
});

test('a .static list row takes neither the hand nor the hover wash; other rows do', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-list" style="width:400px"><div class="nk-list-item static" id="s"><span class="l-title">Richtlinie.pdf</span><span class="l-meta"><button class="nk-btn secondary small">Remove</button></span></div>
    <div class="nk-list-item" id="n"><span class="l-title">Chapter 1</span></div></div>`);
  const state = id => page.evaluate(id => { const cs = getComputedStyle(document.getElementById(id)); return [cs.cursor, cs.backgroundColor]; }, id);
  await page.hover('#s .l-title');
  await settle(page);
  expect(await state('s')).toEqual(['default', 'rgba(0, 0, 0, 0)']);
  await page.hover('#n');
  await settle(page);
  const n = await state('n');
  expect(n[0]).toBe('pointer');
  expect(n[1]).not.toBe('rgba(0, 0, 0, 0)');
});

test('a button stretched across a column keeps its label centred', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div style="display:flex;flex-direction:column;width:360px"><button class="nk-btn primary" id="b"><span id="t">Continue</span></button></div>');
  const m = await page.evaluate(() => { const b = document.getElementById('b').getBoundingClientRect(), t = document.getElementById('t').getBoundingClientRect(); return [Math.round(b.width), Math.round((b.left + b.right) / 2 - (t.left + t.right) / 2)]; });
  expect(m).toEqual([360, 0]);
});

test('a floating menu or date picker lies above the modal, the sheet and the dialog, below the palette, toast and tooltip', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div class="nk-pop nk-menu floating" id="m"></div><div class="nk-modal-backdrop" id="mo"></div><div class="nk-sheet-backdrop" id="sh"></div><div class="nk-dialog-backdrop" id="d"></div><div class="nk-cmdk-backdrop" id="c"></div><div class="nk-toast" id="t"></div><div class="nk-tooltip" id="tt"></div>');
  const z = await page.evaluate(() => Object.fromEntries(['m', 'mo', 'sh', 'd', 'c', 't', 'tt'].map(id => [id, Number(getComputedStyle(document.getElementById(id)).zIndex)])));
  expect(z.m).toBeGreaterThan(Math.max(z.mo, z.sh, z.d));
  expect(z.m).toBeLessThan(Math.min(z.c, z.t, z.tt));
});
