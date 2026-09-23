// Phone regressions (1.5.3): at 390px no page scrolls sideways, the settings
// modal keeps to the screen, the topbar keeps to one row, and the landing
// page's device frames scale to the width they get.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const PAGES = ['index.html', 'de/index.html', 'showcase.html', 'de/showcase.html', 'docs.html', 'de/docs.html', 'app.html', 'de/app.html'];

for (const path of PAGES) {
  test(`${path} does not scroll sideways at 390px`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/' + path);
    await page.waitForTimeout(200);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBeLessThanOrEqual(PHONE.width);
  });
}

for (const path of ['app.html', 'de/app.html']) {
  test(`${path}: every settings pane keeps to the screen at 390px`, async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/' + path);
    const overflow = await page.evaluate(() => {
      document.getElementById('settingsModal').classList.add('open');
      const out = {};
      for (const pane of document.querySelectorAll('.nk-settings-pane')) {
        document.querySelectorAll('.nk-settings-pane').forEach(p => p.classList.toggle('active', p === pane));
        const c = document.querySelector('.nk-settings-content');
        out[pane.id] = c.scrollWidth - c.clientWidth;
      }
      return out;
    });
    for (const [pane, px] of Object.entries(overflow)) expect(px, pane).toBeLessThanOrEqual(1);
  });
}

test('the topbar keeps to one row on a phone and shows the whole trail on the desktop', async ({ page }) => {
  const read = () => page.evaluate(() => {
    const bar = document.querySelector('.nk-topbar');
    const actions = bar.querySelector('.nk-topbar-actions').getBoundingClientRect();
    const shown = [...bar.querySelectorAll('.nk-breadcrumb > *')].filter(el => el.getClientRects().length).length;
    return { barHeight: bar.getBoundingClientRect().height, actionsHeight: actions.height, actionsRight: actions.right, crumbsShown: shown, meta: !!bar.querySelector('.nk-topbar-meta').getClientRects().length };
  });
  await page.setViewportSize(PHONE);
  await page.goto('/de/app.html');
  const phone = await read();
  expect(phone.barHeight).toBeLessThanOrEqual(44);
  expect(phone.actionsHeight, 'actions on one line').toBeLessThanOrEqual(32);
  expect(phone.actionsRight).toBeLessThanOrEqual(PHONE.width);
  expect(phone.crumbsShown, 'only the current page').toBe(1);
  expect(phone.meta, '"last edited" steps aside').toBe(false);

  await page.setViewportSize({ width: 1280, height: 800 });
  const desk = await read();
  expect(desk.crumbsShown, 'crumb, separator, crumb').toBe(3);
  expect(desk.meta).toBe(true);
});

test('a long address ends in an ellipsis instead of pushing the role select out', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const r = await page.evaluate(() => {
    document.getElementById('stage').innerHTML = `<div class="nk-member-list" style="width:300px">
      <div class="nk-member-row"><span class="mini-avatar" style="background:var(--nk-decor-blue)">MK</span>
        <div><div>Marcel Karas</div><div class="m-mail">marcel.karas@a-very-long-company-domain.example</div></div>
        <select class="nk-select"><option>Owner</option></select></div></div>`;
    const row = document.querySelector('.nk-member-row').getBoundingClientRect();
    const select = document.querySelector('.nk-member-row .nk-select').getBoundingClientRect();
    const mail = document.querySelector('.m-mail');
    return { over: select.right - row.right, clipped: mail.scrollWidth > mail.clientWidth };
  });
  expect(r.over, 'select past the row').toBeLessThanOrEqual(0.5);
  expect(r.clipped, 'address ellipsised').toBe(true);
});

for (const width of [390, 1280]) {
  test(`landing frames scale the app to their width · ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/index.html');
    const frames = await page.evaluate(() => [...document.querySelectorAll('.site-scaler')].map(s => {
      const f = s.getBoundingClientRect(), i = s.querySelector('iframe').getBoundingClientRect();
      return { frame: f.width, iframe: i.width, frameH: f.height, iframeH: i.height };
    }));
    expect(frames.length).toBe(2);
    for (const f of frames) {
      expect(Math.abs(f.frame - f.iframe), 'iframe fills the frame width').toBeLessThanOrEqual(3);
      expect(Math.abs(f.frameH - f.iframeH), 'and its height').toBeLessThanOrEqual(3);
    }
  });
}
