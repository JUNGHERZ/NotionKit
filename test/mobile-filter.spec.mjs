// Mobile and filter (1.7.0): menus that float in and become sheets on a
// phone, the standalone sheet, the sidebar drawer, the database toolbar with
// filter pills, the steps, the scrolling segmented control, the anchors.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const frames = page => page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const settle = page => page.waitForTimeout(350);

// ── Floating menus ──────────────────────────────────────────────────────────

test('the ⋯ menu floats in under its button and takes nothing while closed', async ({ page }) => {
  await page.goto('/app.html');
  const state = () => page.evaluate(() => {
    const m = document.getElementById('pageMenu'), b = document.getElementById('pageMenuBtn').getBoundingClientRect();
    const r = m.getBoundingClientRect(), cs = getComputedStyle(m);
    return { visibility: cs.visibility, events: cs.pointerEvents, gap: Math.round(r.top - b.bottom), right: Math.round(b.right - r.right), z: cs.zIndex };
  });
  expect(await state()).toMatchObject({ visibility: 'hidden', events: 'none' });
  await page.click('#pageMenuBtn');
  await settle(page);
  // 106: above the modal, the sheet and the dialog, so a menu opened from one of them shows over it.
  expect(await state()).toEqual({ visibility: 'visible', events: 'auto', gap: 6, right: 0, z: '106' });
  expect(await page.locator('#pageMenuBtn').getAttribute('aria-expanded')).toBe('true');
});

test('a tap outside an open menu closes it and reaches nothing else', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('#pageMenuBtn');
  await settle(page);
  await page.evaluate(() => { window.hits = 0; document.querySelector('.nk-sidebar [data-view="home"]').addEventListener('click', () => window.hits++); });
  await page.click('.nk-sidebar [data-view="home"]');
  await settle(page);
  expect(await page.evaluate(() => [window.hits, document.getElementById('pageMenu').classList.contains('open')])).toEqual([0, false]);
  await expect(page.locator('#view-page')).toBeVisible();
});

test('on a phone the same menu is a bottom sheet above the tab bar, whatever its inline position says', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html#menu');
  await settle(page);
  const m = await page.evaluate(() => {
    const menu = document.getElementById('pageMenu'), r = menu.getBoundingClientRect(), cs = getComputedStyle(menu);
    const bar = document.getElementById('tabBar').getBoundingClientRect();
    const hit = document.elementFromPoint(bar.left + bar.width / 2, bar.top + bar.height / 2);
    return { left: r.left, right: Math.round(r.right), bottom: Math.round(r.bottom), inlineTop: menu.style.top !== '', radius: cs.borderTopLeftRadius, aboveBar: menu.contains(hit), row: document.querySelector('#pageMenu .nk-menu-item').getBoundingClientRect().height, sw: document.documentElement.scrollWidth };
  });
  expect(m).toMatchObject({ left: 0, right: PHONE.width, bottom: PHONE.height, inlineTop: true, radius: '14px', aboveBar: true, row: 40 });
  expect(m.sw).toBeLessThanOrEqual(PHONE.width);
});

test('#menu opens the page menu, as the landing page shows it', async ({ page }) => {
  await page.goto('/app.html#menu');
  await settle(page);
  await expect(page.locator('#pageMenu')).toHaveClass(/open/);
});

// ── Sheet and drawer ────────────────────────────────────────────────────────

test('"More" opens a sheet over the tab bar; closed it leaves the layout', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html');
  const display = () => page.evaluate(() => getComputedStyle(document.getElementById('moreSheet')).display);
  expect(await display()).toBe('none');
  await page.click('#moreTab');
  await settle(page);
  const m = await page.evaluate(() => {
    const sheet = document.querySelector('#moreSheet .nk-sheet').getBoundingClientRect();
    const bar = document.getElementById('tabBar').getBoundingClientRect();
    return { bottom: Math.round(sheet.bottom), coversBar: document.getElementById('moreSheet').contains(document.elementFromPoint(bar.left + 20, bar.top + 20)), focused: document.activeElement.closest('#moreSheet') !== null, row: document.querySelector('#moreSheet .nk-tree-item').getBoundingClientRect().height };
  });
  expect(m).toEqual({ bottom: PHONE.height, coversBar: true, focused: true, row: 40 });
  await page.mouse.click(200, 60);
  await settle(page);
  expect(await display()).toBe('none');
  expect(await page.evaluate(() => document.activeElement.id)).toBe('moreTab');
});

test('the ☰ opens the sidebar as a drawer on a phone and is gone on the desktop', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html');
  await expect(page.locator('#sidebarToggle')).toBeVisible();
  await expect(page.locator('#sidebar')).toBeHidden();
  await page.click('#sidebarToggle');
  await settle(page);
  const open = await page.evaluate(() => ({ left: document.getElementById('sidebar').getBoundingClientRect().left, scrim: getComputedStyle(document.getElementById('sidebarBackdrop')).display, expanded: document.getElementById('sidebarToggle').getAttribute('aria-expanded') }));
  expect(open).toEqual({ left: 0, scrim: 'block', expanded: 'true' });
  await page.mouse.click(360, 400);
  await settle(page);
  await expect(page.locator('#sidebar')).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('#sidebarToggle')).toBeHidden();
  await expect(page.locator('#sidebar')).toBeVisible();
});

// ── Toolbar and filter pills ────────────────────────────────────────────────

test('"Status: Open" filters table, board and list live; the pill removes it', async ({ page }) => {
  await page.goto('/app.html');
  const counts = () => page.evaluate(() => ({
    table: document.querySelectorAll('#tableBody tr').length,
    list: document.querySelectorAll('#view-list .nk-list-item').length,
    board: document.querySelectorAll('#view-board .nk-card').length,
    badge: document.getElementById('rowCount').textContent,
    filterActive: document.getElementById('filterBtn').classList.contains('active'),
  }));
  expect(await counts()).toEqual({ table: 2, list: 2, board: 2, badge: '2', filterActive: true });
  await page.click('#filterRow .fp-remove');
  expect(await counts()).toEqual({ table: 4, list: 4, board: 4, badge: '4', filterActive: false });
  await page.click('#addFilter');
  await settle(page);
  await page.click('#filterMenu [data-filter="done"]');
  expect((await counts()).table).toBe(2);
  expect(await page.locator('#filterRow .nk-filter-pill.active').count()).toBe(1);
  // No inline style anywhere in the toolbar and the pill row.
  expect(await page.evaluate(() => document.querySelectorAll('.nk-db-toolbar [style], #filterRow [style]').length)).toBe(0);
});

test('the tabs scroll and the tools keep their place on a phone', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const bar = document.querySelector('.nk-db-toolbar'), tools = bar.querySelector('.tools').getBoundingClientRect(), tabs = bar.querySelector('.nk-db-tabs');
    return { height: bar.getBoundingClientRect().height, toolsRight: tools.right <= bar.getBoundingClientRect().right + 0.5, scrolls: tabs.scrollWidth > tabs.clientWidth || tabs.scrollWidth === tabs.clientWidth, sw: document.documentElement.scrollWidth };
  });
  expect(m.height).toBeLessThanOrEqual(40);
  expect(m.toolsRight).toBe(true);
  expect(m.sw).toBeLessThanOrEqual(PHONE.width);
});

// ── Steps, segmented control ────────────────────────────────────────────────

test('choosing your own model shows the steps; Save and Test move them on', async ({ page }) => {
  await page.goto('/app.html#settings');
  await page.click('[data-pane="ki"]');
  await expect(page.locator('#modelSteps')).toBeHidden();
  await page.click('.nk-model-card[data-custom]');
  await expect(page.locator('#modelSteps')).toBeVisible();
  const state = () => page.evaluate(() => [...document.querySelectorAll('#modelSteps .nk-step')].map(li => (li.classList.contains('done') ? 'done' : li.classList.contains('current') ? 'current' : 'todo') + ':' + li.querySelector('.st-mark').textContent));
  expect(await state()).toEqual(['done:✓', 'current:2', 'todo:3']);
  await page.click('#aiSave');
  expect(await state()).toEqual(['done:✓', 'done:✓', 'current:3']);
  await page.click('#aiTest');
  expect(await state()).toEqual(['done:✓', 'done:✓', 'done:✓']);
  const mark = await page.evaluate(() => { const m = document.querySelector('#modelSteps .nk-step .st-mark').getBoundingClientRect(); return [m.width, m.height]; });
  expect(mark).toEqual([20, 20]);
});

test('six ranges scroll in one row; the chosen one comes into view, the page stays put', async ({ page }) => {
  await page.goto('/app.html');
  const seg = page.locator('#demoSegmented');
  await seg.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({ overflow: document.getElementById('demoSegmented').scrollWidth > document.getElementById('demoSegmented').clientWidth, rows: new Set([...document.querySelectorAll('#demoSegmented button')].map(b => Math.round(b.getBoundingClientRect().top))).size }));
  expect(before).toEqual({ overflow: true, rows: 1 });
  const pageScroll = await page.evaluate(() => document.querySelector('#view-page').scrollTop);
  await page.evaluate(() => [...document.querySelectorAll('#demoSegmented button')].pop().click());
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => {
    const row = document.getElementById('demoSegmented').getBoundingClientRect(), last = [...document.querySelectorAll('#demoSegmented button')].pop().getBoundingClientRect();
    return { visible: last.right <= row.right + 0.5 && last.left >= row.left - 0.5, pageScroll: document.querySelector('#view-page').scrollTop };
  });
  expect(after).toEqual({ visible: true, pageScroll });
});

// ── Stylesheet contracts ────────────────────────────────────────────────────

test('sheet rows are 40px through --_nk-row, also for rows in a shadow root', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const h = await page.evaluate(async () => {
    const { componentsSheet } = await import('/notionkit-styles.js');
    const stage = document.getElementById('stage');
    stage.innerHTML = '<div class="nk-sheet-backdrop open" style="position:static"><div class="nk-sheet"><div class="nk-menu-item" id="a">Row</div><span id="host"></span></div></div><div class="nk-menu-item" id="b">Row</div>';
    const root = document.getElementById('host').attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [componentsSheet];
    root.innerHTML = '<div class="nk-tree-item">Row</div>';
    await new Promise(r => requestAnimationFrame(r));
    return [document.getElementById('a').getBoundingClientRect().height, root.querySelector('.nk-tree-item').getBoundingClientRect().height, document.getElementById('b').getBoundingClientRect().height];
  });
  expect(h).toEqual([40, 40, 28]);
});
