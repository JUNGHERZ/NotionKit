// Links and peeks (1.8.0): the bookmark, the copy field, the side peek that
// becomes a sheet on a phone, and pictures on the profile row – in the
// stylesheet and in the demo that uses them.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);

/** A PNG made in the page, as a file for an <input type="file">. */
async function pngFile(page, width, height) {
  const b64 = await page.evaluate(([w, h]) => {
    const c = Object.assign(document.createElement('canvas'), { width: w, height: h });
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#2383e2'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#eb5757'; ctx.fillRect(0, 0, w / 2, h);
    return c.toDataURL('image/png').split(',')[1];
  }, [width, height]);
  return { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') };
}

// ── Bookmark ────────────────────────────────────────────────────────────────

test('bookmark: one link, 106px of text, the image in a third – 240px at most – title on one line', async ({ page }) => {
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const b = document.querySelector('.nk-bookmark'), r = b.getBoundingClientRect(), cover = b.querySelector('.bm-cover').getBoundingClientRect();
    const title = b.querySelector('.bm-title'), desc = b.querySelector('.bm-desc').getBoundingClientRect();
    return { tag: b.tagName, height: r.height, third: Math.abs(cover.width - Math.min(240, (r.width - 2) * 0.33)) < 0.5, coverHeight: cover.height, titleOneLine: title.getBoundingClientRect().height, clamp: desc.height <= 32, img: b.querySelector('.bm-cover img').naturalWidth > 0 };
  });
  expect(m).toEqual({ tag: 'A', height: 108, third: true, coverHeight: 106, titleOneLine: 24, clamp: true, img: true });
});

test('bookmark on a phone: the image keeps its third, nothing runs past the column', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html');
  const m = await page.evaluate(() => {
    const b = document.querySelector('.nk-bookmark').getBoundingClientRect(), cover = document.querySelector('.nk-bookmark .bm-cover').getBoundingClientRect();
    const title = document.querySelector('.nk-bookmark .bm-title');
    return { third: Math.abs(cover.width - (b.width - 2) * 0.33) < 0.5, ellipsis: title.scrollWidth > title.clientWidth, right: b.right <= 390 - 23, sw: document.documentElement.scrollWidth };
  });
  expect(m).toEqual({ third: true, ellipsis: true, right: true, sw: PHONE.width });
});

// ── Copy field ──────────────────────────────────────────────────────────────

test('copy field: as tall as an input, the value cut with an ellipsis, Copy writes the clipboard and turns green', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/test/fixtures/stage.html');
  const m = await page.evaluate(() => {
    const stage = document.getElementById('stage');
    stage.innerHTML = '<input class="nk-input" id="i"><div class="nk-copy-field" id="f" style="width:220px"><span class="cf-value">https://monahilft.notionkit.app/very/long/path</span><button class="cf-btn">Copy</button></div>';
    const f = document.getElementById('f'), v = f.querySelector('.cf-value');
    return { input: document.getElementById('i').getBoundingClientRect().height, field: f.getBoundingClientRect().height, cut: v.scrollWidth > v.clientWidth, btn: f.querySelector('.cf-btn').getBoundingClientRect().right <= f.getBoundingClientRect().right };
  });
  expect(m).toEqual({ input: 32, field: 32, cut: true, btn: true });

  await page.goto('/app.html#settings');
  await page.click('[data-pane="allgemein"]');
  const btn = page.locator('#pane-allgemein [data-copy]');
  await btn.click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://monahilft.notionkit.app');
  expect(await btn.evaluate(b => [b.textContent, b.classList.contains('copied'), getComputedStyle(b).color])).toEqual(['Copied', true, 'rgb(68, 131, 97)']);
  await page.waitForTimeout(1700);
  expect(await btn.evaluate(b => [b.textContent, b.classList.contains('copied')])).toEqual(['Copy', false]);
});

// ── Side peek ───────────────────────────────────────────────────────────────

test('side peek: a row opens at the right edge, full height, 560px, title in 32px; the table stays usable', async ({ page }) => {
  await page.goto('/app.html');
  const peekState = () => page.evaluate(() => {
    const bd = document.getElementById('sidePeek'), p = bd.querySelector('.nk-peek').getBoundingClientRect();
    return { display: getComputedStyle(bd).display, left: Math.round(p.left), top: p.top, bottom: p.bottom, width: p.width, title: document.getElementById('peekTitle').textContent, size: getComputedStyle(document.getElementById('peekTitle')).fontSize };
  });
  expect((await peekState()).display).toBe('none');
  await page.click('#tableBody .row-title >> nth=0');
  await settle(page);
  expect(await peekState()).toEqual({ display: 'block', left: 1280 - 560, top: 0, bottom: 800, width: 560, title: '🗃️ Database Table-View', size: '32px' });
  // No scrim: the backdrop lets clicks through to the page.
  expect(await page.evaluate(() => [getComputedStyle(document.getElementById('sidePeek')).pointerEvents, getComputedStyle(document.getElementById('sidePeek')).backgroundColor])).toEqual(['none', 'rgba(0, 0, 0, 0)']);
  // Another row swaps the content without closing.
  await page.click('#tableBody .row-title >> nth=1');
  await settle(page);
  expect((await peekState()).title).toBe('▤ Board-View & Drag-and-Drop');
  // The page's own title keeps its 40px.
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('#view-page .nk-page-title')).fontSize)).toBe('40px');
});

test('side peek: », Escape and a click elsewhere close it; the click still reaches the page', async ({ page }) => {
  await page.goto('/app.html#peek');
  await settle(page);
  const open = () => page.evaluate(() => document.getElementById('sidePeek').classList.contains('open'));
  expect(await open()).toBe(true);
  await page.click('#peekClose');
  expect(await open()).toBe(false);
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('sidePeek')).display)).toBe('none');
  await page.click('#tableBody .row-title >> nth=0');
  await page.keyboard.press('Escape');
  expect(await open()).toBe(false);
  await page.click('#tableBody .row-title >> nth=0');
  await settle(page);
  await page.evaluate(() => { window.hits = 0; document.querySelector('.nk-sidebar [data-view="home"]').addEventListener('click', () => window.hits++); });
  await page.click('.nk-sidebar [data-view="home"]');
  expect(await open()).toBe(false);
  expect(await page.evaluate(() => window.hits)).toBe(1);
});

test('side peek on a phone: a bottom sheet over a dimmed page, title in 28px, a tap on the page closes it', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html#peek');
  await settle(page);
  const m = await page.evaluate(() => {
    const bd = document.getElementById('sidePeek'), p = bd.querySelector('.nk-peek'), r = p.getBoundingClientRect(), cs = getComputedStyle(p);
    const bar = document.getElementById('tabBar').getBoundingClientRect();
    return { left: r.left, width: r.width, bottom: Math.round(r.bottom), radius: cs.borderTopLeftRadius, scrim: getComputedStyle(bd).backgroundColor !== 'rgba(0, 0, 0, 0)', title: getComputedStyle(document.getElementById('peekTitle')).fontSize, overBar: p.contains(document.elementFromPoint(bar.left + 20, bar.top + 20)), sw: document.documentElement.scrollWidth };
  });
  expect(m).toEqual({ left: 0, width: PHONE.width, bottom: PHONE.height, radius: '14px', scrim: true, title: '28px', overBar: true, sw: PHONE.width });
  await page.mouse.click(200, 30);
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('sidePeek')).display)).toBe('none');
});

test('side peek lies under the floating menus and over the tab bar', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const z = await page.evaluate(() => {
    document.getElementById('stage').innerHTML = '<div class="nk-peek-backdrop open" id="p"></div><div class="nk-pop nk-menu floating open" id="m"></div><div class="nk-tab-bar always" id="t"></div>';
    const zi = id => +getComputedStyle(document.getElementById(id)).zIndex;
    return [zi('t'), zi('p'), zi('m')];
  });
  expect(z[0]).toBeLessThan(z[1]);
  expect(z[1]).toBeLessThan(z[2]);
});

// ── Pictures ────────────────────────────────────────────────────────────────

test('profile picture: a chosen file is scaled, shown cropped to the circle, and can be removed', async ({ page }) => {
  await page.goto('/app.html#settings');
  const row = page.locator('#pane-profil [data-picker]');
  await expect(row.locator('.pr-remove')).toBeHidden();
  await row.locator('input[type=file]').setInputFiles(await pngFile(page, 1600, 800));
  await expect(row.locator('.big-avatar img')).toHaveCount(1);
  const m = await row.evaluate(r => {
    const img = r.querySelector('.big-avatar img'), box = r.querySelector('.big-avatar');
    return { w: img.naturalWidth, h: img.naturalHeight, jpeg: img.src.startsWith('data:image/jpeg'), fit: getComputedStyle(img).objectFit, round: getComputedStyle(box).borderTopLeftRadius, size: [box.clientWidth, box.clientHeight] };
  });
  expect(m).toEqual({ w: 512, h: 256, jpeg: true, fit: 'cover', round: '50%', size: [56, 56] });
  await expect(row.locator('[data-choose]')).toHaveText('Change image');
  await row.locator('.pr-remove').click();
  await expect(row.locator('.big-avatar')).toHaveText('MK');
  await expect(row.locator('.pr-remove')).toBeHidden();
});

test('workspace icon: the rounded square, kept as PNG', async ({ page }) => {
  await page.goto('/app.html#settings');
  await page.click('[data-pane="allgemein"]');
  const row = page.locator('#pane-allgemein [data-picker]');
  expect(await row.locator('.big-avatar').evaluate(b => getComputedStyle(b).borderTopLeftRadius)).toBe('8px');
  await row.locator('input[type=file]').setInputFiles(await pngFile(page, 300, 300));
  await expect(row.locator('.big-avatar img')).toHaveCount(1);
  expect(await row.locator('.big-avatar img').evaluate(i => [i.naturalWidth, i.src.startsWith('data:image/png')])).toEqual([256, true]);
});
