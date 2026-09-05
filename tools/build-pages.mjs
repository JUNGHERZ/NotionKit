import { writeFileSync, readFileSync } from 'fs';
import { CATALOG, GROUPS } from './catalog.mjs';
import { WORDS } from './words.mjs';
import { PAGES } from './i18n-pages.mjs';
import { LANDING } from './i18n-landing.mjs';
import { CHROME_CSS, nav, head, THEME_JS } from './chrome.mjs';
import { highlightHtml, tidy } from './highlight.mjs';
import { readTokens, TOKEN_MEANING, STATES, CONTRAST } from './reference.mjs';
import { readPalettes, paletteJs } from './palettes.mjs';

const DOC_CSS = `
  .doc-layout { display: flex; align-items: flex-start; gap: 40px; max-width: 1180px; margin: 0 auto; padding: 0 clamp(16px, 4vw, 40px) 80px; }
  .doc-toc { position: sticky; top: 72px; width: 220px; flex-shrink: 0; max-height: calc(100vh - 92px); overflow-y: auto; padding: 24px 0; }
  .doc-toc .nk-section-label { padding-left: 8px; }
  .doc-toc a { display: block; padding: 3px 10px; border-radius: var(--nk-radius); color: var(--nk-text-secondary); text-decoration: none; font-size: 13px; line-height: 1.5; }
  .doc-toc a:hover { background: var(--nk-bg-hover); color: var(--nk-text); }
  .doc-toc a.current { background: var(--nk-bg-active); color: var(--nk-text); font-weight: 500; }
  .doc-main { flex: 1; min-width: 0; padding: 24px 0 0; }
  .doc-main > header { padding-bottom: 8px; }
  .doc-main h1 { font-size: clamp(28px, 4vw, 40px); font-weight: 700; letter-spacing: -0.02em; margin: 0 0 12px; }

  .doc-group { padding-top: 40px; }
  .doc-group > h2 { font-size: 22px; font-weight: 600; margin: 0 0 4px; scroll-margin-top: 76px; }
  .doc-group > .prd { font-size: 12px; color: var(--nk-text-tertiary); margin-bottom: 8px; }

  .doc-entry { padding: 26px 0; border-top: 1px solid var(--nk-border); scroll-margin-top: 76px; }
  .doc-entry > h3 { font-size: 17px; font-weight: 600; margin: 0 0 6px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .doc-entry > h3 code { font-size: 12.5px; font-weight: 400; color: var(--nk-text-tertiary); font-family: var(--nk-font-mono); }
  .doc-desc { font-size: 14px; line-height: 1.65; color: var(--nk-text-secondary); margin: 0 0 14px; max-width: 72ch; }
  .doc-desc code, .doc-note code, .doc-meta code { font-family: var(--nk-font-mono); font-size: 85%; background: var(--nk-bg-callout); border-radius: 4px; padding: 1px 5px; }

  .doc-preview { border: 1px solid var(--nk-border); border-radius: 10px; padding: 24px; background: var(--nk-bg); margin: 0 0 12px; }
  .doc-preview.is-frame { padding: 0; overflow: hidden; }
  .doc-preview.on-sidebar { background: var(--nk-bg-sidebar); }

  .doc-meta { display: flex; gap: 10px; flex-wrap: wrap; align-items: baseline; font-size: 13px; color: var(--nk-text-secondary); margin-top: 12px; line-height: 1.6; }
  .doc-meta b { color: var(--nk-text); font-weight: 500; flex-shrink: 0; }
  .doc-classes { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 10px; }
  .doc-classes code { font-family: var(--nk-font-mono); font-size: 11.5px; background: var(--nk-bg-callout); border-radius: 4px; padding: 1px 6px; color: var(--nk-text-secondary); }

  .doc-note { font-size: 13.5px; line-height: 1.65; color: var(--nk-text-secondary); max-width: 72ch; }
  .doc-note--preview { margin: -2px 0 12px; font-size: 12.5px; color: var(--nk-text-tertiary); }
  .doc-note--preview a { color: var(--nk-text-secondary); }
  .doc-section { padding: 44px 0 8px; border-top: 1px solid var(--nk-border); scroll-margin-top: 76px; }
  .doc-section:first-of-type { border-top: 0; }
  .doc-section > h2 { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; margin: 0 0 10px; }
  .doc-section > h3 { font-size: 15px; font-weight: 600; margin: 26px 0 8px; }

  .doc-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 14px 0; }
  .doc-table th { text-align: left; font-weight: 500; color: var(--nk-text-tertiary); font-size: 11.5px; text-transform: uppercase; letter-spacing: .04em; padding: 8px 12px 8px 0; border-bottom: 1px solid var(--nk-border); }
  .doc-table td { padding: 8px 12px 8px 0; border-bottom: 1px solid var(--nk-border); vertical-align: top; line-height: 1.55; }
  .doc-table td code { font-family: var(--nk-font-mono); font-size: 11.5px; }
  .doc-table .sw { display: inline-block; width: 12px; height: 12px; border-radius: 3px; border: 1px solid var(--nk-border-strong); vertical-align: -2px; margin-right: 6px; }
  .doc-table-wrap { overflow-x: auto; }
  .pass { color: var(--nk-tag-green-text); } .warn { color: var(--nk-tag-orange-text); }

  @media (max-width: 860px) {
    .doc-toc { display: none; }
    .doc-layout { gap: 0; }
  }
`;

const esc = s => String(s).replace(/&(?!\w+;|#)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = src => `<div class="nk-code"><span class="lang">html</span>${highlightHtml(tidy(src))}</div>`;

const previewBox = (entry, markup) => {
  const cls = ['doc-preview'];
  if (entry.frame) cls.push('is-frame');
  if (entry.onSidebar) cls.push('on-sidebar');
  const style = entry.frame ? ` style="height:${entry.frame}px${entry.relativeFrame ? ';position:relative' : ''}"` : '';
  return `<div class="${cls.join(' ')}"${style}>${markup}</div>`;
};

// ---------------------------------------------------------------- showcase
function buildShowcase(lang) {
  const t = { ...LANDING[lang], ...PAGES[lang] };
  const W = WORDS[lang];
  const groups = GROUPS.map(g => ({ g, items: CATALOG.filter(c => c.group === g.id) }));

  return `${head(t, { title: t.showcaseTitle, desc: t.showcaseDesc, css: t.cssHref, page: 'showcase' })}
<style>${CHROME_CSS}${DOC_CSS}</style>
</head>
<body class="nk-body">
${nav(t, 'showcase')}
<div class="doc-layout">
  <aside class="doc-toc">
    <div class="nk-section-label">${t.components}</div>
    ${groups.map(({ g }) => `<a href="#${g.id}">${g.title[lang]}</a>`).join('\n    ')}
  </aside>
  <main class="doc-main">
    <header>
      <h1>${t.showcaseH1}</h1>
      <p class="doc-desc" style="font-size:15px">${t.showcaseLead}</p>
    </header>
    ${groups.map(({ g, items }) => `<section class="doc-group" id="${g.id}">
      <h2>${g.title[lang]}</h2>
      <div class="prd">PRD ${g.prd}</div>
      ${items.map(e => `<article class="doc-entry" id="s-${e.id}">
        <h3>${e.title[lang]} <code>.${e.id}</code></h3>
        ${previewBox(e, e.html(W))}
        ${e.note ? `<p class="doc-note doc-note--preview">${e.note[lang]}</p>` : ''}
      </article>`).join('\n      ')}
    </section>`).join('\n    ')}
  </main>
</div>
<script>${THEME_JS}${TOC_JS}</script>
</body>
</html>
`;
}

const TOC_JS = `
  (function () {
    var links = [].slice.call(document.querySelectorAll('.doc-toc a'));
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    function sync() {
      var best = 0;
      targets.forEach(function (el, i) { if (el && el.getBoundingClientRect().top < 120) best = i; });
      links.forEach(function (a, i) { a.classList.toggle('current', i === best); });
    }
    addEventListener('scroll', sync, { passive: true });
    sync();
  })();`;

// ---------------------------------------------------------------- docs
function buildDocs(lang) {
  const t = { ...LANDING[lang], ...PAGES[lang] };
  const W = WORDS[lang];
  const { light, dark } = readTokens();
  const groups = GROUPS.map(g => ({ g, items: CATALOG.filter(c => c.group === g.id) }));
  const isColour = v => /^#|^rgba?\(/.test(v);

  const sections = [
    ['install', t.secInstall], ['tokens', t.secTokens], ['theming', t.secTheming],
    ['states', t.secStates], ['contrast', t.secContrast], ['editor', t.secEditor],
    ['shadow', t.secShadow],
  ];

  return `${head(t, { title: t.docsTitle, desc: t.docsDesc, css: t.cssHref, page: 'docs' })}
<style>${CHROME_CSS}${DOC_CSS}</style>
</head>
<body class="nk-body">
${nav(t, 'docs')}
<div class="doc-layout">
  <aside class="doc-toc">
    <div class="nk-section-label">${t.sections}</div>
    ${sections.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('\n    ')}
    <div class="nk-section-label">${t.components}</div>
    ${groups.map(({ g }) => `<a href="#${g.id}">${g.title[lang]}</a>`).join('\n    ')}
  </aside>
  <main class="doc-main">
    <header>
      <h1>${t.docsH1}</h1>
      <p class="doc-desc" style="font-size:15px">${t.docsLead}</p>
    </header>

    <section class="doc-section" id="install">
      <h2>${t.secInstall}</h2>
      <p class="doc-note">${t.installLead}</p>
      ${code(`<!-- CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@jungherz-de/notionkit@1/notionkit.min.css">

<!-- local -->
<link rel="stylesheet" href="notionkit.css">

<!-- your own theme, after the library -->
<link rel="stylesheet" href="theme-override.css">`)}
      ${code(`npm install @jungherz-de/notionkit`)}
      <p class="doc-note">${t.installTheme}</p>
      ${code(`<html lang="${lang}" data-theme="dark">
  <body class="nk-body">
    …
  </body>
</html>`)}
      <p class="doc-note">${t.installBody}</p>
    </section>

    <section class="doc-section" id="tokens">
      <h2>${t.secTokens}</h2>
      <p class="doc-note">${t.tokensLead}</p>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>${t.colToken}</th><th>${t.colLight}</th><th>${t.colDark}</th><th>${t.colMeaning}</th></tr></thead>
        <tbody>
        ${Object.entries(light).map(([k, v]) => {
          const d = dark[k];
          const sw = x => isColour(x) ? `<span class="sw" style="background:${x}"></span>` : '';
          return `<tr><td><code>${k}</code></td><td>${sw(v)}<code>${esc(v)}</code></td><td>${d ? sw(d) + `<code>${esc(d)}</code>` : '<span style="color:var(--nk-text-tertiary)">—</span>'}</td><td>${(TOKEN_MEANING[k] || {})[lang] || ''}</td></tr>`;
        }).join('\n        ')}
        </tbody>
      </table></div>
      <p class="doc-note">${t.tokenRebrand}</p>
      ${code(`:root {
  --nk-accent: #16a34a;
}`)}
    </section>

    <section class="doc-section" id="theming">
      <h2>${t.secTheming}</h2>
      <p class="doc-note">${t.themingLead}</p>
      ${code(`<html data-theme="light">   <!-- default, the attribute may be omitted -->
<html data-theme="dark">`)}
      ${code(`document.documentElement.setAttribute('data-theme', 'dark');`)}
      <p class="doc-note">${t.themingNote}</p>
      <p class="doc-note">${t.themingPalettes}</p>
    </section>

    <section class="doc-section" id="states">
      <h2>${t.secStates}</h2>
      <p class="doc-note">${t.statesLead}</p>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>${t.colClass}</th><th>${t.colAppliesTo}</th><th>${t.colEffect}</th></tr></thead>
        <tbody>${STATES.map(s => `<tr><td><code>.${esc(s.cls)}</code></td><td>${s.on.split(', ').map(x => `<code>${x}</code>`).join(' ')}</td><td>${s[lang]}</td></tr>`).join('\n        ')}</tbody>
      </table></div>
    </section>

    <section class="doc-section" id="contrast">
      <h2>${t.secContrast}</h2>
      <p class="doc-note">${t.contrastLead}</p>
      <div class="doc-table-wrap"><table class="doc-table">
        <thead><tr><th>${t.colPair}</th><th>${t.colLight}</th><th>${t.colDark}</th><th>${t.colVerdict}</th></tr></thead>
        <tbody>${CONTRAST.map(c => {
          const ok = c.light >= 4.5 && c.dark >= 4.5;
          const mark = v => `<span class="${v >= 4.5 ? 'pass' : 'warn'}">${v.toFixed(2)}</span>`;
          return `<tr><td><code>${esc(c.pair)}</code></td><td>${mark(c.light)}</td><td>${mark(c.dark)}</td><td>${!c.body ? '<span style="color:var(--nk-text-tertiary)">—</span>' : ok ? '<span class="pass">✓</span>' : '<span class="warn">✗</span>'}</td></tr>`;
        }).join('\n        ')}</tbody>
      </table></div>
      <p class="doc-note">${t.contrastNote}</p>
    </section>

    <section class="doc-section" id="editor">
      <h2>${t.secEditor}</h2>
      <p class="doc-note">${t.editorLead}</p>

      <h3>${t.editorTip}</h3>
      <p class="doc-note">${t.editorTipBody}</p>
      ${code(`<div class="nk-block-host" id="editor"></div>

<script type="module">
  import { Editor } from 'https://esm.sh/@tiptap/core@2';
  import StarterKit from 'https://esm.sh/@tiptap/starter-kit@2';
  import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder@2';

  new Editor({
    element: document.getElementById('editor'),
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'Type "/" for commands …' })],
    content: '<p>Hello NotionKit.</p>',
  });
<\/script>`)}

      <h3>${t.editorBn}</h3>
      <p class="doc-note">${t.editorBnBody}</p>
      ${code(`<div class="nk-block-host">
  <BlockNoteView editor={editor} theme="light" />
</div>`)}

      <h3>${t.editorNovel}</h3>
      <p class="doc-note">${t.editorNovelBody}</p>
      ${code(`<div class="nk-block-host">
  <EditorContent className="novel-editor" />
</div>`)}

      <h3>${t.editorLive}</h3>
      <p class="doc-note">${t.editorLiveBody}</p>
      <div class="doc-preview" id="tiptap-demo-box" style="padding-left:56px">
        <div class="nk-block-host" id="tiptap-demo"></div>
      </div>
      <p class="doc-note">${t.editorRecipeNote}</p>
    </section>

    <section class="doc-section" id="shadow">
      <h2>${t.secShadow}</h2>
      <p class="doc-note">${t.shadowLead}</p>
      ${code(`import { componentsSheet, tokensCss } from '@jungherz-de/notionkit/notionkit-styles.js';

// Tokens go on the document once, wrapped in a layer so a brand
// stylesheet wins no matter the load order.
const tokens = new CSSStyleSheet();
tokens.replaceSync(\`@layer notionkit-defaults { \${tokensCss} }\`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, tokens];

class NkCallout extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [componentsSheet];   // components only
  }
}`)}
      <h3>${t.shadowWhy}</h3>
      <p class="doc-note">${t.shadowWhyBody}</p>
      <h3>${t.shadowSlotted}</h3>
      <p class="doc-note">${t.shadowSlottedBody}</p>
      ${code(`.nk-callout .c-icon,
.nk-callout ::slotted(.c-icon) { font-size: 17px; }`)}
      <p class="doc-note">${t.shadowPoc}</p>
    </section>

    ${groups.map(({ g, items }) => `<section class="doc-group" id="${g.id}">
      <h2>${g.title[lang]}</h2>
      <div class="prd">PRD ${g.prd}</div>
      ${items.map(e => {
        const markup = e.html(W);
        return `<article class="doc-entry" id="${e.id}">
        <h3>${e.title[lang]} <code>.${e.id}</code></h3>
        <p class="doc-desc">${e.desc[lang]}</p>
        ${previewBox(e, markup)}
        ${e.note ? `<p class="doc-note doc-note--preview">${e.note[lang]}</p>` : ''}
        ${code(markup)}
        <div class="doc-meta"><b>${t.mobileLabel}:</b><span>${e.mobile[lang]}</span></div>
        <div class="doc-classes">${e.classes.map(c => `<code>.${c}</code>`).join('')}</div>
      </article>`;
      }).join('\n      ')}
    </section>`).join('\n    ')}
  </main>
</div>
<script>${THEME_JS}${TOC_JS}</script>
${TIPTAP_SCRIPT(lang)}
</body>
</html>
`;
}

// The live editor is its own file so the docs show the full recipe – slash
// menu, bubble toolbar, block handle – rather than a ten-line teaser.
// Inlined rather than linked: a module *file* is CORS-blocked when the page
// is opened from file://, while an inline module with https:// imports is
// not. docs-editor.js stays the single source and is still shipped as the
// readable recipe the prose links to.
const TIPTAP_SCRIPT = () => `<script type="module">\n${readFileSync('docs-editor.js', 'utf-8')}</script>`;

// The demo pages are hand-ported, not generated; only the editor recipe is
// injected between markers so docs-editor.js stays the single source.
for (const file of ['app.html', 'de/app.html']) {
  let html = readFileSync(file, 'utf-8');
  const inject = (name, content) => {
    const re = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
    if (!re.test(html)) throw new Error(`${file}: ${name} markers missing`);
    html = html.replace(re, `<!-- ${name}:start -->\n${content}\n<!-- ${name}:end -->`);
  };
  inject('nk-editor-recipe', TIPTAP_SCRIPT());
  inject('nk-palette', `<script>${paletteJs(readPalettes())}</script>`);
  writeFileSync(file, html);
}

writeFileSync('showcase.html', buildShowcase('en'));
writeFileSync('de/showcase.html', buildShowcase('de'));
writeFileSync('docs.html', buildDocs('en'));
writeFileSync('de/docs.html', buildDocs('de'));
console.log('✅ showcase.html, docs.html (+ de/) generated · editor recipe injected into app.html (+ de/)');
