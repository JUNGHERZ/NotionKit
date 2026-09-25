// 1.19.0: Auxdesk's wish 24 in the stylesheet – a toast with an action and
// an ×, as Notion's "Moved to trash · Undo"; the demo's trash toast has one.
import { test, expect } from '@playwright/test';

const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

test('a toast with .t-action and .t-close keeps its height; only a shown toast lets them take the pointer', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-toast show" id="plain">🗑️ <span>Moved to trash</span></div>
    <div class="nk-toast" id="t" style="bottom:80px">🗑️ <span>Moved to trash</span><button class="t-action" type="button" id="a">Undo</button><button class="t-close" type="button" aria-label="Close" id="x">${X}</button></div>`);
  const pointer = () => page.evaluate(() => ['t', 'a', 'x'].map(id => getComputedStyle(document.getElementById(id)).pointerEvents));
  expect(await pointer()).toEqual(['none', 'none', 'none']);
  await page.evaluate(() => document.getElementById('t').classList.add('show'));
  await settle(page);
  expect(await pointer()).toEqual(['none', 'auto', 'auto']);
  const m = await page.evaluate(() => {
    const h = id => Math.round(document.getElementById(id).getBoundingClientRect().height);
    const a = getComputedStyle(document.getElementById('a')), x = document.getElementById('x').getBoundingClientRect(), t = document.getElementById('t').getBoundingClientRect();
    return { plain: h('plain'), action: h('t'), weight: a.fontWeight, xSize: [Math.round(x.width), Math.round(x.height)], xRight: Math.round(t.right - x.right) };
  });
  expect(m).toEqual({ plain: m.action, action: m.action, weight: '500', xSize: [24, 24], xRight: 8 });
  // The toast's own colours: the action is text on a faint wash of the toast's text colour.
  expect(await page.evaluate(() => { const t = getComputedStyle(document.getElementById('t')), a = getComputedStyle(document.getElementById('a')); return [a.color === t.color, a.backgroundColor !== 'rgba(0, 0, 0, 0)']; })).toEqual([true, true]);
});

test('the demo: moving the page to the trash offers Undo, which restores it', async ({ page }) => {
  await page.goto('/app.html#dialog');
  await page.waitForSelector('.nk-dialog-backdrop.open');
  await page.click('#trashDialog [data-close="trash"]');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('toast').classList.contains('show'), document.getElementById('toastMsg').textContent, document.querySelector('#toast .t-action')?.textContent])).toEqual([true, 'Moved to trash', 'Undo']);
  await page.waitForTimeout(2600);                                  // it stays
  await page.click('#toast .t-action');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('toastMsg').textContent, !!document.querySelector('#toast .t-action')])).toEqual(['Restored', false]);
});
