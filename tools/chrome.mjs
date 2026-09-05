// Page chrome for the demo/docs pages. Deliberately prefixed `site-`, not
// `nk-`: this is the wrapper around the library, not part of it. Every value
// comes from a --nk-* token so the chrome themes along with the components.
import { readPalettes, paletteJs, paletteMenu } from './palettes.mjs';
const PALETTES = readPalettes();

export const CHROME_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  a { color: inherit; }

  .site-nav {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; gap: 14px;
    padding: 0 clamp(16px, 4vw, 40px); height: 56px;
    background: color-mix(in srgb, var(--nk-bg) 88%, transparent);
    backdrop-filter: saturate(180%) blur(12px);
    border-bottom: 1px solid var(--nk-border);
  }
  .site-brand { display: flex; align-items: center; gap: 9px; font-weight: 600; text-decoration: none; font-size: 15px; }
  .site-brand .mark {
    width: 24px; height: 24px; border-radius: 6px; font-size: 13px;
    background: linear-gradient(135deg, var(--nk-decor-purple), var(--nk-decor-blue));
    color: var(--nk-on-accent); display: flex; align-items: center; justify-content: center;
  }
  .site-nav-links { display: flex; gap: 2px; margin-left: 18px; }
  .site-nav-links a {
    padding: 5px 10px; border-radius: var(--nk-radius); text-decoration: none;
    color: var(--nk-text-secondary); font-size: 13.5px;
  }
  .site-nav-links a:hover { background: var(--nk-bg-hover); color: var(--nk-text); }
  .site-nav-links a.current { color: var(--nk-text); font-weight: 500; }
  .site-nav-right { margin-left: auto; display: flex; align-items: center; gap: 4px; }
  #paletteMenu .nk-menu-item.selected { background: var(--nk-bg-active); font-weight: 500; }

  .site-wrap { max-width: 1080px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px); }
  .site-section { padding: clamp(48px, 8vw, 96px) 0; }
  .site-section + .site-section { border-top: 1px solid var(--nk-border); }
  .site-h2 { font-size: clamp(24px, 3.4vw, 32px); font-weight: 600; letter-spacing: -0.015em; margin: 0 0 10px; }
  .site-lead { font-size: 16px; line-height: 1.65; color: var(--nk-text-secondary); max-width: 68ch; margin: 0 0 28px; }
  .site-kicker { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--nk-text-tertiary); margin-bottom: 14px; }

  .site-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
  .site-card { border: 1px solid var(--nk-border); border-radius: 10px; padding: 20px 22px; background: var(--nk-bg-card); }
  .site-card h3 { font-size: 15px; font-weight: 600; margin: 10px 0 6px; }
  .site-card p { font-size: 13.5px; line-height: 1.6; color: var(--nk-text-secondary); margin: 0; }
  .site-card .ico { font-size: 22px; }

  .site-frame {
    border: 1px solid var(--nk-border-strong); border-radius: 10px; overflow: hidden;
    background: var(--nk-bg); box-shadow: var(--nk-shadow-menu);
  }
  .site-frame-bar {
    display: flex; align-items: center; gap: 7px; padding: 8px 12px;
    border-bottom: 1px solid var(--nk-border); background: var(--nk-bg-sidebar);
  }
  .site-frame-bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--nk-border-strong); }
  .site-frame-bar span { margin-left: 6px; font-size: 11.5px; color: var(--nk-text-tertiary); }
  .site-frame iframe { display: block; width: 100%; border: 0; background: var(--nk-bg); }

  .site-viewports { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
  .site-viewport { flex: 1 1 420px; min-width: 0; }
  .site-viewport.mobile { flex: 0 0 auto; }
  .site-viewport-label { font-size: 12px; color: var(--nk-text-tertiary); margin-bottom: 8px; }
  /* The scaler shows a real viewport width shrunk to fit, so the layout the
     iframe computes is the one that width would really produce. */
  .site-scaler { overflow: hidden; border-radius: 10px; border: 1px solid var(--nk-border-strong); }
  .site-scaler iframe { display: block; border: 0; transform-origin: top left; }

  .site-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .site-table th {
    text-align: left; font-weight: 500; color: var(--nk-text-tertiary); font-size: 12px;
    text-transform: uppercase; letter-spacing: .04em; padding: 8px 12px 8px 0;
    border-bottom: 1px solid var(--nk-border);
  }
  .site-table td { padding: 11px 12px 11px 0; border-bottom: 1px solid var(--nk-border); vertical-align: top; line-height: 1.55; }
  .site-table td:first-child { font-weight: 500; white-space: nowrap; }
  .site-table td:last-child { color: var(--nk-text-secondary); }

  .site-foot {
    border-top: 1px solid var(--nk-border); padding: 32px 0 48px;
    font-size: 13px; color: var(--nk-text-tertiary);
    display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
  }
  .site-foot a { color: var(--nk-text-secondary); }

  @media (max-width: 860px) {
    .site-nav-links { display: none; }
    .site-viewports { gap: 32px; }
  }
`;

/** Sticky top bar shared by every page. The language switch stays on the
    current page rather than dropping the reader back on the start page. */
export const nav = (t, current) => {
  const other = t.lang === 'de' ? `../${current}.html` : `de/${current}.html`;
  return `
<nav class="site-nav">
  <a class="site-brand" href="${t.lang === 'de' ? 'index.html' : 'index.html'}"><span class="mark">N</span>NotionKit</a>
  <div class="site-nav-links">
    <a href="index.html"${current === 'index' ? ' class="current"' : ''}>Start</a>
    <a href="docs.html"${current === 'docs' ? ' class="current"' : ''}>${t.navDocs}</a>
    <a href="showcase.html"${current === 'showcase' ? ' class="current"' : ''}>${t.navShowcase}</a>
    <a href="app.html"${current === 'app' ? ' class="current"' : ''}>${t.navDemo}</a>
  </div>
  <div class="site-nav-right">
    <a class="nk-topbar-btn" href="${other}" title="${t.langTitle}">${t.langLabel}</a>
    <a class="nk-topbar-btn" href="https://github.com/JUNGHERZ/NotionKit" title="GitHub">↗ ${t.navGithub}</a>${paletteMenu(PALETTES, t.lang)}
    <button class="nk-topbar-btn nk-theme-toggle" id="themeToggle" title="${t.lang === 'de' ? 'Light / Dark wechseln' : 'Toggle light / dark'}">🌙</button>
  </div>
</nav>`;
};

/** Theme toggle + persistence. Identical on every page. */
export const THEME_JS = `
  (function () {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    function set(theme) {
      root.setAttribute('data-theme', theme);
      if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      try { localStorage.setItem('nk-theme', theme); } catch (e) {}
      document.querySelectorAll('iframe[data-theme-sync]').forEach(function (f) {
        try { f.contentWindow.postMessage({ nkTheme: theme }, '*'); } catch (e) {}
      });
    }
    var stored = null;
    try { stored = localStorage.getItem('nk-theme'); } catch (e) {}
    set(stored || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    if (btn) btn.addEventListener('click', function () {
      set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();` + paletteJs(PALETTES);

/** Favicon set. `base` is '' at the root and '../' under de/. */
export const ICON_LINKS = base => `<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${base}favicon.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">`;

/** <head> shared by every page. */
export const head = (t, { title, desc, css, page }) => `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://notionkit.jungherz.com/${t.lang === 'de' ? 'de/' : ''}${page}.html">
<link rel="alternate" hreflang="en" href="https://notionkit.jungherz.com/${page}.html">
<link rel="alternate" hreflang="de" href="https://notionkit.jungherz.com/de/${page}.html">
<link rel="alternate" hreflang="x-default" href="https://notionkit.jungherz.com/${page}.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NotionKit">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://notionkit.jungherz.com/${t.lang === 'de' ? 'de/' : ''}${page}.html">
<meta property="og:image" content="https://notionkit.jungherz.com/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${t.lang === 'de' ? 'de_DE' : 'en_US'}">
<meta property="og:locale:alternate" content="${t.lang === 'de' ? 'en_US' : 'de_DE'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="https://notionkit.jungherz.com/og.png">
<meta name="theme-color" content="#f7f6f3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#202020" media="(prefers-color-scheme: dark)">
${ICON_LINKS(t.lang === 'de' ? '../' : '')}
<link rel="stylesheet" href="${css}">`;
