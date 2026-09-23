// The minified stylesheet and notionkit-styles.js carry every rule of
// notionkit.css. Up to 1.7.0 clean-css closed the 860px block at the first
// @starting-style – the phone rules after it applied on every screen – and
// wrote the reduced-motion durations as `NaNs`. Here the browser parses
// source and output and compares every declaration where it applies: the
// at-rules around it, the selector, the property and the value.
import { test, expect } from '@playwright/test';

const collect = () => {
  // Minifiers may drop spaces after commas, a leading zero or write
  // translateX(a) as translate(a); anything else counts as a difference.
  const norm = v => v.replace(/\s*,\s*/g, ',').replace(/(^|[\s(,])0\.(\d)/g, '$1.$2')
    .replace(/translateX\(([^,()]+)\)/g, 'translate($1)').replace(/\s+/g, ' ').trim();
  const split = sel => { const out = []; let depth = 0, cur = ''; for (const ch of sel) { if ('(['.includes(ch)) depth++; if (')]'.includes(ch)) depth--; if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += ch; } out.push(cur.trim()); return out; };
  const head = r => r instanceof CSSMediaRule ? `@media ${r.conditionText}` : r instanceof CSSSupportsRule ? `@supports ${r.conditionText}`
    : r instanceof CSSLayerBlockRule ? `@layer ${r.name}` : r instanceof CSSContainerRule ? `@container ${r.conditionText}`
    : r instanceof CSSKeyframesRule ? `@keyframes ${r.name}` : r instanceof CSSKeyframeRule ? r.keyText
    : r.constructor.name === 'CSSStartingStyleRule' ? '@starting-style' : r.constructor.name;
  const declarations = (ctx, style, out) => { for (let i = 0; i < style.length; i++) { const p = style[i]; out.push(`${ctx} { ${p}: ${norm(style.getPropertyValue(p))}${style.getPropertyPriority(p) ? ' !important' : ''} }`); } };
  const walk = (rules, ctx, out) => {
    for (const r of rules) {
      if (r instanceof CSSStyleRule) {
        for (const sel of split(r.selectorText)) declarations(`${ctx}${sel}`, r.style, out);
        if (r.cssRules.length) walk(r.cssRules, `${ctx}${r.selectorText} ⟩ `, out);
      } else if (r instanceof CSSKeyframeRule) declarations(`${ctx}${r.keyText}`, r.style, out);
      else if (r.cssRules) { out.push(`${ctx}${head(r)}`); walk(r.cssRules, `${ctx}${head(r)} ⟩ `, out); }
      else out.push(`${ctx}${r.cssText}`);
    }
    return out;
  };
  return text => { const sheet = new CSSStyleSheet(); sheet.replaceSync(text); return walk(sheet.cssRules, '', []).sort(); };
};

/** Entries only in `a` and only in `b`, counted as multisets. */
function difference(a, b) {
  const left = new Map();
  for (const x of a) left.set(x, (left.get(x) || 0) + 1);
  const onlyB = [];
  for (const x of b) { const n = left.get(x); if (n) left.set(x, n - 1); else onlyB.push(x); }
  const onlyA = [...left].flatMap(([x, n]) => Array(n).fill(x));
  return { onlyA, onlyB };
}

test('notionkit.min.css has every declaration of notionkit.css, in the same at-rules', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const [source, minified] = await page.evaluate(async (collectSrc) => {
    const parse = (0, eval)(`(${collectSrc})`)();
    const text = url => fetch(url, { cache: 'no-store' }).then(r => r.text());
    return [parse(await text('/notionkit.css')), parse(await text('/notionkit.min.css'))];
  }, collect.toString());
  const { onlyA, onlyB } = difference(source, minified);
  expect(source.length).toBeGreaterThan(5000);
  expect({ lost: onlyA.slice(0, 12), added: onlyB.slice(0, 12) }).toEqual({ lost: [], added: [] });
});

test('notionkit-styles.js: css is the minified file, tokens and components together are the source', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const r = await page.evaluate(async (collectSrc) => {
    const parse = (0, eval)(`(${collectSrc})`)();
    const m = await import('/notionkit-styles.js');
    const min = await fetch('/notionkit.min.css', { cache: 'no-store' }).then(r => r.text());
    const source = parse(await fetch('/notionkit.css', { cache: 'no-store' }).then(r => r.text()));
    return { same: m.css === min, source, split: [...parse(m.tokensCss), ...parse(m.componentsCss)].sort(), tokenRules: m.tokensSheet.cssRules.length };
  }, collect.toString());
  expect(r.same).toBe(true);
  expect(r.tokenRules).toBe(2);
  const { onlyA, onlyB } = difference(r.source, r.split);
  expect({ lost: onlyA.slice(0, 12), added: onlyB.slice(0, 12) }).toEqual({ lost: [], added: [] });
});

test('the minified phone rules stay inside the 860px block and reduced motion keeps its durations', async ({ page }) => {
  await page.goto('/test/fixtures/stage.html');
  const r = await page.evaluate(async () => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(await fetch('/notionkit.min.css', { cache: 'no-store' }).then(r => r.text()));
    const top = [...sheet.cssRules];
    const outside = top.filter(x => x instanceof CSSStyleRule).map(x => x.selectorText);
    const reduce = top.find(x => x instanceof CSSMediaRule && /reduce/.test(x.conditionText));
    const durations = [...reduce.cssRules].filter(x => x instanceof CSSStyleRule).map(x => x.style.transitionDuration).filter(Boolean);
    return { tabBarOutside: outside.includes('.nk-tab-bar') && top.some(x => x instanceof CSSStyleRule && x.selectorText === '.nk-tab-bar' && x.style.display === 'flex'), durations };
  });
  expect(r).toEqual({ tabBarOutside: false, durations: ['0.01ms'] });
});
