// 1.18.0: LearnHub's finding 17 and Auxdesk's 26 and 27 in the stylesheet – a
// bar and its label as one row in a column, stacked properties that keep to
// their card on a phone, icons instead of words in the copy field.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const box = (page, id) => page.evaluate(id => { const r = document.getElementById(id).getBoundingClientRect(); return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), mid: Math.round(r.top + r.height / 2) }; }, id);
const ROW = (n, wide = true) => `<span class="nk-progress-row" id="r${n}"><span class="nk-progress${wide ? ' wide' : ''}" id="b${n}"><i style="width:40%"></i></span><span class="nk-progress-label" id="l${n}">40 %</span></span>`;

test('.nk-progress-row keeps a bar and its label in one row inside a panel: the label beside the bar, on its middle, the bar filling the rest', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  // Panels in one grid row stretch to the tallest – the row must not grow with them.
  await stage(page, `<div class="nk-panels" style="width:640px"><div class="nk-panel" id="p"><h3>Progress</h3>${ROW(1)}<p id="after" style="margin:0">After</p></div><div class="nk-panel" style="height:260px">Tall</div></div>`);
  const [p, b, l, r, after] = await Promise.all(['p', 'b1', 'l1', 'r1', 'after'].map(id => box(page, id)));
  expect(l.left).toBeGreaterThan(b.right);                      // beside, not under
  expect(Math.abs(l.mid - b.mid)).toBeLessThanOrEqual(1);       // on the bar's middle
  expect(b.height).toBe(6);
  expect(r.height).toBe(l.height);                              // as tall as the label, however tall the panel
  const gap = await page.evaluate(() => parseFloat(getComputedStyle(document.getElementById('p')).rowGap) || 0);
  expect(after.top).toBe(r.top + r.height + gap);
  expect(p.right - l.right).toBeLessThanOrEqual(20);             // the bar fills the panel up to the label
});

test('.nk-progress-row in a flex row: a sibling keeps its width and line, the wide bar grows into the rest; a narrow bar stays 110px', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div style="display:flex;align-items:center;gap:6px;width:300px"><span id="sib">Chapter three</span>${ROW(2)}</div>
    <div style="display:flex;flex-direction:column;width:300px">${ROW(3, false)}</div>`);
  const [sib, r2, b2, l2, b3] = await Promise.all(['sib', 'r2', 'b2', 'l2', 'b3'].map(id => box(page, id)));
  expect(sib.height).toBeLessThan(30);                          // one line: not squeezed
  expect(r2.left).toBe(sib.right + 6);
  expect(l2.right).toBeGreaterThanOrEqual(r2.right - 1);
  expect(b2.width).toBeGreaterThan(120);
  expect(b3.width).toBe(110);
});

test('stacked properties on a phone keep to their card: a copy field with a long address cuts it instead of widening the row', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/test/fixtures/stage.html');
  const long = 'https://hooks.auxdesk.app/notion/webhooks/4f2a9c1e-7b3d-4e8a-9f61-2c5d8e7a1b04/inbound?token=' + 'x'.repeat(420);
  await stage(page, `<div class="nk-panel" id="card" style="width:308px"><dl class="nk-props flush" id="props"><div class="nk-prop" id="prop"><dt class="p-name">Webhook</dt><dd class="p-value" id="val"><div class="nk-copy-field mono wide" id="cf"><span class="cf-value">${long}</span><button class="cf-btn" id="copy">Copy</button></div></dd></div></dl></div>`);
  await settle(page);
  const [card, prop, val, cf, copy] = await Promise.all(['card', 'prop', 'val', 'cf', 'copy'].map(id => box(page, id)));
  expect(prop.width).toBeLessThanOrEqual(card.width);
  expect(val.right).toBeLessThanOrEqual(card.right);
  expect(cf.right).toBeLessThanOrEqual(card.right);
  expect(copy.right).toBeLessThanOrEqual(card.right);
});

const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/></svg>';
const FIELD = cls => `<div class="nk-copy-field ${cls}" id="f" style="width:300px"><span class="cf-value">ntn_4f2a9c1e7b3d4e8a</span><button class="cf-btn" id="show" aria-label="Show">${ICON}<span>Show</span></button><button class="cf-btn" id="copy" aria-label="Copy">${ICON}<span>Copy</span></button><button class="cf-btn" id="plain">Open</button></div>`;
const look = page => page.evaluate(() => ['show', 'copy', 'plain'].map(id => {
  const b = document.getElementById(id), svg = b.querySelector('svg'), span = b.querySelector('span');
  return [Math.round(b.getBoundingClientRect().width), svg ? getComputedStyle(svg).display : '-', span ? getComputedStyle(span).display : '-'];
}));

test('copy field: words on the desktop; `.icons` puts a 16px icon in a 28px button instead; a button without an icon keeps its word', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, FIELD(''));
  const words = await look(page);
  expect(words.map(w => w.slice(1))).toEqual([['none', 'inline'], ['none', 'inline'], ['-', '-']]);
  await stage(page, FIELD('icons'));
  const icons = await look(page);
  expect(icons.slice(0, 2)).toEqual([[28, 'block', 'none'], [28, 'block', 'none']]);
  expect(icons[2]).toEqual(words[2]);
  expect(await page.evaluate(() => { const s = document.querySelector('#copy svg').getBoundingClientRect(); return [s.width, s.height]; })).toEqual([16, 16]);
});

test('copy field on a phone: the icons stand in for the words by themselves; the value gets the room', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, FIELD(''));
  const desktop = await page.evaluate(() => document.querySelector('#f .cf-value').getBoundingClientRect().width);
  await page.setViewportSize(PHONE);
  await settle(page);
  const phone = await look(page);
  expect(phone.slice(0, 2)).toEqual([[28, 'block', 'none'], [28, 'block', 'none']]);
  expect(phone[2][0]).toBeGreaterThan(28);
  // Show and Copy take 28px each instead of their words.
  expect(await page.evaluate(() => document.querySelector('#f .cf-value').getBoundingClientRect().width)).toBeGreaterThan(desktop + 30);
});
