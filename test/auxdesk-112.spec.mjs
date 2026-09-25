// 1.12.0: what Auxdesk's move to 1.11 found – a panel title with something
// beside it, lists without the margin meant for a page, text values, a
// value that moves under its name in a narrow column, steps skipped in any
// order and in a row, tabs that scroll, a cap for full pages and buttons
// for a table row.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const rect = (page, id) => page.evaluate(id => { const r = document.getElementById(id).getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom), right: Math.round(r.right) }; }, id);
const prop = (id, name, value, cls = '') => `<div class="nk-prop" id="${id}"><dt class="p-name">${name}</dt><dd class="p-value ${cls}" id="${id}-v">${value}</dd></div>`;

test('panel: .p-head sets the title and its end in one row, the end at the right edge; narrow, the end moves under the title', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-panel" id="p" style="width:420px"><div class="p-head"><h3 id="t">Contacts database</h3><span class="p-end" id="e"><span class="nk-tag green">Connected</span></span></div><p>Rows land in “Contacts”.</p></div>`);
  const [p, t, e] = [await rect(page, 'p'), await rect(page, 't'), await rect(page, 'e')];
  expect(e.right).toBe(p.right - 17);                       // 16px padding + 1px border
  expect(Math.abs((t.y + t.h / 2) - (e.y + e.h / 2))).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => { const cs = getComputedStyle(document.getElementById('t')); return [cs.fontSize, cs.fontWeight, cs.marginTop]; })).toEqual(['14px', '600', '0px']);
  await page.evaluate(() => { document.getElementById('p').style.width = '180px'; });
  await settle(page);                                       // widths transition, even under reduced motion
  const [t2, e2] = [await rect(page, 't'), await rect(page, 'e')];
  expect(e2.y).toBeGreaterThanOrEqual(t2.bottom);
});

test('.flush drops the outer margin of a property list and of a panel grid', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<dl class="nk-props" id="a">${prop('x', 'Status', 'Open')}</dl><dl class="nk-props flush" id="b">${prop('y', 'Status', 'Open')}</dl><div class="nk-panels" id="c"></div><div class="nk-panels flush" id="d"></div>`);
  expect(await page.evaluate(() => ['a', 'b', 'c', 'd'].map(id => getComputedStyle(document.getElementById(id)).margin))).toEqual(['0px 0px 20px', '0px', '12px 0px', '0px']);
});

test('props: a .text value flows as text; the value keeps 220px and moves under its name below 380px', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const mixed = 'on · <code class="nk-inline-code">bedrock/claude-opus-5@eu-central-1</code> · <span class="nk-tag blue">EU</span>';
  await stage(page, `<dl class="nk-props" id="l" style="width:600px">${prop('f', 'Triage', mixed)}${prop('t', 'Triage', mixed, 'text')}${prop('s', 'Status', '<span class="nk-tag">Open</span>')}</dl>`);
  // Side by side at 600px: the value starts after the 160px name; one 34px row each.
  expect((await rect(page, 't-v')).x - (await rect(page, 'l')).x).toBe(160);
  expect((await rect(page, 't-v')).h).toBe(34);
  // Narrow the list to 360px: every value moves under its name, full width.
  await page.evaluate(() => { document.getElementById('l').style.width = '360px'; });
  await settle(page);
  const [n, v] = [await page.evaluate(() => document.querySelector('#t .p-name').getBoundingClientRect().bottom), await rect(page, 't-v')];
  expect(v.y).toBeGreaterThanOrEqual(Math.round(n));
  expect(v.w).toBe(360);
  // Too narrow for one line: the flex value puts its three parts on lines of their own, the text value wraps as text.
  await page.evaluate(() => { document.getElementById('l').style.width = '300px'; });
  await settle(page);
  expect((await rect(page, 't-v')).h).toBeLessThan((await rect(page, 'f-v')).h);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('t-v')).display)).toBe('block');
  // The text sits centred in the 34px row, as the flex value does.
  await page.evaluate(() => { document.getElementById('l').style.width = '600px'; document.getElementById('t-v').textContent = 'Short'; document.getElementById('f-v').textContent = 'Short'; });
  await settle(page);
  const tops = await page.evaluate(() => ['t-v', 'f-v'].map(id => { const r = document.createRange(); r.selectNodeContents(document.getElementById(id)); return Math.round(r.getBoundingClientRect().top - document.getElementById(id).getBoundingClientRect().top); }));
  expect(tops[0]).toBe(tops[1]);
});

test('props on a phone: stacked with the compact rows, the value no taller than its content', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<dl class="nk-props" id="l">${prop('s', 'Status', 'Open')}${prop('t', 'Address', 'support@example.com', 'text')}</dl>`);
  await settle(page);
  expect([(await rect(page, 's-v')).h, (await rect(page, 't-v')).h]).toEqual([31, 31]);
});

test('steps: states per step, a label as a button, and a row that keeps only the current label on a phone', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<ol class="nk-steps horizontal" id="s" style="width:700px">
    <li class="nk-step done" id="a"><span class="st-mark">✓</span><button type="button" class="st-label" id="al">Inbox</button></li>
    <li class="nk-step skipped" id="b"><span class="st-mark" id="bm">–</span><button type="button" class="st-label" id="bl">Database</button></li>
    <li class="nk-step current" id="c" aria-current="step"><span class="st-mark">3</span><button type="button" class="st-label" id="cl">Test</button></li></ol>`);
  const [a, b, c] = [await rect(page, 'a'), await rect(page, 'b'), await rect(page, 'c')];
  expect(a.y === b.y && b.y === c.y && a.x < b.x && b.x < c.x).toBe(true);
  expect(c.right).toBeLessThanOrEqual(724);
  expect(await page.evaluate(() => { const m = getComputedStyle(document.getElementById('bm')); const l = getComputedStyle(document.getElementById('al')); const line = getComputedStyle(document.getElementById('a'), '::after'); return [m.borderTopStyle, l.backgroundColor, l.borderTopWidth, l.fontSize, line.position, line.height]; }))
    .toEqual(['dashed', 'rgba(0, 0, 0, 0)', '0px', '14px', 'static', '1px']);
  await page.setViewportSize(PHONE);
  await settle(page);
  expect(await page.evaluate(() => ['al', 'bl', 'cl'].map(id => getComputedStyle(document.getElementById(id)).display))).toEqual(['none', 'none', 'block']);
});

test('tabs: .scroll scrolls sideways, keeps the underline and looks like the plain strip', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const tabs = n => Array.from({ length: n }, (_, i) => `<div class="nk-tab${i ? '' : ' active'}">Tab number ${i + 1}</div>`).join('');
  await stage(page, `<div style="width:420px"><div class="nk-tabs" id="p">${tabs(3)}</div><div style="height:20px"></div><div class="nk-tabs scroll" id="s">${tabs(3)}</div><div style="height:20px"></div><div class="nk-tabs scroll" id="l">${tabs(10)}</div></div>`);
  const [p, s] = [await page.locator('#p').screenshot(), await page.locator('#s').screenshot()];
  expect(p.equals(s)).toBe(true);
  expect(await page.evaluate(() => { const l = document.getElementById('l'); const t = l.querySelector('.nk-tab.active').getBoundingClientRect(), r = l.getBoundingClientRect(); return [l.scrollWidth > l.clientWidth, l.scrollHeight === l.clientHeight, Math.round(r.bottom - t.bottom), Math.round(r.width)]; })).toEqual([true, true, 0, 420]);
});

test('page: --nk-page-full-max caps a full page, none by default', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div class="nk-page full" id="p"></div>');
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('p')).maxWidth)).toBe('none');
  await page.evaluate(() => document.documentElement.style.setProperty('--nk-page-full-max', '1080px'));
  await settle(page);
  expect((await rect(page, 'p')).w).toBe(1080);
});

test('table: .row-actions sets the buttons at the right edge of their cell; th.actions sorts nothing', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-table-wrap" style="width:600px"><table class="nk-table"><thead><tr><th>Job</th><th class="actions" id="h"></th></tr></thead>
    <tbody><tr><td>Reply to MH-125</td><td id="c"><span class="row-actions"><button class="nk-btn secondary small">Retry</button><button class="nk-btn danger small" id="b">Discard</button></span></td></tr></tbody></table></div>`);
  const [c, b] = [await rect(page, 'c'), await rect(page, 'b')];
  expect(c.right - b.right).toBe(8);
  expect(c.h).toBe(37);
  await page.hover('#h');
  expect(await page.evaluate(() => { const cs = getComputedStyle(document.getElementById('h')); return [cs.cursor, cs.backgroundColor]; })).toEqual(['default', 'rgba(0, 0, 0, 0)']);
});
