// Regression tests for notionkit.css. Each block guards a defect that shipped
// once; the CHANGELOG entry named in the title says what went wrong.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const CLASSES = [...new Set(readFileSync('notionkit.css', 'utf8').match(/\.nk-[a-z0-9-]+/g))].map(c => c.slice(1));
const STAGE = '/test/fixtures/stage.html';

// ── hidden (1.5.2) ──────────────────────────────────────────────────────────

for (const width of [1280, 390]) {
  test(`hidden hides every nk- class · ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(STAGE);
    const shown = await page.evaluate(classes => {
      const stage = document.getElementById('stage');
      const out = [];
      for (const cls of classes) {
        for (const state of ['', ' active', ' open', ' show', ' always', ' fixed']) {
          const el = document.createElement(/btn|switch|tab-bar-item/.test(cls) ? 'button' : 'div');
          el.className = cls + state;
          el.hidden = true;
          stage.appendChild(el);
          if (getComputedStyle(el).display !== 'none') out.push(el.className);
          el.remove();
        }
      }
      return out;
    }, CLASSES);
    expect(CLASSES.length).toBeGreaterThan(100);
    expect(shown, 'these stayed visible with hidden').toEqual([]);
  });
}

test('hidden hides a slotted node that a ::slotted() twin displays', async ({ page }) => {
  await page.goto(STAGE);
  const display = await page.evaluate(async () => {
    const { componentsSheet } = await import('/notionkit-styles.js');
    const host = document.createElement('div');
    document.getElementById('stage').appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [componentsSheet];
    root.innerHTML = '<div class="nk-avatar-group"><slot></slot></div>';
    const shown = Object.assign(document.createElement('span'), { className: 'mini-avatar', textContent: 'MK' });
    const hidden = Object.assign(shown.cloneNode(true), { hidden: true });
    host.append(shown, hidden);
    return [getComputedStyle(shown).display, getComputedStyle(hidden).display];
  });
  expect(display).toEqual(['flex', 'none']);
});

test('hidden="until-found" keeps the browser behaviour', async ({ page }) => {
  await page.goto(STAGE);
  const cs = await page.evaluate(() => {
    const el = Object.assign(document.createElement('div'), { className: 'nk-callout' });
    el.setAttribute('hidden', 'until-found');
    document.getElementById('stage').appendChild(el);
    const s = getComputedStyle(el);
    return { display: s.display, contentVisibility: s.contentVisibility };
  });
  expect(cs.display).not.toBe('none');
  expect(cs.contentVisibility).toBe('hidden');
});

// ── toast (1.5.2) ───────────────────────────────────────────────────────────

async function showToast(page, message = 'Settings saved') {
  await page.evaluate(m => {
    document.getElementById('toastMsg').textContent = m;
    document.getElementById('toast').classList.add('show');
  }, message);
  await page.waitForTimeout(100);
}

// The toast ignores the pointer (pointer-events: none), so elementFromPoint
// would look straight through it. It is made hittable for the probe only;
// then the answer is the topmost painted element – the question here.
async function toastOnTop(page) {
  return page.evaluate(() => {
    const t = document.getElementById('toast');
    t.style.pointerEvents = 'auto';
    const r = t.getBoundingClientRect();
    const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    t.style.pointerEvents = '';
    return t.contains(hit);
  });
}

test('the toast paints above the settings dialog and the command palette', async ({ page }) => {
  await page.goto('/app.html');
  for (const id of ['settingsModal', 'cmdkModal']) {
    await page.evaluate(i => {
      document.querySelectorAll('.nk-modal-backdrop, .nk-cmdk-backdrop').forEach(b => b.classList.remove('open'));
      document.getElementById(i).classList.add('open');
    }, id);
    await showToast(page);
    expect(await toastOnTop(page), `toast above #${id}`).toBe(true);
  }
});

for (const floating of [false, true]) {
  test(`on a phone the toast clears the ${floating ? 'floating ' : ''}tab bar`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/app.html');
    if (floating) await page.evaluate(() => document.getElementById('tabBar').classList.add('floating'));
    await showToast(page, 'Einstellungen gespeichert');
    const g = await page.evaluate(() => {
      const t = document.getElementById('toast').getBoundingClientRect();
      const b = document.getElementById('tabBar').getBoundingClientRect();
      return { gap: b.top - t.bottom, height: t.height };
    });
    expect(g.gap, 'space between toast and tab bar').toBeGreaterThanOrEqual(8);
    expect(g.height, 'a short message stays on one line').toBeLessThan(40);
    expect(await toastOnTop(page)).toBe(true);
  });
}

test('without a tab bar the toast keeps its 20px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(STAGE);
  const bottom = await page.evaluate(() => {
    document.getElementById('stage').innerHTML = '<div class="nk-toast show">✓ <span>Saved</span></div>';
    return innerHeight - document.querySelector('.nk-toast').getBoundingClientRect().bottom;
  });
  expect(bottom).toBeCloseTo(20, 0);
});

// ── first line (1.5.2) ──────────────────────────────────────────────────────

test('checkbox and switch sit beside the first line of their label', async ({ page }) => {
  await page.goto(STAGE);
  const r = await page.evaluate(() => {
    document.getElementById('stage').innerHTML = `
      <label class="nk-check" id="c1"><input type="checkbox">One line</label>
      <label class="nk-check" id="c2" style="width:180px"><input type="checkbox">A consent label long enough to wrap over three lines in this narrow box</label>
      <label class="nk-check" id="c3" style="width:180px;line-height:1.5"><input type="radio">A radio label long enough to wrap over three lines at 1.5</label>
      <label class="nk-switch-label" id="s1"><button class="nk-switch" role="switch" aria-checked="true"></button><span>One line</span></label>
      <label class="nk-switch-label" id="s2" style="width:180px"><button class="nk-switch" role="switch" aria-checked="false"></button><span>A switch label long enough to wrap over three lines</span></label>`;
    const firstLine = node => {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()];
      const top = Math.min(...rects.map(x => x.top));
      const first = rects.find(x => Math.abs(x.top - top) < 1);
      return { centre: (first.top + first.bottom) / 2, lines: new Set(rects.map(x => Math.round(x.top))).size };
    };
    const out = {};
    for (const id of ['c1', 'c2', 'c3', 's1', 's2']) {
      const label = document.getElementById(id);
      const control = label.querySelector('input, .nk-switch').getBoundingClientRect();
      const text = firstLine(id.startsWith('c') ? label.lastChild : label.querySelector('span'));
      out[id] = { offset: (control.top + control.bottom) / 2 - text.centre, lines: text.lines };
    }
    return out;
  });
  for (const id of ['c2', 'c3', 's2']) expect(r[id].lines, `${id} wraps`).toBeGreaterThan(1);
  for (const [id, v] of Object.entries(r)) expect(Math.abs(v.offset), `${id}: control centre vs first line`).toBeLessThanOrEqual(1);
});

// ── empty state actions (1.5.2) ─────────────────────────────────────────────

test('several empty-state actions sit 8px apart and wrap centred', async ({ page }) => {
  await page.goto(STAGE);
  const r = await page.evaluate(() => {
    const actions = '<div class="e-actions"><button class="nk-btn primary small">New entry</button><button class="nk-btn secondary small">Import data</button></div>';
    document.getElementById('stage').innerHTML = `<div class="nk-empty" id="e1"><div class="e-title">Nothing yet</div>${actions}</div>`
      + `<div class="nk-empty" id="e2" style="width:170px;margin-top:12px">${actions}</div>`;
    const btns = id => [...document.querySelectorAll(`#${id} .nk-btn`)].map(b => b.getBoundingClientRect());
    const [a, b] = btns('e1'), [c, d] = btns('e2');
    const box = document.getElementById('e1').getBoundingClientRect();
    return { gap: b.left - a.right, sameRow: Math.abs(a.top - b.top) < 1, centre: (a.left + b.right) / 2 - (box.left + box.right) / 2, rowGap: d.top - c.bottom };
  });
  expect(r.sameRow).toBe(true);
  expect(r.gap).toBeCloseTo(8, 0);
  expect(Math.abs(r.centre)).toBeLessThanOrEqual(1);
  expect(r.rowGap).toBeCloseTo(8, 0);
});

// ── date and time fields (1.5.2) ────────────────────────────────────────────
// The defect was iOS-only (checked in the iOS 26.3 and 27.0 simulators); here
// the guard is that the native appearance stays off and the fields keep to
// their column in a .nk-fields row.

test('date and time fields drop the native appearance and keep to their column', async ({ page }) => {
  await page.goto(STAGE);
  const r = await page.evaluate(() => {
    document.getElementById('stage').innerHTML = '<div class="nk-fields" style="width:360px">'
      + ['date', 'time', 'datetime-local', 'month'].map(t => `<div class="nk-field"><div><div class="f-label">${t}</div></div><div class="f-control"><input class="nk-input wide" type="${t}"></div></div>`).join('')
      + '</div>';
    return [...document.querySelectorAll('.nk-field')].map(f => {
      const input = f.querySelector('input');
      return { type: input.type, appearance: getComputedStyle(input).appearance, over: input.getBoundingClientRect().right - f.getBoundingClientRect().right };
    });
  });
  for (const f of r) {
    expect(f.appearance, f.type).toBe('none');
    expect(f.over, `${f.type} past its column`).toBeLessThanOrEqual(0.5);
  }
});
