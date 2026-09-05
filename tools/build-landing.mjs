import { writeFileSync } from 'fs';
import { LANDING, GROUPS } from './i18n-landing.mjs';
import { CHROME_CSS, nav, head, THEME_JS } from './chrome.mjs';

const LANDING_CSS = `
  .site-hero { padding: clamp(56px, 9vw, 110px) 0 clamp(36px, 5vw, 60px); }
  .site-hero h1 { font-size: clamp(32px, 5.4vw, 54px); font-weight: 700; letter-spacing: -0.025em; line-height: 1.08; margin: 0 0 18px; max-width: 18ch; }
  .site-hero .site-lead { font-size: clamp(15px, 1.6vw, 18px); }
  .site-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 26px; }
  .site-cta { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 34px; }
  .site-cta .nk-btn { padding: 8px 18px; font-size: 14px; text-decoration: none; }
  .site-install { max-width: 720px; }
  .site-install .nk-code { margin-top: 0; white-space: pre-wrap; word-break: break-all; }
  .site-note { font-size: 13px; color: var(--nk-text-tertiary); margin-top: 10px; line-height: 1.6; }
  .site-status { font-size: 11px; padding: 1px 8px; border-radius: 10px; font-weight: 500; }
  .site-status.on { background: var(--nk-tag-green-bg); color: var(--nk-tag-green-text); }
  .site-status.here { background: var(--nk-bg-callout); color: var(--nk-text-secondary); }
  .site-family .links { display: flex; gap: 12px; margin-top: 12px; font-size: 13px; }
  .site-family .links a { color: var(--nk-accent); text-decoration: none; }
  .site-family .links a:hover { text-decoration: underline; }
  .site-family h3 { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .site-family .role { font-size: 12px; color: var(--nk-text-tertiary); font-weight: 400; }
`;

// Both viewports render the same document; only the width differs.
const DESKTOP_W = 1280, DESKTOP_H = 800, MOBILE_W = 390, MOBILE_H = 780;
const DESKTOP_SCALE = 0.5, MOBILE_SCALE = 0.62;

const build = (t, groups) => `${head(t, {
  title: t.title, desc: t.metaDesc, css: t.cssHref, page: 'index',
})}
<style>${CHROME_CSS}${LANDING_CSS}</style>
</head>
<body class="nk-body">
${nav(t, 'index')}

<header class="site-wrap site-hero">
  <div class="site-kicker">${t.heroKicker}</div>
  <h1>${t.heroTitle}</h1>
  <p class="site-lead">${t.heroLead}</p>
  <div class="site-badges">
    <span class="nk-tag blue">CSS only</span>
    <span class="nk-tag green">~100 ${t.lang === 'de' ? 'Komponenten' : 'components'}</span>
    <span class="nk-tag purple">Light &amp; Dark</span>
    <span class="nk-tag orange">7.2 KB gzip</span>
    <span class="nk-tag blue">MIT</span>
  </div>
  <div class="site-cta">
    <a class="nk-btn primary" href="docs.html">${t.ctaPrimary}</a>
    <a class="nk-btn secondary" href="showcase.html">${t.ctaSecondary}</a>
  </div>

  <div class="site-install">
    <h2 class="site-kicker" style="margin-bottom:8px">${t.installTitle}</h2>
    <div class="nk-code"><span class="lang">html</span><span class="tag">&lt;link</span> <span class="attr">rel=</span>"stylesheet" <span class="attr">href=</span>"https://cdn.jsdelivr.net/npm/@jungherz-de/notionkit@1/notionkit.min.css"<span class="tag">&gt;</span>
<span class="tag">&lt;html</span> <span class="attr">data-theme=</span>"dark"<span class="tag">&gt;</span></div>
    <div class="nk-code"><span class="lang">npm</span>npm install @jungherz-de/notionkit</div>
    <p class="site-note">${t.installNote}</p>
  </div>
</header>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.previewTitle}</h2>
    <p class="site-lead">${t.previewLead}</p>
  </div>
  <div class="site-wrap" style="max-width:1320px">
    <div class="site-frame">
      <div class="site-frame-bar"><i></i><i></i><i></i><span>notionkit.jungherz.com/${t.lang === 'de' ? 'de/' : ''}${t.appSrc}</span></div>
      <iframe src="${t.appSrc}" title="NotionKit demo" loading="lazy" data-theme-sync style="height:min(760px, 82vh)"></iframe>
    </div>
    <p class="site-note"><a href="${t.appSrc}">${t.previewOpen}</a></p>
  </div>
</section>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.responsiveTitle}</h2>
    <p class="site-lead">${t.responsiveLead}</p>
    <div class="site-viewports">
      <div class="site-viewport" style="flex:0 0 auto;width:${Math.round(DESKTOP_W * DESKTOP_SCALE)}px">
        <div class="site-viewport-label">${t.respDesktop}</div>
        <div class="site-scaler" style="width:${Math.round(DESKTOP_W * DESKTOP_SCALE)}px;height:${Math.round(DESKTOP_H * DESKTOP_SCALE)}px">
          <iframe src="${t.appSrc}" title="${t.respDesktop}" loading="lazy" data-theme-sync
                  style="width:${DESKTOP_W}px;height:${DESKTOP_H}px;transform:scale(${DESKTOP_SCALE})"></iframe>
        </div>
      </div>
      <div class="site-viewport mobile" style="width:${Math.round(MOBILE_W * MOBILE_SCALE)}px">
        <div class="site-viewport-label">${t.respMobile}</div>
        <div class="site-scaler" style="width:${Math.round(MOBILE_W * MOBILE_SCALE)}px;height:${Math.round(MOBILE_H * MOBILE_SCALE)}px">
          <iframe src="${t.appSrc}" title="${t.respMobile}" loading="lazy" data-theme-sync
                  style="width:${MOBILE_W}px;height:${MOBILE_H}px;transform:scale(${MOBILE_SCALE})"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.featuresTitle}</h2>
    <div class="site-grid" style="margin-top:28px">
      ${t.features.map(([ico, h, p]) => `<div class="site-card"><div class="ico">${ico}</div><h3>${h}</h3><p>${p}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.componentsTitle}</h2>
    <p class="site-lead">${t.componentsLead}</p>
    <table class="site-table">
      <thead><tr><th>${t.colGroup}</th><th>${t.colWhat}</th></tr></thead>
      <tbody>
        ${groups.map(([g, d]) => `<tr><td>${g}</td><td>${d}</td></tr>`).join('\n        ')}
      </tbody>
    </table>
  </div>
</section>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.editorTitle}</h2>
    <p class="site-lead">${t.editorBody}</p>
    <p><a class="nk-btn secondary" href="docs.html#editor" style="text-decoration:none">${t.editorLink}</a></p>
  </div>
</section>

<section class="site-section">
  <div class="site-wrap">
    <h2 class="site-h2">${t.familyTitle}</h2>
    <p class="site-lead">${t.familyLead}</p>
    <div class="site-grid site-family">
      ${t.family.map(([name, role, desc, site, repo]) => `<div class="site-card">
        <h3>${name} <span class="site-status ${site ? 'on' : 'here'}">${site ? t.statusAvailable : t.linkThis}</span></h3>
        <div class="role">${role}</div>
        <p style="margin-top:8px">${desc}</p>
        <div class="links">${site ? `<a href="${site}">${t.linkSite} →</a>` : ''}<a href="${repo}">${t.linkRepo} →</a></div>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<footer class="site-wrap site-foot">
  <span>${t.footerNote} <a href="https://www.jungherz.com">Jungherz GmbH</a></span>
  <a href="https://github.com/JUNGHERZ/NotionKit">GitHub</a>
  <a href="https://www.npmjs.com/package/@jungherz-de/notionkit">npm</a>
  <a href="${t.langHref}">${t.langLabel}</a>
</footer>

<script>${THEME_JS}</script>
</body>
</html>
`;

writeFileSync('index.html', build(LANDING.en, GROUPS.en));
writeFileSync('de/index.html', build(LANDING.de, GROUPS.de));
console.log('✅ index.html + de/index.html generated');
