// Reads the example palettes straight out of theme-override.css so the
// palette switcher on the demo pages can never drift from the template.
// A palette is a `/* Name … */` comment followed by a commented-out CSS
// block containing `:root {`.
import { readFileSync } from 'fs';

export function readPalettes(path = 'theme-override.css') {
  const css = readFileSync(path, 'utf-8');
  const comments = [...css.matchAll(/\/\*([\s\S]*?)\*\//g)].map(m => m[1]);
  const palettes = [{ id: 'default', name: 'Default', light: {}, dark: {} }];
  for (let i = 1; i < comments.length; i++) {
    const body = comments[i];
    if (!/^\s*:root\s*\{/.test(body)) continue;
    // Only the brand/contrast examples: skip the metric/typography/dark-mode demos.
    if (!/--nk-accent|--nk-text-secondary|--nk-on-accent/.test(body)) continue;
    // First line of the preceding comment that is not a banner rule (====).
    const label = comments[i - 1].split('\n').map(l => l.trim()).filter(l => l && !/^[=\-]{4,}$/.test(l))[0]
      .replace(/[—–-].*$/, '').replace(/\s+/g, ' ').trim();
    const name = label.replace(/\b([A-Z]+)\b/g, w => w[0] + w.slice(1).toLowerCase());
    const block = sel => {
      const m = body.match(new RegExp(sel.replace(/[[\]"=]/g, '\\$&') + '\\s*\\{([^}]*)\\}'));
      const out = {};
      if (m) for (const d of m[1].matchAll(/(--nk-[a-z0-9-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
      return out;
    };
    palettes.push({ id: name.toLowerCase().replace(/\s+/g, '-'), name, light: block(':root'), dark: block('[data-theme="dark"]') });
  }
  return palettes;
}

/** Inline script: applies a palette by injecting a <style>, persists it, syncs iframes. */
export const paletteJs = palettes => `
  (function () {
    var PALETTES = ${JSON.stringify(palettes)};
    var KEY = 'nk-palette';
    function css(p) {
      var rule = function (sel, o) { var k = Object.keys(o); return k.length ? sel + '{' + k.map(function (n) { return n + ':' + o[n]; }).join(';') + '}' : ''; };
      return rule(':root', p.light) + rule('[data-theme="dark"]', p.dark);
    }
    function apply(id) {
      var p = PALETTES.filter(function (x) { return x.id === id; })[0] || PALETTES[0];
      var el = document.getElementById('nk-palette-style');
      if (!el) { el = document.createElement('style'); el.id = 'nk-palette-style'; document.head.appendChild(el); }
      el.textContent = css(p);
      try { localStorage.setItem(KEY, p.id); } catch (e) {}
      document.querySelectorAll('[data-palette]').forEach(function (b) { b.classList.toggle('selected', b.dataset.palette === p.id); });
      var sel = document.getElementById('paletteSelect'); if (sel && sel.value !== p.id) sel.value = p.id;
      document.querySelectorAll('iframe[data-theme-sync]').forEach(function (f) { try { f.contentWindow.postMessage({ nkPalette: p.id }, '*'); } catch (e) {} });
    }
    var stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
    apply(stored || 'default');
    window.addEventListener('message', function (e) { if (e.data && e.data.nkPalette) apply(e.data.nkPalette); });
    var sel = document.getElementById('paletteSelect'); if (sel) sel.addEventListener('change', function () { apply(sel.value); });
    var btn = document.getElementById('paletteToggle'), menu = document.getElementById('paletteMenu');
    if (btn && menu) {
      btn.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; });
      menu.addEventListener('click', function (e) { var t = e.target.closest('[data-palette]'); if (t) { apply(t.dataset.palette); menu.hidden = true; } });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.hidden = true; });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.hidden = true; });
    }
    window.nkApplyPalette = apply;
  })();`;

/** The 🎨 button + nk-menu for the site nav. */
export const paletteMenu = (palettes, lang) => `
    <span style="position:relative">
      <button class="nk-topbar-btn nk-theme-toggle" id="paletteToggle" title="${lang === 'de' ? 'Farbschema' : 'Palette'}">🎨</button>
      <div class="nk-pop nk-menu" id="paletteMenu" hidden style="position:absolute;right:0;top:34px;width:210px;z-index:60">
        <div class="nk-menu-label">${lang === 'de' ? 'Farbschema · theme-override.css' : 'Palette · theme-override.css'}</div>
        ${palettes.map(p => `<div class="nk-menu-item" data-palette="${p.id}"><span class="m-icon" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${p.light['--nk-accent'] || 'var(--nk-accent)'};border:1px solid var(--nk-border-strong)"></span>${p.id === 'default' ? (lang === 'de' ? 'Standard' : 'Default') : p.id === 'high-contrast' ? (lang === 'de' ? 'Hoher Kontrast' : 'High contrast') : p.name}</div>`).join('\n        ')}
      </div>
    </span>`;
