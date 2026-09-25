// 1.15.0: a text cell with a tone and a second line (.td-text, .td-desc).
import { test, expect } from '@playwright/test';

test('table: .td-text takes one of the nine text colours, .td-desc a quiet second line; the row grows', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await page.evaluate(() => { document.getElementById('stage').innerHTML = `<div class="nk-table-wrap" style="width:600px"><table class="nk-table"><tbody>
    <tr id="a"><td><span class="td-text orange" id="t">Notion 502: Bad Gateway</span><span class="td-desc" id="d">next run in 4 min</span></td></tr>
    <tr id="b"><td>Import</td></tr></tbody></table></div>`; });
  const m = () => page.evaluate(() => {
    const cs = id => getComputedStyle(document.getElementById(id)), h = id => Math.round(document.getElementById(id).getBoundingClientRect().height);
    return { tone: cs('t').color, desc: [cs('d').display, cs('d').fontSize, cs('d').color === getComputedStyle(document.body).getPropertyValue('--nk-text-tertiary').trim() || cs('d').color], rows: [h('a'), h('b')] };
  });
  const light = await m();
  expect(light.tone).toBe('rgb(217, 115, 13)');
  expect(light.desc.slice(0, 2)).toEqual(['block', '12px']);
  expect(light.rows[0]).toBeGreaterThan(light.rows[1]);
  expect(light.rows[1]).toBe(36);
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(350);
  expect((await m()).tone).toBe('rgb(199, 125, 72)');
});
