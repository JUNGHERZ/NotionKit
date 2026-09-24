// 1.11.0: what SupaGantt's first weeks found in the stylesheet – the
// banner's action, a field grid that fits, the tooltip's lines, long
// floating menus, and open overlays that carry no transform at rest.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);

test('banner: the action is a button shown as text; on a phone it goes under the text', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div style="max-width:700px"><div class="nk-banner warning">⚠️ <span id="t">The “Project overview” database has 2 overdue entries that wait for an owner.</span><button class="b-action" id="a">Show all overdue</button></div></div>');
  const m = () => page.evaluate(() => { const t = document.getElementById('t').getBoundingClientRect(), a = document.getElementById('a').getBoundingClientRect(), cs = getComputedStyle(document.getElementById('a')); return { below: a.top >= t.bottom - 1, left: Math.round(a.left - t.left), text: Math.round(t.width), bg: cs.backgroundColor, border: cs.borderTopWidth, padding: cs.paddingTop, font: cs.fontSize }; });
  expect(await m()).toMatchObject({ below: false, bg: 'rgba(0, 0, 0, 0)', border: '0px', padding: '0px', font: '14px' });
  await page.setViewportSize(PHONE);
  await settle(page);
  const phone = await m();
  expect(phone.below).toBe(true);
  expect(phone.text).toBeGreaterThan(250);
});

test('fields: .fit shares the row – two fields are two halves, not two thirds and a gap', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const field = '<div class="nk-field"><div><div class="f-label">Type</div></div><div class="f-control"><input class="nk-input"></div></div>';
  await stage(page, `<div style="width:512px"><div class="nk-fields" id="a">${field}${field}</div><div class="nk-fields fit" id="f">${field}${field}</div></div>`);
  const w = id => page.evaluate(id => [...document.querySelectorAll(`#${id} > .nk-field`)].map(f => Math.round(f.getBoundingClientRect().width)), id);
  expect((await w('a'))[0]).toBeLessThan(170);
  expect(await w('f')).toEqual([250, 250]);
});

test('tooltip: .lines keeps line breaks, a long word breaks inside 260px', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div class="nk-tooltip open lines" id="l" style="position:fixed;top:20px;left:20px">Shell\n12.10.–30.11.</div><div class="nk-tooltip open" id="w" style="position:fixed;top:80px;left:20px">Baustelleneinrichtungsplanungsabschnittsverantwortlicher</div>');
  const m = await page.evaluate(() => [document.getElementById('l').getBoundingClientRect().height, document.getElementById('w').getBoundingClientRect().width]);
  expect(m[0]).toBe(40);
  expect(m[1]).toBeLessThanOrEqual(260);
});

test('a floating menu never grows past the window and scrolls inside; --_nk-float-max caps it', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const items = Array.from({ length: 60 }, (_, i) => `<div class="nk-menu-item">Person ${i + 1}</div>`).join('');
  await stage(page, `<div class="nk-pop nk-menu floating open" id="m" style="position:fixed;top:8px;right:8px">${items}</div>`);
  const m = () => page.evaluate(() => { const p = document.getElementById('m'); return [Math.round(p.getBoundingClientRect().height), p.scrollHeight > p.clientHeight]; });
  expect(await m()).toEqual([800 - 16, true]);
  await page.evaluate(() => document.getElementById('m').style.setProperty('--_nk-float-max', '240px'));
  expect(await m()).toEqual([240, true]);
});

test('open overlays carry no transform at rest, so a floating menu inside is fixed to the window', async ({ page }) => {
  await page.goto('/app.html#settings');
  await settle(page);
  await page.evaluate(() => { location.hash = ''; });
  const none = await page.evaluate(() => [getComputedStyle(document.querySelector('.nk-modal')).transform]);
  expect(none).toEqual(['none']);
  await page.goto('/app.html#dialog');
  await settle(page);
  expect(await page.evaluate(() => { const cs = getComputedStyle(document.querySelector('#trashDialog .nk-dialog')); return [cs.scale, cs.translate]; })).toEqual(['none', 'none']);
  // A fixed box inside the open dialog sits at the window's origin, not the card's.
  expect(await page.evaluate(() => { const probe = Object.assign(document.createElement('div'), { style: 'position:fixed;top:0;left:0;width:1px;height:1px' }); document.querySelector('#trashDialog .dl-body').appendChild(probe); const r = probe.getBoundingClientRect(); probe.remove(); return [r.left, r.top]; })).toEqual([0, 0]);
});
