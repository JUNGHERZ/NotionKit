// Shell and overlays (1.10.0): the sidebar that collapses on the desktop, the
// side peek that resizes and can inset the page, the dialog, the tooltip –
// in the stylesheet and in the demo that uses them. 1.10.1: a disabled
// button takes the pointer again, for its title or tooltip.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);
const box = (page, sel) => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) }; }, sel);

// ── Sidebar ─────────────────────────────────────────────────────────────────

test('sidebar: « shows over the sidebar and collapses it; the main column takes the width; ☰ brings it back', async ({ page }) => {
  await page.goto('/app.html');
  const opacity = () => page.evaluate(() => getComputedStyle(document.getElementById('sidebarCollapse')).opacity);
  // The pointer starts at 0/0, over the sidebar; in CI Chromium can hover it
  // on load. Away from the sidebar the « is hidden.
  await page.mouse.move(900, 600);
  await settle(page);
  expect(await opacity()).toBe('0');
  await page.hover('.nk-sidebar-scroll');
  await settle(page);
  expect(await opacity()).toBe('1');
  // The workspace row makes room for it.
  expect(await box(page, '#sidebarCollapse')).toMatchObject({ left: 219, top: 13, width: 28, height: 28 });
  expect((await box(page, '.nk-workspace')).right).toBe(215);
  await page.click('#sidebarCollapse');
  await settle(page);
  expect(await page.evaluate(() => [getComputedStyle(document.getElementById('sidebar')).visibility, getComputedStyle(document.getElementById('sidebarToggle')).display])).toEqual(['hidden', 'flex']);   // inline-flex, blockified in the topbar
  expect(await box(page, '#sidebar')).toMatchObject({ left: -260, width: 260 });
  expect(await box(page, '.nk-main')).toMatchObject({ left: 0, width: 1280 });
  await page.click('#sidebarToggle');
  await settle(page);
  expect(await box(page, '.nk-main')).toMatchObject({ left: 260, width: 1020 });
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('sidebarToggle')).display)).toBe('none');
});

test('sidebar: ⌘\\ toggles it; collapsed, it takes no focus, and focus moves to the control that is left', async ({ page }) => {
  await page.goto('/app.html');
  await page.focus('#sidebarCollapse');
  await page.keyboard.press('Enter');
  await settle(page);
  expect(await page.evaluate(() => document.activeElement.id)).toBe('sidebarToggle');
  await page.keyboard.press('Enter');
  await settle(page);
  expect(await page.evaluate(() => [document.activeElement.id, document.getElementById('sidebar').classList.contains('collapsed')])).toEqual(['sidebarCollapse', false]);
  await page.keyboard.press('Enter');
  await settle(page);
  // Nothing in the hidden sidebar is reachable.
  expect(await page.evaluate(() => { const el = document.querySelector('#sidebar .nk-tree-item[data-view="home"]'); el.tabIndex = 0; el.focus(); return document.activeElement === el; })).toBe(false);
  await page.keyboard.press('Meta+Backslash');
  await settle(page);
  expect(await page.evaluate(() => document.getElementById('sidebar').classList.contains('collapsed'))).toBe(false);
  await page.keyboard.press('Control+Backslash');
  expect(await page.evaluate(() => document.getElementById('sidebar').classList.contains('collapsed'))).toBe(true);
});

test('sidebar on a phone: .collapsed changes nothing, the drawer still slides in, the « is not there', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html');
  await page.evaluate(() => { document.getElementById('sidebar').classList.add('collapsed'); document.getElementById('sidebarToggle').classList.add('collapsed'); });
  await page.click('#sidebarToggle');
  await settle(page);
  expect(await box(page, '#sidebar')).toMatchObject({ left: 0, width: 260 });
  expect(await page.evaluate(() => [getComputedStyle(document.getElementById('sidebar')).visibility, getComputedStyle(document.getElementById('sidebarCollapse')).display])).toEqual(['visible', 'none']);
});

// ── Side peek ───────────────────────────────────────────────────────────────

test('side peek: the left edge resizes it through --nk-peek-width, with the pointer and the arrow keys', async ({ page }) => {
  await page.goto('/app.html#peek');
  await settle(page);
  expect((await box(page, '#sidePeek .nk-peek')).width).toBe(560);
  const handle = await box(page, '#peekResize');
  expect(handle).toMatchObject({ left: 1280 - 560 - 4, width: 8, top: 0, height: 800 });
  await page.mouse.move(handle.left + 4, 300);
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('#peekResize'), '::after').backgroundColor)).toBe('rgb(35, 131, 226)');
  await page.mouse.down();
  await page.mouse.move(480, 300, { steps: 4 });
  await page.mouse.up();
  expect((await box(page, '#sidePeek .nk-peek')).width).toBe(800);
  expect(await page.evaluate(() => document.getElementById('sidePeek').classList.contains('open'))).toBe(true);   // dragging is no click outside
  // Bounds: all but 320px of the window, at least 380px.
  await page.mouse.move(476, 300); await page.mouse.down(); await page.mouse.move(100, 300, { steps: 3 }); await page.mouse.up();
  expect((await box(page, '#sidePeek .nk-peek')).width).toBe(960);
  await page.focus('#peekResize');
  for (let i = 0; i < 40; i++) await page.keyboard.press('ArrowRight');
  expect((await box(page, '#sidePeek .nk-peek')).width).toBe(380);
  await page.keyboard.press('ArrowLeft');
  expect(await page.evaluate(() => document.getElementById('peekResize').getAttribute('aria-valuenow'))).toBe('396');
});

test('side peek: .peek-inset moves the page aside by the peek\'s width – not on a phone', async ({ page }) => {
  await page.goto('/app.html#peek');
  await settle(page);
  await page.evaluate(() => { document.documentElement.style.setProperty('--nk-peek-width', '600px'); document.querySelector('.nk-app').classList.add('peek-inset'); });
  await settle(page);   // reduced motion still transitions for .01ms: the value lands a frame later
  const m = await page.evaluate(() => {
    const main = document.querySelector('.nk-main'), page = document.querySelector('#view-page .nk-page').getBoundingClientRect(), peek = document.querySelector('#sidePeek .nk-peek').getBoundingClientRect();
    return { padding: getComputedStyle(main).paddingRight, pageRight: Math.round(page.right), peekLeft: Math.round(peek.left) };
  });
  expect(m.padding).toBe('600px');
  expect(m.pageRight).toBeLessThanOrEqual(m.peekLeft);
  await page.setViewportSize(PHONE);
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('.nk-main')).paddingRight)).toBe('0px');
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('peekResize')).display)).toBe('none');
});

// ── Dialog ──────────────────────────────────────────────────────────────────

test('dialog: 440px in the middle over a scrim, focus on the first button; Escape closes it and nothing behind it', async ({ page }) => {
  await page.goto('/app.html#peek');
  await settle(page);
  await page.evaluate(() => { location.hash = '#dialog'; });
  await settle(page);
  const d = await box(page, '#trashDialog .nk-dialog');
  expect(d).toMatchObject({ width: 440, left: 420 });
  expect(Math.abs(d.top + d.height / 2 - 400)).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => [document.activeElement.textContent, getComputedStyle(document.getElementById('trashDialog')).zIndex, getComputedStyle(document.getElementById('trashDialog')).backgroundColor])).toEqual(['Cancel', '105', 'rgba(15, 15, 15, 0.5)']);
  await page.keyboard.press('Escape');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('trashDialog').classList.contains('open'), getComputedStyle(document.getElementById('trashDialog')).display, document.getElementById('sidePeek').classList.contains('open')])).toEqual([false, 'none', true]);
});

test('dialog: the page menu asks before the trash; the new view dialog takes a name and Enter', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('#pageMenuBtn');
  await page.click('#pageMenu .nk-menu-item.danger');
  await settle(page);
  await page.click('#trashDialog [data-close="trash"]');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('toastMsg').textContent, document.activeElement.id])).toEqual(['Moved to trash', 'pageMenuBtn']);
  await page.click('#addView');
  await settle(page);
  expect(await page.evaluate(() => document.activeElement.id)).toBe('viewName');
  await page.keyboard.type('Timeline');
  await page.selectOption('#viewLayout', 'Board');
  await page.focus('#viewName');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.getElementById('toastMsg').textContent)).toBe('View “Timeline” created as board');
  // The backdrop closes it without an answer.
  await page.click('#addView');
  await settle(page);
  await page.mouse.click(40, 40);
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('viewDialog').classList.contains('open'), document.getElementById('toastMsg').textContent])).toEqual([false, 'View “Timeline” created as board']);
});

test('dialog on a phone: a bottom sheet with a grabber, the buttons stacked across the width, the confirming one on top', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html#dialog');
  await settle(page);
  const m = await page.evaluate(() => {
    const d = document.querySelector('#trashDialog .nk-dialog'), r = d.getBoundingClientRect(), [cancel, trash] = d.querySelectorAll('.dl-actions button');
    const c = cancel.getBoundingClientRect(), t = trash.getBoundingClientRect();
    return { left: r.left, right: r.right, bottom: Math.round(r.bottom), radius: getComputedStyle(d).borderTopLeftRadius, grabber: getComputedStyle(d, '::before').width, trashOnTop: t.bottom <= c.top, wide: Math.round(c.width) === Math.round(t.width) && c.width > 300 };
  });
  expect(m).toEqual({ left: 0, right: PHONE.width, bottom: PHONE.height, radius: '14px', grabber: '36px', trashOnTop: true, wide: true });
});

// ── Tooltip ─────────────────────────────────────────────────────────────────

test('tooltip: after a moment under the pointer, in the toast\'s colours, below the button and inside the window', async ({ page }) => {
  await page.goto('/app.html');
  await page.hover('#pageMenuBtn');
  expect(await page.evaluate(() => document.getElementById('tooltip').classList.contains('open'))).toBe(false);
  await page.waitForTimeout(550);
  const btn = await box(page, '#pageMenuBtn'), tip = await box(page, '#tooltip');
  expect(await page.evaluate(() => { const t = document.getElementById('tooltip'), toast = document.getElementById('toast'); return [t.textContent, getComputedStyle(t).backgroundColor === getComputedStyle(toast).backgroundColor, getComputedStyle(t).fontSize, getComputedStyle(t).visibility, document.getElementById('pageMenuBtn').getAttribute('aria-describedby')]; }))
    .toEqual(['Style, export and more', true, '12px', 'visible', 'tooltip']);
  expect(tip.top - btn.bottom).toBe(6);
  expect(tip.right).toBe(1280 - 8);   // kept inside the window
  // A press hides it; leaving hides it.
  await page.mouse.down();
  expect(await page.evaluate(() => document.getElementById('tooltip').classList.contains('open'))).toBe(false);
  await page.mouse.up();
  await page.keyboard.press('Escape');
  // The « names its shortcut in .tt-key.
  await page.hover('.nk-sidebar-scroll');
  await page.hover('#sidebarCollapse');
  await page.waitForTimeout(550);
  expect(await page.evaluate(() => [document.getElementById('tooltip').textContent, document.querySelector('#tooltip .tt-key')?.textContent])).toEqual(['Close sidebar⌘\\', '⌘\\']);
  const c = await box(page, '#sidebarCollapse'), t = await box(page, '#tooltip');
  expect(Math.abs((t.left + t.right) / 2 - (c.left + c.right) / 2)).toBeLessThanOrEqual(1);
});

test('tooltip: at once on keyboard focus', async ({ page }) => {
  await page.goto('/app.html');
  await page.focus('#sidebarCollapse');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => [document.activeElement.id, document.getElementById('tooltip').classList.contains('open')])).toEqual(['sidebarCollapse', true]);
});

// ── Disabled buttons (1.10.1) ───────────────────────────────────────────────

test('a disabled button takes the pointer – not-allowed, no hover effect – so its title or tooltip can show', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await page.evaluate(() => {
    document.getElementById('stage').innerHTML = ['primary', 'secondary', 'danger', 'danger-solid'].map(v => `<button class="nk-btn ${v}" id="${v}" disabled>${v}</button>`).join(' ')
      + ' <a class="nk-btn secondary" id="link" href="#x" aria-disabled="true">Link</a>';
  });
  for (const id of ['primary', 'secondary', 'danger', 'danger-solid', 'link']) {
    const style = () => page.evaluate(id => { const cs = getComputedStyle(document.getElementById(id)); return { opacity: cs.opacity, background: cs.backgroundColor, cursor: cs.cursor, events: cs.pointerEvents }; }, id);
    const before = await style();
    expect(before, id).toMatchObject({ opacity: '0.5', cursor: 'not-allowed', events: 'auto' });
    await page.hover(`#${id}`, { force: true });
    await page.waitForTimeout(250);
    expect(await style(), id).toEqual(before);
    expect(await page.evaluate(id => { const el = document.getElementById(id), r = el.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === el; }, id), id).toBe(true);
  }
  // An enabled one still reacts.
  await page.evaluate(() => document.getElementById('primary').removeAttribute('disabled'));
  await page.hover('#primary');
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('primary')).opacity)).toBe('0.88');
});
