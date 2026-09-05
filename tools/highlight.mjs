// Minimal HTML highlighter that emits the same .tag / .attr hooks that
// .nk-code already styles — so the code blocks are themed by the library
// itself rather than by a third-party highlighter.
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function highlightHtml(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) { out += esc(src.slice(i)); break; }
    out += esc(src.slice(i, lt));
    const gt = src.indexOf('>', lt);
    if (gt === -1) { out += esc(src.slice(lt)); break; }
    const tag = src.slice(lt, gt + 1);
    const m = tag.match(/^<(\/?)([a-zA-Z0-9-]+)([\s\S]*?)(\/?)>$/);
    if (!m) { out += esc(tag); i = gt + 1; continue; }
    const [, slash, name, attrs, selfClose] = m;
    let a = '';
    // attr="value" -> the name is coloured, the value stays plain
    const re = /([a-zA-Z-]+)(=)("[^"]*"|'[^']*')?/g;
    let last = 0, mm;
    while ((mm = re.exec(attrs))) {
      a += esc(attrs.slice(last, mm.index));
      a += `<span class="attr">${esc(mm[1] + mm[2])}</span>${esc(mm[3] || '')}`;
      last = mm.index + mm[0].length;
    }
    a += esc(attrs.slice(last));
    out += `<span class="tag">${esc('<' + slash + name)}</span>${a}<span class="tag">${esc(selfClose + '>')}</span>`;
    i = gt + 1;
  }
  return out;
}

/** Re-indents generated markup so the code block reads like hand-written HTML. */
export function tidy(src) {
  return src.split('\n').map(l => l.replace(/\s+$/, '')).filter((l, i, a) => l.trim() || (i > 0 && i < a.length - 1)).join('\n').trim();
}
