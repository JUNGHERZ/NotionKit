// Dates (1.9.0): the date picker (.nk-calendar) – in a popover, as a sheet on
// a phone, with weeks, ranges, days not worked and marks – and the calendar
// view of the database, in the stylesheet and in the demo that uses them.
import { test, expect } from '@playwright/test';

const PHONE = { width: 390, height: 844 };
const settle = page => page.waitForTimeout(350);

/** Measures the demo's date picker. */
const picker = page => page.evaluate(() => {
  const pop = document.getElementById('datePicker'), r = pop.getBoundingClientRect(), cs = getComputedStyle(pop);
  const days = [...pop.querySelectorAll('.cal-day')];
  return {
    visible: cs.visibility === 'visible', left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom),
    title: pop.querySelector('.cal-title').textContent, cell: days[0].getBoundingClientRect().width, days: days.length,
    selected: pop.querySelector('.cal-day.selected')?.dataset.date ?? null,
  };
});

// ── The stylesheet ──────────────────────────────────────────────────────────

test('date picker: 36px cells, seven and the week column fill a popover; range, off, today and marks read at a glance', async ({ page }) => {
  await page.goto('/docs.html');
  const m = await page.evaluate(() => {
    const [single, range] = document.querySelectorAll('#nk-calendar .nk-calendar');
    const pop = single.closest('.nk-pop'), inner = pop.clientWidth - 20, grid = single.querySelector('.cal-grid').getBoundingClientRect();
    const day = sel => range.querySelector(sel) || single.querySelector(sel), cs = el => getComputedStyle(el);
    const start = range.querySelector('.cal-day.start'), mid = range.querySelector('.cal-day.in-range'), end = range.querySelector('.cal-day.end');
    const dot = single.querySelector('.cal-marks i');
    return {
      cell: single.querySelector('.cal-day').getBoundingClientRect().width, gridWidth: grid.width, inner,
      startRadius: [cs(start).borderTopLeftRadius, cs(start).borderTopRightRadius], midRadius: cs(mid).borderTopLeftRadius,
      band: cs(mid).backgroundColor !== 'rgba(0, 0, 0, 0)' && cs(mid).backgroundColor !== cs(start).backgroundColor,
      endRadius: [cs(end).borderTopLeftRadius, cs(end).borderTopRightRadius],
      sameRow: Math.abs(start.getBoundingClientRect().top - end.getBoundingClientRect().top) < 1,
      off: cs(day('.cal-day.off:not(.out)')).color === cs(day('.cal-day.out')).color,
      today: cs(day('.cal-day.today')).color, danger: cs(document.documentElement).getPropertyValue('--nk-danger').trim(),
      dot: [dot.getBoundingClientRect().width, dot.getBoundingClientRect().height],
      holiday: single.querySelector('.cal-day[title]')?.classList.contains('off'),
    };
  });
  expect(m).toMatchObject({ cell: 36, gridWidth: 276, inner: 276, startRadius: ['6px', '0px'], midRadius: '0px', band: true, endRadius: ['0px', '6px'], sameRow: true, off: true, dot: [4, 4], holiday: true });
  expect(m.today).toBe('rgb(205, 60, 58)');   // --nk-danger
});

test('calendar view: seven columns share the width after the week column; today on a red pill; days of other months washed', async ({ page }) => {
  await page.goto('/docs.html');
  const m = await page.evaluate(() => {
    const v = document.querySelector('#nk-calendar-view .nk-calendar-view'), days = [...v.querySelectorAll('.cv-day')];
    const widths = new Set(days.slice(0, 7).map(d => Math.round(d.getBoundingClientRect().width)));
    const today = v.querySelector('.cv-day.today .cv-num'), out = v.querySelector('.cv-day.out'), inMonth = v.querySelector('.cv-day:not(.out)');
    const item = v.querySelector('.cv-item');
    return { widths: widths.size, week: Math.round(v.querySelector('.cv-week').getBoundingClientRect().width), height: Math.round(days[0].getBoundingClientRect().height),
      pill: getComputedStyle(today).backgroundColor, washed: getComputedStyle(out).backgroundColor !== getComputedStyle(inMonth).backgroundColor,
      ellipsis: item.scrollWidth > item.clientWidth || getComputedStyle(item).textOverflow === 'ellipsis' };
  });
  expect(m).toEqual({ widths: 1, week: 32, height: 112, pill: 'rgb(205, 60, 58)', washed: true, ellipsis: true });
});

// ── The demo ────────────────────────────────────────────────────────────────

test('Due opens the picker under it, on the month of its date; a day sets the date and closes it', async ({ page }) => {
  await page.goto('/app.html#date');
  await settle(page);
  const due = await page.evaluate(() => document.getElementById('pageDue').getBoundingClientRect());
  const p = await picker(page);
  expect(p).toMatchObject({ visible: true, title: 'June 2026', cell: 36, days: 42, selected: '2026-06-02' });
  expect(p.top - Math.round(due.bottom)).toBe(6);
  expect(p.right).toBe(Math.round(due.right));
  // Weekends are greyed, the projects' due dates carry a dot, week 23 opens the grid.
  expect(await page.evaluate(() => {
    const pop = document.getElementById('datePicker');
    return [pop.querySelector('[data-date="2026-06-06"]').classList.contains('off'), !!pop.querySelector('[data-date="2026-06-02"] .cal-marks'), pop.querySelector('.cal-week').textContent];
  })).toEqual([true, true, '23']);
  await page.click('#datePicker .cal-nav[data-cal="-1"]');
  expect((await picker(page)).title).toBe('May 2026');
  expect(await page.evaluate(() => document.querySelector('#datePicker [data-date="2026-05-25"]').title)).toBe('Whit Monday');
  await page.click('#datePicker [data-date="2026-05-29"]');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('pageDue').textContent, getComputedStyle(document.getElementById('datePicker')).visibility])).toEqual(['29 May 2026', 'hidden']);
});

test('a due cell opens the picker for its row; the new date reaches table, board and list', async ({ page }) => {
  await page.goto('/app.html');
  await page.click('#tableBody [data-due] >> nth=0');
  await settle(page);
  expect((await picker(page)).selected).toBe('2026-05-20');
  await page.click('#datePicker [data-date="2026-05-27"]');
  expect(await page.evaluate(() => [document.querySelector('#tableBody [data-due]').textContent, [...document.querySelectorAll('#view-board .card-meta')].some(m => m.textContent.includes('27.05.2026')), [...document.querySelectorAll('#view-list .l-meta')].some(m => m.textContent.includes('27.05.2026'))])).toEqual(['27.05.2026', true, true]);
});

test('the calendar view shows the rows on their due dates; ‹ › change the month; a card opens the side peek', async ({ page }) => {
  await page.goto('/app.html#calendar');
  await settle(page);
  const view = () => page.evaluate(() => {
    const v = document.getElementById('view-calendar');
    return { hidden: v.hidden, title: v.querySelector('.cv-title').textContent, items: [...v.querySelectorAll('.cv-item')].map(i => `${i.closest('.cv-day').querySelector('.cv-num').textContent}:${i.textContent}`) };
  });
  expect(await view()).toEqual({ hidden: false, title: 'May 2026', items: ['20:🗃️ Database Table-View'] });
  await page.click('#view-calendar .cal-nav[data-cv="1"]');
  expect(await view()).toMatchObject({ title: 'June 2026', items: ['2:▤ Board-View & Drag-and-Drop'] });
  await page.click('#view-calendar .cv-item');
  await settle(page);
  expect(await page.evaluate(() => [document.getElementById('sidePeek').classList.contains('open'), document.getElementById('peekTitle').textContent])).toEqual([true, '▤ Board-View & Drag-and-Drop']);
});

test('on a phone the picker is a sheet with 44px cells, and the calendar view keeps seven columns', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/app.html#date');
  await settle(page);
  const p = await picker(page);
  expect(p).toMatchObject({ left: 0, right: PHONE.width, bottom: PHONE.height, cell: 44 });
  await page.goto('about:blank');   // a fresh load: with the picker open, the hash's tab click would be an outside click
  await page.goto('/app.html#calendar');
  await settle(page);
  const v = await page.evaluate(() => {
    const days = [...document.querySelectorAll('#view-calendar .cv-day')];
    return { perRow: new Set(days.slice(0, 7).map(d => Math.round(d.getBoundingClientRect().top))).size, height: Math.round(days[0].getBoundingClientRect().height), sw: document.documentElement.scrollWidth };
  });
  expect(v).toEqual({ perRow: 1, height: 64, sw: PHONE.width });
});
