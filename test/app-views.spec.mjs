// App views (1.6.0): page properties, page options, list view, panels, prose,
// avatars and the grey chat bubble – measured in the demo app, where they
// are placed, and on the test stage.
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const PHONE = { width: 390, height: 844 };
const STAGE = '/test/fixtures/stage.html';

const save = (name, buf) => { mkdirSync('test/.artifacts', { recursive: true }); writeFileSync(`test/.artifacts/${name}`, buf); };

async function stage(page, html) {
  await page.goto(STAGE);
  await page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
}

// ── Prose and editor share one set of rules ─────────────────────────────────

for (const path of ['app.html', 'de/app.html']) {
  test(`${path}: "Read" shows the editor's content as prose, pixel for pixel`, async ({ page }) => {
    await page.goto('/' + path);
    await page.waitForFunction(() => window.nkEditor, null, { timeout: 30000 });
    const section = page.locator('#nk-editor-section');
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    // Below the Edit / Read switch, which changes on purpose.
    const clip = async () => page.evaluate(() => {
      const s = document.getElementById('nk-editor-section').getBoundingClientRect();
      const top = document.getElementById('editorMode').getBoundingClientRect().bottom + 1;
      return { x: s.left, y: top, width: s.width, height: s.bottom - top + 8 };
    });
    const editClip = await clip();
    const edit = await page.screenshot({ clip: editClip });
    await page.click('#editorMode [data-mode="read"]');
    await page.mouse.move(0, 0);
    const readClip = await clip();
    const read = await page.screenshot({ clip: readClip });
    expect(await page.locator('#prose-demo').isVisible()).toBe(true);
    expect(await page.locator('#tiptap-demo').isVisible()).toBe(false);
    if (!edit.equals(read)) { save(`prose-${path.replace('/', '-')}-edit.png`, edit); save(`prose-${path.replace('/', '-')}-read.png`, read); }
    expect(readClip.height, 'same height in both modes').toBe(editClip.height);
    expect(edit.equals(read), 'edit and read differ – see test/.artifacts').toBe(true);
  });
}

test('prose: sizes follow the text it sits in, an empty paragraph keeps its line', async ({ page }) => {
  await stage(page, `
    <div class="nk-page" style="padding:0"><div class="nk-prose" id="a"><h1>H1</h1><h2>H2</h2><h3>H3</h3><p>Text</p><p></p><p>After</p></div></div>
    <div class="nk-page small" style="padding:0"><div class="nk-prose" id="b"><h2>H2</h2><p>Text</p></div></div>`);
  const m = await page.evaluate(() => {
    const fs = sel => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize);
    const empty = document.querySelector('#a p:empty').getBoundingClientRect().height;
    return { h1: fs('#a h1'), h2: fs('#a h2'), h3: fs('#a h3'), p: fs('#a p'), smallP: fs('#b p'), smallH2: fs('#b h2'), empty, line: parseFloat(getComputedStyle(document.querySelector('#a p')).lineHeight) };
  });
  expect(m).toMatchObject({ h1: 30, h2: 24, h3: 20, p: 16, smallP: 14, smallH2: 21 });
  expect(m.empty).toBeCloseTo(m.line, 0);
});

// ── Page options ────────────────────────────────────────────────────────────

test('the ⋯ menu switches small text and full width on the page itself', async ({ page }) => {
  await page.goto('/app.html');
  const read = () => page.evaluate(() => {
    const pg = document.querySelector('#view-page .nk-page');
    return {
      width: pg.getBoundingClientRect().width,
      text: parseFloat(getComputedStyle(pg.querySelector('p.lead')).fontSize),
      heading: parseFloat(getComputedStyle(pg.querySelector('.nk-heading')).fontSize),
      title: parseFloat(getComputedStyle(pg.querySelector('.nk-page-title')).fontSize),
      prop: parseFloat(getComputedStyle(pg.querySelector('.nk-prop')).fontSize),
    };
  });
  const before = await read();
  expect(before).toMatchObject({ width: 760, text: 16, heading: 24, title: 40, prop: 14 });
  await page.click('#pageMenuBtn');
  await page.click('#pageMenu [data-option="small"]');
  await page.click('#pageMenu [data-option="full"]');
  expect(await page.locator('#pageMenu [data-option="small"]').getAttribute('aria-checked')).toBe('true');
  // Reduced motion shortens transitions to 0.01ms rather than removing them,
  // so the new size is computed from the next frame on.
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const after = await read();
  expect(after.width, 'full width fills the column').toBeGreaterThan(900);
  expect(after).toMatchObject({ text: 14, heading: 21, title: 40, prop: 14 });
  await page.keyboard.press('Escape');
  await expect(page.locator('#pageMenu')).toBeHidden();
});

// ── Properties ──────────────────────────────────────────────────────────────

test('properties sit beside their names on the desktop and stack on a phone', async ({ page }) => {
  const read = () => page.evaluate(() => [...document.querySelectorAll('#view-page .nk-prop')].map(p => {
    const n = p.querySelector('.p-name').getBoundingClientRect(), v = p.querySelector('.p-value').getBoundingClientRect();
    return { nameW: n.width, sameRow: Math.abs(n.top - v.top) < 1, below: v.top >= n.bottom - 0.5, h: p.getBoundingClientRect().height, valueRight: v.right };
  }));
  await page.goto('/app.html');
  const desk = await read();
  expect(desk).toHaveLength(5);
  for (const r of desk) { expect(r.nameW).toBe(160); expect(r.sameRow).toBe(true); expect(r.h).toBe(34); }
  // Visible in the landing page's 1280 × 800 frame without scrolling.
  const bottom = await page.evaluate(() => document.querySelector('#view-page .nk-props').getBoundingClientRect().bottom);
  expect(bottom).toBeLessThan(800);
  await page.setViewportSize(PHONE);
  const phone = await read();
  for (const r of phone) { expect(r.below, 'value below its name').toBe(true); expect(r.valueRight).toBeLessThanOrEqual(PHONE.width); }
});

test('a wide progress bar keeps its label beside it', async ({ page }) => {
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const v = [...document.querySelectorAll('#view-page .p-value')].find(x => x.querySelector('.nk-progress'));
    const bar = v.querySelector('.nk-progress').getBoundingClientRect(), label = v.querySelector('.nk-progress-label').getBoundingClientRect();
    return { sameLine: Math.abs((bar.top + bar.bottom) / 2 - (label.top + label.bottom) / 2) < 6, barW: bar.width };
  });
  expect(m.sameLine).toBe(true);
  expect(m.barW).toBeGreaterThan(300);
});

// ── Database: list view, numbers ────────────────────────────────────────────

test('the list view is the third view tab, one line per row', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('.nk-db-tab[data-view="list"]');
  await expect(page.locator('#view-list')).toBeVisible();
  await expect(page.locator('#view-table')).toBeHidden();
  const rows = await page.evaluate(() => [...document.querySelectorAll('#view-list .nk-list-item')].map(r => r.getBoundingClientRect().height));
  // The list shows what the table shows – the rows through the active filters (1.7.0).
  expect(rows).toHaveLength(await page.evaluate(() => document.querySelectorAll('#tableBody tr').length));
  for (const h of rows) expect(h).toBeLessThanOrEqual(37);
  await page.click('.nk-db-tab[data-view="board"]');
  await expect(page.locator('#view-board')).toBeVisible();
  await expect(page.locator('#view-list')).toBeHidden();
});

test('on a phone a list row stays one line: the title ends in an ellipsis, the properties stay', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/de/app.html');
  await page.click('#tabBar [data-view="home"]');
  const rows = await page.evaluate(() => [...document.querySelectorAll('#view-home .nk-list-item')].map(r => {
    const meta = r.querySelector('.l-meta').getBoundingClientRect();
    return { h: r.getBoundingClientRect().height, metaRight: meta.right, rowRight: r.getBoundingClientRect().right };
  }));
  for (const r of rows) { expect(r.h).toBeLessThanOrEqual(37); expect(r.metaRight).toBeLessThanOrEqual(r.rowRight + 0.5); }
  await stage(page, `<div class="nk-list"><div class="nk-list-item"><span class="l-icon">📄</span><span class="l-title" id="t">A page title far too long for one line on a phone screen</span><span class="l-meta" id="m">5 June <span class="nk-tag">Open</span></span></div></div>`);
  const m = await page.evaluate(() => {
    const t = document.getElementById('t'), meta = document.getElementById('m');
    return { clipped: t.scrollWidth > t.clientWidth, ellipsis: getComputedStyle(t).textOverflow, metaW: meta.getBoundingClientRect().width, metaNeeds: meta.scrollWidth, sw: document.documentElement.scrollWidth };
  });
  expect(m.clipped).toBe(true);
  expect(m.ellipsis).toBe('ellipsis');
  expect(m.metaW, 'properties keep their width').toBeGreaterThanOrEqual(m.metaNeeds);
  expect(m.sw).toBeLessThanOrEqual(PHONE.width);
});

test('numbers stand right-aligned in figures of equal width, the header stays left', async ({ page }) => {
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const td = document.querySelector('#tableBody td.num'), th = [...document.querySelectorAll('#view-table th')].pop();
    const cs = getComputedStyle(td);
    return { align: cs.textAlign, nums: cs.fontVariantNumeric, head: getComputedStyle(th).textAlign };
  });
  expect(m).toEqual({ align: 'right', nums: 'tabular-nums', head: 'left' });
});

// ── Start view: panels ──────────────────────────────────────────────────────

test('the start view: four panels in a row on the desktop, one column on a phone', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('.nk-sidebar [data-view="home"]');
  await expect(page.locator('#view-home')).toBeVisible();
  await expect(page.locator('#view-page')).toBeHidden();
  expect(await page.locator('#crumbs').innerText()).toContain('Home');
  const tops = () => page.evaluate(() => [...document.querySelectorAll('#view-home .nk-panel')].map(p => { const r = p.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }));
  const desk = await tops();
  expect(new Set(desk.map(([, y]) => y)).size, 'one row').toBe(1);
  await page.setViewportSize(PHONE);
  const phone = await tops();
  expect(new Set(phone.map(([x]) => x)).size, 'one column').toBe(1);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(PHONE.width);
  // A panel opens its page.
  await page.locator('#view-home .nk-panel').first().click();
  await expect(page.locator('#view-page')).toBeVisible();
});

test('a cover as the first child runs to the panel edges; its picture is cropped, not stretched', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('.nk-sidebar [data-view="home"]');
  const m = await page.evaluate(() => {
    const panel = document.querySelector('#view-home .nk-panel'), cover = panel.querySelector('.nk-cover'), img = cover.querySelector('img');
    const p = panel.getBoundingClientRect(), c = cover.getBoundingClientRect(), i = img.getBoundingClientRect();
    return { left: c.left - p.left, right: p.right - c.right, top: c.top - p.top, imgW: i.width, coverW: c.width, imgH: i.height, coverH: c.height, fit: getComputedStyle(img).objectFit };
  });
  expect(m).toMatchObject({ left: 1, right: 1, top: 1, fit: 'cover' });
  expect(m.imgW).toBe(m.coverW);
  expect(m.imgH).toBe(m.coverH);
});

// ── Avatars and the chat bubble ─────────────────────────────────────────────

test('avatar sizes and colours come from classes, never from inline hex values', async ({ page }) => {
  await stage(page, `<span class="nk-avatar small" id="s">A</span><span class="nk-avatar" id="d">A</span><span class="nk-avatar large green" id="l">A</span><span class="nk-avatar xlarge" id="x">A</span>
    <div class="nk-member-row"><span class="nk-avatar orange" id="m">T</span><div>Tom</div></div>`);
  const sizes = await page.evaluate(() => Object.fromEntries(['s', 'd', 'l', 'x', 'm'].map(id => [id, document.getElementById(id).getBoundingClientRect().width])));
  expect(sizes).toEqual({ s: 20, d: 24, l: 32, x: 56, m: 28 });
  for (const path of ['app.html', 'de/app.html']) {
    await page.goto('/' + path);
    const hex = await page.evaluate(() => [...document.querySelectorAll('[style]')].filter(el => /#[0-9a-f]{3,8}\b/i.test(el.getAttribute('style'))).map(el => el.outerHTML.slice(0, 80)));
    expect(hex, `${path}: inline hex colours`).toEqual([]);
  }
});

test('your own question is a grey bubble on the right', async ({ page }) => {
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const thread = document.getElementById('aiThread').getBoundingClientRect();
    const body = document.querySelector('#aiThread .nk-ai-msg.user.bubble .a-body');
    const b = body.getBoundingClientRect();
    return { right: Math.round(thread.right - b.right), bg: getComputedStyle(body).backgroundColor, radius: getComputedStyle(body).borderTopLeftRadius };
  });
  expect(m.right).toBe(0);
  expect(m.bg).not.toBe('rgba(0, 0, 0, 0)');
  expect(m.radius).toBe('16px');
});
