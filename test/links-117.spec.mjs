// 1.17.0: LearnHub's findings 6 and 16 in the stylesheet – a step's label and
// a gallery card as links, to open in a new tab or to copy the address of,
// looking the same as the button and the card they replace.
import { test, expect } from '@playwright/test';

const settle = page => page.waitForTimeout(350);
const stage = (page, html) => page.evaluate(h => { document.getElementById('stage').innerHTML = h; }, html);

test('a step label as a link looks like the button: its colour, no underline at rest, the same box; underlined on hover', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  await stage(page, `<ol class="nk-steps" style="width:320px">
    <li class="nk-step done" id="s1"><span class="st-mark">✓</span><button type="button" class="st-label" id="b">Choose a provider<span class="st-desc">Anthropic</span></button></li>
    <li class="nk-step done" id="s2"><span class="st-mark">✓</span><a class="st-label" href="#chapter-2" id="a">Choose a provider<span class="st-desc">Anthropic</span></a></li>
    <li class="nk-step current" aria-current="step"><span class="st-mark">3</span><a class="st-label" href="#chapter-3" id="c">Test the connection</a></li></ol>`);
  const look = id => page.evaluate(id => {
    const el = document.getElementById(id), cs = getComputedStyle(el), r = el.getBoundingClientRect(), li = el.closest('li');
    return { color: cs.color, li: getComputedStyle(li).color, line: cs.textDecorationLine, font: `${cs.fontSize} ${cs.fontWeight}`, cursor: cs.cursor, left: Math.round(r.left - li.getBoundingClientRect().left), width: Math.round(r.width), height: Math.round(r.height) };
  }, id);
  const button = await look('b'), link = await look('a');
  expect(link).toEqual(button);
  expect(link.color).toBe(link.li);
  expect(link.line).toBe('none');
  expect(link.cursor).toBe('pointer');
  // The current step's link takes its weight and colour.
  expect(await look('c')).toMatchObject({ font: '14px 500', line: 'none' });
  await page.hover('#a');
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('a')).textDecorationLine)).toBe('underline');
  await page.focus('#a');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await settle(page);
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('a')).outlineStyle)).toBe('solid');
});

test('a gallery card as a link fills its .card-item: the same size, place and look as the card beside it', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const body = n => `<div class="nk-cover"></div><div class="card-title">🧭 Course ${n}</div><div class="card-meta"><span class="nk-tag green">Open</span><span>📅 30.10.2026</span></div>`;
  await stage(page, `<div style="width:560px"><div class="nk-gallery" role="list" id="g">
    <div class="nk-card" role="listitem" tabindex="0" id="d">${body(1)}</div>
    <div class="card-item" role="listitem" id="w"><a class="nk-card" href="#course-2" id="l">${body(2)}</a></div></div></div>`);
  const m = await page.evaluate(() => {
    const box = id => { const r = document.getElementById(id).getBoundingClientRect(); return [Math.round(r.top), Math.round(r.width), Math.round(r.height)]; };
    const cs = getComputedStyle(document.getElementById('l')), ds = getComputedStyle(document.getElementById('d'));
    return { div: box('d'), link: box('l'), item: box('w'), look: [cs.color === ds.color, cs.textDecorationLine, cs.borderRadius === ds.borderRadius, cs.boxShadow === ds.boxShadow, cs.cursor] };
  });
  expect(m.link).toEqual(m.div);
  expect(m.item).toEqual(m.link);
  expect(m.look).toEqual([true, 'none', true, true, 'pointer']);
  // A taller card beside it: the link card stretches with its row, like the others.
  await page.evaluate(() => document.querySelector('#d .card-title').insertAdjacentHTML('beforeend', '<br>with a second line'));
  await settle(page);
  expect(await page.evaluate(() => Math.round(document.getElementById('l').getBoundingClientRect().height) === Math.round(document.getElementById('d').getBoundingClientRect().height))).toBe(true);
});
