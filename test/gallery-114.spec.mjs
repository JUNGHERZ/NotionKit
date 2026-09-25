// 1.14.0: the gallery view – cards with a picture on top in a grid that
// fills the row, three card sizes, a picture shown whole with .fit, and an
// add card at the end.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const card = (i, img = true) => `<div class="nk-card" id="c${i}"><div class="nk-cover" id="v${i}">${img ? `<img src="/covers/aurora.svg" alt="" id="i${i}">` : ''}</div><div class="card-title">🧭 Compliance ${i}</div><div class="card-meta"><span class="nk-tag green">Done</span><span>📅 08.05.2026</span></div></div>`;
const cols = page => page.evaluate(() => getComputedStyle(document.getElementById('g')).gridTemplateColumns.split(' ').length);

test('gallery: 260px columns by default, 180px with .small, 340px with .large – the grid fills the row', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div style="width:760px"><div class="nk-gallery" id="g">${[1, 2, 3, 4, 5].map(i => card(i)).join('')}</div></div>`);
  expect(await cols(page)).toBe(2);
  await page.evaluate(() => document.getElementById('g').classList.add('small'));
  await settle(page);                                        // grid tracks transition, even under reduced motion
  expect(await cols(page)).toBe(4);
  await page.evaluate(() => document.getElementById('g').classList.replace('small', 'large'));
  await settle(page);
  expect(await cols(page)).toBe(2);
  // Two large cards share the row, so each is wider than 340px.
  expect(await page.evaluate(() => Math.round(document.getElementById('c1').getBoundingClientRect().width))).toBeGreaterThan(340);
});

test('gallery: the cover runs to the card\'s edges in 2:1; without a picture the gradient shows; .fit shows a picture whole', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div style="width:560px"><div class="nk-gallery" id="g">${card(1)}${card(2, false)}</div></div>`);
  const m = await page.evaluate(() => {
    const c = document.getElementById('c1').getBoundingClientRect(), v = document.getElementById('v1').getBoundingClientRect(), v2 = getComputedStyle(document.getElementById('v2'));
    return { left: Math.round(v.left - c.left), right: Math.round(c.right - v.right), top: Math.round(v.top - c.top), ratio: Math.round(v.width / v.height * 100) / 100, gradient: v2.backgroundImage.includes('radial-gradient'), fit: getComputedStyle(document.getElementById('i1')).objectFit };
  });
  expect(m).toEqual({ left: 1, right: 1, top: 1, ratio: 2, gradient: true, fit: 'cover' });
  await page.evaluate(() => document.getElementById('g').classList.add('fit'));
  await settle(page);
  expect(await page.evaluate(() => [getComputedStyle(document.getElementById('i1')).objectFit, getComputedStyle(document.getElementById('v1')).backgroundImage, getComputedStyle(document.getElementById('v2')).backgroundImage.includes('radial-gradient')])).toEqual(['contain', 'none', true]);
});

test('gallery: the add card is a dashed tile; on a phone one card per row', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-gallery" id="g">${card(1)}${card(2)}<div class="nk-new-row" id="n">＋ New page</div></div>`);
  expect(await page.evaluate(() => { const cs = getComputedStyle(document.getElementById('n')); return [cs.borderTopStyle, cs.minHeight, cs.justifyContent]; })).toEqual(['dashed', '64px', 'center']);
  await page.setViewportSize(PHONE);
  await settle(page);
  expect(await cols(page)).toBe(1);
});
