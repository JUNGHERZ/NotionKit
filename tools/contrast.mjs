// WCAG contrast helper. `node tools/contrast.mjs` prints the default palette;
// the search functions are used to derive the high-contrast theme.
const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
const lum = c => { const s = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return .2126 * s[0] + .7152 * s[1] + .0722 * s[2]; };
export const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };

// Smallest alpha (2-decimal steps) for `fg` over `bg` reaching `target`.
export const alphaFor = (fg, bg, target = 4.5) => { for (let a = 0.30; a <= 1; a += 0.01) if (ratio(over(fg, a, bg), bg) >= target) return +a.toFixed(2); return 1; };
// Darken/lighten a colour toward black/white until it reaches `target` against `bg`.
export const shiftFor = (fg, bg, target = 4.5, towards = 'black') => {
  const t = towards === 'black' ? [0, 0, 0] : [255, 255, 255];
  for (let k = 0; k <= 1; k += 0.01) { const c = over(t, k, fg); if (ratio(c, bg) >= target) return toHex(c); }
  return toHex(t);
};

if ((process.argv[1] || '').endsWith('contrast.mjs')) {
  const W = hex('#ffffff'), SB = hex('#f7f6f3'), D = hex('#191919');
  const row = (label, a, b) => console.log(label.padEnd(44), ratio(a, b).toFixed(2));
  console.log('--- default palette ---');
  row('text-secondary .65 on white', over(hex('#37352f'), .65, W), W);
  console.log('\n--- high-contrast search (target 4.5) ---');
  console.log('LIGHT');
  console.log('  text-secondary alpha on sidebar:', alphaFor(hex('#37352f'), SB), '| on white:', alphaFor(hex('#37352f'), W));
  console.log('  text-tertiary  alpha on sidebar:', alphaFor(hex('#37352f'), SB));
  console.log('  accent (white on it):           ', shiftFor(hex('#2383e2'), W, 4.5, 'black'));
  console.log('  danger on white:                ', shiftFor(hex('#eb5757'), W, 4.5, 'black'));
  console.log('  tag blue   on #e7f3f8:          ', shiftFor(hex('#337ea9'), hex('#e7f3f8')));
  console.log('  tag green  on #edf3ec:          ', shiftFor(hex('#448361'), hex('#edf3ec')));
  console.log('  tag orange on #fbecdd:          ', shiftFor(hex('#d9730d'), hex('#fbecdd')));
  console.log('  tag purple on #f6f3f9:          ', shiftFor(hex('#9065b0'), hex('#f6f3f9')));
  console.log('DARK');
  console.log('  text-tertiary alpha on #202020: ', alphaFor(hex('#ffffff'), hex('#202020')));
  console.log('  accent (white on it):           ', shiftFor(hex('#529CCA'), W, 4.5, 'black'), '| dark text on default accent:', ratio(hex('#529CCA'), D).toFixed(2));
  console.log('  tag green  on #173B2C:          ', shiftFor(hex('#4DAB9A'), hex('#173B2C'), 4.5, 'white'));
  console.log('  tag purple on #2E2440:          ', shiftFor(hex('#9A6DD7'), hex('#2E2440'), 4.5, 'white'));
  console.log('  tag blue   on #133040:          ', ratio(hex('#529CCA'), hex('#133040')).toFixed(2), '(already ok)');
}
