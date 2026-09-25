// 1.13.0: what LearnHub's move to 1.11 found – fields in a narrow tile, a
// cover without a page icon, and the height of covers as tokens.
import { test, expect } from '@playwright/test';

const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);
const width = (page, id) => page.evaluate(id => Math.round(document.getElementById(id).getBoundingClientRect().width), id);

test('fields: inside a panel they never run past a 200px tile; a field row and a toolbar keep 210px', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const copy = id => `<div class="nk-copy-field" id="${id}"><span class="cf-value">lh_pipe_4f9a8c7d9e</span></div>`;
  await stage(page, `
    <div class="nk-panel" style="width:200px"><h3>Pipeline key</h3>${copy('pc')}<input class="nk-input" id="pi"><select class="nk-select" id="ps"><option>Compliance bei LIST</option></select><div><input class="nk-input" id="pw"></div></div>
    <div class="nk-panel" style="width:600px"><div class="nk-field"><div><div class="f-label">Name</div></div><div class="f-control"><input class="nk-input" id="pr"></div></div></div>
    <div style="width:700px"><div class="nk-field"><div><div class="f-label">Name</div></div><div class="f-control"><input class="nk-input" id="r"></div></div>
      <div class="nk-field"><div><div class="f-label">Key</div></div><div class="f-control">${copy('rc')}</div></div></div>
    <div style="display:flex;gap:8px;width:700px"><div><input class="nk-input" id="t"></div><button>Go</button></div>`);
  expect(await Promise.all(['pc', 'pi', 'ps', 'pw'].map(id => width(page, id)))).toEqual([166, 166, 166, 166]);
  expect(await Promise.all(['pr', 'r', 'rc', 't'].map(id => width(page, id)))).toEqual([210, 210, 210, 210]);
});

test('a cover without a page icon leaves the page its top padding; with an icon the icon overlaps the cover', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<div class="nk-cover" id="c1"></div><div class="nk-page" id="p1"><h1 class="nk-page-title" id="t1">Compliance</h1></div>
    <div class="nk-cover" id="c2"></div><div class="nk-page" id="p2"><div class="nk-page-icon" id="i2">🚀</div><h1 class="nk-page-title">Roadmap</h1></div>`);
  const m = await page.evaluate(() => {
    const r = id => document.getElementById(id).getBoundingClientRect();
    return { pad1: getComputedStyle(document.getElementById('p1')).paddingTop, gap1: Math.round(r('t1').top - r('c1').bottom), pad2: getComputedStyle(document.getElementById('p2')).paddingTop, overlaps: r('i2').top < r('c2').bottom - 30 };
  });
  expect(m).toEqual({ pad1: '24px', gap1: 32, pad2: '0px', overlaps: true });
});

test('cover heights are tokens: --nk-cover-height (200px) and --nk-panel-cover-height (64px), also per cover', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, '<div class="nk-cover" id="c"></div><div class="nk-cover" id="own" style="--nk-cover-height: 120px"></div><div class="nk-panel" style="width:260px"><div class="nk-cover" id="pc"></div><h3>Course</h3></div>');
  const h = () => page.evaluate(() => ['c', 'own', 'pc'].map(id => Math.round(document.getElementById(id).getBoundingClientRect().height)));
  expect(await h()).toEqual([200, 120, 64]);
  await page.evaluate(() => { document.documentElement.style.setProperty('--nk-cover-height', 'clamp(200px, 30vh, 300px)'); document.documentElement.style.setProperty('--nk-panel-cover-height', '130px'); });
  await settle(page);
  expect(await h()).toEqual([240, 120, 130]);
});
